const prefixes = {
  1: 'meth',
  2: 'eth',
  3: 'prop',
  4: 'but',
  5: 'pent',
  6: 'hex',
  7: 'hept',
  8: 'oct',
  9: 'non',
  10: 'dec'
};

const seriesInfo = {
  alkane: {
    label: 'Alkane',
    generalFormula: 'CₙH₂ₙ₊₂',
    functionalGroup: 'C–C single bond',
    description: 'Alkanes are saturated hydrocarbons. They contain only single carbon–carbon bonds.'
  },
  alkene: {
    label: 'Alkene',
    generalFormula: 'CₙH₂ₙ',
    functionalGroup: 'C=C double bond',
    description: 'Alkenes are unsaturated hydrocarbons. They contain at least one carbon–carbon double bond.'
  }
};

const state = {
  compareSeries: 'alkane',
  compareCarbons: 4,
  quizAnswer: ''
};

const els = {
  toggleBtns: [...document.querySelectorAll('.toggle-btn')],
  seriesFacts: document.getElementById('seriesFacts'),
  compareCarbons: document.getElementById('compareCarbons'),
  compareCarbonsValue: document.getElementById('compareCarbonsValue'),
  compareName: document.getElementById('compareName'),
  compareFormula: document.getElementById('compareFormula'),
  compareMessage: document.getElementById('compareMessage'),
  namingSeries: document.getElementById('namingSeries'),
  namingCarbons: document.getElementById('namingCarbons'),
  namingCarbonsValue: document.getElementById('namingCarbonsValue'),
  doubleBondField: document.getElementById('doubleBondField'),
  doubleBondPosition: document.getElementById('doubleBondPosition'),
  doubleBondPositionValue: document.getElementById('doubleBondPositionValue'),
  namingResult: document.getElementById('namingResult'),
  namingFormula: document.getElementById('namingFormula'),
  quizPrompt: document.getElementById('quizPrompt'),
  quizInput: document.getElementById('quizInput'),
  quizFeedback: document.getElementById('quizFeedback'),
  checkQuizBtn: document.getElementById('checkQuizBtn'),
  newQuizBtn: document.getElementById('newQuizBtn'),
  builderSeries: document.getElementById('builderSeries'),
  builderCarbons: document.getElementById('builderCarbons'),
  builderCarbonsValue: document.getElementById('builderCarbonsValue'),
  builderDoubleBondField: document.getElementById('builderDoubleBondField'),
  builderDoubleBond: document.getElementById('builderDoubleBond'),
  builderDoubleBondValue: document.getElementById('builderDoubleBondValue'),
  builderName: document.getElementById('builderName'),
  builderFormula: document.getElementById('builderFormula'),
  builderGroup: document.getElementById('builderGroup'),
  moleculeSvg: document.getElementById('moleculeSvg')
};

function molecularFormula(series, carbons) {
  if (series === 'alkane') return `C${carbons}H${2 * carbons + 2}`;
  if (carbons < 2) return 'Not possible';
  return `C${carbons}H${2 * carbons}`;
}

function validAlkene(carbons) {
  return carbons >= 2;
}

function formatName(series, carbons, bondPos = 1) {
  if (!prefixes[carbons]) return '';
  if (series === 'alkane') return `${prefixes[carbons]}ane`;
  if (!validAlkene(carbons)) return 'No alkene possible with 1 carbon atom';
  if (carbons <= 3) return `${prefixes[carbons]}ene`;
  return `${prefixes[carbons]}-${bondPos}-ene`;
}

function maxBondPosition(carbons) {
  return Math.max(1, Math.floor(carbons / 2));
}

function updateCompare() {
  const info = seriesInfo[state.compareSeries];
  const carbons = Number(els.compareCarbons.value);
  state.compareCarbons = carbons;
  els.compareCarbonsValue.textContent = carbons;

  els.seriesFacts.innerHTML = `
    <p><strong>${info.label}</strong></p>
    <p>${info.description}</p>
    <p><strong>General formula:</strong> ${info.generalFormula}</p>
    <p><strong>Functional group:</strong> ${info.functionalGroup}</p>
  `;

  if (state.compareSeries === 'alkene' && !validAlkene(carbons)) {
    els.compareName.textContent = 'Not available';
    els.compareFormula.textContent = '—';
    els.compareMessage.textContent = 'An alkene needs at least 2 carbon atoms because it must contain a C=C bond.';
    return;
  }

  els.compareName.textContent = formatName(state.compareSeries, carbons);
  els.compareFormula.textContent = molecularFormula(state.compareSeries, carbons);
  const nextName = formatName(state.compareSeries, carbons + 1, 1);
  els.compareMessage.innerHTML = `This member is followed by <strong>${nextName}</strong>. The next member adds one <strong>–CH<sub>2</sub>–</strong> unit, so the mass increases by <strong>14</strong>.`;
}

