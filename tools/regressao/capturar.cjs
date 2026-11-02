// Captura telas e estados da página para teste de regressão visual e funcional.
// Uso (a partir da raiz do repositório):
//   node tools/regressao/capturar.cjs <pasta-do-site> <pasta-de-saida>
// Requer Playwright com Chromium (já instalado nos ambientes do Claude Code na nuvem).
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const [,, site, out] = process.argv;
fs.mkdirSync(out, { recursive: true });
const url = 'file://' + path.resolve(site, 'index.html');
const VIEWS = [
  { n: 'desk-light', w: 1280, h: 900, scheme: 'light', touch: false },
  { n: 'desk-dark',  w: 1280, h: 900, scheme: 'dark',  touch: false },
  { n: 'mob-light',  w: 390,  h: 844, scheme: 'light', touch: true },
  { n: 'mob-dark',   w: 390,  h: 844, scheme: 'dark',  touch: true },
];
(async () => {
  const b = await chromium.launch();
  const log = {};
  for (const v of VIEWS) {
    const ctx = await b.newContext({ viewport: { width: v.w, height: v.h }, colorScheme: v.scheme, reducedMotion: 'reduce', hasTouch: v.touch, isMobile: v.touch, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    await p.goto(url); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(700);
    const L = log[v.n] = { errs };
    L.scrollW = await p.evaluate(() => document.documentElement.scrollWidth);
    L.text = await p.evaluate(() => document.body.innerText);
    L.counts = await p.evaluate(() => ({ items: document.querySelectorAll('.item').length, chips: document.querySelectorAll('.chip').length, books: document.querySelectorAll('.book').length, dots: document.querySelectorAll('#map .pt').length, labels: document.querySelectorAll('#map .pt-label').length, viewBox: document.getElementById('map').getAttribute('viewBox') }));
    L.mapSvg = await p.evaluate(() => [...document.querySelectorAll('#map > *')].map(n => n.tagName + '.' + (n.getAttribute('class')||'') + ':' + (n.getAttribute('d')||'').length + ':' + (n.textContent||'').slice(0,30) + ':' + (n.getAttribute('x')||n.getAttribute('cx')||'') + ',' + (n.getAttribute('y')||n.getAttribute('cy')||'')).join('\n'));
    await p.screenshot({ path: `${out}/${v.n}-full.png`, fullPage: true });
    // virar um cartão
    await p.locator('#m-mundo .flipper').scrollIntoViewIfNeeded();
    v.touch ? await p.locator('#m-mundo .flipper').tap() : await p.locator('#m-mundo .flipper').click();
    await p.waitForTimeout(300);
    L.flip = await p.evaluate(() => { const c = document.querySelector('#m-mundo .card'); return [c.className, c.querySelector('.flipper').getAttribute('aria-pressed'), c.querySelector('.back').getAttribute('aria-hidden'), getComputedStyle(c.querySelector('.back')).visibility, getComputedStyle(c.querySelector('.front')).visibility].join('|'); });
    await p.locator('#m-mundo').screenshot({ path: `${out}/${v.n}-flip.png` });
    // rolagem por cima de um cartão
    if (!v.touch) {
      const bx = await p.locator('#m-nascimento .flipper').boundingBox();
      await p.evaluate(y => scrollTo(0, y + scrollY - 100), bx.y);
      const bx2 = await p.locator('#m-nascimento .flipper').boundingBox();
      await p.mouse.move(bx2.x + 50, bx2.y + 50);
      const s0 = await p.evaluate(() => scrollY); await p.mouse.wheel(0, 900); await p.waitForTimeout(300);
      L.wheel = (await p.evaluate(() => scrollY)) - s0;
      // hover acende o ponto do mapa
      L.hover = await p.evaluate(() => { const c = [...document.querySelectorAll('#map .pt')].find(c => c.classList.contains('on')); return c ? c.getAttribute('aria-label') + ' r=' + c.getAttribute('r') : 'nenhum'; });
    }
    // filtro de fase
    await p.locator('.chip', { hasText: 'Exílio' }).click(); await p.waitForTimeout(200);
    L.filter = await p.evaluate(() => [...document.querySelectorAll('.item')].filter(n => !n.hidden).map(n => n.id).join(','));
    await p.locator('#timeline').screenshot({ path: `${out}/${v.n}-filtro.png` });
    // virar todos
    await p.locator('.chip', { hasText: 'Todas' }).click(); await p.waitForTimeout(200);
    await p.locator('#flip-all').click(); await p.waitForTimeout(300);
    await p.mouse.move(0, 0); await p.waitForTimeout(100);
    L.flipAll = await p.evaluate(() => [document.querySelectorAll('.card.flipped').length, document.getElementById('flip-all').textContent].join('|'));
    await p.locator('#timeline').screenshot({ path: `${out}/${v.n}-todos.png` });
    await p.locator('#flip-all').click(); await p.waitForTimeout(300);
    L.unflipAll = await p.evaluate(() => [document.querySelectorAll('.card.flipped').length, document.getElementById('flip-all').textContent].join('|'));
    // clique no ponto de Paris -> vai ao marco do exílio
    await p.evaluate(() => scrollTo(0, 0));
    await p.locator('#map .pt[aria-label="Paris"]').dispatchEvent('click'); await p.waitForTimeout(500);
    L.mapClick = await p.evaluate(() => document.activeElement.closest('.item')?.id);
    await p.locator('#map .pt[aria-label="Dar es Salaam"]').dispatchEvent('click'); await p.waitForTimeout(500);
    L.mapClick2 = await p.evaluate(() => document.activeElement.closest('.item')?.id);
    // teclado: Enter vira
    await p.locator('#m-usp .flipper').focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(100);
    L.keyboard = await p.evaluate(() => document.querySelector('#m-usp .card').classList.contains('flipped'));
    await ctx.close();
  }
  fs.writeFileSync(`${out}/log.json`, JSON.stringify(log, null, 1));
  await b.close();
  for (const [k, L] of Object.entries(log)) console.log(k, JSON.stringify({ errs: L.errs, scrollW: L.scrollW, counts: L.counts, flip: L.flip, wheel: L.wheel, hover: L.hover, filter: L.filter, flipAll: L.flipAll, unflipAll: L.unflipAll, mapClick: L.mapClick, mapClick2: L.mapClick2, keyboard: L.keyboard }));
})();
