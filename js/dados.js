// Conteúdo da página. Para mudar textos, datas, lugares ou livros, edite só este arquivo.
// Os textos são inseridos como HTML: use &amp; para "&" e evite "<" solto.
window.MS_DADOS = {
  // Lugares do mapa e das coordenadas dos cartões. "marco" indica o cartão aberto ao clicar
  // num lugar que não é o lugar principal de nenhum marco. As posições no mapa vêm de
  // js/mapa-mundi.js; se mudar lon/lat aqui, mude também em tools/gerar-mapa.mjs e gere de novo.
  lugares: {
    brotas:     { nome: "Brotas de Macaúbas",   lon: -42.63, lat: -12.00 },
    salvador:   { nome: "Salvador",             lon: -38.50, lat: -12.97 },
    ilheus:     { nome: "Ilhéus",               lon: -39.05, lat: -14.79 },
    strasbourg: { nome: "Strasbourg",           lon:   7.75, lat:  48.58 },
    toulouse:   { nome: "Toulouse",             lon:   1.44, lat:  43.60 },
    paris:      { nome: "Paris",                lon:   2.35, lat:  48.86, marco: "exilio" },
    boston:     { nome: "Cambridge (MIT)",      lon: -71.10, lat:  42.37 },
    toronto:    { nome: "Toronto",              lon: -79.38, lat:  43.65, marco: "mundo" },
    caracas:    { nome: "Caracas",              lon: -66.90, lat:  10.50, marco: "mundo" },
    dar:        { nome: "Dar es Salaam",        lon:  39.28, lat:  -6.79, marco: "mundo" },
    ny:         { nome: "Nova York",            lon: -73.96, lat:  40.81, marco: "mundo" },
    rio:        { nome: "Rio de Janeiro",       lon: -43.20, lat: -22.90 },
    sp:         { nome: "São Paulo",            lon: -46.63, lat: -23.55 },
    stdie:      { nome: "Saint-Dié-des-Vosges", lon:   6.95, lat:  48.28 }
  },

  // Ordem cronológica do percurso desenhado no mapa
  rota: ["brotas", "salvador", "ilheus", "salvador", "strasbourg", "salvador", "toulouse", "paris", "boston", "toronto", "caracas", "dar", "ny", "rio", "sp", "stdie", "sp"],

  // Rótulos do mapa, posicionados em relação a um lugar (dx/dy em pixels do mapa de 1000×500)
  rotulos: [
    { at: "salvador", text: "Bahia", sub: "Brotas · Salvador · Ilhéus", dx: 12, dy: 0 },
    { at: "sp", text: "Rio · São Paulo", sub: "1977–2001", dx: -12, dy: 14, anchor: "end" },
    { at: "paris", text: "França", sub: "Strasbourg · Paris · Toulouse · Saint-Dié", dx: 0, dy: -40, anchor: "middle" },
    { at: "toronto", text: "Toronto · MIT · Nova York", sub: "1971–1977", dx: -8, dy: -26 },
    { at: "caracas", text: "Caracas", sub: "anos 1970", dx: -10, dy: 12, anchor: "end" },
    { at: "dar", text: "Dar es Salaam", sub: "1974–1976", dx: -8, dy: -26, anchor: "end" }
  ],

  // Marcos da linha do tempo. glyph: casa, escola, diploma, livro, mapa, grade, rota, medalha, globo, estrela
  marcos: [
    { id: "nascimento", year: "1926", phase: "Formação", place: "brotas", glyph: "casa",
      title: "Nasce no sertão da Bahia",
      text: [
        "Milton Almeida dos Santos nasce em 3 de maio de 1926, em Brotas de Macaúbas, na Chapada Diamantina. Os pais, Adalgisa e Francisco Irineu, eram professores primários.",
        "Foi alfabetizado em casa e lá teve as primeiras lições, inclusive de francês. O interior baiano, com suas pequenas cidades e longas distâncias, seria mais tarde um dos temas centrais de sua reflexão sobre o território."
      ],
      fact: "Neto de pessoas escravizadas, tornou-se um dos intelectuais negros mais reconhecidos do país." },
    { id: "salvador", year: "1936", phase: "Formação", place: "salvador", glyph: "escola",
      title: "Internato em Salvador",
      text: [
        "Aos dez anos vai para Salvador estudar no Instituto Baiano de Ensino, em regime de internato. Ali descobre a geografia.",
        "Ainda estudante, começa a dar aulas da matéria aos colegas. É o início de uma vida inteira dedicada ao ensino."
      ],
      fact: "Salvador seria também o objeto de sua tese de doutorado, duas décadas depois." },
    { id: "direito", year: "1948", phase: "Formação", place: "ilheus", glyph: "diploma",
      title: "Bacharel em Direito, professor em Ilhéus",
      text: [
        "Forma-se em Direito pela Universidade da Bahia (hoje UFBA). Em vez da advocacia, segue para Ilhéus, onde ensina geografia no ginásio e escreve como correspondente do jornal A Tarde.",
        "Da observação da região cacaueira nasce seu primeiro estudo regional, Zona do Cacau (1955)."
      ],
      fact: "O jornalismo o acompanhou por anos: chegou a redator no jornal A Tarde." },
    { id: "doutorado", year: "1958", phase: "Formação", place: "strasbourg", glyph: "livro",
      title: "Doutorado em Strasbourg",
      text: [
        "Defende o doutorado em geografia na Universidade de Strasbourg, na França, sob orientação de Jean Tricart.",
        "A tese estuda o centro da cidade de Salvador e é publicada em 1959 como O centro da cidade do Salvador, obra pioneira da geografia urbana no Brasil."
      ],
      fact: "A parceria com a geografia francesa marcou sua formação teórica." },
    { id: "laboratorio", year: "1959", phase: "Bahia", place: "salvador", glyph: "mapa",
      title: "Laboratório de Geografia na UFBA",
      text: [
        "De volta à Bahia, torna-se professor da Universidade da Bahia e cria o Laboratório de Geografia e Estudos Regionais, que forma uma geração de pesquisadores.",
        "No início dos anos 1960 preside a Comissão de Planejamento Econômico do estado e se aproxima do debate político nacional."
      ],
      fact: "O laboratório levou a pesquisa geográfica para o planejamento do território baiano." },
    { id: "exilio", year: "1964", phase: "Exílio", place: "toulouse", glyph: "grade",
      title: "Golpe militar, prisão e exílio",
      text: [
        "Com o golpe de 1964, Milton Santos é preso em Salvador. Libertado, deixa o Brasil e segue para a França.",
        "Começa um exílio de treze anos. Ensina nas universidades de Toulouse e Bordeaux e depois em Paris, na Sorbonne."
      ],
      fact: "O exílio transformou um geógrafo baiano em um pensador do chamado Terceiro Mundo." },
    { id: "mundo", year: "1971", phase: "Exílio", place: "boston", glyph: "rota",
      title: "Professor em quatro continentes",
      text: [
        "Leciona no MIT, em Cambridge (EUA), na Universidade de Toronto, na Universidade Central da Venezuela, em Caracas, na Universidade de Dar es Salaam, na Tanzânia, e na Universidade Columbia, em Nova York.",
        "Publica Les villes du Tiers Monde (1971) e L'espace partagé (1975), sobre os dois circuitos da economia urbana nos países pobres."
      ],
      fact: "A teoria dos circuitos superior e inferior da economia urbana nasce desse período." },
    { id: "retorno", year: "1977", phase: "Retorno", place: "rio", glyph: "casa",
      title: "Volta ao Brasil",
      text: [
        "Em 1977 retorna ao país, ainda sob a ditadura. Trabalha como consultor e, a partir de 1979, ensina na Universidade Federal do Rio de Janeiro.",
        "Retoma a vida acadêmica brasileira com a bagagem teórica construída no exterior."
      ],
      fact: "A Lei da Anistia viria em 1979, dois anos depois de seu retorno." },
    { id: "geografia-nova", year: "1978", phase: "Retorno", place: "salvador", glyph: "livro",
      title: "Por uma Geografia Nova",
      text: [
        "Publica Por uma Geografia Nova, crítica à geografia descritiva e quantitativa. Propõe estudar o espaço como instância da sociedade, produzido pelo trabalho e pela técnica.",
        "No mesmo ano, o Encontro Nacional de Geógrafos, em Fortaleza, marca a virada crítica da disciplina no Brasil, e o livro vira referência desse movimento."
      ],
      fact: "Desde então, o espaço passa a ser lido como “acumulação desigual de tempos”." },
    { id: "usp", year: "1983", phase: "Consagração", place: "sp", glyph: "escola",
      title: "Professor titular na USP",
      text: [
        "Ingressa na Universidade de São Paulo, onde se torna professor titular de Geografia Humana e orienta dezenas de mestres e doutores.",
        "Nessa fase publica Espaço e Método (1985), O espaço do cidadão (1987) e Metamorfoses do espaço habitado (1988)."
      ],
      fact: "Em 1997 recebe o título de Professor Emérito da USP." },
    { id: "vautrin-lud", year: "1994", phase: "Consagração", place: "stdie", glyph: "medalha",
      title: "Prêmio Internacional Vautrin Lud",
      text: [
        "Recebe em Saint-Dié-des-Vosges, na França, o Prêmio Vautrin Lud, a maior distinção internacional da geografia, muitas vezes chamado de “Nobel da geografia”.",
        "Foi o primeiro geógrafo de um país do Sul global a recebê-lo."
      ],
      fact: "Ao longo da vida, recebeu cerca de vinte títulos de doutor honoris causa." },
    { id: "natureza", year: "1996", phase: "Consagração", place: "sp", glyph: "livro",
      title: "A Natureza do Espaço",
      text: [
        "Publica A Natureza do Espaço: técnica e tempo, razão e emoção, considerada sua obra teórica mais ambiciosa.",
        "Define o espaço geográfico como um conjunto indissociável de sistemas de objetos e sistemas de ações."
      ],
      fact: "O livro é leitura obrigatória em cursos de geografia no Brasil e no exterior." },
    { id: "globalizacao", year: "2000", phase: "Legado", place: "sp", glyph: "globo",
      title: "Por uma outra globalização",
      text: [
        "Lança Por uma outra globalização: do pensamento único à consciência universal. Descreve a globalização como fábula, como perversidade e como possibilidade.",
        "Escrito em linguagem acessível, tornou-se seu livro mais lido fora da universidade."
      ],
      fact: "Para ele, a periferia e os pobres guardam a força de uma globalização mais humana." },
    { id: "morte", year: "2001", phase: "Legado", place: "sp", glyph: "estrela",
      title: "Despedida e obra final",
      text: [
        "Morre em 24 de junho de 2001, em São Paulo, aos 75 anos, vítima de câncer.",
        "No mesmo ano sai O Brasil: território e sociedade no início do século XXI, escrito com María Laura Silveira. Em 2006, o documentário de Silvio Tendler, Encontro com Milton Santos, leva suas ideias a um público ainda maior."
      ],
      fact: "Deixou mais de quarenta livros e uma escola de pensamento sobre o território." }
  ],

  // Livros. Para mostrar a capa real, salve a imagem em capas/<id>.jpg e troque capa: null por capa: "capas/<id>.jpg"
  livros: [
    { id: "centro-salvador", year: "1959", title: "O centro da cidade do Salvador", capa: null },
    { id: "villes-tiers-monde", year: "1971", title: "Les villes du Tiers Monde", capa: null },
    { id: "espace-partage", year: "1975", title: "L'espace partagé", note: "Em português: O espaço dividido (1979)", capa: null },
    { id: "geografia-nova", year: "1978", title: "Por uma Geografia Nova", capa: null },
    { id: "espaco-metodo", year: "1985", title: "Espaço e Método", capa: null },
    { id: "espaco-cidadao", year: "1987", title: "O espaço do cidadão", capa: null },
    { id: "metamorfoses", year: "1988", title: "Metamorfoses do espaço habitado", capa: null },
    { id: "urbanizacao", year: "1993", title: "A urbanização brasileira", capa: null },
    { id: "natureza-espaco", year: "1996", title: "A Natureza do Espaço", capa: null },
    { id: "outra-globalizacao", year: "2000", title: "Por uma outra globalização", capa: null },
    { id: "brasil-territorio", year: "2001", title: "O Brasil: território e sociedade no início do século XXI", note: "Com María Laura Silveira", capa: null }
  ]
};
