const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
$('#menu').onclick = () => $('#links').classList.toggle('open');
$$('#links a').forEach(a => a.onclick = () => $('#links').classList.remove('open'));

/* reveal on scroll */
const io = new IntersectionObserver(e => e.forEach(x => x.isIntersecting && x.target.classList.add('show')), { threshold: .1 });
$$('.reveal').forEach(el => io.observe(el));

/* navbar: scrolled state, progress bar, back-to-top, active link */
const links = $$('#links a'), secs = links.map(a => $(a.getAttribute('href')));
function onScroll() {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    $('header').classList.toggle('scrolled', y > 20);
    $('#progress').style.width = (max > 0 ? y / max * 100 : 0) + '%';
    $('#top').classList.toggle('on', y > 500);
    let cur = -1; secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= 120) cur = i });
    links.forEach((a, i) => a.classList.toggle('active', i === cur));
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();
$('#top').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

/* lightbox with next/prev for grouped photos */
let group = [], idx = 0;
function show() { $('#lb img').src = group[idx].src; $('#lb').classList.toggle('multi', group.length > 1) }
$$('[data-zoom]').forEach(i => i.onclick = () => {
    group = i.dataset.group ? $$('[data-group="' + i.dataset.group + '"]') : [i]; idx = group.indexOf(i);
    show(); $('#lb').classList.add('on');
});
const step = d => { idx = (idx + d + group.length) % group.length; show() };
$('#prev').onclick = e => { e.stopPropagation(); step(-1) };
$('#next').onclick = e => { e.stopPropagation(); step(1) };
$('#lb').onclick = () => $('#lb').classList.remove('on');
addEventListener('keydown', e => {
    if (!$('#lb').classList.contains('on')) return;
    if (e.key === 'Escape') $('#lb').classList.remove('on');
    if (group.length > 1 && e.key === 'ArrowRight') step(1);
    if (group.length > 1 && e.key === 'ArrowLeft') step(-1);
});