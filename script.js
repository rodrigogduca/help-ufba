/* ---- NAVBAR SCROLL ---- */
(function () {
  var nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.borderBottom = '1px solid #1E2D45';
      nav.style.background = 'rgba(10, 22, 40, 0.85)';
    } else {
      nav.style.backdropFilter = '';
      nav.style.borderBottom = '';
      nav.style.background = '#0A1628';
    }
  });
})();

/* ---- HAMBURGER MENU ---- */
(function () {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('hidden');
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.add('hidden');
    });
  });
})();

/* ---- GERAÇÃO DINÂMICA DE CAMPOS DE PROVAS ---- */
(function () {
  var qtdSelect = document.getElementById('qtdProvas');
  var container = document.getElementById('provasContainer');
  if (!qtdSelect || !container) return;

  function gerarCampos() {
    var qtd = parseInt(qtdSelect.value) || 3;
    container.innerHTML = '';

    for (var i = 1; i <= qtd; i++) {
      var div = document.createElement('div');
      div.className = 'grid grid-cols-2 gap-3';
      div.innerHTML =
        '<div>' +
        '<label for="nota' + i + '" class="block text-xs font-medium text-[#8494AD] mb-1">Nota Prova ' + i + '</label>' +
        '<input type="number" id="nota' + i + '" min="0" max="10" step="0.1" placeholder="0 a 10" ' +
        'class="w-full bg-[#0A1628] border border-[#1E2D45] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#003DA5] transition-colors">' +
        '</div>' +
        '<div>' +
        '<label for="peso' + i + '" class="block text-xs font-medium text-[#8494AD] mb-1">Peso <span class="text-[#5a6a82]">(padrão: 1)</span></label>' +
        '<input type="number" id="peso' + i + '" min="0" step="0.1" value="1" placeholder="1" ' +
        'class="w-full bg-[#0A1628] border border-[#1E2D45] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#003DA5] transition-colors">' +
        '</div>';
      container.appendChild(div);
    }
  }

  qtdSelect.addEventListener('change', gerarCampos);
  gerarCampos();
})();

/* ---- CALCULADORA DE MÉDIA (UFBA: >= 5 aprovado, < 5 reprovado, sem final) ---- */
(function () {
  var btnCalcular = document.getElementById('btnCalcularMedia');
  var resultado = document.getElementById('resultadoMedia');
  if (!btnCalcular || !resultado) return;

  btnCalcular.addEventListener('click', function () {
    var qtd = parseInt(document.getElementById('qtdProvas').value) || 3;
    var notas = [];
    var pesos = [];
    var somaPesos = 0;
    var somaNotasPesos = 0;
    var algumVazio = false;

    for (var i = 1; i <= qtd; i++) {
      var notaInput = document.getElementById('nota' + i);
      var pesoInput = document.getElementById('peso' + i);
      var nota = parseFloat(notaInput ? notaInput.value : '');
      var peso = parseFloat(pesoInput ? pesoInput.value : '1');

      if (isNaN(nota)) {
        algumVazio = true;
        break;
      }
      if (isNaN(peso) || peso <= 0) peso = 1;

      nota = Math.max(0, Math.min(10, nota));
      notas.push(nota);
      pesos.push(peso);
      somaPesos += peso;
      somaNotasPesos += nota * peso;
    }

    resultado.classList.remove('hidden');

    if (algumVazio) {
      resultado.innerHTML =
        '<div class="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">' +
        '<p class="text-red-400 font-medium text-sm">Preencha todas as notas antes de calcular.</p>' +
        '</div>';
      return;
    }

    var media = somaNotasPesos / somaPesos;
    var mediaArredondada = Math.round(media * 10) / 10;

    var linhasTabela = '';
    for (var j = 0; j < notas.length; j++) {
      var percentual = ((pesos[j] / somaPesos) * 100).toFixed(0);
      linhasTabela +=
        '<tr class="border-t border-[#1E2D45]">' +
        '<td class="py-2 text-sm">Prova ' + (j + 1) + '</td>' +
        '<td class="py-2 text-sm text-center">' + notas[j].toFixed(1) + '</td>' +
        '<td class="py-2 text-sm text-center">' + pesos[j] + '</td>' +
        '<td class="py-2 text-sm text-center text-[#8494AD]">' + percentual + '%</td>' +
        '</tr>';
    }

    var tabela =
      '<table class="w-full mt-4 text-sm">' +
      '<thead><tr class="text-[#8494AD] text-xs">' +
      '<th class="pb-2 text-left font-medium">Avaliação</th>' +
      '<th class="pb-2 text-center font-medium">Nota</th>' +
      '<th class="pb-2 text-center font-medium">Peso</th>' +
      '<th class="pb-2 text-center font-medium">%</th>' +
      '</tr></thead>' +
      '<tbody>' + linhasTabela + '</tbody>' +
      '</table>';

    var formulaTexto = '<p class="text-xs text-[#8494AD] mt-3">Média = soma(nota × peso) / soma(pesos)</p>';
    var barWidth = Math.min(100, mediaArredondada * 10);

    if (mediaArredondada >= 5) {
      resultado.innerHTML =
        '<div class="mt-4 p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-3">' +
        '<p class="text-5xl font-extrabold text-emerald-400">' + mediaArredondada.toFixed(1) + '</p>' +
        '<p class="text-sm text-[#8494AD]">Média do Semestre</p>' +
        '<span class="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">Aprovado!</span>' +
        formulaTexto + tabela +
        '<div class="w-full bg-[#1E2D45] rounded-full h-2 mt-3"><div class="bg-emerald-500 h-2 rounded-full transition-all" style="width:' + barWidth + '%"></div></div>' +
        '</div>';
    } else {
      resultado.innerHTML =
        '<div class="mt-4 p-5 bg-red-500/10 border border-red-500/30 rounded-xl text-center space-y-3">' +
        '<p class="text-5xl font-extrabold text-red-400">' + mediaArredondada.toFixed(1) + '</p>' +
        '<p class="text-sm text-[#8494AD]">Média do Semestre</p>' +
        '<span class="inline-block bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">Reprovado</span>' +
        '<p class="text-xs text-[#8494AD]">Média abaixo de 5,0. Reprovação direta na UFBA.</p>' +
        formulaTexto + tabela +
        '<div class="w-full bg-[#1E2D45] rounded-full h-2 mt-3"><div class="bg-red-500 h-2 rounded-full transition-all" style="width:' + barWidth + '%"></div></div>' +
        '</div>';
    }
  });
})();