function syncNamingControls() {
  const series = els.namingSeries.value;
  const carbons = Number(els.namingCarbons.value);
  els.namingCarbonsValue.textContent = carbons;

  if (series === 'alkene') {
    els.doubleBondField.style.display = 'flex';
    const maxPos = maxBondPosition(carbons);
    els.doubleBondPosition.max = String(maxPos);
    if (Number(els.doubleBondPosition.value) > maxPos) {
      els.doubleBondPosition.value = String(maxPos);
    }
    els.doubleBondPositionValue.textContent = els.doubleBondPosition.value;
  } else {
    els.doubleBondField.style.display = 'none';
  }

  if (series === 'alkene' && !validAlkene(carbons)) {
    els.namingResult.textContent = 'No alkene possible';
    els.namingFormula.textContent = 'Choose 2 or more carbon atoms.';
    return;
  }

  const pos = Number(els.doubleBondPosition.value);
  els.namingResult.textContent = formatName(series, carbons, pos);
  els.namingFormula.textContent = molecularFormula(series, carbons);
}

function setQuiz() {
  const series = Math.random() < 0.5 ? 'alkane' : 'alkene';
  const minC = series === 'alkene' ? 2 : 1;
  const carbons = Math.floor(Math.random() * (7 - minC + 1)) + minC;
  const pos = series === 'alkene' ? Math.floor(Math.random() * maxBondPosition(carbons)) + 1 : 1;
  state.quizAnswer = formatName(series, carbons, pos).toLowerCase();
  const formula = molecularFormula(series, carbons);
  const extra = series === 'alkene' && carbons > 3 ? ` and the double bond starts at carbon ${pos}` : '';
  els.quizPrompt.textContent = `Name this ${series}: ${formula}${extra}.`;
  els.quizInput.value = '';
  els.quizFeedback.textContent = '';
  els.quizFeedback.className = 'message small';
}

function checkQuiz() {
  const guess = els.quizInput.value.trim().toLowerCase();
  if (!guess) {
    els.quizFeedback.textContent = 'Type an answer first.';
    return;
  }
  if (guess === state.quizAnswer) {
    els.quizFeedback.textContent = 'Correct. Carbon counting powers activated.';
    els.quizFeedback.className = 'message small success';
  } else {
    els.quizFeedback.textContent = `Not quite. The correct name is ${state.quizAnswer}.`;
    els.quizFeedback.className = 'message small';
  }
}

function syncBuilderControls() {
  const series = els.builderSeries.value;
  const carbons = Number(els.builderCarbons.value);
  els.builderCarbonsValue.textContent = carbons;

  if (series === 'alkene') {
    els.builderDoubleBondField.style.display = 'flex';
    const maxPos = Math.max(1, carbons - 1);
    els.builderDoubleBond.max = String(maxPos);
    if (Number(els.builderDoubleBond.value) > maxPos) {
      els.builderDoubleBond.value = String(maxPos);
    }
    els.builderDoubleBondValue.textContent = els.builderDoubleBond.value;
  } else {
    els.builderDoubleBondField.style.display = 'none';
  }

  if (series === 'alkene' && !validAlkene(carbons)) {
    els.builderName.textContent = 'No alkene possible';
    els.builderFormula.textContent = '—';
    els.builderGroup.textContent = 'C=C double bond';
    drawInvalidMessage();
    return;
  }

  const pos = Number(els.builderDoubleBond.value);
  els.builderName.textContent = formatName(series, carbons, Math.min(pos, maxBondPosition(carbons)));
  els.builderFormula.textContent = molecularFormula(series, carbons);
  els.builderGroup.textContent = seriesInfo[series].functionalGroup;
  drawMolecule(series, carbons, pos);
}

