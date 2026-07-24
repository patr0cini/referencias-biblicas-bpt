/*!
 * referencias-biblicas — mostra o texto bíblico ao passar o rato (ou tocar)
 * sobre referências como "João 3:16" ou "Génesis 1:1-3", em qualquer página.
 *
 * Uso mínimo (uma linha antes de </body>):
 *   script src="referencias-biblicas.js" data-fonte="dados/biblia.json"
 *
 * O texto dos versículos vem de um ficheiro JSON (data-fonte), com a forma
 * { "livro.capitulo.versiculo": "texto", ... } — ver README.
 *
 * Licença: MIT. O código é livre; o texto bíblico pertence ao respetivo
 * editor e a sua utilização segue a licença desse texto.
 */
(function (global) {
  'use strict';

  // ---- Livros da Bíblia: nome canónico + variantes reconhecidas ----
  // A ordem é a dos 66 livros. Cada entrada tem o nome a mostrar e a lista
  // de formas aceites na deteção (nome completo e abreviaturas comuns em
  // português). Livros numerados aceitam "1 ", "1", "I " como prefixo.
  var LIVROS = [
    ['Génesis', ['Génesis', 'Genesis', 'Gén', 'Gen', 'Gn']],
    ['Êxodo', ['Êxodo', 'Exodo', 'Êx', 'Ex', 'Exo']],
    ['Levítico', ['Levítico', 'Levitico', 'Lev', 'Lv']],
    ['Números', ['Números', 'Numeros', 'Núm', 'Num', 'Nm']],
    ['Deuteronómio', ['Deuteronómio', 'Deuteronômio', 'Deuteronomio', 'Deut', 'Dt']],
    ['Josué', ['Josué', 'Josue', 'Jos', 'Js']],
    ['Juízes', ['Juízes', 'Juizes', 'Juí', 'Jui', 'Jz']],
    ['Rute', ['Rute', 'Rt']],
    ['1 Samuel', ['Samuel', 'Sam', 'Sm']],
    ['2 Samuel', ['Samuel', 'Sam', 'Sm']],
    ['1 Reis', ['Reis', 'Rs']],
    ['2 Reis', ['Reis', 'Rs']],
    ['1 Crónicas', ['Crónicas', 'Cronicas', 'Crón', 'Cron', 'Cr']],
    ['2 Crónicas', ['Crónicas', 'Cronicas', 'Crón', 'Cron', 'Cr']],
    ['Esdras', ['Esdras', 'Esd', 'Ed']],
    ['Neemias', ['Neemias', 'Nee', 'Ne']],
    ['Ester', ['Ester', 'Est', 'Et']],
    ['Job', ['Job', 'Jó', 'Jo b']],
    ['Salmos', ['Salmos', 'Salmo', 'Sal', 'Slm', 'Sl']],
    ['Provérbios', ['Provérbios', 'Proverbios', 'Prov', 'Prv', 'Pv', 'Pr']],
    ['Eclesiastes', ['Eclesiastes', 'Ecl', 'Ec']],
    ['Cânticos', ['Cânticos', 'Canticos', 'Cântico', 'Cantico', 'Cantares', 'Cânt', 'Cant', 'Ct']],
    ['Isaías', ['Isaías', 'Isaias', 'Isa', 'Is']],
    ['Jeremias', ['Jeremias', 'Jer', 'Jr']],
    ['Lamentações', ['Lamentações', 'Lamentacoes', 'Lam', 'Lm']],
    ['Ezequiel', ['Ezequiel', 'Eze', 'Ez']],
    ['Daniel', ['Daniel', 'Dan', 'Dn']],
    ['Oseias', ['Oseias', 'Oséias', 'Os']],
    ['Joel', ['Joel', 'Jl']],
    ['Amós', ['Amós', 'Amos', 'Am']],
    ['Obadias', ['Obadias', 'Abdias', 'Ob', 'Abd']],
    ['Jonas', ['Jonas', 'Jon', 'Jn']],
    ['Miqueias', ['Miqueias', 'Miquéias', 'Miq', 'Mq']],
    ['Naum', ['Naum', 'Nau', 'Na']],
    ['Habacuque', ['Habacuque', 'Habacuc', 'Hab', 'Hc']],
    ['Sofonias', ['Sofonias', 'Sof', 'Sf']],
    ['Ageu', ['Ageu', 'Ag']],
    ['Zacarias', ['Zacarias', 'Zac', 'Zc']],
    ['Malaquias', ['Malaquias', 'Mal', 'Ml']],
    ['Mateus', ['Mateus', 'Mat', 'Mt']],
    ['Marcos', ['Marcos', 'Mar', 'Mc']],
    ['Lucas', ['Lucas', 'Luc', 'Lc']],
    ['João', ['João', 'Joao', 'Jo']],
    ['Atos', ['Atos dos Apóstolos', 'Atos', 'Actos', 'Act', 'At']],
    ['Romanos', ['Romanos', 'Rom', 'Rm']],
    ['1 Coríntios', ['Coríntios', 'Corintios', 'Cor', 'Co']],
    ['2 Coríntios', ['Coríntios', 'Corintios', 'Cor', 'Co']],
    ['Gálatas', ['Gálatas', 'Galatas', 'Gal', 'Gl']],
    ['Efésios', ['Efésios', 'Efesios', 'Efe', 'Ef']],
    ['Filipenses', ['Filipenses', 'Fil', 'Flp', 'Fp']],
    ['Colossenses', ['Colossenses', 'Col', 'Cl']],
    ['1 Tessalonicenses', ['Tessalonicenses', 'Tes', 'Ts']],
    ['2 Tessalonicenses', ['Tessalonicenses', 'Tes', 'Ts']],
    ['1 Timóteo', ['Timóteo', 'Timoteo', 'Tim', 'Tm']],
    ['2 Timóteo', ['Timóteo', 'Timoteo', 'Tim', 'Tm']],
    ['Tito', ['Tito', 'Tt']],
    ['Filémon', ['Filémon', 'Filemon', 'Flm', 'Fm']],
    ['Hebreus', ['Hebreus', 'Heb', 'Hb']],
    ['Tiago', ['Tiago', 'Tg']],
    ['1 Pedro', ['Pedro', 'Pe', 'Pd']],
    ['2 Pedro', ['Pedro', 'Pe', 'Pd']],
    ['1 João', ['João', 'Joao', 'Jo']],
    ['2 João', ['João', 'Joao', 'Jo']],
    ['3 João', ['João', 'Joao', 'Jo']],
    ['Judas', ['Judas', 'Jud', 'Jd']],
    ['Apocalipse', ['Apocalipse', 'Apoc', 'Apo', 'Ap']],
  ];

  // livros de um só capítulo: o número solto é o versículo
  var UM_CAPITULO = { 31: true, 57: true, 63: true, 64: true, 65: true };

  var MAX_VERSICULOS_PADRAO = 6;

  function escaparRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Constrói o índice de deteção: para cada variante, a que livro pertence e
  // se precisa de prefixo numérico (1/2/3).
  function construirIndice() {
    var entradas = [];
    for (var i = 0; i < LIVROS.length; i++) {
      var nome = LIVROS[i][0];
      var numero = /^([123]) /.exec(nome);
      var prefixo = numero ? numero[1] : null;
      var variantes = LIVROS[i][1];
      for (var j = 0; j < variantes.length; j++) {
        entradas.push({ variante: variantes[j], indice: i + 1, prefixo: prefixo });
      }
    }
    // ordena da variante mais longa para a mais curta (para "Coríntios" ganhar a "Cor")
    entradas.sort(function (a, b) { return b.variante.length - a.variante.length; });
    return entradas;
  }

  var INDICE = construirIndice();

  // Regex de deteção. Um livro é: prefixo opcional (1, 2, 3, I, II, III) +
  // nome/abreviatura (inicial maiúscula) + localizador capítulo:versículo.
  function construirRegex() {
    var nomes = INDICE.map(function (e) { return escaparRegex(e.variante); });
    var nomesAlt = nomes.join('|');
    // prefixo: 1 / 1º / I  (com ou sem espaço)
    var prefixo = '(?:[123]|I{1,3})\\s*\\.?\\s*';
    // localizador: cap [:.,] versos, com intervalos (incl. entre capítulos),
    // listas e "ss."
    // um número de lista não pode ser seguido de letra (evita agarrar o "1"
    // de "1Co" na referência seguinte)
    var nao = '(?![A-Za-zÀ-ÿ])';
    // separador entre capítulos (num intervalo) é só ":" ou "." — nunca ","
    var loc = '\\d+\\s*[:.,]\\s*\\d+(?:ss\\.?)?(?:\\s*[-–]\\s*\\d+(?:\\s*[:.]\\s*\\d+)?)?'
      + '(?:\\s*,\\s*\\d+' + nao + '(?:ss\\.?)?(?:\\s*[-–]\\s*\\d+' + nao + ')?)*';
    var padrao = '(?:' + prefixo + ')?(?:' + nomesAlt + ')\\.?\\s+' + loc;
    return new RegExp(padrao, 'g');
  }

  // Faz corresponder o início de uma referência a um livro (com/sem prefixo).
  function casarLivro(texto) {
    var m = /^([123]|I{1,3})\s*\.?\s*/.exec(texto);
    var prefixoTexto = null;
    var resto = texto;
    if (m) {
      var romanos = { I: '1', II: '2', III: '3' };
      prefixoTexto = romanos[m[1]] || m[1];
      resto = texto.slice(m[0].length);
    }
    for (var i = 0; i < INDICE.length; i++) {
      var e = INDICE[i];
      if (resto.indexOf(e.variante) === 0) {
        var depois = resto.charAt(e.variante.length);
        if (depois !== '' && !/[\s.\d]/.test(depois)) continue;
        // livro numerado exige prefixo coincidente; livro simples exige ausência
        if (e.prefixo && prefixoTexto !== e.prefixo) continue;
        if (!e.prefixo && prefixoTexto) continue;
        var localizador = resto.slice(e.variante.length).replace(/^\.?\s+/, '');
        return { indice: e.indice, localizador: localizador };
      }
    }
    return null;
  }

  // Expande um localizador ("3:16", "1:1-3", "11:5-7, 26-36", "3", "16ss.")
  // em chaves "livro.capitulo.versiculo".
  function expandir(localizador, livro, maxVersiculos) {
    var limpo = localizador.replace(/\s+/g, '').replace(/\.$/, '');
    var seguintes = /ss$/.test(limpo);
    limpo = limpo.replace(/ss$/, '');
    if (!limpo) return { chaves: [], mais: false };

    // intervalo entre capítulos: 11:39-12:2 (separador só ":" ou ".")
    var entre = /^(\d+)[:.](\d+)[-–](\d+)[:.](\d+)$/.exec(limpo);
    if (entre) {
      return { chaves: [livro + '.' + (+entre[1]) + '.' + (+entre[2])], mais: true };
    }

    var comCap = /^(\d+)[:.,](.+)$/.exec(limpo);
    if (comCap) {
      var capitulo = +comCap[1];
      var chaves = [];
      var partes = comCap[2].split(',');
      for (var p = 0; p < partes.length; p++) {
        var intervalo = /^(\d+)[-–](\d+)$/.exec(partes[p]);
        if (intervalo) {
          for (var v = +intervalo[1]; v <= +intervalo[2] && chaves.length < maxVersiculos; v++) {
            chaves.push(livro + '.' + capitulo + '.' + v);
          }
        } else if (/^\d+$/.test(partes[p])) {
          chaves.push(livro + '.' + capitulo + '.' + (+partes[p]));
        }
        if (chaves.length >= maxVersiculos) break;
      }
      var cortou = chaves.length >= maxVersiculos;
      return { chaves: chaves, mais: seguintes || cortou };
    }

    // só capítulo(s): "3" ou "2-3"
    var soCap = /^(\d+)(?:[-–]\d+)?$/.exec(limpo);
    if (soCap) {
      if (UM_CAPITULO[livro]) {
        return { chaves: [livro + '.1.' + (+soCap[1])], mais: false };
      }
      return { chaves: [livro + '.' + (+soCap[1]) + '.1'], mais: true };
    }
    return { chaves: [], mais: false };
  }

  // Encontra todas as referências num texto. Devolve [{inicio, fim, texto, chaves, mais}].
  function encontrarNoTexto(texto, maxVersiculos) {
    maxVersiculos = maxVersiculos || MAX_VERSICULOS_PADRAO;
    var regex = construirRegex();
    var achados = [];
    var m;
    while ((m = regex.exec(texto)) !== null) {
      var bruto = m[0];
      var casado = casarLivro(bruto);
      if (!casado) continue;
      var exp = expandir(casado.localizador, casado.indice, maxVersiculos);
      if (!exp.chaves.length) continue;
      achados.push({
        inicio: m.index,
        fim: m.index + bruto.length,
        texto: bruto,
        chaves: exp.chaves,
        mais: exp.mais,
      });
    }
    return achados;
  }

  var NOMES = LIVROS.map(function (l) { return l[0]; });

  // API pura (também usável em Node para testes)
  var api = {
    LIVROS: LIVROS,
    NOMES: NOMES,
    encontrarNoTexto: encontrarNoTexto,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  // A partir daqui, só corre no browser.
  if (typeof document === 'undefined') return;

  // ---- Configuração (lida do próprio <script data-*>) ----
  var script = document.currentScript || (function () {
    var todos = document.getElementsByTagName('script');
    return todos[todos.length - 1];
  })();
  // Alternativa a data-fonte: os dados podem vir já embebidos numa variável
  // global (útil num ficheiro único, offline). Ver README.
  var cfg = {
    fonte: script && script.getAttribute('data-fonte'),
    dados: global.ReferenciasBiblicasDados || null,
    seletor: (script && script.getAttribute('data-seletor')) || 'body',
    atribuicao: (script && script.getAttribute('data-atribuicao')) || global.ReferenciasBiblicasAtribuicao || '',
    max: parseInt((script && script.getAttribute('data-max')) || '', 10) || MAX_VERSICULOS_PADRAO,
    estilos: !script || script.getAttribute('data-estilos') !== 'nao',
  };

  // ---- Estilos (injetados; desativáveis com data-estilos="nao") ----
  var CSS = '' +
    '.rb-ref{color:#527487;cursor:help;text-decoration:underline;' +
    'text-decoration-style:dotted;text-underline-offset:2px;border:0;background:none;' +
    'font:inherit;padding:0}' +
    '.rb-ref:hover{text-decoration-style:solid}' +
    '.rb-ref:focus-visible{outline:2px solid #527487;outline-offset:2px}' +
    '.rb-janela{position:absolute;z-index:2147483000;max-width:min(30rem,calc(100vw - 1.5rem));' +
    'padding:.85rem 1rem;background:#fff;color:#20323d;border:1px solid #d5e0e6;border-radius:4px;' +
    'box-shadow:0 12px 32px rgba(20,30,40,.18);font-size:.95rem;line-height:1.55;' +
    'font-family:inherit}' +
    '.rb-janela[hidden]{display:none}' +
    '.rb-janela p{margin:0 0 .55em}' +
    '.rb-janela p:last-child{margin-bottom:0}' +
    '.rb-janela b{display:block;font-size:.75rem;font-weight:700;letter-spacing:.05em;' +
    'text-transform:uppercase;color:#527487;margin-bottom:.15em}' +
    '.rb-fonte{margin-top:.7em;padding-top:.55em;border-top:1px solid #d5e0e6;' +
    'font-size:.72rem;color:#566a76}' +
    '.rb-mais{color:#566a76}' +
    '@media (prefers-color-scheme:dark){' +
    '.rb-ref{color:#8fb0c1}' +
    '.rb-janela{background:#21303a;color:#e9f0f4;border-color:#32454f;box-shadow:0 12px 32px rgba(0,0,0,.5)}' +
    '.rb-janela b{color:#8fb0c1}.rb-fonte{color:#9fb4c0;border-top-color:#32454f}}';

  function injetarEstilos() {
    if (!cfg.estilos) return;
    var s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ---- Deteção no DOM: envolve as referências em <span class="rb-ref"> ----
  var IGNORAR = { A: 1, BUTTON: 1, SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1 };

  function linkificar(raiz) {
    var walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode: function (no) {
        if (!no.nodeValue || !/\d/.test(no.nodeValue)) return NodeFilter.FILTER_REJECT;
        var pai = no.parentNode;
        while (pai && pai !== raiz) {
          if (pai.nodeType === 1) {
            if (IGNORAR[pai.tagName] || pai.isContentEditable || pai.classList.contains('rb-ref')) {
              return NodeFilter.FILTER_REJECT;
            }
          }
          pai = pai.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    var nos = [];
    var atual;
    while ((atual = walker.nextNode())) nos.push(atual);

    for (var i = 0; i < nos.length; i++) {
      var no = nos[i];
      var achados = encontrarNoTexto(no.nodeValue, cfg.max);
      if (!achados.length) continue;

      var frag = document.createDocumentFragment();
      var pos = 0;
      for (var a = 0; a < achados.length; a++) {
        var ach = achados[a];
        if (ach.inicio > pos) frag.appendChild(document.createTextNode(no.nodeValue.slice(pos, ach.inicio)));
        var span = document.createElement('span');
        span.className = 'rb-ref';
        span.setAttribute('role', 'button');
        span.setAttribute('tabindex', '0');
        span.setAttribute('data-rb', ach.chaves.join(','));
        if (ach.mais) span.setAttribute('data-rb-mais', '1');
        span.textContent = ach.texto;
        frag.appendChild(span);
        pos = ach.fim;
      }
      if (pos < no.nodeValue.length) frag.appendChild(document.createTextNode(no.nodeValue.slice(pos)));
      no.parentNode.replaceChild(frag, no);
    }
  }

  // ---- Janela com o texto bíblico ----
  var painel, dados = null, aCarregar = null, ativo = null;

  function carregar() {
    if (dados) return Promise.resolve(dados);
    if (cfg.dados) { dados = cfg.dados.versiculos || cfg.dados; return Promise.resolve(dados); }
    if (!cfg.fonte) return Promise.resolve({});
    if (!aCarregar) {
      aCarregar = fetch(cfg.fonte)
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(function (d) { dados = d.versiculos || d; return dados; })
        .catch(function () { return {}; });
    }
    return aCarregar;
  }

  function montar(elemento) {
    var chaves = elemento.getAttribute('data-rb').split(',');
    var versos = [];
    for (var i = 0; i < chaves.length; i++) {
      var texto = dados[chaves[i]];
      if (!texto) continue;
      var partes = chaves[i].split('.');
      versos.push({ livro: +partes[0], capitulo: +partes[1], versiculo: +partes[2], texto: texto });
    }
    if (!versos.length) return null;

    // agrupa versículos seguidos num só bloco (referência em cima, texto corrido)
    var blocos = [];
    for (var v = 0; v < versos.length; v++) {
      var atualV = versos[v];
      var ult = blocos[blocos.length - 1];
      if (ult && ult.livro === atualV.livro && ult.capitulo === atualV.capitulo && atualV.versiculo === ult.fim + 1) {
        ult.fim = atualV.versiculo;
        ult.textos.push(atualV.texto);
      } else {
        blocos.push({ livro: atualV.livro, capitulo: atualV.capitulo, inicio: atualV.versiculo, fim: atualV.versiculo, textos: [atualV.texto] });
      }
    }

    var html = blocos.map(function (b) {
      var intervalo = b.fim > b.inicio ? (b.inicio + '-' + b.fim) : ('' + b.inicio);
      var ref = NOMES[b.livro - 1] + ' ' + b.capitulo + ':' + intervalo;
      return '<p><b>' + escapar(ref) + '</b> ' + escapar(b.textos.join(' ')) + '</p>';
    }).join('');
    if (elemento.getAttribute('data-rb-mais')) html += '<span class="rb-mais">…</span>';
    if (cfg.atribuicao) html += '<p class="rb-fonte">' + escapar(cfg.atribuicao) + '</p>';
    return html;
  }

  function escapar(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function posicionar(elemento) {
    var caixa = elemento.getBoundingClientRect();
    var largura = painel.offsetWidth, altura = painel.offsetHeight, margem = 10;
    var esquerda = caixa.left + caixa.width / 2 - largura / 2;
    esquerda = Math.max(margem, Math.min(esquerda, window.innerWidth - largura - margem));
    var emCima = caixa.top - altura - 8 > 0;
    var topo = emCima ? caixa.top - altura - 8 : caixa.bottom + 8;
    painel.style.left = (esquerda + window.pageXOffset) + 'px';
    painel.style.top = (topo + window.pageYOffset) + 'px';
  }

  function mostrar(elemento) {
    carregar().then(function () {
      var html = montar(elemento);
      if (!html) return;
      ativo = elemento;
      painel.innerHTML = html;
      painel.hidden = false;
      posicionar(elemento);
    });
  }

  function esconder() { painel.hidden = true; ativo = null; }

  function iniciarInteracao() {
    painel = document.createElement('div');
    painel.className = 'rb-janela';
    painel.setAttribute('role', 'tooltip');
    painel.hidden = true;
    document.body.appendChild(painel);

    var temRato = window.matchMedia && window.matchMedia('(hover: hover)').matches;

    document.addEventListener('mouseover', function (e) {
      var alvo = e.target.closest && e.target.closest('.rb-ref');
      if (temRato && alvo) mostrar(alvo);
    });
    document.addEventListener('mouseout', function (e) {
      var alvo = e.target.closest && e.target.closest('.rb-ref');
      if (temRato && alvo && !painel.contains(e.relatedTarget)) esconder();
    });
    document.addEventListener('click', function (e) {
      var alvo = e.target.closest && e.target.closest('.rb-ref');
      if (alvo) {
        e.preventDefault();
        if (ativo === alvo && !painel.hidden) esconder(); else mostrar(alvo);
      } else if (!painel.hidden && !(e.target.closest && e.target.closest('.rb-janela'))) {
        esconder();
      }
    });
    document.addEventListener('focusin', function (e) {
      var alvo = e.target.closest && e.target.closest('.rb-ref');
      if (alvo) mostrar(alvo);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') esconder(); });
    window.addEventListener('scroll', function () { if (ativo) posicionar(ativo); }, { passive: true });
    window.addEventListener('resize', esconder);
  }

  function iniciar() {
    injetarEstilos();
    var raizes = document.querySelectorAll(cfg.seletor);
    for (var i = 0; i < raizes.length; i++) linkificar(raizes[i]);
    iniciarInteracao();
  }

  // exposto para uso manual (ex.: re-scan após conteúdo dinâmico)
  global.ReferenciasBiblicas = {
    encontrarNoTexto: encontrarNoTexto,
    linkificar: linkificar,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})(typeof window !== 'undefined' ? window : this);
