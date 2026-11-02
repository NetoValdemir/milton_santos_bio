// Comportamento da página. O conteúdo vem de js/dados.js (window.MS_DADOS) e o desenho
// do mapa de js/mapa-mundi.js (window.MS_MAPA_MUNDI), ambos carregados antes deste arquivo.
(() => {
  const { lugares: LUGARES, rota: ROTA, rotulos: ROTULOS, marcos: MARCOS, livros: LIVROS } = window.MS_DADOS;
  const MAPA = window.MS_MAPA_MUNDI;
  const reduzMovimento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ativarComTeclado = (el, acao) => el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); acao(); }
  });

  /* ---------- Ícones ---------- */
  const GLYPHS = {
    casa: '<path d="M10 52 L50 18 L90 52"/><path d="M20 44 V86 H80 V44"/><rect x="42" y="60" width="16" height="26"/><path d="M4 92 H96"/>',
    escola: '<path d="M8 40 L50 20 L92 40 L50 60 Z"/><path d="M24 48 V70 Q50 84 76 70 V48"/><path d="M92 40 V66"/><circle cx="92" cy="70" r="3"/>',
    diploma: '<rect x="12" y="24" width="76" height="52" rx="2"/><path d="M24 40 H76 M24 50 H64 M24 60 H56"/><circle cx="72" cy="66" r="9"/><path d="M66 74 L62 90 L72 84 L82 90 L78 74"/>',
    livro: '<path d="M50 26 Q32 16 10 20 V80 Q32 76 50 86 Q68 76 90 80 V20 Q68 16 50 26 Z"/><path d="M50 26 V86"/><path d="M20 34 Q32 32 42 37 M20 46 Q32 44 42 49 M58 37 Q68 32 80 34 M58 49 Q68 44 80 46"/>',
    mapa: '<path d="M8 24 L36 14 L64 24 L92 14 V76 L64 86 L36 76 L8 86 Z"/><path d="M36 14 V76 M64 24 V86"/><circle cx="50" cy="46" r="6"/><path d="M50 52 V62"/>',
    grade: '<rect x="14" y="14" width="72" height="72"/><path d="M32 14 V86 M50 14 V86 M68 14 V86"/><path d="M14 30 H86"/>',
    rota: '<circle cx="18" cy="74" r="6"/><circle cx="82" cy="24" r="6"/><path d="M24 70 Q40 30 56 56 T78 30" stroke-dasharray="5 5"/><path d="M76 40 L82 30 L88 40"/>',
    medalha: '<path d="M36 10 L46 40 M64 10 L54 40"/><circle cx="50" cy="62" r="26"/><circle cx="50" cy="62" r="17"/><path d="M50 52 L53 59 L60 59 L54 64 L57 71 L50 67 L43 71 L46 64 L40 59 L47 59 Z"/>',
    globo: '<circle cx="50" cy="50" r="38"/><ellipse cx="50" cy="50" rx="16" ry="38"/><path d="M12 50 H88 M18 32 H82 M18 68 H82"/>',
    estrela: '<path d="M50 10 L60 38 L90 40 L66 58 L74 88 L50 70 L26 88 L34 58 L10 40 L40 38 Z"/>'
  };
  const svgGlyph = g => `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GLYPHS[g]}</svg>`;
  const ICONE_VIRAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/></svg>';
  const fmtCoord = p => `${Math.abs(p.lat).toFixed(2)}°${p.lat < 0 ? "S" : "N"} ${Math.abs(p.lon).toFixed(2)}°${p.lon < 0 ? "O" : "L"}`;

  /* ---------- Mapa ---------- */
  const svg = document.getElementById("map");
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent = svg) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n);
    return n;
  };
  const XY = MAPA.xy;

  function montarMapa() {
    // No celular, mostra só a região da trajetória (Américas, Europa e África)
    const telaEstreita = matchMedia("(max-width: 720px)");
    const enquadrar = () => svg.setAttribute("viewBox", telaEstreita.matches ? "215 70 450 345" : MAPA.viewBox);
    enquadrar();
    telaEstreita.addEventListener?.("change", enquadrar);

    for (const [classe, d] of Object.entries(MAPA.camadas)) el("path", { class: classe, d });
    for (const p of MAPA.paralelos) {
      el("path", { class: "grat-strong", d: p.d });
      el("text", { class: "grat-label", x: p.x, y: p.y, "text-anchor": "end" }).textContent = p.nome;
    }
    for (const m of MAPA.meridianos) el("text", { class: "grat-label", x: m.x, y: m.y }).textContent = m.t;

    // Percurso: arcos entre lugares consecutivos
    let d = "M" + XY[ROTA[0]].join(" ");
    for (let i = 1; i < ROTA.length; i++) {
      const [x0, y0] = XY[ROTA[i - 1]], [x1, y1] = XY[ROTA[i]];
      const dist = Math.hypot(x1 - x0, y1 - y0);
      const mx = (x0 + x1) / 2 + (y1 - y0) * .18, my = (y0 + y1) / 2 - (x1 - x0) * .18 - dist * .05;
      d += ` Q${mx.toFixed(1)} ${my.toFixed(1)} ${x1} ${y1}`;
    }
    el("path", { class: "route", d, pathLength: 1 });

    for (const r of ROTULOS) {
      const [x, y] = XY[r.at];
      const anchor = r.anchor || "start";
      el("text", { x: x + r.dx, y: y + r.dy, class: "pt-label", "text-anchor": anchor }).textContent = r.text;
      el("text", { x: x + r.dx, y: y + r.dy + 13, class: "pt-sub", "text-anchor": anchor }).textContent = r.sub;
    }

    const pontos = {};
    for (const [k, lugar] of Object.entries(LUGARES)) {
      const c = el("circle", { cx: XY[k][0], cy: XY[k][1], r: 4, class: "pt", tabindex: 0, role: "button", "aria-label": lugar.nome });
      el("title", {}, c).textContent = lugar.nome;
      pontos[k] = c;
      const irParaMarco = () => {
        const marco = MARCOS.find(m => m.place === k) || MARCOS.find(m => m.id === lugar.marco);
        if (marco) linhaDoTempo.mostrarMarco(marco.id);
      };
      c.addEventListener("click", irParaMarco);
      ativarComTeclado(c, irParaMarco);
    }
    return {
      destacar(k, on) {
        const c = pontos[k];
        if (!c) return;
        c.classList.toggle("on", on);
        c.setAttribute("r", on ? 6 : 4);
      }
    };
  }

  /* ---------- Ilustrações dos cartões (curvas de nível) ---------- */
  function aleatorio(semente) {
    let h = 2166136261;
    for (const c of semente) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
    return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  }
  function desenharCurvas(canvas, semente, forcar) {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    // Só redesenha se o tamanho mudou (ou se o tema mudou: forcar)
    const tamanho = Math.round(r.width) + "x" + Math.round(r.height);
    if (!forcar && canvas.dataset.size === tamanho) return;
    canvas.dataset.size = tamanho;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = r.width * dpr; canvas.height = r.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const cs = getComputedStyle(document.documentElement);
    const corForte = cs.getPropertyValue("--ink-soft").trim(), corFraca = cs.getPropertyValue("--contour").trim();
    const rnd = aleatorio(semente);
    ctx.clearRect(0, 0, r.width, r.height);
    const morros = Array.from({ length: 3 }, () => ({ x: rnd() * r.width, y: rnd() * r.height, k: 0.6 + rnd() * 0.8, ph: rnd() * 6.28 }));
    ctx.lineWidth = 1;
    for (const m of morros) {
      for (let anel = 1; anel <= 14; anel++) {
        const base = anel * 13 * m.k;
        const mestra = anel % 5 === 0;
        ctx.strokeStyle = mestra ? corForte : corFraca;
        ctx.globalAlpha = mestra ? 0.5 : 0.9;
        ctx.beginPath();
        for (let a = 0; a <= 6.30; a += 0.06) {
          const rr = base + Math.sin(a * 3 + m.ph + anel * .3) * base * .12 + Math.sin(a * 5 - m.ph) * base * .06;
          const x = m.x + Math.cos(a) * rr * 1.25, y = m.y + Math.sin(a) * rr;
          a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- Fotos enviadas pelo visitante (IndexedDB, só neste navegador) ---------- */
  const fotos = (() => {
    let conexao = null;
    const abrir = () => conexao || (conexao = new Promise((ok, falha) => {
      try {
        const rq = indexedDB.open("milton-santos-fotos", 1);
        rq.onupgradeneeded = () => rq.result.createObjectStore("fotos");
        rq.onsuccess = () => ok(rq.result);
        rq.onerror = () => falha(rq.error);
      } catch (e) { falha(e); }
    }));
    return {
      async ler(id) {
        try {
          const db = await abrir();
          return await new Promise(ok => { const q = db.transaction("fotos").objectStore("fotos").get(id); q.onsuccess = () => ok(q.result || null); q.onerror = () => ok(null); });
        } catch { return null; }
      },
      async salvar(id, blob) {
        try {
          const db = await abrir();
          await new Promise(ok => { const t = db.transaction("fotos", "readwrite"); blob ? t.objectStore("fotos").put(blob, id) : t.objectStore("fotos").delete(id); t.oncomplete = ok; t.onerror = ok; });
        } catch {}
      }
    };
  })();

  /* ---------- Linha do tempo ---------- */
  const tl = document.getElementById("timeline");

  function htmlDoMarco(m) {
    const lugar = LUGARES[m.place];
    return `
      <div class="marker" aria-hidden="true"><i></i><b>${m.year}</b></div>
      <div class="slot">
        <div class="card">
          <label class="photo-btn" for="f-${m.id}">Adicionar foto</label>
          <input class="photo-input" type="file" accept="image/*" id="f-${m.id}">
          <div class="flipper" role="button" tabindex="0" aria-pressed="false" aria-label="${m.year}: ${m.title}. Virar cartão">
            <div class="face front">
              <div class="plate">
                <canvas aria-hidden="true"></canvas>
                <div class="glyph">${svgGlyph(m.glyph)}</div>
                <span class="year">${m.year}</span>
                <span class="coord mono">${fmtCoord(lugar)}</span>
              </div>
              <div class="front-body">
                <span class="mono phase">${m.phase}</span>
                <h3>${m.title}</h3>
                <span class="place">${lugar.nome}</span>
                <span class="hint">${ICONE_VIRAR} Clique para virar</span>
              </div>
            </div>
            <div class="face back" aria-hidden="true">
              <span class="mono phase">${m.phase} · ${m.year}</span>
              <h3>${m.title}</h3>
              ${m.text.map(t => `<p>${t}</p>`).join("")}
              <div class="fact"><strong>Para lembrar:</strong> ${m.fact}</div>
              <span class="hint">${ICONE_VIRAR} Clique para voltar</span>
            </div>
          </div>
        </div>
      </div>`;
  }

  function prepararFoto(item, m) {
    const plate = item.querySelector(".plate");
    const botao = item.querySelector(".photo-btn");
    let url = null;
    const mostrar = blob => {
      plate.querySelector("img")?.remove();
      if (url) URL.revokeObjectURL(url);
      if (!blob) { plate.classList.remove("has-photo"); botao.textContent = "Adicionar foto"; return; }
      url = URL.createObjectURL(blob);
      const img = new Image();
      img.alt = `Foto: ${m.title}`;
      img.src = url;
      plate.prepend(img);
      plate.classList.add("has-photo");
      botao.textContent = "Trocar foto";
    };
    item.querySelector(".photo-input").addEventListener("change", e => {
      const arquivo = e.target.files && e.target.files[0];
      if (!arquivo) return;
      mostrar(arquivo);
      fotos.salvar(m.id, arquivo);
      e.target.value = "";
    });
    fotos.ler(m.id).then(b => b && mostrar(b));
  }

  function montarLinhaDoTempo() {
    const cartoes = [];
    for (const m of MARCOS) {
      const item = document.createElement("article");
      item.className = "item";
      item.id = "m-" + m.id;
      item.dataset.phase = m.phase;
      item.innerHTML = htmlDoMarco(m);
      tl.appendChild(item);

      const card = item.querySelector(".card");
      const flipper = item.querySelector(".flipper");
      const front = item.querySelector(".front"), back = item.querySelector(".back");
      const virar = (forcar) => {
        const on = typeof forcar === "boolean" ? forcar : !card.classList.contains("flipped");
        card.classList.toggle("flipped", on);
        flipper.setAttribute("aria-pressed", on);
        front.setAttribute("aria-hidden", on);
        back.setAttribute("aria-hidden", !on);
      };
      cartoes.push({ item, card, virar, canvas: item.querySelector("canvas"), id: m.id });

      flipper.addEventListener("click", () => virar());
      ativarComTeclado(flipper, () => virar());
      item.addEventListener("mouseenter", () => mapa.destacar(m.place, true));
      item.addEventListener("mouseleave", () => mapa.destacar(m.place, false));
      flipper.addEventListener("focus", () => mapa.destacar(m.place, true));
      flipper.addEventListener("blur", () => mapa.destacar(m.place, false));
      prepararFoto(item, m);
    }

    // Ilustrações: redesenha só quando a largura muda de fato (no celular, a barra do
    // navegador dispara resize ao rolar) ou quando o tema muda
    const pintar = (forcar) => cartoes.forEach(c => desenharCurvas(c.canvas, c.id, forcar === true));
    const repintarTudo = () => pintar(true);
    requestAnimationFrame(pintar);
    let larguraAnterior = innerWidth, espera;
    addEventListener("resize", () => {
      if (innerWidth === larguraAnterior) return;
      larguraAnterior = innerWidth;
      clearTimeout(espera);
      espera = setTimeout(pintar, 150);
    }, { passive: true });
    matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", repintarTudo);
    new MutationObserver(repintarTudo).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.fonts?.ready.then(() => pintar());

    // Filtro por fase
    const caixaFases = document.getElementById("phases");
    let faseAtual = "Todas";
    const aplicarFase = () => {
      caixaFases.querySelectorAll(".chip").forEach(b => b.setAttribute("aria-pressed", b.dataset.p === faseAtual));
      cartoes.forEach(c => { c.item.hidden = faseAtual !== "Todas" && c.item.dataset.phase !== faseAtual; });
      requestAnimationFrame(pintar);
    };
    for (const fase of ["Todas", ...new Set(MARCOS.map(m => m.phase))]) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.dataset.p = fase; b.textContent = fase;
      b.addEventListener("click", () => { faseAtual = fase; aplicarFase(); });
      caixaFases.appendChild(b);
    }
    aplicarFase();

    // Virar todos os cartões visíveis
    const botaoTodos = document.getElementById("flip-all");
    botaoTodos.addEventListener("click", () => {
      const visiveis = cartoes.filter(c => !c.item.hidden);
      const algumDeFrente = visiveis.some(c => !c.card.classList.contains("flipped"));
      visiveis.forEach(c => c.virar(algumDeFrente));
      botaoTodos.textContent = algumDeFrente ? "Desvirar todos" : "Virar todos";
    });

    return {
      // Mostra todas as fases, rola até o marco e põe o foco nele
      mostrarMarco(id) {
        if (faseAtual !== "Todas") { faseAtual = "Todas"; aplicarFase(); }
        const node = document.getElementById("m-" + id);
        node.scrollIntoView({ behavior: reduzMovimento() ? "auto" : "smooth", block: "center" });
        node.querySelector(".flipper").focus({ preventScroll: true });
      }
    };
  }

  /* ---------- Livros ---------- */
  function montarLivros() {
    const cores = ["var(--laranja)", "var(--turquesa)", "var(--lilas)"];
    const lista = document.getElementById("books");
    LIVROS.forEach((livro, i) => {
      const li = document.createElement("li");
      li.className = "book";
      const capa = livro.capa
        ? `<img src="${livro.capa}" alt="Capa de ${livro.title}" loading="lazy">`
        : `<div class="cover-ph" style="--c:${cores[i % 3]}" aria-hidden="true"><b>${livro.title}</b><small class="mono">Milton Santos · ${livro.year}</small></div>`;
      li.innerHTML = `<div class="cover">${capa}</div>
      <div class="book-meta"><span>${livro.year}</span><em>${livro.title}</em>${livro.note ? `<small>${livro.note}</small>` : ""}</div>`;
      lista.appendChild(li);
    });
  }

  /* ---------- Início ---------- */
  // O mapa e a linha do tempo se referenciam: os pontos levam aos marcos e os marcos acendem os pontos
  let linhaDoTempo;
  const mapa = montarMapa();
  linhaDoTempo = montarLinhaDoTempo();
  montarLivros();
})();