function carbonHydrogens(index, total, series, bondStart) {
  let bondOrderLeft = 0;
  let bondOrderRight = 0;

  if (index > 0) {
    bondOrderLeft = (series === 'alkene' && bondStart === index) ? 2 : 1;
  }
  if (index < total - 1) {
    bondOrderRight = (series === 'alkene' && bondStart === index + 1) ? 2 : 1;
  }

  return 4 - bondOrderLeft - bondOrderRight;
}

function drawInvalidMessage() {
  els.moleculeSvg.innerHTML = '';
  const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  txt.setAttribute('x', '450');
  txt.setAttribute('y', '130');
  txt.textContent = 'Choose at least 2 carbon atoms for an alkene.';
  txt.setAttribute('font-size', '28');
  els.moleculeSvg.appendChild(txt);
}

function svgEl(name, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function addText(svg, x, y, text) {
  const t = svgEl('text', { x, y });
  t.textContent = text;
  svg.appendChild(t);
}

function addLine(svg, x1, y1, x2, y2, cls = 'bond') {
  svg.appendChild(svgEl('line', { x1, y1, x2, y2, class: cls }));
}

function drawMolecule(series, carbons, rawBondStart) {
  const svg = els.moleculeSvg;
  svg.innerHTML = '';

  const maxPos = series === 'alkene' ? Math.max(1, carbons - 1) : 1;
  const bondStart = Math.min(rawBondStart, maxPos);
  const startX = 90;
  const stepX = carbons > 6 ? 90 : 110;
  const yC = 130;
  const yTopH = 60;
  const yBottomH = 200;
  const leftHX = 25;
  const fontOffset = 18;

  const xs = Array.from({ length: carbons }, (_, i) => startX + i * stepX);

  for (let i = 0; i < carbons; i++) {
    const hCount = carbonHydrogens(i, carbons, series, bondStart);
    const x = xs[i];

    addText(svg, x, yC, 'C');

    if (i < carbons - 1) {
      const isDouble = series === 'alkene' && bondStart === i + 1;
      if (isDouble) {
        addLine(svg, x + fontOffset, yC - 6, xs[i + 1] - fontOffset, yC - 6, 'bond double-1');
        addLine(svg, x + fontOffset, yC + 6, xs[i + 1] - fontOffset, yC + 6, 'bond double-2');
      } else {
        addLine(svg, x + fontOffset, yC, xs[i + 1] - fontOffset, yC, 'bond');
      }
    }

    if (hCount >= 1) {
      addLine(svg, x, yC - 24, x, yTopH + 14, 'bond');
      addText(svg, x, yTopH, 'H');
    }

    if (hCount >= 2) {
      addLine(svg, x, yC + 24, x, yBottomH - 14, 'bond');
      addText(svg, x, yBottomH, 'H');
    }

    if (i === 0 && hCount >= 3) {
      addLine(svg, x - 24, yC, leftHX + 18, yC, 'bond');
      addText(svg, leftHX, yC, 'H');
    }

    if (i === carbons - 1 && hCount >= 3) {
      addLine(svg, x + 24, yC, x + 62, yC, 'bond');
      addText(svg, x + 84, yC, 'H');
    }
  }

  svg.setAttribute('viewBox', `0 0 ${Math.max(900, startX + stepX * carbons + 130)} 260`);
}

els.toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    state.compareSeries = btn.dataset.series;
    els.toggleBtns.forEach(b => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    const min = state.compareSeries === 'alkene' ? 2 : 1;
    els.compareCarbons.min = String(min);
    if (Number(els.compareCarbons.value) < min) els.compareCarbons.value = String(min);
    updateCompare();
  });
});

els.compareCarbons.addEventListener('input', updateCompare);
els.namingSeries.addEventListener('change', syncNamingControls);
els.namingCarbons.addEventListener('input', syncNamingControls);
els.doubleBondPosition.addEventListener('input', () => {
  els.doubleBondPositionValue.textContent = els.doubleBondPosition.value;
  syncNamingControls();
});
els.checkQuizBtn.addEventListener('click', checkQuiz);
els.newQuizBtn.addEventListener('click', setQuiz);
els.quizInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkQuiz();
});
els.builderSeries.addEventListener('change', syncBuilderControls);
els.builderCarbons.addEventListener('input', syncBuilderControls);
els.builderDoubleBond.addEventListener('input', () => {
  els.builderDoubleBondValue.textContent = els.builderDoubleBond.value;
  syncBuilderControls();
});

updateCompare();
syncNamingControls();
setQuiz();
syncBuilderControls();