/* ---- CALCULADORA DE FALTAS ---- */
(function () {
  var btnFaltas = document.getElementById('btnCalcularFaltas');
  var cargaInput = document.getElementById('cargaHoraria');
  var faltasInput = document.getElementById('faltasAtuais');
  var resultado = document.getElementById('resultadoFaltas');
  if (!btnFaltas) return;

  btnFaltas.addEventListener('click', function () {
    var cargaHoras = parseFloat(cargaInput.value);
    var faltasDias = parseInt(faltasInput.value) || 0;

    resultado.classList.remove('hidden');

    if (!cargaHoras || cargaHoras <= 0) {
      resultado.innerHTML =
        '<div class="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">' +
        '<p class="text-red-400 font-medium text-sm">Informe a carga horária da disciplina.</p>' +
        '</div>';
      return;
    }

    var cargaMinutos = cargaHoras * 60;
    var totalDias = cargaMinutos / 100;
    var maxFaltasDias = Math.floor(totalDias * 0.25);
    var faltasRestantes = Math.max(0, maxFaltasDias - faltasDias);
    var percentualUsado = totalDias > 0 ? ((faltasDias / totalDias) * 100) : 0;
    var percentualPresenca = 100 - percentualUsado;

    var statusColor, statusBg, statusBorder, statusText, barColor;
    if (faltasDias > maxFaltasDias) {
      statusColor = 'text-red-400';
      statusBg = 'bg-red-500/10';
      statusBorder = 'border-red-500/30';
      statusText = 'Reprovado por falta!';
      barColor = 'bg-red-500';
    } else if (faltasRestantes <= 2) {
      statusColor = 'text-amber-400';
      statusBg = 'bg-amber-500/10';
      statusBorder = 'border-amber-500/30';
      statusText = 'Cuidado! Você está no limite.';
      barColor = 'bg-amber-500';
    } else {
      statusColor = 'text-emerald-400';
      statusBg = 'bg-emerald-500/10';
      statusBorder = 'border-emerald-500/30';
      statusText = 'Você ainda pode faltar.';
      barColor = 'bg-emerald-500';
    }

    var barWidth = Math.min(100, percentualPresenca);

    resultado.innerHTML =
      '<div class="mt-4 p-5 ' + statusBg + ' border ' + statusBorder + ' rounded-xl text-center space-y-3">' +
      '<p class="text-sm font-medium ' + statusColor + '">' + statusText + '</p>' +
      '<p class="text-5xl font-extrabold ' + statusColor + '">' + faltasRestantes + ' dia' + (faltasRestantes !== 1 ? 's' : '') + '</p>' +
      '<p class="text-sm text-[#8494AD]">restantes para faltar</p>' +
      '<div class="text-left text-sm text-[#8494AD] space-y-1 mt-2">' +
      '<p>Total de dias letivos: <strong class="text-white">' + Math.floor(totalDias) + '</strong></p>' +
      '<p>Máximo de faltas: <strong class="text-white">' + maxFaltasDias + ' dias</strong></p>' +
      '<p>Faltas acumuladas: <strong class="text-white">' + faltasDias + ' dias</strong></p>' +
      '<p>Presença atual: <strong class="text-white">' + percentualPresenca.toFixed(1) + '%</strong></p>' +
      '</div>' +
      '<div class="w-full bg-[#1E2D45] rounded-full h-2 mt-3"><div class="' + barColor + ' h-2 rounded-full transition-all" style="width:' + barWidth + '%"></div></div>' +
      '</div>';
  });
})();
