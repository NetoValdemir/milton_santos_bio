# Contexto do projeto: Milton Santos — vida e trajetória

Este arquivo guarda o contexto do projeto para retomar o trabalho em conversas futuras com o Claude.
Leia-o inteiro antes de mudar qualquer coisa. Ao terminar uma mudança, atualize o **Histórico** e,
se for o caso, as **Pendências**.

## O que é

Home page interativa sobre a vida e a trajetória profissional do geógrafo Milton Santos (1926–2001).
Site estático, sem build e sem dependências em tempo de execução (só Google Fonts).

- **Site publicado (GitHub Pages):** https://netovaldemir.github.io/milton_santos_bio/
- **Repositório:** https://github.com/NetoValdemir/milton_santos_bio (público, branch `main`)
- **GitHub Pages:** ativado pelo dono em Settings → Pages, "Deploy from a branch", `main`, `/ (root)`.
  Cada push na `main` dispara o workflow "pages build and deployment" (1 a 2 minutos).
- **Artifact antigo (claude.ai):** https://claude.ai/artifact/AZwZoCnNYLJSzg5XKrp5fp — versão de
  protótipo, anterior à refatoração. **A fonte da verdade é este repositório**, não o artifact.
- **Dono:** NetoValdemir. Idioma de toda a comunicação, do conteúdo e dos commits: português do Brasil.

## Estrutura

```
index.html            Só a estrutura da página (abertura, mapa, linha do tempo, livros, rodapé)
css/estilo.css        Todos os estilos, organizados por seção, com tokens de cor no topo
js/dados.js           TODO o conteúdo: lugares, percurso, rótulos do mapa, marcos, livros
js/mapa-mundi.js      Desenho do mapa (GERADO, não editar à mão)
js/app.js             Comportamento: mapa, ilustrações, fotos, linha do tempo, livros
milton-santos.jpg     Retrato da abertura (enviado pelo dono; 335×597 px)
.nojekyll             Faz o GitHub Pages servir os arquivos como estão
tools/gerar-mapa.mjs  Gera js/mapa-mundi.js a partir do Natural Earth (world-atlas)
tools/package.json    Dependências do gerador (só para desenvolvimento)
tools/regressao/      Teste de regressão visual e funcional (ver abaixo)
```

Os scripts são carregados em ordem, sem módulos ES (para funcionar abrindo o arquivo direto, via
`file://`): `dados.js` define `window.MS_DADOS`, `mapa-mundi.js` define `window.MS_MAPA_MUNDI` e
`app.js` monta a página a partir dos dois.

## Seções da página

1. **Abertura:** retrato à esquerda, com blocos laranja e lilás atrás (ecoando a colagem da foto);
   nome, datas com ícones de estrela (nascimento) e cruz (morte), resumo e citação.
2. **"Por onde ele passou":** mapa-múndi real (projeção Natural Earth, dados Natural Earth de domínio
   público). Países onde viveu em turquesa (Brasil, França, EUA, Canadá, Venezuela, Tanzânia), 14
   cidades nas coordenadas reais, percurso cronológico em arcos laranja. Passar o mouse num cartão
   acende o ponto; clicar num ponto rola até o marco. No celular (≤720px) o `viewBox` recorta só a
   região da trajetória, e o mapa não tem rolagem própria.
3. **Linha do tempo:** 14 marcos (1926–2001) em cartões que viram ao clicar ou com Enter/Espaço.
   Filtro por fase (Formação, Bahia, Exílio, Retorno, Consagração, Legado) e botão "Virar todos".
   A frente tem uma ilustração de curvas de nível gerada por semente (sempre a mesma para cada
   marco), um ícone, o ano e as coordenadas. O botão "Adicionar foto" guarda uma foto só no navegador
   de quem enviou (IndexedDB); não aparece para outros visitantes.
4. **"Obras para começar":** 11 livros em grade. Sem imagem de capa, cada um mostra uma ficha
   tipográfica (título, autor, ano, faixa colorida).

## Identidade visual

- **Paleta** (tirada da colagem do retrato), definida como tokens em `css/estilo.css`:
  concreto claro `--paper`, preto da foto `--ink`, laranja `--laranja` (destaques, percurso),
  turquesa `--turquesa` (sobrenome, fases), lilás `--lilas` (ponto ativo no mapa, "Para lembrar").
  Tema escuro com os mesmos tokens redefinidos (grafite e cores mais claras).
- **Fontes (Google Fonts):** Gloock (títulos), Libre Franklin (texto), IBM Plex Mono (datas,
  coordenadas, rótulos).
- Funciona em celular e computador, nos temas claro e escuro.

## Como fazer mudanças comuns

- **Textos, datas, marcos, lugares, livros:** só em `js/dados.js`. Os textos são inseridos como
  HTML (use `&amp;` para "&").
- **Capa de livro:** salve a imagem em `capas/<id>.jpg` (o `id` está em `livros`, em `js/dados.js`)
  e troque `capa: null` por `capa: "capas/<id>.jpg"`. Só publique imagens que o dono tenha direito
  de usar.
