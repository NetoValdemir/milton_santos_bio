// Gera ../js/mapa-mundi.js: camadas do mapa-múndi (projeção Natural Earth) e a posição
// de cada lugar em pixels. Rodar de dentro de tools/:  npm install && npm run mapa
// Os lugares (lon/lat) vêm de LUGARES abaixo e devem coincidir com js/dados.js.
import fs from 'node:fs';
import * as d3 from 'd3-geo';
import { range } from 'd3-array';
import * as topo from 'topojson-client';

const LUGARES = {
  brotas: [-42.63, -12.00], salvador: [-38.50, -12.97], ilheus: [-39.05, -14.79],
  strasbourg: [7.75, 48.58], toulouse: [1.44, 43.60], paris: [2.35, 48.86],
  boston: [-71.10, 42.37], toronto: [-79.38, 43.65], caracas: [-66.90, 10.50],
  dar: [39.28, -6.79], ny: [-73.96, 40.81], rio: [-43.20, -22.90],
  sp: [-46.63, -23.55], stdie: [6.95, 48.28]
};
// Países onde ele viveu (códigos ISO 3166 numéricos): Brasil, França, EUA, Canadá, Venezuela, Tanzânia
const VIVEU = new Set(['076', '250', '840', '124', '862', '834']);

const W = 1000, H = 500;
const world = JSON.parse(fs.readFileSync(new URL('./node_modules/world-atlas/countries-110m.json', import.meta.url)));
const geoms = world.objects.countries.geometries.filter(g => g.properties.name !== 'Antarctica');
const land = topo.merge(world, geoms);
const lived = topo.merge(world, geoms.filter(g => VIVEU.has(String(g.id).padStart(3, '0'))));

// Enquadra de 56°S a 84°N incluindo o Equador, onde a projeção é mais larga
const proj = d3.geoNaturalEarth1();
proj.fitExtent([[6, 6], [W - 6, H - 6]], { type: 'MultiPoint', coordinates: range(-180, 181, 10).flatMap(l => [[l, -56], [l, 84], [l, 0]]) });
const path = d3.geoPath(proj).digits(1);
const r1 = n => +n.toFixed(1);

const paralelo = lat => ({ type: 'LineString', coordinates: range(-180, 180.1, 2).map(l => [l, lat]) });
const contorno = { type: 'Polygon', coordinates: [[...range(-180, 180.1, 2).map(l => [l, -56]), ...range(180, -180.1, -2).map(l => [l, 84]), [-180, -56]]] };
const rotuloParalelo = (lat, nome) => { const [x, y] = proj([179, lat]); return { d: path(paralelo(lat)), nome, x: Math.round(x - 6), y: Math.round(y - 4) }; };

const dados = {
  viewBox: `0 0 ${W} ${H}`,
  camadas: {
    grat: path(d3.geoGraticule().step([30, 30]).extent([[-180, -60], [180.0001, 90]])()),
    land: path(land),
    'land-lived': path(lived),
    borders: path(topo.mesh(world, world.objects.countries, (a, b) => a !== b)),
    sphere: path(contorno)
  },
  paralelos: [rotuloParalelo(0, 'Equador'), rotuloParalelo(23.44, 'Trópico de Câncer'), rotuloParalelo(-23.44, 'Trópico de Capricórnio')],
  meridianos: [-120, -60, 0, 60, 120].map(l => { const [x, y] = proj([l, -56]); return { t: l < 0 ? -l + '°O' : l > 0 ? l + '°L' : '0°', x: r1(r1(x) + 3), y: r1(r1(y) - 4) }; }),
  xy: Object.fromEntries(Object.entries(LUGARES).map(([k, v]) => [k, proj(v).map(r1)]))
};

const saida = new URL('../js/mapa-mundi.js', import.meta.url);
fs.writeFileSync(saida, '// Arquivo gerado por tools/gerar-mapa.mjs. Não edite à mão.\n// Dados cartográficos: Natural Earth (domínio público), via world-atlas 2.0.2.\nwindow.MS_MAPA_MUNDI = ' + JSON.stringify(dados) + ';\n');
console.log('Gerado', saida.pathname, (fs.statSync(saida).size / 1024).toFixed(0) + ' KB');
