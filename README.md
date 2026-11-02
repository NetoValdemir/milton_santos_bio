# Milton Santos — vida e trajetória

Página interativa sobre a vida e a trajetória profissional do geógrafo Milton Santos (1926–2001).

**Acesse:** https://netovaldemir.github.io/milton_santos_bio/

- Abertura com retrato e um resumo da sua vida
- Mapa-múndi com os lugares onde viveu e trabalhou (dados cartográficos: Natural Earth, domínio público)
- Linha do tempo com cartões que viram ao clicar, com filtro por fase
- Bibliografia essencial

Site estático, sem build: basta abrir `index.html` no navegador. Publicado com GitHub Pages a partir da branch `main`.

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Estrutura da página |
| `css/estilo.css` | Estilos e paleta de cores |
| `js/dados.js` | Todo o conteúdo: marcos, lugares, livros |
| `js/app.js` | Comportamento da página |
| `js/mapa-mundi.js` | Desenho do mapa (gerado por `tools/gerar-mapa.mjs`) |
| `tools/` | Gerador do mapa e teste de regressão visual |

## Como editar

- **Textos, datas, marcos e livros:** edite `js/dados.js`.
- **Capa de um livro:** salve a imagem em `capas/<id>.jpg` e, em `js/dados.js`, troque `capa: null` por `capa: "capas/<id>.jpg"` no livro correspondente.
- **Novo lugar no mapa:** adicione-o em `js/dados.js` e em `tools/gerar-mapa.mjs` e rode `cd tools && npm install && npm run mapa`.

Detalhes de arquitetura, decisões técnicas e histórico estão em [`CLAUDE.md`](CLAUDE.md).
