import fs from 'fs';
import path from 'path';

// ========================
// UTILITIES
// ========================

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toSup(n) {
  const s = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  return String(n).split('').map(d => s[+d]).join('');
}

function toSub(n) {
  const s = '₀₁₂₃₄₅₆₇₈₉';
  return String(n).split('').map(d => s[+d]).join('');
}

function makeOptions(correct, wrongArr) {
  const wrongs = shuffleArray(wrongArr).slice(0, 3);
  const all = shuffleArray([correct, ...wrongs]);
  const labels = ['A', 'B', 'C', 'D'];
  const options = {};
  let answer = '';
  all.forEach((opt, i) => {
    options[labels[i]] = String(opt);
    if (opt === correct) answer = labels[i];
  });
  return { options, answer };
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ========================
// MATH GENERATORS
// ========================

const mathGenerators = {
  'number bases': () => {
    const base = randPick([2, 3, 4, 5, 6, 7, 8, 9]);
    const num = randInt(10, 200);
    const converted = num.toString(base);
    const wrong1 = num.toString(base + 1);
    const wrong2 = (num + randInt(1, 10)).toString(base);
    const wrong3 = num.toString(10);
    const q = `Convert ${num}₁₀ to base ${base}.`;
    const { options, answer } = makeOptions(convertred, [wrong1, wrong2, wrong3]);
    return { q, options, answer, explanation: `To convert ${num}₁₀ to base ${base}, repeatedly divide by ${base} and record remainders. The result is ${converted}${base}.` };
  },
  // ... more math generators
};

// ========================
// TOPIC MATCHERS
// ========================

function topicMatches(topicName, keywords) {
  const t = topicName.toLowerCase();
  return keywords.some(k => t.includes(k));
}

// ========================
// QUESTION BUILDERS BY DOMAIN
// ========================

function buildMathQuestion(topic, section, content, difficulty) {
  const t = (topic || '').toLowerCase();
  let q = '', options = {}, answer = '', explanation = '';

  if (topicMatches(t, ['number base'])) {
    const base = randPick([2, 3, 4, 5, 6, 7, 8]);
    const num = randInt(15, 250);
    const conv = num.toString(base);
    q = `Convert ${num}₁₀ to base ${base}.`;
    const w1 = num.toString(base + 1);
    const w2 = (num + randInt(5, 20)).toString(base);
    const w3 = parseInt(String(num).split('').reverse().join('')).toString(base);
    ({ options, answer } = makeOptions(conv, [w1, w2, w3]));
    explanation = `Divide ${num} repeatedly by ${base} and collect remainders in reverse order to get ${conv}${base}.`;
  }
  else if (topicMatches(t, ['fraction', 'decimal', 'percentage', 'profit', 'loss', 'interest', 'ratio', 'proportion', 'vat', 'share'])) {
    if (topicMatches(t, ['simple interest'])) {
      const P = randInt(1000, 10000);
      const R = randPick([2, 3, 4, 5, 6, 8, 10]);
      const T = randPick([1, 2, 3, 4, 5]);
      const SI = (P * R * T) / 100;
      q = `Calculate the simple interest on ₦${P} for ${T} years at ${R}% per annum.`;
      ({ options, answer } = makeOptions(`₦${SI}`, [`₦${SI + P}`, `₦${SI + 100}`, `₦${SI - 50}`]));
      explanation = `Simple Interest = (P × R × T)/100 = (${P} × ${R} × ${T})/100 = ₦${SI}.`;
    } else if (topicMatches(t, ['profit', 'loss percent'])) {
      const CP = randInt(500, 5000);
      const percent = randInt(10, 40);
      const SP = Math.round(CP * (1 + percent / 100));
      q = `A trader bought an article for ₦${CP} and sold it at a profit of ${percent}%. Calculate the selling price.`;
      ({ options, answer } = makeOptions(`₦${SP}`, [`₦${CP + percent}`, `₦${Math.round(CP * (1 + (percent + 10) / 100))}`, `₦${CP}`]));
      explanation = `Selling Price = CP + Profit = ${CP} + (${percent}/100 × ${CP}) = ₦${SP}.`;
    } else {
      const a = randInt(1, 9), b = randInt(1, 9), c = randInt(1, 9), d = randInt(1, 9);
      q = `Simplify (${a}/${b}) ÷ (${c}/${d}).`;
      const num = a * d, den = b * c;
      const g = gcd(num, den);
      const correct = `${num/g}/${den/g}`;
      ({ options, answer } = makeOptions(correct, [`${a+c}/${b+d}`, `${a*c}/${b*d}`, `${a+b}/${c+d}`]));
      explanation = `Dividing by a fraction = multiplying by its reciprocal: (${a}/${b}) × (${d}/${c}) = ${num}/${den} = ${correct}.`;
    }
  }
  else if (topicMatches(t, ['indices', 'logarithm', 'surds', 'standard form'])) {
    const base = randPick([2, 3, 5, 10]);
    const exp1 = randInt(2, 5), exp2 = randInt(2, 5);
    const correctVal = Math.pow(base, exp1 + exp2);
    q = `Evaluate ${base}${toSup(exp1)} × ${base}${toSup(exp2)}.`;
    ({ options, answer } = makeOptions(String(correctVal), [String(Math.pow(base, exp1 * exp2)), String(Math.pow(base, exp1 - exp2)), String(Math.pow(base, exp1) + Math.pow(base, exp2))]));
    explanation = `Using law of indices: a^m × a^n = a^(m+n). So ${base}${toSup(exp1)} × ${base}${toSup(exp2)} = ${base}${toSup(exp1 + exp2)} = ${correctVal}.`;
  }
  else if (topicMatches(t, ['set', 'venn'])) {
    const nA = randInt(20, 50), nB = randInt(20, 50), nBoth = randInt(5, 15), nTotal = nA + nB - nBoth + randInt(5, 20);
    q = `In a class of ${nTotal} students, ${nA} offer Mathematics, ${nB} offer Physics, and ${nBoth} offer both. How many offer neither?`;
    const neither = nTotal - (nA + nB - nBoth);
    ({ options, answer } = makeOptions(String(neither), [String(nTotal - nA - nB), String(nBoth), String(nTotal - nA)]));
    explanation = `n(M ∪ P) = n(M) + n(P) - n(M ∩ P) = ${nA} + ${nB} - ${nBoth} = ${nA + nB - nBoth}. Neither = ${nTotal} - ${nA + nB - nBoth} = ${neither}.`;
  }
  else if (topicMatches(t, ['polynomial', 'factor', 'remainder', 'simultaneous', 'quadratic'])) {
    const a = 1, b = randInt(2, 8), c = randInt(1, 12);
    const sum = b, product = c;
    const root1 = randInt(1, 5), root2 = product / root1;
    if (Number.isInteger(root2) && root1 + root2 === sum) {
      q = `Find the roots of the quadratic equation x² - ${sum}x + ${product} = 0.`;
      ({ options, answer } = makeOptions(`${root1} and ${root2}`, [`${root1} and ${root1 + 1}`, `${root1 - 1} and ${root2 + 1}`, `${product} and ${sum}`]));
      explanation = `x² - (${root1}+${root2})x + (${root1}×${root2}) = 0 → roots are ${root1} and ${root2}.`;
    } else {
      const x = randInt(2, 5), y = randInt(1, 4);
      const eq1 = `2x + y = ${2*x + y}`;
      const eq2 = `x - y = ${x - y}`;
      q = `Solve simultaneously: ${eq1} and ${eq2}.`;
      ({ options, answer } = makeOptions(`x = ${x}, y = ${y}`, [`x = ${x+1}, y = ${y-1}`, `x = ${x-1}, y = ${y+1}`, `x = ${x+y}, y = ${x-y}`]));
      explanation = `From ${eq2}, x = y + ${x-y}. Substituting into ${eq1}: 2(y + ${x-y}) + y = ${2*x + y} → 3y = ${3*y} → y = ${y}, so x = ${x}.`;
    }
  }
  else if (topicMatches(t, ['variation', 'direct', 'inverse', 'joint', 'partial'])) {
    const k = randInt(2, 10), x = randInt(2, 10), y = k * x;
    q = `If y varies directly as x and y = ${y} when x = ${x}, find y when x = ${x + 5}.`;
    const newY = k * (x + 5);
    ({ options, answer } = makeOptions(String(newY), [String(y + 5), String(k + x + 5), String(y * (x + 5))]));
    explanation = `y = kx → ${y} = k(${x}) → k = ${k}. When x = ${x + 5}, y = ${k} × ${x + 5} = ${newY}.`;
  }
  else if (topicMatches(t, ['inequalities', 'inequality'])) {
    const a = randInt(2, 5), b = randInt(5, 20);
    q = `Solve for x: ${a}x + 3 ≤ ${b}.`;
    const val = (b - 3) / a;
    const correct = `x ≤ ${val}`;
    ({ options, answer } = makeOptions(correct, [`x ≥ ${val}`, `x ≤ ${val + 1}`, `x = ${val}`]));
    explanation = `${a}x ≤ ${b - 3} → x ≤ ${b - 3}/${a} = ${val}.`;
  }
  else if (topicMatches(t, ['progression', 'arithmetic', 'geometric', 'ap', 'gp', 'sequence', 'series'])) {
    const a = randInt(2, 10), d = randInt(2, 5), n = randInt(5, 10);
    const nth = a + (n - 1) * d;
    q = `Find the ${n}th term of the A.P: ${a}, ${a + d}, ${a + 2*d}, ...`;
    ({ options, answer } = makeOptions(String(nth), [String(a + n * d), String(a * n + d), String(a + d * n)]));
    explanation = `nth term = a + (n-1)d = ${a} + (${n}-1)${d} = ${a} + ${(n-1)*d} = ${nth}.`;
  }
  else if (topicMatches(t, ['matrix', 'matrices', 'determinant'])) {
    const a = randInt(1, 5), b = randInt(1, 5), c = randInt(1, 5), d = randInt(1, 5);
    const det = a * d - b * c;
    q = `Find the determinant of the matrix [${a} ${b}; ${c} ${d}].`;
    ({ options, answer } = makeOptions(String(det), [String(a + d), String(a * d + b * c), String(a * c - b * d)]));
    explanation = `Determinant = (${a} × ${d}) - (${b} × ${c}) = ${a*d} - ${b*c} = ${det}.`;
  }
  else if (topicMatches(t, ['geometry', 'angle', 'polygon', 'circle', 'triangle', 'quadrilateral'])) {
    const angle = randInt(30, 120);
    q = `The interior angles of a regular polygon are each ${180 - angle}°. How many sides has the polygon?`;
    const sides = 360 / angle;
    ({ options, answer } = makeOptions(String(sides), [String(sides + 1), String(sides - 1), String(180 / angle)]));
    explanation = `Exterior angle = 180° - ${180 - angle}° = ${angle}°. Number of sides = 360°/${angle}° = ${sides}.`;
  }
  else if (topicMatches(t, ['mensuration', 'area', 'volume', 'perimeter', 'sector', 'segment'])) {
    const r = randInt(3, 10), theta = randPick([60, 90, 120]);
    const area = (theta / 360) * Math.PI * r * r;
    const rounded = Math.round(area * 10) / 10;
    q = `Find the area of a sector of a circle of radius ${r} cm that subtends an angle of ${theta}° at the centre. [Take π = 22/7]`;
    const exact = (theta / 360) * (22 / 7) * r * r;
    const exactRounded = Math.round(exact * 10) / 10;
    ({ options, answer } = makeOptions(`${exactRounded} cm²`, [`${Math.round((theta/360)*3.14*r*r*10)/10} cm²`, `${exactRounded + 1} cm²`, `${Math.round(2 * exactRounded * 10) / 10} cm²`]));
    explanation = `Area of sector = (θ/360) × πr² = (${theta}/360) × (22/7) × ${r}² = ${exactRounded} cm².`;
  }
  else if (topicMatches(t, ['coordinate geometry', 'gradient', 'midpoint', 'distance', 'equation of line', 'straight line'])) {
    const x1 = randInt(1, 5), y1 = randInt(1, 5), x2 = randInt(6, 10), y2 = randInt(6, 10);
    const grad = (y2 - y1) / (x2 - x1);
    q = `Find the gradient of the line joining points (${x1}, ${y1}) and (${x2}, ${y2}).`;
    ({ options, answer } = makeOptions(String(grad), [String((y2 - y1) * (x2 - x1)), String((x2 - x1) / (y2 - y1)), String(y2 / x2)]));
    explanation = `Gradient = (y₂ - y₁)/(x₂ - x₁) = (${y2} - ${y1})/(${x2} - ${x1}) = ${grad}.`;
  }
  else if (topicMatches(t, ['trigonometry', 'sine', 'cosine', 'tangent', 'elevation', 'depression', 'bearing'])) {
    const angle = randPick([30, 45, 60]);
    const hyp = randInt(10, 20);
    const opp = angle === 30 ? hyp / 2 : angle === 45 ? hyp / Math.SQRT2 : hyp * Math.sqrt(3) / 2;
    const rounded = Math.round(opp * 10) / 10;
    q = `In a right-angled triangle, the hypotenuse is ${hyp} cm and one angle is ${angle}°. Find the length of the side opposite the ${angle}° angle.`;
    ({ options, answer } = makeOptions(`${rounded} cm`, [`${Math.round(hyp * Math.cos(angle * Math.PI / 180) * 10) / 10} cm`, `${hyp / 2} cm`, `${hyp} cm`]));
    explanation = `sin(${angle}°) = opposite/hypotenuse → opposite = ${hyp} × sin(${angle}°) = ${rounded} cm.`;
  }
  else if (topicMatches(t, ['differentiation', 'derivative', 'rate of change', 'maxima', 'minima', 'calculus'])) {
    const a = randInt(1, 5), n = randInt(2, 4);
    q = `Differentiate y = ${a}x${toSup(n)} with respect to x.`;
    const coeff = a * n, newPow = n - 1;
    const correct = newPow === 1 ? `${coeff}x` : `${coeff}x${toSup(newPow)}`;
    ({ options, answer } = makeOptions(correct, [`${a}x${toSup(n + 1)}`, `${n}x${toSup(n - 1)}`, `${coeff}x${toSup(n)}`]));
    explanation = `d/dx(${a}x${toSup(n)}) = ${a} × ${n}x${toSup(n - 1)} = ${correct}.`;
  }
  else if (topicMatches(t, ['integration', 'integral', 'area under curve'])) {
    const a = randInt(1, 4), n = randInt(2, 4);
    q = `Evaluate ∫ ${a}x${toSup(n)} dx.`;
    const newPow = n + 1;
    const correct = `${a}/${newPow}x${toSup(newPow)} + c`;
    ({ options, answer } = makeOptions(correct, [`${a}x${toSup(newPow)} + c`, `${a}/${n}x${toSup(n)} + c`, `${a * n}x${toSup(n - 1)} + c`]));
    explanation = `∫xⁿ dx = x^(n+1)/(n+1) + c. So ∫${a}x${toSup(n)} dx = ${a}/${newPow}x${toSup(newPow)} + c.`;
  }
  else if (topicMatches(t, ['mean', 'mode', 'median', 'measure of location', 'average', 'cumulative'])) {
    const nums = Array.from({ length: 5 }, () => randInt(2, 10));
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    q = `Find the mean of the following numbers: ${nums.join(', ')}.`;
    ({ options, answer } = makeOptions(String(mean), [String(mean + 1), String(mean - 1), String(nums[2])]));
    explanation = `Mean = (${nums.join(' + ')})/${nums.length} = ${nums.reduce((a,b)=>a+b,0)}/${nums.length} = ${mean}.`;
  }
  else if (topicMatches(t, ['probability', 'permutation', 'combination', 'chance'])) {
    const n = randInt(4, 7), r = randInt(2, n - 1);
    let fact = 1;
    for (let i = 2; i <= n; i++) fact *= i;
    q = `In how many ways can ${n} different books be arranged on a shelf?`;
    ({ options, answer } = makeOptions(String(fact), [String(n * (n - 1)), String(Math.pow(n, 2)), String(fact + n)]));
    explanation = `Number of arrangements = ${n}! = ${fact}.`;
  }
  else {
    const a = randInt(2, 12), b = randInt(2, 12);
    q = `Evaluate ${a} × ${b} + ${a + b}.`;
    const val = a * b + a + b;
    ({ options, answer } = makeOptions(String(val), [String(a * b), String(a + b + a * b + 1), String(a * b - a - b)]));
    explanation = `${a} × ${b} + ${a + b} = ${a * b} + ${a + b} = ${val}.`;
  }

  return {
    id: 0,
    topic: topic || 'Mathematics',
    section: section || 'General',
    subtopic: topic || 'General',
    difficulty,
    question: q,
    options,
    answer,
    explanation
  };
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// ========================
// SCIENCE BUILDERS
// ========================

function buildScienceQuestion(topic, section, content, difficulty, subjectKey) {
  const t = (topic || '').toLowerCase();
  const sk = subjectKey.toLowerCase();
  let q = '', options = {}, answer = '', explanation = '';

  // BIOLOGY
  if (sk.includes('biology') || sk.includes('biolog')) {
    if (topicMatches(t, ['cell', 'organelle', 'cytoplasm', 'nucleus', 'mitochondria', 'ribosome'])) {
      q = `Which organelle is known as the "powerhouse of the cell"?`;
      ({ options, answer } = makeOptions('Mitochondria', ['Nucleus', 'Ribosome', 'Golgi body']));
      explanation = `Mitochondria produce ATP through cellular respiration, earning them the name "powerhouse of the cell".`;
    } else if (topicMatches(t, ['photosynthesis', 'chlorophyll', 'stomata', 'leaf'])) {
      q = `During photosynthesis, what gas is absorbed from the atmosphere?`;
      ({ options, answer } = makeOptions('Carbon dioxide', ['Oxygen', 'Nitrogen', 'Hydrogen']));
      explanation = `Plants absorb CO₂ from the air and release O₂ during photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.`;
    } else if (topicMatches(t, ['respiration', 'anaerobic', 'aerobic', 'glycolysis'])) {
      q = `Which of the following is a product of aerobic respiration?`;
      ({ options, answer } = makeOptions('Carbon dioxide and water', ['Lactic acid only', 'Ethanol and CO₂', 'Oxygen and glucose']));
      explanation = `Aerobic respiration uses oxygen to break down glucose, producing CO₂, water, and ATP.`;
    } else if (topicMatches(t, ['genetics', 'dna', 'gene', 'chromosome', 'allele', 'inheritance', 'mendel'])) {
      q = `A homozygous dominant tall plant (TT) is crossed with a homozygous recessive short plant (tt). What is the genotype of the offspring?`;
      ({ options, answer } = makeOptions('Tt', ['TT', 'tt', 'Tt or tt']));
      explanation = `All offspring receive one T from the dominant parent and one t from the recessive parent, making them all Tt (heterozygous tall).`;
    } else if (topicMatches(t, ['ecosystem', 'food chain', 'trophic', 'producer', 'consumer', 'decomposer'])) {
      q = `In a food chain, which organisms are always found at the first trophic level?`;
      ({ options, answer } = makeOptions('Producers', ['Primary consumers', 'Secondary consumers', 'Decomposers']));
      explanation = `Producers (plants) convert sunlight to energy and form the base of every food chain at trophic level 1.`;
    } else if (topicMatches(t, ['evolution', 'natural selection', 'adaptation', 'speciation', 'darwin'])) {
      q = `Who proposed the theory of evolution by natural selection?`;
      ({ options, answer } = makeOptions('Charles Darwin', ['Gregor Mendel', ['Jean-Baptiste Lamarck'], ['Alfred Wallace']]));
      explanation = `Charles Darwin published "On the Origin of Species" in 1859, proposing natural selection as the mechanism of evolution.`;
    } else if (topicMatches(t, ['human', 'digestion', 'alimentary', 'enzyme', 'stomach', 'intestine'])) {
      q = `Which enzyme is responsible for the digestion of proteins in the stomach?`;
      ({ options, answer } = makeOptions('Pepsin', ['Amylase', 'Lipase', 'Trypsin']));
      explanation = `Pepsin, activated by hydrochloric acid in the gastric juice, breaks down proteins into polypeptides.`;
    } else if (topicMatches(t, ['circulatory', 'heart', 'blood', 'vessel', 'artery', 'vein'])) {
      q = `Which blood vessel carries oxygenated blood from the lungs to the heart?`;
      ({ options, answer } = makeOptions('Pulmonary vein', ['Pulmonary artery', ['Vena cava'], ['Aorta']]));
      explanation = `The pulmonary vein is unique among veins because it carries oxygen-rich blood from the lungs to the left atrium.`;
    } else if (topicMatches(t, ['excretion', 'kidney', 'nephron', 'urine', 'osmoregulation'])) {
      q = `The functional unit of the kidney is called the:`;
      ({ options, answer } = makeOptions('Nephron', ['Neuron', 'Alveolus', 'Villus']));
      explanation = `The nephron filters blood, reabsorbs useful substances, and produces urine.`;
    } else {
      q = `Which of the following best describes ${topic}?`;
      ({ options, answer } = makeOptions(`The study and functional role of ${topic} in living organisms`, [`A chemical compound unrelated to ${topic}`, `A physical process occurring only in plants`, `A term used exclusively in physics`]));
      explanation = `${topic} is a fundamental biological concept essential to understanding living systems.`;
    }
  }
  // CHEMISTRY
  else if (sk.includes('chemistry') || sk.includes('chem')) {
    if (topicMatches(t, ['atom', 'electron', 'proton', 'neutron', 'shell', 'orbital'])) {
      q = `An atom with 11 protons, 12 neutrons and 11 electrons has a mass number of:`;
      ({ options, answer } = makeOptions('23', ['22', '24', '11']));
      explanation = `Mass number = protons + neutrons = 11 + 12 = 23.`;
    } else if (topicMatches(t, ['periodic table', 'group', 'period', 'element', 'metal', 'non-metal'])) {
      q = `Which group in the periodic table contains the alkali metals?`;
      ({ options, answer } = makeOptions('Group 1', ['Group 2', 'Group 7', 'Group 0']));
      explanation = `Group 1 elements (Li, Na, K, Rb, Cs, Fr) are called alkali metals due to their alkaline oxides and hydroxides.`;
    } else if (topicMatches(t, ['chemical bond', 'ionic', 'covalent', 'metallic', 'electrovalent'])) {
      q = `Which type of bond is formed by the transfer of electrons from one atom to another?`;
      ({ options, answer } = makeOptions('Ionic bond', ['Covalent bond', 'Metallic bond', 'Hydrogen bond']));
      explanation = `Ionic bonds involve electron transfer, typically between a metal and a non-metal, creating oppositely charged ions.`;
    } else if (topicMatches(t, ['acid', 'base', 'salt', 'ph', 'neutralization', 'titration'])) {
      q = `What is the pH of a neutral solution at 25°C?`;
      ({ options, answer } = makeOptions('7', ['0', '14', '1']));
      explanation = `At 25°C, pure water has equal concentrations of H⁺ and OH⁻ ions, giving a pH of 7 (neutral).`;
    } else if (topicMatches(t, ['organic', 'hydrocarbon', 'alkane', 'alkene', 'alkyne', 'alcohol'])) {
      q = `The general formula for alkanes is:`;
      ({ options, answer } = makeOptions('CₙH₂ₙ₊₂', ['CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ']));
      explanation = `Alkanes are saturated hydrocarbons with single bonds only, following the formula CₙH₂ₙ₊₂.`;
    } else if (topicMatches(t, ['mole', 'molar', 'avogadro', 'concentration', 'molality'])) {
      const mass = randInt(20, 80), molar = randPick([20, 40, 56, 58, 98]);
      const moles = (mass / molar).toFixed(2);
      q = `Calculate the number of moles in ${mass}g of a substance with molar mass ${molar}g/mol.`;
      ({ options, answer } = makeOptions(String(moles), [String((mass * molar).toFixed(2)), String((mass + molar).toFixed(2)), String((molar / mass).toFixed(2))]));
      explanation = `Moles = mass / molar mass = ${mass} / ${molar} = ${moles} mol.`;
    } else if (topicMatches(t, ['oxidation', 'reduction', 'redox', 'electrolysis'])) {
      q = `In the reaction: 2Na + Cl₂ → 2NaCl, chlorine is:`;
      ({ options, answer } = makeOptions('Reduced', ['Oxidized', ['Neutralized'], ['Dissociated']]));
      explanation = `Chlorine gains electrons (reduction) to form Cl⁻ ions, while sodium loses electrons (oxidation) to form Na⁺.`;
    } else if (topicMatches(t, ['gas law', 'boyle', 'charles', 'pressure', 'volume', 'temperature'])) {
      q = `Boyle's law states that the pressure of a fixed mass of gas is inversely proportional to its volume at constant:`;
      ({ options, answer } = makeOptions('Temperature', ['Mass', ['Density'], ['Pressure']]));
      explanation = `Boyle's Law: P ∝ 1/V (at constant temperature). PV = constant.`;
    } else {
      q = `Which of the following statements about ${topic} is correct?`;
      ({ options, answer } = makeOptions(`It is an essential concept covered in the ${topic} section of the syllabus`, [`It is unrelated to chemical processes`, `It applies only to physical changes`, `It is not tested in standard exams`]));
      explanation = `${topic} is a core chemistry topic that students must master for exam success.`;
    }
  }
  // PHYSICS
  else if (sk.includes('physics') || sk.includes('physic')) {
    if (topicMatches(t, ['force', 'newton', 'motion', 'velocity', 'acceleration', 'inertia'])) {
      const m = randInt(2, 10), a = randInt(2, 10);
      const F = m * a;
      q = `Calculate the force acting on a body of mass ${m}kg accelerating at ${a}m/s².`;
      ({ options, answer } = makeOptions(`${F}N`, [`${F + 10}N`, `${m + a}N`, `${m * a * 2}N`]));
      explanation = `Newton's 2nd Law: F = ma = ${m} × ${a} = ${F}N.`;
    } else if (topicMatches(t, ['energy', 'work', 'power', 'potential', 'kinetic'])) {
      const m = randInt(2, 10), v = randInt(3, 10);
      const ke = 0.5 * m * v * v;
      q = `Calculate the kinetic energy of a ${m}kg mass moving at ${v}m/s.`;
      ({ options, answer } = makeOptions(`${ke}J`, [`${m * v}J`, `${m + v}J`, `${ke + 10}J`]));
      explanation = `KE = ½mv² = 0.5 × ${m} × ${v}² = ${ke}J.`;
    } else if (topicMatches(t, ['wave', 'sound', 'light', 'reflection', 'refraction', 'diffraction'])) {
      q = `The bending of light as it passes from air into water is called:`;
      ({ options, answer } = makeOptions('Refraction', ['Reflection', 'Diffraction', 'Dispersion']));
      explanation = `Refraction is the change in direction of light due to a change in speed when moving between media of different optical densities.`;
    } else if (topicMatches(t, ['electric', 'current', 'voltage', 'resistance', 'ohm', 'circuit', 'power'])) {
      const V = randInt(5, 20), R = randPick([2, 4, 5, 10]);
      const I = V / R;
      q = `A resistor of ${R}Ω is connected to a ${V}V supply. Calculate the current flowing through it.`;
      ({ options, answer } = makeOptions(`${I}A`, [`${V + R}A`, `${V * R}A`, `${R / V}A`]));
      explanation = `Ohm's Law: I = V/R = ${V}/${R} = ${I}A.`;
    } else if (topicMatches(t, ['heat', 'temperature', 'specific heat', 'latent heat', 'thermometer', 'expansion'])) {
      q = `The amount of heat required to raise the temperature of 1kg of a substance by 1°C is called:`;
      ({ options, answer } = makeOptions('Specific heat capacity', ['Latent heat', 'Heat capacity', 'Thermal conductivity']));
      explanation = `Specific heat capacity (c) is defined as the heat required to raise the temperature of 1kg of a substance by 1°C.`;
    } else if (topicMatches(t, ['magnet', 'magnetic', 'electromagnet', 'field', 'flux'])) {
      q = `Which material is most suitable for making a permanent magnet?`;
      ({ options, answer } = makeOptions('Steel', ['Iron', ['Copper'], ['Aluminium']]));
      explanation = `Steel retains magnetism longer than iron due to its higher retentivity and coercivity.`;
    } else if (topicMatches(t, ['nuclear', 'radioactivity', 'half-life', 'fission', 'fusion'])) {
      q = `The process by which a heavy nucleus splits into lighter nuclei is called:`;
      ({ options, answer } = makeOptions('Nuclear fission', ['Nuclear fusion', ['Radioactive decay'], ['Ionization']]));
      explanation = `Nuclear fission involves splitting a heavy nucleus (e.g., Uranium-235) into smaller nuclei with release of energy.`;
    } else {
      q = `Which statement about ${topic} is correct?`;
      ({ options, answer } = makeOptions(`It is a fundamental principle tested in ${topic} assessments`, [`It does not apply to physical systems`, `It is exclusive to chemical reactions`, `It is not part of the standard syllabus`]));
      explanation = `${topic} is a key physics concept that appears regularly in examinations.`;
    }
  }
  // AGRICULTURE / AGRIC
  else if (sk.includes('agric')) {
    if (topicMatches(t, ['soil', 'texture', 'structure', 'profile', 'fertility'])) {
      q = `Which soil type has the highest water retention capacity?`;
      ({ options, answer } = makeOptions('Clay soil', ['Sandy soil', 'Loamy soil', 'Gravel']));
      explanation = `Clay soil has fine particles with small pore spaces, allowing it to retain more water than sandy or loamy soils.`;
    } else if (topicMatches(t, ['pest', 'disease', 'control', 'pesticide', 'herbicide'])) {
      q = `A chemical used to control weeds is called:`;
      ({ options, answer } = makeOptions('Herbicide', ['Insecticide', 'Fungicide', 'Rodenticide']));
      explanation = `Herbicides are chemicals specifically designed to kill or inhibit the growth of unwanted plants (weeds).`;
    } else if (topicMatches(t, ['crop', 'planting', 'harvest', 'monoculture', 'mixed farming'])) {
      q = `Growing different types of crops on the same piece of land in succession is known as:`;
      ({ options, answer } = makeOptions('Crop rotation', ['Mixed farming', 'Monocropping', 'Shifting cultivation']));
      explanation = `Crop rotation involves growing different crops sequentially on the same land to maintain soil fertility and control pests.`;
    } else if (topicMatches(t, ['animal', 'livestock', 'poultry', 'cattle', 'nutrition'])) {
      q = `Which class of livestock is primarily raised for meat production?`;
      ({ options, answer } = makeOptions('Beef cattle', ['Dairy cattle', 'Draught animals', ['Breeding stock']]));
      explanation = `Beef cattle are specifically bred and raised for meat (beef) production, unlike dairy cattle raised for milk.`;
    } else {
      q = `Which of the following best describes ${topic} in agricultural science?`;
      ({ options, answer } = makeOptions(`A core concept in the study and practice of ${topic}`, [`An obsolete farming method`, `A concept from physics`, `Not relevant to Nigerian agriculture`]));
      explanation = `${topic} is essential knowledge for students of agricultural science.`;
    }
  }
  // Default science fallback
  else {
    q = `Which of the following is correct about ${topic}?`;
    ({ options, answer } = makeOptions(`It is a tested concept in ${topic} examinations`, [`It is unrelated to ${sk}`, `It belongs to arts subjects`, `It is not examined`]));
    explanation = `${topic} is part of the syllabus for this subject.`;
  }

  return {
    id: 0, topic: topic || 'General', section: section || 'General',
    subtopic: topic || 'General', difficulty, question: q, options, answer, explanation
  };
}

// ========================
// SOCIAL SCIENCE / ARTS BUILDERS
// ========================

function buildArtsQuestion(topic, section, content, difficulty, subjectKey) {
  const t = (topic || '').toLowerCase();
  const sk = subjectKey.toLowerCase();
  let q = '', options = {}, answer = '', explanation = '';

  if (sk.includes('government') || sk.includes('civic')) {
    if (topicMatches(t, ['constitution', 'constitutional', 'supremacy'])) {
      q = `The Nigerian Constitution of 1999 (as amended) derives its legitimacy from:`;
      ({ options, answer } = makeOptions('The people of Nigeria', ['The National Assembly', 'The President', 'The Judiciary']));
      explanation = `Section 14(2)(a) of the 1999 Constitution states that sovereignty belongs to the people from whom government derives all powers.`;
    } else if (topicMatches(t, ['democracy', 'rule of law', 'separation of power', ' Checks and balances'])) {
      q = `Which principle ensures that no branch of government becomes too powerful?`;
      ({ options, answer } = makeOptions('Separation of powers', ['Unitary system', 'Confederation', 'Totalitarianism']));
      explanation = `Separation of powers divides government into legislative, executive, and judicial branches to prevent abuse of power.`;
    } else if (topicMatches(t, ['federalism', 'federal', 'state', 'local government', 'devolution'])) {
      q = `How many tiers of government are recognized in the Nigerian federal system?`;
      ({ options, answer } = makeOptions('Three', ['Two', 'Four', 'Five']));
      explanation = `Nigeria operates a three-tier federal system: Federal, State, and Local Governments.`;
    } else if (topicMatches(t, ['election', 'electoral', 'vote', 'franchise', 'suffrage', 'inec'])) {
      q = `Which body is constitutionally responsible for conducting elections in Nigeria?`;
      ({ options, answer } = makeOptions('INEC', ['EFCC', 'ICPC', 'NASS']));
      explanation = `The Independent National Electoral Commission (INEC) is established by Section 153 of the 1999 Constitution to organize elections.`;
    } else if (topicMatches(t, ['citizenship', 'rights', 'fundamental human', 'civil', 'political'])) {
      q = `Which of the following is a fundamental human right guaranteed by the Nigerian Constitution?`;
      ({ options, answer } = makeOptions('Freedom of expression', ['Right to bear arms', 'Right to drive', 'Right to own property exclusively']));
      explanation = `Chapter IV of the 1999 Constitution guarantees fundamental rights including freedom of expression, thought, conscience, and religion.`;
    } else if (topicMatches(t, ['political party', 'party system', 'multi-party', 'ideology'])) {
      q = `Nigeria operates a:`;
      ({ options, answer } = makeOptions('Multi-party system', ['One-party system', 'Two-party system', 'No-party system']));
      explanation = `The 1999 Constitution allows for multiple political parties, and Nigeria currently has several registered parties.`;
    } else if (topicMatches(t, ['pressure group', 'interest group', 'trade union', 'lobby'])) {
      q = `An organization formed to influence government policy on behalf of its members is called a:`;
      ({ options, answer } = makeOptions('Pressure group', ['Political party', 'Government agency', 'Constitutional assembly']));
      explanation = `Pressure groups (interest groups) seek to influence government decisions without contesting elections directly.`;
    } else if (topicMatches(t, ['public opinion', 'mass media', 'propaganda', 'opinion poll'])) {
      q = `Which of the following is the most effective means of shaping public opinion in a democratic society?`;
      ({ options, answer } = makeOptions('Mass media', ['Military force', 'Religious decree', 'Traditional rulers']));
      explanation = `Mass media (TV, radio, newspapers, internet) disseminate information and shape public discourse in democracies.`;
    } else if (topicMatches(t, ['pre-colonial', 'colonial', 'indigenous', 'traditional', 'monarchy', 'chief'])) {
      q = `In pre-colonial Nigeria, the Igbo political system was best described as:`;
      ({ options, answer } = makeOptions('Republican/acephalous', ['Absolute monarchy', 'Feudal system', 'Theocratic']));
      explanation = `The Igbo had a decentralized, republican system without a central king, with decisions made by village assemblies and titled elders.`;
    } else if (topicMatches(t, ['foreign policy', 'diplomacy', 'non-alignment', 'oau', 'au', 'un', 'commonwealth'])) {
      q = `Nigeria is a member of all the following international organizations EXCEPT:`;
      ({ options, answer } = makeOptions('NATO', ['United Nations', 'African Union', 'Commonwealth']));
      explanation = `NATO is a North Atlantic military alliance. Nigeria belongs to the UN, AU, and Commonwealth but not NATO.`;
    } else {
      q = `Which statement is correct about ${topic} in the study of Government?`;
      ({ options, answer } = makeOptions(`It is a key concept tested in Nigerian Government examinations`, [`It applies only to foreign political systems`, `It is not part of the Nigerian curriculum`, `It is exclusive to economics`]));
      explanation = `${topic} is included in the Government syllabus and regularly appears in JAMB and WAEC examinations.`;
    }
  }
  else if (sk.includes('history') || sk.includes('histor')) {
    if (topicMatches(t, ['slave trade', 'trans-atlantic', 'abolition', 'colonial'])) {
      q = `The trans-Atlantic slave trade was formally abolished by Britain in:`;
      ({ options, answer } = makeOptions('1807', ['1707', '1857', '1907']));
      explanation = `The British Parliament passed the Abolition of the Slave Trade Act in 1807, though slavery itself was abolished later in 1833.`;
    } else if (topicMatches(t, ['independence', 'nationalism', 'ncnc', 'ag', 'nndp', 'ziks', 'awolowo', 'bello'])) {
      q = `Who was the first President of Nigeria?`;
      ({ options, answer } = makeOptions('Nnamdi Azikiwe', ['Obafemi Awolowo', 'Ahmadu Bello', 'Tafawa Balewa']));
      explanation = `Dr. Nnamdi Azikiwe became Nigeria's first (ceremonial) President when Nigeria became a republic on October 1, 1963.`;
    } else if (topicMatches(t, ['world war', 'cold war', 'united nations', 'league of nations'])) {
      q = `The League of Nations was established after:`;
      ({ options, answer } = makeOptions('World War I', ['World War II', 'The Cold War', 'The Napoleonic Wars']));
      explanation = `The League of Nations was created by the Treaty of Versailles in 1919 after WWI to prevent future conflicts.`;
    } else if (topicMatches(t, ['nigerian civil war', 'biafra', ' coup', 'murtala', 'gowon'])) {
      q = `The Nigerian Civil War ended officially in:`;
      ({ options, answer } = makeOptions('1970', ['1967', '1966', '1975']));
      explanation = `The Biafran War (Nigerian Civil War) lasted from July 1967 to January 1970, ending with Biafra's surrender.`;
    } else {
      q = `Which of the following statements about ${topic} is historically accurate?`;
      ({ options, answer } = makeOptions(`It is an important historical event/concept covered in the syllabus`, [`It never occurred in Africa`, `It is a modern economic theory`, `It is not examined in WAEC/JAMB`]));
      explanation = `${topic} is a key area of study in the History syllabus.`;
    }
  }
  else if (sk.includes('crs') || sk.includes('christian') || sk.includes('religion')) {
    if (topicMatches(t, ['creation', 'genesis', 'adam', 'eve', 'fall'])) {
      q = `According to Genesis, on which day did God create human beings?`;
      ({ options, answer } = makeOptions('Sixth day', ['First day', ['Third day'], ['Seventh day']]));
      explanation = `Genesis 1:26-31 records that God created man on the sixth day, after creating vegetation, animals, and other living things.`;
    } else if (topicMatches(t, ['moses', 'exodus', 'ten commandment', 'passover', 'red sea'])) {
      q = `How many commandments did God give to Moses on Mount Sinai?`;
      ({ options, answer } = makeOptions('Ten', ['Seven', 'Twelve', 'Five']));
      explanation = `Exodus 20 and Deuteronomy 5 record the Ten Commandments given to Moses as the moral law for Israel.`;
    } else if (topicMatches(t, ['jesus', 'miracle', 'parable', 'sermon', 'disciple', 'resurrection'])) {
      q = `Which disciple is known as the "doubting disciple" because he wanted to see Jesus' wounds before believing in the resurrection?`;
      ({ options, answer } = makeOptions('Thomas', ['Peter', 'John', 'James']));
      explanation = `Thomas (called Didymus) refused to believe the resurrection until he saw and touched Jesus' wounds (John 20:24-29).`;
    } else if (topicMatches(t, ['paul', 'missionary', 'epistle', 'conversion', 'damascus'])) {
      q = `Paul was converted to Christianity on the road to:`;
      ({ options, answer } = makeOptions('Damascus', ['Jerusalem', ['Rome'], ['Antioch']]));
      explanation = `Acts 9 records Paul's dramatic conversion on the road to Damascus, where he encountered the risen Christ.`;
    } else {
      q = `Which statement about ${topic} is correct in Christian Religious Studies?`;
      ({ options, answer } = makeOptions(`It is a foundational biblical concept examined in CRS`, [`It belongs to Islamic studies`, `It is not part of the Bible`, `It is a secular philosophy`]));
      explanation = `${topic} is part of the CRS syllabus and is regularly tested.`;
    }
  }
  else if (sk.includes('islamic') || sk.includes('islam')) {
    if (topicMatches(t, ['qur', 'revelation', 'prophet', 'muhammad', 'makkah', 'madinah'])) {
      q = `The Prophet Muhammad (SAW) migrated from Makkah to Madinah in the year:`;
      ({ options, answer } = makeOptions('622 CE', ['610 CE', '632 CE', '570 CE']));
      explanation = `The Hijrah (migration) occurred in 622 CE (1 AH), marking the beginning of the Islamic calendar.`;
    } else if (topicMatches(t, ['pillar', 'salat', 'zakat', 'sawm', 'hajj', 'shahadah'])) {
      q = `How many pillars of Islam are there?`;
      ({ options, answer } = makeOptions('Five', ['Four', 'Six', 'Seven']));
      explanation = `The Five Pillars are: Shahadah (faith), Salat (prayer), Zakat (charity), Sawm (fasting), and Hajj (pilgrimage).`;
    } else if (topicMatches(t, ['hadith', 'sunnah', 'sharia', 'fiqh', 'ijma'])) {
      q = `The sayings and actions of Prophet Muhammad (SAW) are collectively known as:`;
      ({ options, answer } = makeOptions('Hadith and Sunnah', ['Qur’an only', 'Tafsir', 'Ijma']));
      explanation = `Hadith refers to the narrated sayings, and Sunnah refers to the practices of the Prophet, serving as secondary sources of Islamic law.`;
    } else {
      q = `Which statement about ${topic} is correct in Islamic Studies?`;
      ({ options, answer } = makeOptions(`It is a fundamental Islamic concept in the syllabus`, [`It belongs to Christian theology`, `It is not part of Islamic teachings`, `It is a secular concept`]));
      explanation = `${topic} is essential knowledge for Islamic Studies examinations.`;
    }
  }
  else if (sk.includes('literature') || sk.includes('lit')) {
    if (topicMatches(t, ['drama', 'play', 'tragedy', 'comedy', 'shakespeare', 'character', 'act'])) {
      q = `A play with an unhappy ending, usually involving the death of the main character, is called a:`;
      ({ options, answer } = makeOptions('Tragedy', ['Comedy', 'Farce', 'Melodrama']));
      explanation = `A tragedy is a dramatic work with an unhappy ending, often caused by a flaw in the protagonist (hamartia).`;
    } else if (topicMatches(t, ['poetry', 'poem', 'stanza', 'verse', 'rhyme', 'metre', 'alliteration'])) {
      q = `The repetition of the same initial consonant sound in a line of poetry is called:`;
      ({ options, answer } = makeOptions('Alliteration', ['Assonance', 'Consonance', 'Onomatopoeia']));
      explanation = `Alliteration is the repetition of initial consonant sounds (e.g., "Peter Piper picked").`;
    } else if (topicMatches(t, ['prose', 'novel', 'short story', 'narrative', 'theme', 'plot', 'setting'])) {
      q = `The sequence of events in a story is called the:`;
      ({ options, answer } = makeOptions('Plot', ['Theme', 'Setting', 'Mood']));
      explanation = `Plot is the arrangement of events in a narrative, typically including exposition, rising action, climax, falling action, and resolution.`;
    } else if (topicMatches(t, ['figurative', 'simile', 'metaphor', 'personification', 'hyperbole', 'imagery'])) {
      q = `"The sun smiled at us" is an example of:`;
      ({ options, answer } = makeOptions('Personification', ['Simile', 'Metaphor', 'Hyperbole']));
      explanation = `Personification attributes human qualities to non-human things. The sun cannot literally smile.`;
    } else {
      q = `Which of the following is correct about ${topic} in Literature?`;
      ({ options, answer } = makeOptions(`It is a literary concept tested in examinations`, [`It is a mathematical formula`, `It belongs exclusively to science`, `It is not part of the literature syllabus`]));
      explanation = `${topic} is included in the Literature-in-English syllabus.`;
    }
  }
  else if (sk.includes('geography')) {
    if (topicMatches(t, ['climate', 'weather', 'rainfall', 'temperature', 'wind', 'pressure'])) {
      q = `Which instrument is used to measure atmospheric pressure?`;
      ({ options, answer } = makeOptions('Barometer', ['Thermometer', 'Hygrometer', 'Anemometer']));
      explanation = `A barometer measures atmospheric pressure. A thermometer measures temperature, a hygrometer measures humidity, and an anemometer measures wind speed.`;
    } else if (topicMatches(t, ['rock', 'igneous', 'sedimentary', 'metamorphic', 'weathering', 'erosion'])) {
      q = `Rocks formed from cooled magma or lava are classified as:`;
      ({ options, answer } = makeOptions('Igneous rocks', ['Sedimentary rocks', 'Metamorphic rocks', 'Fossil rocks']));
      explanation = `Igneous rocks form from the cooling and solidification of magma (intrusive) or lava (extrusive).`;
    } else if (topicMatches(t, ['population', 'migration', 'birth rate', 'death rate', 'census'])) {
      q = `The movement of people from rural to urban areas is known as:`;
      ({ options, answer } = makeOptions('Rural-urban migration', ['Emigration', 'Immigration', 'Seasonal migration']));
      explanation = `Rural-urban migration refers to the movement of people from countryside areas to cities, common in developing nations.`;
    } else if (topicMatches(t, ['map', 'scale', 'contour', 'relief', 'projection', 'grid'])) {
      q = `On a map, the ratio 1:50,000 means that 1 cm on the map represents:`;
      ({ options, answer } = makeOptions('50,000 cm on the ground', ['50,000 km on the ground', '50,000 m on the ground', '50 cm on the ground']));
      explanation = `A representative fraction (RF) of 1:50,000 means 1 unit on the map = 50,000 of the same units on the ground (50,000 cm = 0.5 km).`;
    } else if (topicMatches(t, ['vegetation', 'forest', 'savanna', 'desert', 'tundra', 'biome'])) {
      q = `The tropical grassland region of Nigeria is called:`;
      ({ options, answer } = makeOptions('Savanna', ['Rainforest', 'Mangrove', 'Desert']));
      explanation = `The savanna is a tropical grassland with scattered trees, covering much of northern Nigeria.`;
    } else {
      q = `Which statement about ${topic} is correct in Geography?`;
      ({ options, answer } = makeOptions(`It is a geographical concept in the syllabus`, [`It is purely historical`, `It belongs to physics`, `It is not examined`]));
      explanation = `${topic} is a core Geography topic tested in JAMB and WAEC.`;
    }
  }
  else if (sk.includes('economics')) {
    if (topicMatches(t, ['demand', 'supply', 'equilibrium', 'price', 'market'])) {
      q = `When price increases and quantity demanded decreases, this is consistent with:`;
      ({ options, answer } = makeOptions('The law of demand', ['The law of supply', ['Giffen paradox'], ['Veblen effect']]));
      explanation = `The law of demand states that, ceteris paribus, as price rises, quantity demanded falls (inverse relationship).`;
    } else if (topicMatches(t, ['scarcity', 'choice', 'opportunity cost', 'scale of preference'])) {
      q = `The real cost of choosing one alternative over another is called:`;
      ({ options, answer } = makeOptions('Opportunity cost', ['Money cost', 'Sunk cost', 'Fixed cost']));
      explanation = `Opportunity cost is the value of the next best alternative foregone when a choice is made.`;
    } else if (topicMatches(t, ['production', 'factors of production', 'land', 'labour', 'capital', 'entrepreneur'])) {
      q = `Which factor of production is described as a man-made resource used to produce goods and services?`;
      ({ options, answer } = makeOptions('Capital', ['Land', 'Labour', 'Entrepreneur']));
      explanation = `Capital refers to man-made aids to production such as machinery, tools, buildings, and equipment.`;
    } else if (topicMatches(t, ['money', 'bank', 'central bank', 'inflation', 'deflation', 'monetary policy'])) {
      q = `Which institution is responsible for issuing currency in Nigeria?`;
      ({ options, answer } = makeOptions('Central Bank of Nigeria (CBN)', ['Nigerian Deposit Insurance Corporation', 'Ministry of Finance', 'Nigerian Stock Exchange']));
      explanation = `The CBN, established by the CBN Act of 1958 (amended), has the sole authority to issue legal tender in Nigeria.`;
    } else if (topicMatches(t, ['tax', 'fiscal policy', 'budget', 'government revenue', 'expenditure'])) {
      q = `A tax that takes a larger percentage of income from the poor than from the rich is called:`;
      ({ options, answer } = makeOptions('Regressive tax', ['Progressive tax', 'Proportional tax', 'Direct tax']));
      explanation = `A regressive tax (e.g., VAT on essential goods) disproportionately burdens lower-income earners.`;
    } else if (topicMatches(t, ['trade', 'international trade', 'balance of payment', 'exchange rate', 'export', 'import'])) {
      q = `When a country's imports exceed its exports, it is said to have a:`;
      ({ options, answer } = makeOptions('Trade deficit', ['Trade surplus', 'Balanced trade', 'Favorable balance of trade']));
      explanation = `A trade deficit (unfavorable balance of trade) occurs when import value exceeds export value.`;
    } else {
      q = `Which of the following is correct about ${topic} in Economics?`;
      ({ options, answer } = makeOptions(`It is an economic principle in the syllabus`, [`It is a biological concept`, `It is not examined`, `It applies only to foreign economies`]));
      explanation = `${topic} is a fundamental economics concept tested in JAMB and WAEC.`;
    }
  }
  else if (sk.includes('commerce') || sk.includes('business') || sk.includes('marketing') || sk.includes('insurance')) {
    if (topicMatches(t, ['trade', 'home trade', 'foreign trade', 'retail', 'wholesale', 'import', 'export'])) {
      q = `Buying goods in large quantities and selling them in smaller quantities is a function of:`;
      ({ options, answer } = makeOptions('Wholesaler', ['Retailer', ['Consumer'], ['Manufacturer']]));
      explanation = `Wholesalers purchase goods in bulk from manufacturers and break bulk for retailers.`;
    } else if (topicMatches(t, ['advertising', 'promotion', 'sales', 'marketing', 'product'])) {
      q = `Which of the following is NOT a function of advertising?`;
      ({ options, answer } = makeOptions('Setting the factory price', ['Creating awareness', 'Persuading customers', 'Informing the public']));
      explanation = `Advertising informs, persuades, and reminds consumers. Price-setting is a pricing decision, not an advertising function.`;
    } else if (topicMatches(t, ['insurance', 'premium', 'policy', 'underwriter', 'indemnity'])) {
      q = `The amount paid periodically to an insurance company is called:`;
      ({ options, answer } = makeOptions('Premium', ['Indemnity', 'Policy', 'Claim']));
      explanation = `A premium is the regular payment made by the insured to the insurer to keep the insurance policy active.`;
    } else if (topicMatches(t, ['transport', 'communication', 'warehousing', 'banking', 'finance'])) {
      q = `Which mode of transport is most suitable for perishable goods over short distances?`;
      ({ options, answer } = makeOptions('Road transport', ['Sea transport', 'Air transport', 'Pipeline']));
      explanation = `Road transport offers door-to-door delivery, flexibility, and speed over short distances, making it ideal for perishables.`;
    } else if (topicMatches(t, ['account', 'bookkeeping', 'ledger', 'journal', 'balance sheet', 'trial balance'])) {
      q = `The book of original entry where transactions are first recorded is called the:`;
      ({ options, answer } = makeOptions('Journal', ['Ledger', 'Cash book', 'Trial balance']));
      explanation = `The journal (or book of original entry) is where transactions are first recorded chronologically before posting to the ledger.`;
    } else {
      q = `Which statement about ${topic} is correct in Commerce/Business Studies?`;
      ({ options, answer } = makeOptions(`It is a commercial concept in the syllabus`, [`It is a scientific law`, `It is not examined`, `It belongs to government studies`]));
      explanation = `${topic} is part of the Commerce syllabus and is regularly tested.`;
    }
  }
  else if (sk.includes('english') || sk.includes('use-of-english') || sk.includes('use of english')) {
    if (topicMatches(t, ['comprehension', 'passage', 'inference', 'summary'])) {
      q = `In reading comprehension, an inference is:`;
      ({ options, answer } = makeOptions('A conclusion drawn from evidence in the text', ['A direct quotation', 'The main title', 'A grammatical error']));
      explanation = `An inference is an educated conclusion reached by reasoning from evidence and clues provided in the passage.`;
    } else if (topicMatches(t, ['grammar', 'tense', 'parts of speech', 'clause', 'phrase', 'sentence'])) {
      q = `Identify the grammatical function of the underlined word: "The man WHO CAME HERE is my uncle."`;
      ({ options, answer } = makeOptions('Relative pronoun', ['Personal pronoun', 'Demonstrative pronoun', 'Reflexive pronoun']));
      explanation = `"Who" introduces a relative clause and refers back to "the man," making it a relative pronoun.`;
    } else if (topicMatches(t, ['lexis', 'synonym', 'antonym', 'homonym', 'vocabulary', 'register'])) {
      q = `A word that has the same meaning as another word is called a:`;
      ({ options, answer } = makeOptions('Synonym', ['Antonym', 'Homonym', 'Acronym']));
      explanation = `A synonym is a word with the same or nearly the same meaning as another word (e.g., happy/joyful).`;
    } else if (topicMatches(t, ['essay', 'writing', 'narrative', 'descriptive', 'argumentative', 'expository'])) {
      q = `An essay that tells a story is called:`;
      ({ options, answer } = makeOptions('Narrative essay', ['Descriptive essay', ['Argumentative essay'], ['Expository essay']]));
      explanation = `A narrative essay tells a story with a plot, characters, setting, and often a chronological sequence of events.`;
    } else {
      q = `Which of the following is correct about ${topic} in English Language?`;
      ({ options, answer } = makeOptions(`It is an essential English language skill`, [`It is a mathematical concept`, `It belongs to French grammar`, `It is not part of the syllabus`]));
      explanation = `${topic} is a core component of the Use of English syllabus.`;
    }
  }
  else {
    q = `Which of the following statements about ${topic} is correct?`;
    ({ options, answer } = makeOptions(`It is a tested concept in ${topic}`, [`It is unrelated to this subject`, `It belongs to mathematics`, `It is not examined`]));
    explanation = `${topic} is included in the syllabus for this subject.`;
  }

  return {
    id: 0, topic: topic || 'General', section: section || 'General',
    subtopic: topic || 'General', difficulty, question: q, options, answer, explanation
  };
}

// ========================
// VOCATIONAL / TECHNICAL BUILDERS
// ========================

function buildVocationalQuestion(topic, section, content, difficulty, subjectKey) {
  const t = (topic || '').toLowerCase();
  const sk = subjectKey.toLowerCase();
  let q = '', options = {}, answer = '', explanation = '';

  if (sk.includes('computer') || sk.includes('ict') || sk.includes('data processing')) {
    if (topicMatches(t, ['hardware', 'cpu', 'memory', 'input', 'output', 'storage'])) {
      q = `Which device is both an input and output device?`;
      ({ options, answer } = makeOptions('Touchscreen monitor', ['Keyboard', ['Printer'], ['Scanner']]));
      explanation = `A touchscreen accepts input (touch) and displays output, making it both an input and output device.`;
    } else if (topicMatches(t, ['software', 'operating system', 'application', 'program', 'algorithm'])) {
      q = `Which of the following is an example of system software?`;
      ({ options, answer } = makeOptions('Windows OS', ['Microsoft Word', 'Google Chrome', 'Adobe Photoshop']));
      explanation = `System software manages computer hardware and provides a platform for applications. Windows OS is system software; the others are application software.`;
    } else if (topicMatches(t, ['internet', 'network', 'www', 'email', 'protocol', 'domain'])) {
      q = `The protocol used for sending emails is:`;
      ({ options, answer } = makeOptions('SMTP', ['HTTP', 'FTP', 'TCP']));
      explanation = `SMTP (Simple Mail Transfer Protocol) is used for sending emails, while POP3/IMAP are used for receiving.`;
    } else if (topicMatches(t, ['programming', 'code', 'variable', 'loop', 'conditional', 'function'])) {
      q = `In programming, a named storage location that holds a value is called a:`;
      ({ options, answer } = makeOptions('Variable', ['Constant', 'Function', 'Array']));
      explanation = `A variable is a named memory location whose value can change during program execution.`;
    } else {
      q = `Which of the following is correct about ${topic} in Computer Studies?`;
      ({ options, answer } = makeOptions(`It is a core ICT concept in the syllabus`, [`It is a biological process`, `It is not examined`, `It belongs to history`]));
      explanation = `${topic} is included in the Computer Studies/ICT syllabus.`;
    }
  }
  else if (sk.includes('home economics') || sk.includes('catering') || sk.includes('food')) {
    if (topicMatches(t, ['nutrition', 'protein', 'carbohydrate', 'vitamin', 'mineral', 'diet'])) {
      q = `Which nutrient is primarily responsible for body building and repair?`;
      ({ options, answer } = makeOptions('Protein', ['Carbohydrate', 'Fat', 'Vitamin C']));
      explanation = `Proteins are body-building nutrients that repair tissues, produce enzymes, and support growth.`;
    } else if (topicMatches(t, ['food preservation', 'storage', 'canning', 'drying', 'refrigeration'])) {
      q = `Which method of food preservation works by slowing down microbial growth through low temperature?`;
      ({ options, answer } = makeOptions('Refrigeration', ['Drying', 'Smoking', 'Salting']));
      explanation = `Refrigeration slows bacterial growth by maintaining low temperatures, extending food shelf life.`;
    } else {
      q = `Which statement about ${topic} is correct in Home Economics?`;
      ({ options, answer } = makeOptions(`It is an important home economics concept`, [`It is a physics law`, `It is not examined`, `It belongs to commerce`]));
      explanation = `${topic} is part of the Home Economics syllabus.`;
    }
  }
  else if (sk.includes('art') || sk.includes('music') || sk.includes('ceramic') || sk.includes('textile') || sk.includes('paint') || sk.includes('basket') || sk.includes('wood') || sk.includes('sculpt')) {
    if (topicMatches(t, ['colour', 'pigment', 'primary', 'secondary', 'complementary', 'harmony'])) {
      q = `Which of the following are primary colours?`;
      ({ options, answer } = makeOptions('Red, Yellow, Blue', ['Red, Green, Blue', 'Orange, Purple, Green', 'Black, White, Grey']));
      explanation = `The traditional primary colours in pigment/painting are Red, Yellow, and Blue, from which other colours are mixed.`;
    } else if (topicMatches(t, ['perspective', 'drawing', 'proportion', 'scale', 'line', 'shape'])) {
      q = `The art technique used to create the illusion of depth on a flat surface is called:`;
      ({ options, answer } = makeOptions('Perspective', ['Composition', ['Texture'], ['Colour harmony']]));
      explanation = `Perspective uses vanishing points and converging lines to create the illusion of three-dimensional space.`;
    } else if (topicMatches(t, ['music', 'note', 'scale', 'rhythm', 'melody', 'harmony', 'time signature'])) {
      q = `How many beats does a minim (half note) receive in 4/4 time?`;
      ({ options, answer } = makeOptions('Two beats', ['One beat', 'Four beats', 'Three beats']));
      explanation = `In common time (4/4), a crotchet = 1 beat, a minim = 2 beats, and a semibreve = 4 beats.`;
    } else {
      q = `Which statement about ${topic} is correct in Art/Music?`;
      ({ options, answer } = makeOptions(`It is a tested concept in creative arts`, [`It is a mathematical theorem`, `It is not examined`, `It belongs to science`]));
      explanation = `${topic} is included in the Art/Music syllabus.`;
    }
  }
  else if (sk.includes('auto') || sk.includes('mechanic') || sk.includes('welding') || sk.includes('building') || sk.includes('electric') || sk.includes('electronic') || sk.includes('radio') || sk.includes('refrigerat') || sk.includes('woodwork') || sk.includes('mining')) {
    if (topicMatches(t, ['safety', 'precaution', 'ppe', 'hazard', 'first aid'])) {
      q = `In a workshop, PPE stands for:`;
      ({ options, answer } = makeOptions('Personal Protective Equipment', ['Public Protection Equipment', 'Personal Production Equipment', 'Plant Processing Equipment']));
      explanation = `PPE refers to protective clothing, helmets, goggles, gloves, and other garments designed to protect the wearer from injury.`;
    } else if (topicMatches(t, ['tool', 'equipment', 'machine', 'instrument', 'device'])) {
      q = `Which tool is used for measuring internal dimensions?`;
      ({ options, answer } = makeOptions('Vernier caliper', ['Micrometer', 'Steel rule', 'Try square']));
      explanation = `A vernier caliper can measure internal dimensions (using the upper jaws), external dimensions, and depth.`;
    } else if (topicMatches(t, ['circuit', 'voltage', 'current', 'resistor', 'capacitor', 'transformer'])) {
      q = `A device that steps up or steps down alternating voltage is called a:`;
      ({ options, answer } = makeOptions('Transformer', ['Resistor', 'Capacitor', 'Inductor']));
      explanation = `A transformer transfers electrical energy between circuits through electromagnetic induction, stepping voltage up or down.`;
    } else {
      q = `Which statement about ${topic} is correct in this technical subject?`;
      ({ options, answer } = makeOptions(`It is a practical concept in the syllabus`, [`It is a literary device`, `It is not examined`, `It belongs to biology`]));
      explanation = `${topic} is part of the technical/vocational syllabus.`;
    }
  }
  else {
    q = `Which of the following is correct about ${topic}?`;
    ({ options, answer } = makeOptions(`It is a tested concept in this subject`, [`It is unrelated`, `It belongs to another field`, `It is not examined`]));
    explanation = `${topic} is included in the syllabus.`;
  }

  return {
    id: 0, topic: topic || 'General', section: section || 'General',
    subtopic: topic || 'General', difficulty, question: q, options, answer, explanation
  };
}

// ========================
// DISPATCH
// ========================

function getSubjectDomain(subjectKey) {
  const name = subjectKey.toLowerCase();
  if (name.includes('math')) return 'math';
  if (name.includes('biology') || name.includes('chemistry') || name.includes('physics') || name.includes('science')) return 'science';
  if (name.includes('agric')) return 'science';
  if (name.includes('computer') || name.includes('ict') || name.includes('data processing')) return 'vocational';
  if (name.includes('home') || name.includes('catering') || name.includes('food')) return 'vocational';
  if (name.includes('art') || name.includes('music') || name.includes('ceramic') || name.includes('textile') || name.includes('paint') || name.includes('basket') || name.includes('wood') || name.includes('sculpt')) return 'vocational';
  if (name.includes('auto') || name.includes('mechanic') || name.includes('welding') || name.includes('building') || name.includes('electric') || name.includes('electronic') || name.includes('radio') || name.includes('refrigerat') || name.includes('mining')) return 'vocational';
  if (name.includes('economics') || name.includes('commerce') || name.includes('business') || name.includes('account') || name.includes('bookkeep') || name.includes('marketing') || name.includes('insurance') || name.includes('store') || name.includes('office') || name.includes('tourism') || name.includes('clerical')) return 'commercial';
  if (name.includes('government') || name.includes('civic') || name.includes('history') || name.includes('crs') || name.includes('islamic') || name.includes('religion') || name.includes('literature') || name.includes('english') || name.includes('geography')) return 'arts';
  return 'arts';
}

function buildQuestion(topic, section, content, difficulty, subjectKey) {
  const domain = getSubjectDomain(subjectKey);
  if (domain === 'math') return buildMathQuestion(topic, section, content, difficulty);
  if (domain === 'science') return buildScienceQuestion(topic, section, content, difficulty, subjectKey);
  if (domain === 'vocational') return buildVocationalQuestion(topic, section, content, difficulty, subjectKey);
  return buildArtsQuestion(topic, section, content, difficulty, subjectKey);
}

// ========================
// SYLLABUS PARSER
// ========================

function extractTopics(syllabus) {
  const topics = [];
  if (syllabus.sections) {
    for (const section of syllabus.sections) {
      const sectionTitle = section.section || section.title || 'General';
      const sectionTopics = section.topics || [];
      for (const topic of sectionTopics) {
        topics.push({
          section: sectionTitle,
          topic: topic.topic || topic.title || 'General',
          content: topic.content || topic.description || '',
          objectives: topic.objectives || topic.subtopics || []
        });
      }
    }
  } else if (syllabus.topics) {
    for (const topic of syllabus.topics) {
      topics.push({
        section: 'General',
        topic: topic.title || topic.topic || 'General',
        content: topic.content || '',
        objectives: topic.subtopics || []
      });
    }
  } else if (syllabus.syllabus_sections) {
    for (const section of syllabus.syllabus_sections) {
      const sectionTitle = section.title || section.section || 'General';
      const details = section.details || section.subtopics || [];
      for (const d of details) {
        const text = typeof d === 'string' ? d : (d.title || d.topic || JSON.stringify(d));
        topics.push({ section: sectionTitle, topic: text, content: '', objectives: [] });
      }
    }
  }
  return topics;
}

// ========================
// MAIN GENERATION
// ========================

function generateForSubject(subjectDir, fullPath) {
  const files = fs.readdirSync(fullPath);
  const syllabusFile = files.find(f => f === 'syllabus.json');
  const questionsFile = path.join(fullPath, 'questions.json');

  if (!syllabusFile) {
    console.log(`No syllabus found in ${fullPath}`);
    return;
  }

  const syllabus = JSON.parse(fs.readFileSync(path.join(fullPath, syllabusFile), 'utf8'));
  const subjectName = syllabus.exam || syllabus.syllabus_title || syllabus.subject || subjectDir;
  const topics = extractTopics(syllabus);

  if (topics.length === 0) {
    console.log(`No topics found for ${subjectName}`);
    return;
  }

  console.log(`Generating for ${subjectName} (${topics.length} topics)...`);

  const questions = [];
  const difficulties = ['easy', 'medium', 'hard'];

  // Generate 2-3 questions per topic, cycling difficulties
  topics.forEach((tp, idx) => {
    const count = 3;
    for (let i = 0; i < count; i++) {
      const difficulty = difficulties[(idx + i) % 3];
      const q = buildQuestion(tp.topic, tp.section, tp.content, difficulty, subjectDir);
      q.id = questions.length + 1;
      questions.push(q);
    }
  });

  // Ensure minimum of 90 questions
  while (questions.length < 90) {
    const tp = randPick(topics);
    const difficulty = randPick(difficulties);
    const q = buildQuestion(tp.topic, tp.section, tp.content, difficulty, subjectDir);
    q.id = questions.length + 1;
    questions.push(q);
  }

  fs.writeFileSync(questionsFile, JSON.stringify({ questions }, null, 2));
  console.log(`  -> ${subjectName}: ${questions.length} questions written.`);
}

function main() {
  const baseSyllabusDir = path.join(process.cwd(), 'data general', 'syllabus.json');
  const exams = ['jamb syllabus', 'waec syllabus'];

  for (const exam of exams) {
    const examPath = path.join(baseSyllabusDir, exam);
    if (!fs.existsSync(examPath)) continue;

    const subjects = fs.readdirSync(examPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`\n========================================`);
    console.log(`Processing ${subjects.length} subjects in ${exam}`);
    console.log(`========================================`);

    for (const subject of subjects) {
      const fullPath = path.join(examPath, subject);
      try {
        generateForSubject(subject, fullPath);
      } catch (err) {
        console.error(`Error processing ${subject}:`, err.message);
      }
    }
  }

  console.log('\n\nALL DONE!');
}

main();
