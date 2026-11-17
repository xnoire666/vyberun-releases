// vyberun's manual: the open topics as tabs, folding chapters, "On this page", and the search (all in the browser:
// search.json holds every page's sections; nothing is sent anywhere)
(() => {
  const M = window.MANUAL, current = M.id, topics = M.topics;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // (the open tabs and folded chapters: this browser tab only, for this visit, and only a convenience; kept in
  // sessionStorage, so they're gone when the browser closes and nothing about a visitor stays behind; no cookies)
  const store = {
    get(k, d) { try { return JSON.parse(sessionStorage.getItem('vyberun-manual-' + k)) ?? d; } catch { return d; } },
    set(k, v) { try { sessionStorage.setItem('vyberun-manual-' + k, JSON.stringify(v)); } catch { } }
  };

  // ---- tabs: the topics opened, the current one first time it's seen ----
  let open = store.get('tabs', []).filter(id => topics[id]);
  if (topics[current] && !open.includes(current)) open.push(current);
  store.set('tabs', open);
  function renderTabs() {
    const tabs = $('tabs');
    tabs.innerHTML = open.map(id => { const t = topics[id], on = id === current;
      return `<a class="tab${on ? ' on' : ''}" href="${id}.html" style="--c:${t.c}"><span class="d"></span>${esc(t.title)}${on ? `<span class="role">${esc(t.ch.toLowerCase())}</span>` : ''}<button class="x" type="button" data-close="${id}" title="Close" aria-label="Close ${esc(t.title)}">✕</button></a>`; }).join('') +
      `<a class="plus" href="./" title="Contents">+</a>`;
    tabs.querySelectorAll('.x').forEach(x => x.onclick = e => {
      e.preventDefault(); e.stopPropagation();
      const id = x.dataset.close, i = open.indexOf(id);
      open.splice(i, 1); store.set('tabs', open);
      if (id === current) location.href = open.length ? open[Math.max(0, i - 1)] + '.html' : './';
      else renderTabs();
    });
    tabs.querySelector('.tab.on')?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    document.querySelectorAll('.item').forEach(it => it.classList.toggle('open', open.includes(it.dataset.id)));
    const count = $('count'); if (count) count.textContent = open.length + (open.length === 1 ? ' tab open' : ' tabs open');
  }
  renderTabs();

  // ---- the sidebar: chapters fold (remembered); the current chapter is always open ----
  const folded = new Set(store.get('folded', []));
  document.querySelectorAll('.side .space').forEach(space => {
    const head = space.querySelector('.space-head'), name = head.dataset.ch;
    const set = f => { space.classList.toggle('folded', f); head.querySelector('.chev').textContent = f ? '›' : '⌄'; head.setAttribute('aria-expanded', !f); };
    set(folded.has(name) && !space.querySelector('.item.sel'));
    head.onclick = () => { const f = !space.classList.contains('folded'); set(f); f ? folded.add(name) : folded.delete(name); store.set('folded', [...folded]); };
  });
  document.querySelector('.side .item.sel')?.scrollIntoView({ block: 'nearest' });
  $('contents-btn').onclick = () => document.body.classList.toggle('toc');

  // ---- the page's sections, under its line in the sidebar, follow the scroll ----
  const page = $('page');
  function follow() {
    const links = [...document.querySelectorAll('.side .sub')]; let k = 0;
    links.forEach((a, j) => { const h = document.getElementById(decodeURIComponent(a.hash.slice(1))); if (h && h.getBoundingClientRect().top - page.getBoundingClientRect().top < 80) k = j; });
    links.forEach((a, j) => a.classList.toggle('on', j === k));
  }
  document.querySelectorAll('.side .sub').forEach(a => a.addEventListener('click', () => document.body.classList.remove('toc')));
  page.addEventListener('scroll', follow, { passive: true }); follow();

  // ---- search ----
  let index = null;
  const load = () => index ? Promise.resolve(index) : fetch('search.json').then(r => r.json()).then(d => index = d).catch(() => index = []);
  const mark = (s, words) => words.length ? esc(s).replace(new RegExp('(' + words.map(w => reEsc(esc(w))).join('|') + ')', 'gi'), '<mark>$1</mark>') : esc(s);
  function snippet(text, words) {
    const low = text.toLowerCase();
    let at = Math.min(...words.map(w => { const i = low.indexOf(w); return i < 0 ? Infinity : i; }));
    if (!isFinite(at)) at = 0;
    const from = at > 50 ? text.lastIndexOf(' ', at - 50) + 1 : 0, to = Math.min(text.length, from + 150);
    return (from > 0 ? '… ' : '') + mark(text.slice(from, to), words) + (to < text.length ? ' …' : '');
  }
  function search(q) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean), hits = [];
    if (!words.length || !index) return { words, hits };
    for (const e of index) {
      const t = topics[e.id]; if (!t) continue;
      const title = t.title.toLowerCase(), head = (e.head + ' ' + e.kw).toLowerCase(), text = e.text.toLowerCase(), ch = t.ch.toLowerCase();
      // (a section matches on its own words and its page's title; a page also on its chapter's name)
      if (!words.every(w => title.includes(w) || head.includes(w) || text.includes(w) || (!e.head && ch.includes(w)))) continue;
      let score = 0;
      for (const w of words) score += (title.startsWith(w) ? 6 : title.includes(w) ? 4 : 0) + (head.includes(w) ? 3 : 0) + (text.includes(w) ? 1 : 0) + (!e.head && ch.includes(w) ? 1 : 0);
      hits.push({ e, t, score, inText: words.some(w => text.includes(w)) });
    }
    hits.sort((a, b) => b.score - a.score);
    return { words, hits: hits.slice(0, 40) };
  }
  const q = $('q'), results = $('results');
  let shown = [], sel = 0;
  async function renderResults() {
    if (!q.value.trim()) { results.hidden = true; return; }
    await load();
    const { words, hits } = search(q.value);
    sel = 0; shown = [];
    if (!hits.length) { results.innerHTML = `<div class="none">Nothing in the manual matches “${esc(q.value.trim())}”.</div>`; results.hidden = false; return; }
    const pages = hits.filter(h => !h.e.head), secs = hits.filter(h => h.e.head);
    const row = (h, i) => `<a class="r" role="option" data-i="${i}" href="${h.e.id}.html${h.e.anchor ? '#' + h.e.anchor : ''}" style="--c:${h.t.c}"><div class="t"><span class="d"></span><span>${mark(h.e.head || h.t.title, words)}</span><span class="where">${esc(h.e.head ? h.t.title : h.t.ch)}</span></div>` +
      (h.inText ? `<div class="s">${snippet(h.e.text, words)}</div>` : '') + `</a>`;
    let html = '', i = 0;
    if (pages.length) { html += '<div class="grp"># pages</div>'; pages.forEach(h => { html += row(h, i++); shown.push(h); }); }
    if (secs.length) { html += '<div class="grp"># in the pages</div>'; secs.forEach(h => { html += row(h, i++); shown.push(h); }); }
    html += `<div class="foot"><kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>Enter</kbd> to open · <kbd>Esc</kbd> to close</div>`;
    results.innerHTML = html; results.hidden = false; highlight();
    results.querySelectorAll('.r').forEach(r => {
      r.onmousemove = () => { sel = +r.dataset.i; highlight(); };
      r.onmousedown = e => e.preventDefault();
      r.onclick = e => { e.preventDefault(); go(+r.dataset.i); };
    });
  }
  function highlight() { results.querySelectorAll('.r').forEach(r => r.classList.toggle('sel', +r.dataset.i === sel)); results.querySelector('.r.sel')?.scrollIntoView({ block: 'nearest' }); }
  function go(i) {
    const h = shown[i]; if (!h) return;
    // the words go along, so the page they open on can mark them
    try { sessionStorage.setItem('vyberun-manual-find', q.value.trim()); } catch { }
    location.href = h.e.id + '.html' + (h.e.anchor ? '#' + h.e.anchor : '');
    if (h.e.id === current) { results.hidden = true; q.blur(); markFound(); }
  }
  q.addEventListener('input', renderResults);
  q.addEventListener('focus', () => { load(); if (q.value.trim()) renderResults(); });
  q.addEventListener('blur', () => setTimeout(() => results.hidden = true, 120));
  q.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); highlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); highlight(); }
    else if (e.key === 'Enter') { e.preventDefault(); go(sel); }
    else if (e.key === 'Escape') { if (q.value) { q.value = ''; results.hidden = true; } else q.blur(); }
  });
  // "/" or Ctrl+K anywhere: to the search box
  addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName);
    if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) { e.preventDefault(); q.focus(); q.select(); }
  });

  // arriving from a search: the words found are marked on the page for a moment
  function markFound() {
    let words; try { words = (sessionStorage.getItem('vyberun-manual-find') || '').toLowerCase().split(/\s+/).filter(Boolean); sessionStorage.removeItem('vyberun-manual-find'); } catch { return; }
    if (!words.length) return;
    const art = document.querySelector('article'), re = new RegExp('(' + words.map(reEsc).join('|') + ')', 'i');
    const walk = document.createTreeWalker(art, NodeFilter.SHOW_TEXT), nodes = []; while (walk.nextNode()) nodes.push(walk.currentNode);
    for (const n of nodes) if (re.test(n.data)) { const span = document.createElement('span'); span.innerHTML = mark(n.data, words).replace(/<mark>/g, '<mark class="hit">'); n.replaceWith(...span.childNodes); }
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ block: 'start' });
    setTimeout(() => art.querySelectorAll('mark.hit').forEach(m => m.classList.add('fade')), 2500);
    setTimeout(() => art.querySelectorAll('mark.hit').forEach(m => m.replaceWith(m.textContent)), 4000);
  }

  // ---- scenes: a pointer with data-path="10:.a|30:.b|60:-" goes to each target at that point of the loop (its tip on
  // the target's middle; "-" hides it where it is). Measured in the scene as it is at that moment, again on resize. ----
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function placePointers() {
    document.querySelectorAll('.sc-ptr[data-path]').forEach(ptr => {
      const stage = ptr.closest('.sc-stage'), anims = [...stage.querySelectorAll('*')];
      const steps = ptr.dataset.path.split('|').map(s => { const [p, sel] = s.split(':'); return { at: +p / 100, sel: sel.trim() }; });
      const frames = []; let last = null;
      for (const st of steps) {
        if (st.sel !== '-') {
          // the scene paused at that moment, so a menu that opens later is where it will be
          anims.forEach(e => { e.style.animationPlayState = 'paused'; e.style.animationDelay = (-st.at * 8) + 's'; });
          const t = stage.querySelector(st.sel), sr = stage.getBoundingClientRect();
          if (t) { const r = t.getBoundingClientRect(); last = [r.left + r.width / 2 - sr.left, r.top + r.height / 2 - sr.top]; }
        }
        if (last) frames.push({ offset: st.at, transform: `translate(${last[0]}px, ${last[1]}px)`, opacity: st.sel === '-' ? 0 : 1, easing: 'ease-in-out' });
      }
      anims.forEach(e => { e.style.animationPlayState = ''; e.style.animationDelay = ''; });
      if (!frames.length) return;
      if (frames[0].offset > 0) frames.unshift({ ...frames[0], offset: 0, opacity: 0 });
      if (frames[frames.length - 1].offset < 1) frames.push({ ...frames[frames.length - 1], offset: 1, opacity: 0 });
      ptr.getAnimations().forEach(a => a.cancel());
      if (still) return;
      const a = ptr.animate(frames, { duration: 8000, iterations: Infinity });   // (eased move by move: each keyframe's easing)
      // in step with the scene's own animations
      const ref = anims.flatMap(e => e.getAnimations()).find(x => x.animationName);
      a.currentTime = (ref ? ref.currentTime : document.timeline.currentTime) % 8000;
    });
  }
  placePointers();
  let resizeTimer; addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(placePointers, 200); });

  markFound();
})();