- **Novo lugar no mapa:** adicione em `lugares` (`js/dados.js`) **e** em `LUGARES`
  (`tools/gerar-mapa.mjs`) com a mesma lon/lat, depois gere o mapa de novo:
  `cd tools && npm install && npm run mapa`. Ajuste `rota` e `rotulos` se precisar.
  Um lugar que não é o `place` de nenhum marco precisa do campo `marco` (id do cartão aberto ao clicar).
- **Cores e fontes:** tokens no topo de `css/estilo.css`. Mantenha os três blocos (claro, escuro
  pelo sistema, escuro forçado) com os mesmos nomes de token.

## Fluxo de trabalho

1. Crie uma branch a partir da `main`.
2. Antes de mudar, gere a referência: copie a `main` para uma pasta temporária
   (`git archive main | tar -x -C /tmp/ref-site`) e rode
   `node tools/regressao/capturar.cjs /tmp/ref-site /tmp/ref`.
3. Faça a mudança e rode `node tools/regressao/capturar.cjs . /tmp/novo`, depois
   `python3 tools/regressao/comparar.py /tmp/ref /tmp/novo`. O script captura computador (1280px) e
   celular (390px), claro e escuro, página inteira, cartão virado, filtro, "virar todos", e checa
   rolagem com o cursor sobre um cartão, ponto do mapa aceso no hover, clique no mapa, teclado e
   ausência de rolagem lateral. Em refatoração, o resultado deve ser "IDÊNTICO". Em mudança visual
   intencional, confira que só a área esperada mudou.
4. Commit em português, merge na `main`, push. Confira o workflow do Pages em
   `gh api "repos/NetoValdemir/milton_santos_bio/actions/runs?per_page=1"`.

## Limitações do ambiente (Claude Code na nuvem)

- A rede bloqueia Wikimedia, Wikipédia, Open Library, Google Books, Amazon e `github.io`. Por isso
  não foi possível baixar fotos nem capas reais, nem abrir o site publicado para conferir. Os pacotes
  npm funcionam (é assim que os dados do mapa foram obtidos).
- A sessão não cria repositórios nem altera configurações do GitHub Pages pela API; o dono faz isso
  pela interface do GitHub. Push, leitura do repositório e consulta aos workflows funcionam.

## Decisões técnicas importantes (não desfazer sem motivo)

- **Cartões viram sem `transform-style: preserve-3d`:** cada face gira com `perspective()` própria,
  e em repouso a frente não tem transformação. O contexto 3D permanente travava a rolagem no celular.
- **O verso só rola quando o cartão está virado** (`overflow: hidden` + `pointer-events: none` em
  repouso). Antes, o verso escondido capturava a rolagem e a página "travava" com o cursor em cima.
- **Mapa sem rolagem lateral** e com `touch-action: pan-y`: o arraste vertical no celular vai para a
  página.
- **Ilustrações só são redesenhadas quando a largura muda** (ou o tema). No celular, a barra do
  navegador dispara `resize` durante a rolagem.
- **O mapa é gerado, não desenhado à mão:** `tools/gerar-mapa.mjs` reproduz `js/mapa-mundi.js` byte
  a byte.

## Pendências e pontos a verificar

- **Capas reais dos livros:** aguardando o dono enviar as imagens.
- **Fotos dos marcos:** os cartões usam ilustrações; o dono pode enviar fotos de arquivo para
  substituí-las (precisaria de um campo `foto` nos marcos, ainda não implementado).
- **Fatos escritos de memória, sem conferência em fontes:** tempo de prisão em 1964; "primeiro
  geógrafo de um país do Sul global" a receber o Vautrin Lud; "cerca de vinte" títulos honoris causa;
  ano de ingresso na USP (1983). Vale conferir antes de ampla divulgação.
- **Retrato** com 335×597 px: pode ficar levemente suave em telas de alta densidade. Trocar se houver
  versão maior.

## Histórico

- **Versão inicial (artifact):** abertura, mapa esquemático, linha do tempo com 14 cartões que viram,
  lista de livros.
- **Retrato e paleta:** foto enviada pelo dono à esquerda do título; paleta laranja, turquesa e
  lilás tirada da colagem da foto.
- **Mapa real:** mapa-múndi do Natural Earth com as cidades nas coordenadas reais; grade de livros
  com espaço para capas.
- **Repositório e Pages:** repositório criado pelo dono; site enviado e Pages ativado.
- **Rolagem travando (computador):** verso dos cartões prendia a rolagem; corrigido.
- **Rolagem travando (celular, arrastando sobre imagens):** mapa com rolagem lateral e cartões com
  contexto 3D permanente; corrigido.
- **Ícones nas datas:** "n." e "m." trocados por estrela e cruz.
- **Refatoração:** código separado em `index.html`, `css/`, `js/` e `tools/`; conteúdo isolado em
  `js/dados.js`; gerador do mapa versionado; teste de regressão criado. Visual e comportamento
  verificados como idênticos pixel a pixel.
- **Livros no celular:** corrigida regra antiga que deixava as fichas de capa enormes, uma por linha;
  agora são duas colunas.
