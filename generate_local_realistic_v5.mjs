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

function stripJsonComments(raw) {
  return raw
    .replace(/\/\/.*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    try {
      return JSON.parse(stripJsonComments(raw));
    } catch (e2) {
      return null;
    }
  }
}

function topicMatches(topicName, keywords) {
  const t = (topicName || '').toLowerCase();
  return keywords.some(k => t.includes(k));
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

const META_KEYS = new Set(['syllabus_title', 'exam', 'subject', 'description']);

// ========================
// ROBUST SYLLABUS PARSER
// ========================

function extractTopics(syllabus) {
  const topics = [];

  // Helper: add a topic if it's meaningful
  function addTopic(section, topic, content = '') {
    const t = (topic || '').trim();
    if (!t || t.length < 4) return;
    // Skip meta-looking topics
    if (t.toLowerCase().includes('syllabus') && t.length < 30) return;
    if (t.toLowerCase().includes('detailed syllabus')) return;
    topics.push({ section: section || 'General', topic: t, content: content || '', objectives: [] });
  }

  // Helper: get section name from parent object
  function getSectionName(obj, fallback) {
    if (!obj || typeof obj !== 'object') return fallback;
    const possible = obj.title || obj.section || obj.part || obj.topic || '';
    if (possible && typeof possible === 'string' && possible.length > 2 && possible.length < 120) {
      return possible;
    }
    return fallback;
  }

  // Process a single topic object
  function processTopicObject(obj, section) {
    if (!obj || typeof obj !== 'object') return;
    const title = obj.title || obj.topic || '';
    const sec = getSectionName(obj, section);

    if (title && typeof title === 'string' && title.length > 2 && title.length < 200) {
      // This is a real topic with a title
      const content = (typeof obj.notes === 'string' ? obj.notes : '') ||
                      (typeof obj.content === 'string' ? obj.content : '') ||
                      (typeof obj.description === 'string' ? obj.description : '');
      addTopic(sec, title, content);

      // Extract subtopics
      if (obj.subtopics && Array.isArray(obj.subtopics)) {
        for (const st of obj.subtopics) {
          if (typeof st === 'string' && st.length > 3) {
            addTopic(sec, `${title}: ${st}`);
          } else if (typeof st === 'object' && st !== null) {
            const stTitle = st.title || st.topic || '';
            if (stTitle) addTopic(sec, `${title}: ${stTitle}`);
          }
        }
      }
      // Extract contents
      if (obj.contents && Array.isArray(obj.contents)) {
        for (const c of obj.contents) {
          if (typeof c === 'string' && c.length > 3) addTopic(sec, `${title}: ${c}`);
        }
      }
      if (obj.content && Array.isArray(obj.content)) {
        for (const c of obj.content) {
          if (typeof c === 'string' && c.length > 3) addTopic(sec, `${title}: ${c}`);
        }
      }
      // Extract notes
      if (obj.notes && Array.isArray(obj.notes)) {
        for (const n of obj.notes) {
          if (typeof n === 'string' && n.length > 3) addTopic(sec, `${title}: ${n}`);
        }
      }
    } else {
      // No clear title - treat all string fields as potential topics
      for (const [k, v] of Object.entries(obj)) {
        if (META_KEYS.has(k.toLowerCase())) continue;
        if (typeof v === 'string' && v.length > 10 && v.length < 400) {
          addTopic(sec, v);
        } else if (Array.isArray(v)) {
          for (const item of v) {
            if (typeof item === 'string' && item.length > 3) addTopic(sec, item);
            else if (typeof item === 'object') processTopicObject(item, sec);
          }
        } else if (typeof v === 'object' && v !== null) {
          processTopicObject(v, sec);
        }
      }
    }
  }

  // Main recursive processor
  function recurse(obj, section = 'General') {
    if (typeof obj !== 'object' || obj === null) return;

    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (typeof item === 'string' && item.length > 3) {
          addTopic(section, item);
        } else if (typeof item === 'object' && item !== null) {
          recurse(item, getSectionName(item, section));
        }
      }
      return;
    }

    // It's an object
    for (const [key, val] of Object.entries(obj)) {
      const keyLower = key.toLowerCase();
      if (META_KEYS.has(keyLower)) continue;

      // Keys that contain arrays of topic objects
      if ((keyLower === 'topics' || keyLower === 'subsections') && Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === 'object' && item !== null) {
            processTopicObject(item, section);
          } else if (typeof item === 'string') {
            addTopic(section, item);
          }
        }
      }
      // Sections/parts/main_sections arrays
      else if ((keyLower === 'sections' || keyLower === 'parts' || keyLower === 'main_sections' || keyLower === 'theory_sections') && Array.isArray(val)) {
        for (const item of val) {
          const itemSec = getSectionName(item, section);
          recurse(item, itemSec);
        }
      }
      // detailed_syllabus object - recurse with current section
      else if (keyLower === 'detailed_syllabus' && typeof val === 'object' && val !== null) {
        recurse(val, section);
      }
      // Top-level numbered keys or named categories in WAEC commerce/agric style
      else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        // Check if this object is a topic container
        const hasTitle = val.title || val.topic;
        const hasNotes = val.notes || val.content || val.contents;
        if (hasTitle || hasNotes) {
          processTopicObject(val, section);
        } else {
          // It's a category container - use key as section name
          const catName = key.replace(/_/g, ' ').replace(/^\d+\s*/, '').trim();
          const catSec = catName.length > 2 && catName.length < 80 ? catName : section;
          recurse(val, catSec);
        }
      }
      // String value that's not in a recognized container
      else if (typeof val === 'string' && val.length > 10 && val.length < 400 && !META_KEYS.has(keyLower)) {
        // The key itself might be a topic name (e.g. in WAEC geography style)
        const topicName = key.replace(/_/g, ' ').replace(/^\d+\s*/, '').trim();
        if (topicName.length > 3 && topicName.length < 100) {
          addTopic(section, topicName, val);
        } else {
          addTopic(section, val);
        }
      }
      // Arrays of strings
      else if (Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === 'string' && item.length > 3) addTopic(section, item);
          else if (typeof item === 'object') recurse(item, section);
        }
      }
    }
  }

  recurse(syllabus);

  // Deduplicate
  const seen = new Set();
  const unique = [];
  for (const t of topics) {
    const key = (t.section + '::' + t.topic).toLowerCase().slice(0, 300);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(t);
    }
  }

  // Fallback: if very few topics, extract ALL string values > 10 chars
  if (unique.length < 3) {
    function collectAllStrings(o, sec = 'General') {
      if (typeof o === 'string' && o.length > 10 && o.length < 400) {
        addTopic(sec, o);
      } else if (Array.isArray(o)) {
        o.forEach(i => collectAllStrings(i, sec));
      } else if (typeof o === 'object' && o !== null) {
        for (const [k, v] of Object.entries(o)) {
          if (META_KEYS.has(k.toLowerCase())) continue;
          const newSec = k.replace(/_/g, ' ').replace(/^\d+\s*/, '').trim();
          collectAllStrings(v, newSec.length > 2 ? newSec : sec);
        }
      }
    }
    collectAllStrings(syllabus);
    // Re-deduplicate
    const seen2 = new Set();
    const unique2 = [];
    for (const t of topics) {
      const key = t.topic.toLowerCase().slice(0, 200);
      if (!seen2.has(key)) { seen2.add(key); unique2.push(t); }
    }
    return unique2;
  }

  return unique;
}

// ========================
// MATH GENERATORS
// ========================

function buildMathQuestion(topic, section, content, difficulty) {
  const t = (topic || '').toLowerCase();
  let q = '', options = {}, answer = '', explanation = '';

  if (topicMatches(t, ['number base', 'base '])) {
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
  else if (topicMatches(t, ['modular', 'modulo', 'clock arithmetic'])) {
    const mod = randPick([5, 6, 7, 8, 12]);
    const a = randInt(2, 20), b = randInt(2, 20);
    const correct = (a + b) % mod;
    q = `Evaluate ${a} + ${b} (mod ${mod}).`;
    ({ options, answer } = makeOptions(String(correct), [String(a + b), String(a + b - mod), String(Math.abs(a - b) % mod)]));
    explanation = `(${a} + ${b}) mod ${mod} = ${a + b} mod ${mod} = ${correct}.`;
  }
  else if (topicMatches(t, ['fraction', 'decimal', 'approximation', 'significant figure'])) {
    const a = randInt(1, 9), b = randInt(1, 9), c = randInt(1, 9), d = randInt(1, 9);
    q = `Simplify (${a}/${b}) ÷ (${c}/${d}).`;
    const num = a * d, den = b * c;
    const g = gcd(num, den);
    const correct = `${num/g}/${den/g}`;
    ({ options, answer } = makeOptions(correct, [`${a+c}/${b+d}`, `${a*c}/${b*d}`, `${a+b}/${c+d}`]));
    explanation = `Dividing by a fraction = multiplying by its reciprocal: (${a}/${b}) × (${d}/${c}) = ${num}/${den} = ${correct}.`;
  }
  else if (topicMatches(t, ['percentage', 'profit', 'loss', 'discount', 'vat', 'interest', 'share', 'dividend'])) {
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
      const val = randInt(100, 1000);
      const p = randInt(10, 30);
      const correct = Math.round(val * (1 + p / 100));
      q = `Increase ${val} by ${p}%.`;
      ({ options, answer } = makeOptions(String(correct), [String(val + p), String(Math.round(val * p / 100)), String(val + Math.round(val * p / 100))]));
      explanation = `${val} + (${p}/100 × ${val}) = ${val} + ${Math.round(val * p / 100)} = ${correct}.`;
    }
  }
  else if (topicMatches(t, ['indices', 'standard form', 'scientific notation'])) {
    const base = randPick([2, 3, 5, 10]);
    const exp1 = randInt(2, 5), exp2 = randInt(2, 5);
    const correctVal = Math.pow(base, exp1 + exp2);
    q = `Evaluate ${base}${toSup(exp1)} × ${base}${toSup(exp2)}.`;
    ({ options, answer } = makeOptions(String(correctVal), [String(Math.pow(base, exp1 * exp2)), String(Math.pow(base, exp1 - exp2)), String(Math.pow(base, exp1) + Math.pow(base, exp2))]));
    explanation = `Using law of indices: a^m × a^n = a^(m+n). So ${base}${toSup(exp1)} × ${base}${toSup(exp2)} = ${base}${toSup(exp1 + exp2)} = ${correctVal}.`;
  }
  else if (topicMatches(t, ['logarithm', 'antilogarithm'])) {
    const a = randInt(1, 5), n = randInt(2, 4);
    q = `Simplify log(${a}${toSup(n)}).`;
    const correct = `${n}log(${a})`;
    ({ options, answer } = makeOptions(correct, [`log(${a})+${n}`, `log(${a}×${n})`, `${a}log(${n})`]));
    explanation = `Using log(a^n) = n·log(a), log(${a}${toSup(n)}) = ${n}log(${a}).`;
  }
  else if (topicMatches(t, ['set', 'venn', 'union', 'intersection', 'complement'])) {
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
  else if (topicMatches(t, ['inequalities', 'inequality', 'linear programming'])) {
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
  else if (topicMatches(t, ['geometry', 'angle', 'polygon', 'circle', 'triangle', 'quadrilateral', 'theorem'])) {
    const angle = randInt(30, 120);
    q = `The interior angles of a regular polygon are each ${180 - angle}°. How many sides has the polygon?`;
    const sides = 360 / angle;
    ({ options, answer } = makeOptions(String(sides), [String(sides + 1), String(sides - 1), String(180 / angle)]));
    explanation = `Exterior angle = 180° - ${180 - angle}° = ${angle}°. Number of sides = 360°/${angle}° = ${sides}.`;
  }
  else if (topicMatches(t, ['mensuration', 'area', 'volume', 'perimeter', 'sector', 'segment', 'surface area'])) {
    const r = randInt(3, 10), theta = randPick([60, 90, 120]);
    const exact = (theta / 360) * (22 / 7) * r * r;
    const exactRounded = Math.round(exact * 10) / 10;
    q = `Find the area of a sector of a circle of radius ${r} cm that subtends an angle of ${theta}° at the centre. [Take π = 22/7]`;
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
  else if (topicMatches(t, ['trigonometry', 'sine', 'cosine', 'tangent', 'elevation', 'depression', 'bearing', 'sine rule', 'cosine rule'])) {
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
  else if (topicMatches(t, ['mean', 'mode', 'median', 'measure of location', 'average', 'cumulative', 'standard deviation', 'variance'])) {
    const nums = Array.from({ length: 5 }, () => randInt(2, 10));
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    q = `Find the mean of the following numbers: ${nums.join(', ')}.`;
    ({ options, answer } = makeOptions(String(mean), [String(mean + 1), String(mean - 1), String(nums[2])]));
    explanation = `Mean = (${nums.join(' + ')})/${nums.length} = ${nums.reduce((a,b)=>a+b,0)}/${nums.length} = ${mean}.`;
  }
  else if (topicMatches(t, ['probability', 'permutation', 'combination', 'chance'])) {
    const n = randInt(4, 7);
    let fact = 1;
    for (let i = 2; i <= n; i++) fact *= i;
    q = `In how many ways can ${n} different books be arranged on a shelf?`;
    ({ options, answer } = makeOptions(String(fact), [String(n * (n - 1)), String(Math.pow(n, 2)), String(fact + n)]));
    explanation = `Number of arrangements = ${n}! = ${fact}.`;
  }
  else if (topicMatches(t, ['locus', 'parabola', 'ellipse', 'hyperbola', 'conic'])) {
    q = `The locus of points equidistant from a fixed point is called a:`;
    ({ options, answer } = makeOptions('Circle', ['Parabola', 'Ellipse', 'Hyperbola']));
    explanation = `A circle is defined as the locus of all points in a plane equidistant from a fixed point (the centre).`;
  }
  else if (topicMatches(t, ['vector', 'magnitude', 'direction', 'scalar', 'displacement'])) {
    const x = randInt(2, 8), y = randInt(2, 8);
    const mag = Math.round(Math.sqrt(x*x + y*y) * 10) / 10;
    q = `Find the magnitude of the vector (${x}, ${y}).`;
    ({ options, answer } = makeOptions(String(mag), [String(x + y), String(x * y), String(Math.abs(x - y))]));
    explanation = `Magnitude = √(x² + y²) = √(${x}² + ${y}²) = √(${x*x + y*y}) = ${mag}.`;
  }
  else if (topicMatches(t, ['transformation', 'translation', 'rotation', 'reflection', 'enlargement', 'matrix transformation'])) {
    const angle = randPick([90, 180, 270]);
    q = `A point is rotated ${angle}° anticlockwise about the origin. If its original coordinates are (1, 0), what are the new coordinates?`;
    let correct;
    if (angle === 90) correct = '(0, 1)';
    else if (angle === 180) correct = '(-1, 0)';
    else correct = '(0, -1)';
    ({ options, answer } = makeOptions(correct, ['(1, 0)', '(0, -1)', '(-1, -1)']));
    explanation = `Rotating (1,0) by ${angle}° anticlockwise gives ${correct}.`;
  }
  else {
    const a = randInt(2, 12), b = randInt(2, 12);
    q = `Evaluate ${a} × ${b} + ${a + b}.`;
    const val = a * b + a + b;
    ({ options, answer } = makeOptions(String(val), [String(a * b), String(a + b + a * b + 1), String(a * b - a - b)]));
    explanation = `${a} × ${b} + ${a + b} = ${a * b} + ${a + b} = ${val}.`;
  }

  return { id: 0, topic: topic || 'Mathematics', section: section || 'General', subtopic: topic || 'General', difficulty, question: q, options, answer, explanation };
}

// ========================
// SCIENCE BUILDERS
// ========================

function buildScienceQuestion(topic, section, content, difficulty, subjectKey) {
  const t = (topic || '').toLowerCase();
  const sk = subjectKey.toLowerCase();
  let q = '', options = {}, answer = '', explanation = '';

  if (sk.includes('biology') || sk.includes('biolog')) {
    if (topicMatches(t, ['cell', 'organelle', 'cytoplasm', 'nucleus', 'mitochondria', 'ribosome', 'cell structure', 'cell component', 'cell membrane'])) {
      q = `Which organelle is known as the "powerhouse of the cell"?`;
      ({ options, answer } = makeOptions('Mitochondria', ['Nucleus', 'Ribosome', 'Golgi body']));
      explanation = `Mitochondria produce ATP through cellular respiration, earning them the name "powerhouse of the cell".`;
    } else if (topicMatches(t, ['photosynthesis', 'chlorophyll', 'stomata', 'leaf', 'light reaction'])) {
      q = `During photosynthesis, what gas is absorbed from the atmosphere?`;
      ({ options, answer } = makeOptions('Carbon dioxide', ['Oxygen', 'Nitrogen', 'Hydrogen']));
      explanation = `Plants absorb CO₂ from the air and release O₂ during photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.`;
    } else if (topicMatches(t, ['respiration', 'anaerobic', 'aerobic', 'glycolysis', 'gaseous exchange', 'krebs cycle'])) {
      q = `Which of the following is a product of aerobic respiration?`;
      ({ options, answer } = makeOptions('Carbon dioxide and water', ['Lactic acid only', 'Ethanol and CO₂', 'Oxygen and glucose']));
      explanation = `Aerobic respiration uses oxygen to break down glucose, producing CO₂, water, and ATP.`;
    } else if (topicMatches(t, ['genetics', 'dna', 'gene', 'chromosome', 'allele', 'inheritance', 'mendel', 'monohybrid', 'dihybrid', 'cross'])) {
      q = `A homozygous dominant tall plant (TT) is crossed with a homozygous recessive short plant (tt). What is the genotype of the offspring?`;
      ({ options, answer } = makeOptions('Tt', ['TT', 'tt', 'Tt or tt']));
      explanation = `All offspring receive one T from the dominant parent and one t from the recessive parent, making them all Tt (heterozygous tall).`;
    } else if (topicMatches(t, ['ecosystem', 'food chain', 'trophic', 'producer', 'consumer', 'decomposer', 'food web', 'pyramid'])) {
      q = `In a food chain, which organisms are always found at the first trophic level?`;
      ({ options, answer } = makeOptions('Producers', ['Primary consumers', 'Secondary consumers', 'Decomposers']));
      explanation = `Producers (plants) convert sunlight to energy and form the base of every food chain at trophic level 1.`;
    } else if (topicMatches(t, ['evolution', 'natural selection', 'adaptation', 'speciation', 'darwin', 'lamarck'])) {
      q = `Who proposed the theory of evolution by natural selection?`;
      ({ options, answer } = makeOptions('Charles Darwin', ['Gregor Mendel', 'Jean-Baptiste Lamarck', 'Alfred Wallace']));
      explanation = `Charles Darwin published "On the Origin of Species" in 1859, proposing natural selection as the mechanism of evolution.`;
    } else if (topicMatches(t, ['human', 'digestion', 'alimentary', 'enzyme', 'stomach', 'intestine', 'mammalian tooth', 'bile', 'pancreas'])) {
      q = `Which enzyme is responsible for the digestion of proteins in the stomach?`;
      ({ options, answer } = makeOptions('Pepsin', ['Amylase', 'Lipase', 'Trypsin']));
      explanation = `Pepsin, activated by hydrochloric acid in the gastric juice, breaks down proteins into polypeptides.`;
    } else if (topicMatches(t, ['circulatory', 'heart', 'blood', 'vessel', 'artery', 'vein', 'xylem', 'phloem', 'capillary', 'aorta'])) {
      if (topicMatches(t, ['xylem', 'phloem', 'vascular', 'transpiration', 'translocation'])) {
        q = `Which tissue in plants is responsible for transporting water and mineral salts from roots to leaves?`;
        ({ options, answer } = makeOptions('Xylem', ['Phloem', 'Cambium', 'Epidermis']));
        explanation = `Xylem vessels transport water and dissolved minerals upward from roots to the aerial parts of the plant.`;
      } else {
        q = `Which blood vessel carries oxygenated blood from the lungs to the heart?`;
        ({ options, answer } = makeOptions('Pulmonary vein', ['Pulmonary artery', 'Vena cava', 'Aorta']));
        explanation = `The pulmonary vein is unique among veins because it carries oxygen-rich blood from the lungs to the left atrium.`;
      }
    } else if (topicMatches(t, ['excretion', 'kidney', 'nephron', 'urine', 'osmoregulation', 'urea', 'sweat'])) {
      q = `The functional unit of the kidney is called the:`;
      ({ options, answer } = makeOptions('Nephron', ['Neuron', 'Alveolus', 'Villus']));
      explanation = `The nephron filters blood, reabsorbs useful substances, and produces urine.`;
    } else if (topicMatches(t, ['living organism', 'characteristic', 'level of organization', 'cell', 'tissue', 'organ', 'system', 'irritability', 'movement', 'growth', 'respiration', 'nutrition', 'excretion', 'reproduction'])) {
      q = `Which level of organization comes immediately after tissue?`;
      ({ options, answer } = makeOptions('Organ', ['Cell', 'System', 'Organism']));
      explanation = `The hierarchy is: Cell → Tissue → Organ → System → Organism.`;
    } else if (topicMatches(t, ['monera', 'protista', 'fungi', 'plantae', 'animalia', 'bacteria', 'amoeba', 'euglena', 'rhizopus', 'fern', 'moss', 'liverwort', 'spirogyra', 'kingdom'])) {
      q = `Which kingdom includes organisms that are prokaryotic and unicellular?`;
      ({ options, answer } = makeOptions('Monera', ['Protista', 'Fungi', 'Plantae']));
      explanation = `Monera includes bacteria and blue-green algae, which are prokaryotic (lack membrane-bound nucleus).`;
    } else if (topicMatches(t, ['reproduction', 'asexual', 'sexual', 'pollination', 'fertilization', 'contraception', 'menstrual', 'ovulation', 'gamete', 'zygote'])) {
      q = `Which method of reproduction involves only one parent?`;
      ({ options, answer } = makeOptions('Asexual reproduction', ['Sexual reproduction', 'Conjugation', 'Cross-fertilization']));
      explanation = `Asexual reproduction requires only one parent and produces genetically identical offspring.`;
    } else if (topicMatches(t, ['nutrition', 'autotrophic', 'heterotrophic', 'photosynthesis', 'chemosynthesis', 'food', 'class of food', 'mineral', 'vitamin'])) {
      q = `Which class of food is primarily responsible for body building?`;
      ({ options, answer } = makeOptions('Proteins', ['Carbohydrates', 'Fats', 'Vitamins']));
      explanation = `Proteins are body-building nutrients that repair tissues and support growth.`;
    } else if (topicMatches(t, ['support', 'skeleton', 'bone', 'cartilage', 'muscle', 'tendon', 'ligament', 'movement', 'joint', 'vertebral column'])) {
      q = `Which type of joint allows movement in all directions?`;
      ({ options, answer } = makeOptions('Ball and socket joint', ['Hinge joint', 'Pivot joint', 'Gliding joint']));
      explanation = `The ball and socket joint (e.g., shoulder, hip) allows the widest range of movement.`;
    } else if (topicMatches(t, ['growth', 'development', 'germination', 'seed', 'seedling', 'metamorphosis', 'life cycle'])) {
      q = `The process by which a seed develops into a seedling is called:`;
      ({ options, answer } = makeOptions('Germination', ['Fertilization', ['Pollination', 'Photosynthesis']]));
      explanation = `Germination is the process by which a plant grows from a seed under favorable conditions.`;
    } else {
      q = `Which of the following is correct about ${topic}?`;
      ({ options, answer } = makeOptions(`It is a fundamental biological concept in ${topic}`, [`It is a chemical compound unrelated to ${topic}`, `A physical process occurring only in plants`, `A term used exclusively in physics`]));
      explanation = `${topic} is essential to understanding living systems and is regularly tested in biology examinations.`;
    }
  }
  else if (sk.includes('chemistry') || sk.includes('chem')) {
    if (topicMatches(t, ['atom', 'electron', 'proton', 'neutron', 'shell', 'orbital', 'atomic structure', 'isotope'])) {
      q = `An atom with 11 protons, 12 neutrons and 11 electrons has a mass number of:`;
      ({ options, answer } = makeOptions('23', ['22', '24', '11']));
      explanation = `Mass number = protons + neutrons = 11 + 12 = 23.`;
    } else if (topicMatches(t, ['periodic table', 'group', 'period', 'element', 'metal', 'non-metal', 'alkali', 'halogen', 'noble gas'])) {
      q = `Which group in the periodic table contains the alkali metals?`;
      ({ options, answer } = makeOptions('Group 1', ['Group 2', 'Group 7', 'Group 0']));
      explanation = `Group 1 elements (Li, Na, K, Rb, Cs, Fr) are called alkali metals due to their alkaline oxides and hydroxides.`;
    } else if (topicMatches(t, ['chemical bond', 'ionic', 'covalent', 'metallic', 'electrovalent', 'hydrogen bond', 'van der waals', 'dative'])) {
      q = `Which type of bond is formed by the transfer of electrons from one atom to another?`;
      ({ options, answer } = makeOptions('Ionic bond', ['Covalent bond', 'Metallic bond', 'Hydrogen bond']));
      explanation = `Ionic bonds involve electron transfer, typically between a metal and a non-metal, creating oppositely charged ions.`;
    } else if (topicMatches(t, ['acid', 'base', 'salt', 'ph', 'neutralization', 'titration', 'indicator', 'buffer'])) {
      q = `What is the pH of a neutral solution at 25°C?`;
      ({ options, answer } = makeOptions('7', ['0', '14', '1']));
      explanation = `At 25°C, pure water has equal concentrations of H⁺ and OH⁻ ions, giving a pH of 7 (neutral).`;
    } else if (topicMatches(t, ['organic', 'hydrocarbon', 'alkane', 'alkene', 'alkyne', 'alcohol', 'carbon compound', 'functional group', 'isomerism', 'petroleum', 'cracking'])) {
      q = `The general formula for alkanes is:`;
      ({ options, answer } = makeOptions('CₙH₂ₙ₊₂', ['CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ']));
      explanation = `Alkanes are saturated hydrocarbons with single bonds only, following the formula CₙH₂ₙ₊₂.`;
    } else if (topicMatches(t, ['mole', 'molar', 'avogadro', 'concentration', 'molality', 'molarity', 'molar mass', 'empirical formula'])) {
      const mass = randInt(20, 80), molar = randPick([20, 40, 56, 58, 98]);
      const moles = (mass / molar).toFixed(2);
      q = `Calculate the number of moles in ${mass}g of a substance with molar mass ${molar}g/mol.`;
      ({ options, answer } = makeOptions(String(moles), [String((mass * molar).toFixed(2)), String((mass + molar).toFixed(2)), String((molar / mass).toFixed(2))]));
      explanation = `Moles = mass / molar mass = ${mass} / ${molar} = ${moles} mol.`;
    } else if (topicMatches(t, ['oxidation', 'reduction', 'redox', 'electrolysis', 'electrochemical', 'electrode', 'anode', 'cathode'])) {
      q = `In the reaction: 2Na + Cl₂ → 2NaCl, chlorine is:`;
      ({ options, answer } = makeOptions('Reduced', ['Oxidized', 'Neutralized', 'Dissociated']));
      explanation = `Chlorine gains electrons (reduction) to form Cl⁻ ions, while sodium loses electrons (oxidation) to form Na⁺.`;
    } else if (topicMatches(t, ['gas law', 'boyle', 'charles', 'pressure', 'volume', 'temperature', 'gay-lussac', 'combined gas law'])) {
      q = `Boyle's law states that the pressure of a fixed mass of gas is inversely proportional to its volume at constant:`;
      ({ options, answer } = makeOptions('Temperature', ['Mass', 'Density', 'Pressure']));
      explanation = `Boyle's Law: P ∝ 1/V (at constant temperature). PV = constant.`;
    } else if (topicMatches(t, ['water', 'hard water', 'soft water', 'water treatment', 'water cycle', 'solubility'])) {
      q = `Temporary hardness of water is caused by the presence of:`;
      ({ options, answer } = makeOptions('Calcium hydrogen carbonate', ['Calcium sulphate', 'Sodium chloride', 'Magnesium oxide']));
      explanation = `Temporary hardness is due to dissolved calcium/magnesium hydrogen carbonates, which can be removed by boiling.`;
    } else if (topicMatches(t, ['energy', 'enthalpy', 'exothermic', 'endothermic', 'activation energy', 'catalyst'])) {
      q = `A reaction that releases heat to the surroundings is called:`;
      ({ options, answer } = makeOptions('Exothermic', ['Endothermic', ['Reversible', 'Catalytic']]));
      explanation = `Exothermic reactions release energy as heat (ΔH < 0), while endothermic reactions absorb heat.`;
    } else {
      q = `Which of the following statements about ${topic} is correct?`;
      ({ options, answer } = makeOptions(`It is a core chemistry concept in ${topic}`, [`It is unrelated to chemical processes`, `It applies only to physical changes`, `It is not tested in standard exams`]));
      explanation = `${topic} is a fundamental chemistry topic that students must master for exam success.`;
    }
  }
  else if (sk.includes('physics') || sk.includes('physic')) {
    if (topicMatches(t, ['force', 'newton', 'motion', 'velocity', 'acceleration', 'inertia', 'projectile', 'momentum', 'impulse'])) {
      const m = randInt(2, 10), a = randInt(2, 10);
      const F = m * a;
      q = `Calculate the force acting on a body of mass ${m}kg accelerating at ${a}m/s².`;
      ({ options, answer } = makeOptions(`${F}N`, [`${F + 10}N`, `${m + a}N`, `${m * a * 2}N`]));
      explanation = `Newton's 2nd Law: F = ma = ${m} × ${a} = ${F}N.`;
    } else if (topicMatches(t, ['energy', 'work', 'power', 'potential', 'kinetic', 'conservation of energy', 'joule', 'watt'])) {
      const m = randInt(2, 10), v = randInt(3, 10);
      const ke = 0.5 * m * v * v;
      q = `Calculate the kinetic energy of a ${m}kg mass moving at ${v}m/s.`;
      ({ options, answer } = makeOptions(`${ke}J`, [`${m * v}J`, `${m + v}J`, `${ke + 10}J`]));
      explanation = `KE = ½mv² = 0.5 × ${m} × ${v}² = ${ke}J.`;
    } else if (topicMatches(t, ['wave', 'sound', 'light', 'reflection', 'refraction', 'diffraction', 'interference', 'dispersion', 'lens'])) {
      q = `The bending of light as it passes from air into water is called:`;
      ({ options, answer } = makeOptions('Refraction', ['Reflection', 'Diffraction', 'Dispersion']));
      explanation = `Refraction is the change in direction of light due to a change in speed when moving between media of different optical densities.`;
    } else if (topicMatches(t, ['electric', 'current', 'voltage', 'resistance', 'ohm', 'circuit', 'power', 'resistor', 'capacitor', 'transformer'])) {
      const V = randInt(5, 20), R = randPick([2, 4, 5, 10]);
      const I = V / R;
      q = `A resistor of ${R}Ω is connected to a ${V}V supply. Calculate the current flowing through it.`;
      ({ options, answer } = makeOptions(`${I}A`, [`${V + R}A`, `${V * R}A`, `${R / V}A`]));
      explanation = `Ohm's Law: I = V/R = ${V}/${R} = ${I}A.`;
    } else if (topicMatches(t, ['heat', 'temperature', 'specific heat', 'latent heat', 'thermometer', 'expansion', 'thermal', 'conduction', 'convection', 'radiation'])) {
      q = `The amount of heat required to raise the temperature of 1kg of a substance by 1°C is called:`;
      ({ options, answer } = makeOptions('Specific heat capacity', ['Latent heat', 'Heat capacity', 'Thermal conductivity']));
      explanation = `Specific heat capacity (c) is defined as the heat required to raise the temperature of 1kg of a substance by 1°C.`;
    } else if (topicMatches(t, ['magnet', 'magnetic', 'electromagnet', 'field', 'flux', 'solenoid'])) {
      q = `Which material is most suitable for making a permanent magnet?`;
      ({ options, answer } = makeOptions('Steel', ['Iron', 'Copper', 'Aluminium']));
      explanation = `Steel retains magnetism longer than iron due to its higher retentivity and coercivity.`;
    } else if (topicMatches(t, ['nuclear', 'radioactivity', 'half-life', 'fission', 'fusion', 'alpha', 'beta', 'gamma'])) {
      q = `The process by which a heavy nucleus splits into lighter nuclei is called:`;
      ({ options, answer } = makeOptions('Nuclear fission', ['Nuclear fusion', 'Radioactive decay', 'Ionization']));
      explanation = `Nuclear fission involves splitting a heavy nucleus (e.g., Uranium-235) into smaller nuclei with release of energy.`;
    } else if (topicMatches(t, ['matter', 'state of matter', 'solid', 'liquid', 'gas', 'kinetic theory', 'brownian', 'cohesion', 'adhesion'])) {
      q = `The random motion of particles in a fluid is called:`;
      ({ options, answer } = makeOptions('Brownian motion', ['Circular motion', 'Rotational motion', 'Simple harmonic motion']));
      explanation = `Brownian motion is the erratic movement of particles suspended in a fluid, providing evidence for the kinetic theory of matter.`;
    } else if (topicMatches(t, ['position', 'distance', 'displacement', 'scalar', 'vector', 'speed'])) {
      q = `Which of the following is a vector quantity?`;
      ({ options, answer } = makeOptions('Displacement', ['Distance', 'Speed', 'Time']));
      explanation = `Displacement has both magnitude and direction, making it a vector. Distance, speed, and time are scalar quantities.`;
    } else if (topicMatches(t, ['fundamental', 'derived', 'quantity', 'unit', 'si unit', 'dimension'])) {
      q = `Which of the following is a fundamental quantity?`;
      ({ options, answer } = makeOptions('Mass', ['Velocity', ['Force', 'Energy']]));
      explanation = `Mass, length, time, electric current, temperature, amount of substance, and luminous intensity are fundamental quantities.`;
    } else {
      q = `Which statement about ${topic} is correct?`;
      ({ options, answer } = makeOptions(`It is a key physics concept in ${topic}`, [`It does not apply to physical systems`, `It is exclusive to chemical reactions`, `It is not part of the standard syllabus`]));
      explanation = `${topic} is a fundamental physics concept regularly examined in JAMB and WAEC.`;
    }
  }
  else if (sk.includes('agric')) {
    if (topicMatches(t, ['soil', 'texture', 'structure', 'profile', 'fertility', 'soil erosion', 'loam', 'clay', 'sand'])) {
      q = `Which soil type has the highest water retention capacity?`;
      ({ options, answer } = makeOptions('Clay soil', ['Sandy soil', 'Loamy soil', 'Gravel']));
      explanation = `Clay soil has fine particles with small pore spaces, allowing it to retain more water than sandy or loamy soils.`;
    } else if (topicMatches(t, ['pest', 'disease', 'control', 'pesticide', 'herbicide', 'fungicide', 'rodenticide'])) {
      q = `A chemical used to control weeds is called:`;
      ({ options, answer } = makeOptions('Herbicide', ['Insecticide', 'Fungicide', 'Rodenticide']));
      explanation = `Herbicides are chemicals specifically designed to kill or inhibit the growth of unwanted plants (weeds).`;
    } else if (topicMatches(t, ['crop', 'planting', 'harvest', 'monoculture', 'mixed farming', 'crop rotation', 'intercropping'])) {
      q = `Growing different types of crops on the same piece of land in succession is known as:`;
      ({ options, answer } = makeOptions('Crop rotation', ['Mixed farming', 'Monocropping', 'Shifting cultivation']));
      explanation = `Crop rotation involves growing different crops sequentially on the same land to maintain soil fertility and control pests.`;
    } else if (topicMatches(t, ['animal', 'livestock', 'poultry', 'cattle', 'nutrition', 'feed', 'pasture', 'ruminant'])) {
      q = `Which class of livestock is primarily raised for meat production?`;
      ({ options, answer } = makeOptions('Beef cattle', ['Dairy cattle', 'Draught animals', 'Breeding stock']));
      explanation = `Beef cattle are specifically bred and raised for meat (beef) production, unlike dairy cattle raised for milk.`;
    } else if (topicMatches(t, ['agricultural', 'extension', 'finance', 'marketing', 'cooperative', 'nafed', 'adp'])) {
      q = `An organization owned and operated by a group of farmers for their mutual benefit is called a:`;
      ({ options, answer } = makeOptions('Cooperative society', ['Public corporation', 'Private company', 'Trade union']));
      explanation = `Agricultural cooperatives help farmers pool resources for buying inputs and marketing produce.`;
    } else if (topicMatches(t, ['fishery', 'fish', 'pond', 'aquaculture', 'net', 'trap', 'preservation'])) {
      q = `Which method of fish preservation involves salting and drying under the sun?`;
      ({ options, answer } = makeOptions('Sun-drying', ['Refrigeration', ['Canning', 'Smoking']]));
      explanation = `Sun-drying (with or without salting) is a traditional and cost-effective method of preserving fish in tropical regions.`;
    } else if (topicMatches(t, ['forest', 'timber', 'deforestation', 'afforestation', 'silviculture'])) {
      q = `The practice of establishing forest plantations is called:`;
      ({ options, answer } = makeOptions('Afforestation', ['Deforestation', ['Agroforestry', 'Silviculture']]));
      explanation = `Afforestation is the establishment of a forest or stand of trees in an area where there was no previous tree cover.`;
    } else {
      q = `Which of the following best describes ${topic} in agricultural science?`;
      ({ options, answer } = makeOptions(`A core concept in the study and practice of ${topic}`, [`An obsolete farming method`, `A concept from physics`, `Not relevant to Nigerian agriculture`]));
      explanation = `${topic} is essential knowledge for students of agricultural science.`;
    }
  }
  else {
    q = `Which of the following is correct about ${topic}?`;
    ({ options, answer } = makeOptions(`It is a tested concept in ${topic}`, [`It is unrelated to ${sk}`, `It belongs to arts subjects`, `It is not examined`]));
    explanation = `${topic} is part of the syllabus for this subject.`;
  }

  return { id: 0, topic: topic || 'General', section: section || 'General', subtopic: topic || 'General', difficulty, question: q, options, answer, explanation };
}

// ========================
// ARTS BUILDERS
// ========================

function buildArtsQuestion(topic, section, content, difficulty, subjectKey) {
  const t = (topic || '').toLowerCase();
  const sk = subjectKey.toLowerCase();
  let q = '', options = {}, answer = '', explanation = '';

  if (sk.includes('government') || sk.includes('civic')) {
    if (topicMatches(t, ['constitution', 'constitutional', 'supremacy', 'fundamental objective', 'directive principle'])) {
      q = `The Nigerian Constitution of 1999 (as amended) derives its legitimacy from:`;
      ({ options, answer } = makeOptions('The people of Nigeria', ['The National Assembly', 'The President', 'The Judiciary']));
      explanation = `Section 14(2)(a) of the 1999 Constitution states that sovereignty belongs to the people from whom government derives all powers.`;
    } else if (topicMatches(t, ['democracy', 'rule of law', 'separation of power', 'checks', 'balance'])) {
      q = `Which principle ensures that no branch of government becomes too powerful?`;
      ({ options, answer } = makeOptions('Separation of powers', ['Unitary system', 'Confederation', 'Totalitarianism']));
      explanation = `Separation of powers divides government into legislative, executive, and judicial branches to prevent abuse of power.`;
    } else if (topicMatches(t, ['federalism', 'federal', 'state', 'local government', 'devolution', 'revenue allocation'])) {
      q = `How many tiers of government are recognized in the Nigerian federal system?`;
      ({ options, answer } = makeOptions('Three', ['Two', 'Four', 'Five']));
      explanation = `Nigeria operates a three-tier federal system: Federal, State, and Local Governments.`;
    } else if (topicMatches(t, ['election', 'electoral', 'vote', 'franchise', 'suffrage', 'inec'])) {
      q = `Which body is constitutionally responsible for conducting elections in Nigeria?`;
      ({ options, answer } = makeOptions('INEC', ['EFCC', 'ICPC', 'NASS']));
      explanation = `The Independent National Electoral Commission (INEC) is established by Section 153 of the 1999 Constitution to organize elections.`;
    } else if (topicMatches(t, ['citizenship', 'rights', 'fundamental human', 'civil', 'political', 'duty'])) {
      q = `Which of the following is a fundamental human right guaranteed by the Nigerian Constitution?`;
      ({ options, answer } = makeOptions('Freedom of expression', ['Right to bear arms', 'Right to drive', 'Right to own property exclusively']));
      explanation = `Chapter IV of the 1999 Constitution guarantees fundamental rights including freedom of expression, thought, conscience, and religion.`;
    } else if (topicMatches(t, ['political party', 'party system', 'multi-party', 'ideology', 'pressure group'])) {
      q = `An organization formed to influence government policy on behalf of its members is called a:`;
      ({ options, answer } = makeOptions('Pressure group', ['Political party', 'Government agency', 'Constitutional assembly']));
      explanation = `Pressure groups (interest groups) seek to influence government decisions without contesting elections directly.`;
    } else if (topicMatches(t, ['public opinion', 'mass media', 'propaganda', 'opinion poll'])) {
      q = `Which of the following is the most effective means of shaping public opinion in a democratic society?`;
      ({ options, answer } = makeOptions('Mass media', ['Military force', 'Religious decree', 'Traditional rulers']));
      explanation = `Mass media (TV, radio, newspapers, internet) disseminate information and shape public discourse in democracies.`;
    } else if (topicMatches(t, ['pre-colonial', 'colonial', 'indigenous', 'traditional', 'monarchy', 'chief', 'ogboni', 'iyalode'])) {
      q = `In pre-colonial Nigeria, the Igbo political system was best described as:`;
      ({ options, answer } = makeOptions('Republican/acephalous', ['Absolute monarchy', 'Feudal system', 'Theocratic']));
      explanation = `The Igbo had a decentralized, republican system without a central king, with decisions made by village assemblies and titled elders.`;
    } else if (topicMatches(t, ['foreign policy', 'diplomacy', 'non-alignment', 'oau', 'au', 'un', 'commonwealth', 'ecowas'])) {
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
    if (topicMatches(t, ['slave trade', 'trans-atlantic', 'abolition', 'colonial', 'partition'])) {
      q = `The trans-Atlantic slave trade was formally abolished by Britain in:`;
      ({ options, answer } = makeOptions('1807', ['1707', '1857', '1907']));
      explanation = `The British Parliament passed the Abolition of the Slave Trade Act in 1807, though slavery itself was abolished later in 1833.`;
    } else if (topicMatches(t, ['independence', 'nationalism', 'ncnc', 'ag', 'nndp', 'ziks', 'awolowo', 'bello', ' Herbert macauley'])) {
      q = `Who was the first President of Nigeria?`;
      ({ options, answer } = makeOptions('Nnamdi Azikiwe', ['Obafemi Awolowo', 'Ahmadu Bello', 'Tafawa Balewa']));
      explanation = `Dr. Nnamdi Azikiwe became Nigeria's first (ceremonial) President when Nigeria became a republic on October 1, 1963.`;
    } else if (topicMatches(t, ['world war', 'cold war', 'united nations', 'league of nations'])) {
      q = `The League of Nations was established after:`;
      ({ options, answer } = makeOptions('World War I', ['World War II', 'The Cold War', 'The Napoleonic Wars']));
      explanation = `The League of Nations was created by the Treaty of Versailles in 1919 after WWI to prevent future conflicts.`;
    } else if (topicMatches(t, ['nigerian civil war', 'biafra', 'coup', 'murtala', 'gowon', 'ogoni', 'saro-wiwa'])) {
      q = `The Nigerian Civil War ended officially in:`;
      ({ options, answer } = makeOptions('1970', ['1967', '1966', '1975']));
      explanation = `The Biafran War (Nigerian Civil War) lasted from July 1967 to January 1970, ending with Biafra's surrender.`;
    } else if (topicMatches(t, ['west african', 'ghana', 'mali', 'songhai', 'empire', 'trans-saharan'])) {
      q = `Which ancient West African empire was famous for the wealth of its ruler, Mansa Musa?`;
      ({ options, answer } = makeOptions('Mali Empire', ['Ghana Empire', 'Songhai Empire', 'Benin Kingdom']));
      explanation = `Mansa Musa, ruler of the Mali Empire in the 14th century, was renowned as one of the wealthiest individuals in history.`;
    } else {
      q = `Which of the following statements about ${topic} is historically accurate?`;
      ({ options, answer } = makeOptions(`It is an important historical event/concept covered in the syllabus`, [`It never occurred in Africa`, `It is a modern economic theory`, `It is not examined in WAEC/JAMB`]));
      explanation = `${topic} is a key area of study in the History syllabus.`;
    }
  }
  else if (sk.includes('crs') || sk.includes('christian') || sk.includes('religion')) {
    if (topicMatches(t, ['creation', 'genesis', 'adam', 'eve', 'fall', 'eden', 'noah', 'flood'])) {
      q = `According to Genesis, on which day did God create human beings?`;
      ({ options, answer } = makeOptions('Sixth day', ['First day', 'Third day', 'Seventh day']));
      explanation = `Genesis 1:26-31 records that God created man on the sixth day, after creating vegetation, animals, and other living things.`;
    } else if (topicMatches(t, ['moses', 'exodus', 'ten commandment', 'passover', 'red sea', 'sinai', 'law'])) {
      q = `How many commandments did God give to Moses on Mount Sinai?`;
      ({ options, answer } = makeOptions('Ten', ['Seven', 'Twelve', 'Five']));
      explanation = `Exodus 20 and Deuteronomy 5 record the Ten Commandments given to Moses as the moral law for Israel.`;
    } else if (topicMatches(t, ['jesus', 'miracle', 'parable', 'sermon', 'disciple', 'resurrection', 'ascension', 'baptism'])) {
      q = `Which disciple is known as the "doubting disciple" because he wanted to see Jesus' wounds before believing in the resurrection?`;
      ({ options, answer } = makeOptions('Thomas', ['Peter', 'John', 'James']));
      explanation = `Thomas (called Didymus) refused to believe the resurrection until he saw and touched Jesus' wounds (John 20:24-29).`;
    } else if (topicMatches(t, ['paul', 'missionary', 'epistle', 'conversion', 'damascus', 'saul'])) {
      q = `Paul was converted to Christianity on the road to:`;
      ({ options, answer } = makeOptions('Damascus', ['Jerusalem', 'Rome', 'Antioch']));
      explanation = `Acts 9 records Paul's dramatic conversion on the road to Damascus, where he encountered the risen Christ.`;
    } else if (topicMatches(t, ['apostle', 'pentecost', 'holy spirit', 'gift', 'fruit', 'church', 'barnabas', 'timothy'])) {
      q = `On which day were the apostles filled with the Holy Spirit?`;
      ({ options, answer } = makeOptions('Day of Pentecost', ['Passover', 'Day of Atonement', 'Sabbath']));
      explanation = `Acts 2 describes the outpouring of the Holy Spirit on the Day of Pentecost, 50 days after Easter.`;
    } else {
      q = `Which statement about ${topic} is correct in Christian Religious Studies?`;
      ({ options, answer } = makeOptions(`It is a foundational biblical concept examined in CRS`, [`It belongs to Islamic studies`, `It is not part of the Bible`, `It is a secular philosophy`]));
      explanation = `${topic} is part of the CRS syllabus and is regularly tested.`;
    }
  }
  else if (sk.includes('islamic') || sk.includes('islam')) {
    if (topicMatches(t, ['qur', 'revelation', 'prophet', 'muhammad', 'makkah', 'madinah', 'hijrah'])) {
      q = `The Prophet Muhammad (SAW) migrated from Makkah to Madinah in the year:`;
      ({ options, answer } = makeOptions('622 CE', ['610 CE', '632 CE', '570 CE']));
      explanation = `The Hijrah (migration) occurred in 622 CE (1 AH), marking the beginning of the Islamic calendar.`;
    } else if (topicMatches(t, ['pillar', 'salat', 'zakat', 'sawm', 'hajj', 'shahadah'])) {
      q = `How many pillars of Islam are there?`;
      ({ options, answer } = makeOptions('Five', ['Four', 'Six', 'Seven']));
      explanation = `The Five Pillars are: Shahadah (faith), Salat (prayer), Zakat (charity), Sawm (fasting), and Hajj (pilgrimage).`;
    } else if (topicMatches(t, ['hadith', 'sunnah', 'sharia', 'fiqh', 'ijma', 'qiyas'])) {
      q = `The sayings and actions of Prophet Muhammad (SAW) are collectively known as:`;
      ({ options, answer } = makeOptions('Hadith and Sunnah', ['Qur’an only', 'Tafsir', 'Ijma']));
      explanation = `Hadith refers to the narrated sayings, and Sunnah refers to the practices of the Prophet, serving as secondary sources of Islamic law.`;
    } else if (topicMatches(t, ['jahiliyyah', 'idol', 'mecca', 'reform', 'polytheism'])) {
      q = `The period before the advent of Islam in Arabia is known as:`;
      ({ options, answer } = makeOptions('Jahiliyyah', ['Riddah', 'Khilafah', 'Fatrah']));
      explanation = `Jahiliyyah refers to the "Age of Ignorance" in pre-Islamic Arabia, characterized by idol worship and tribal conflict.`;
    } else if (topicMatches(t, ['caliph', 'rashidun', 'abu bakr', 'umar', 'uthman', 'ali', 'khilafah'])) {
      q = `Who was the first rightly-guided caliph after the death of Prophet Muhammad (SAW)?`;
      ({ options, answer } = makeOptions('Abu Bakr', ['Umar ibn al-Khattab', 'Uthman ibn Affan', 'Ali ibn Abi Talib']));
      explanation = `Abu Bakr as-Siddiq became the first Caliph (632-634 CE) and was instrumental in compiling the Qur'an.`;
    } else if (topicMatches(t, ['tafsir', 'ijtihad', 'taqwa', 'tawhid', 'shirk', 'aqidah'])) {
      q = `The Islamic concept of the oneness of Allah is called:`;
      ({ options, answer } = makeOptions('Tawhid', ['Shirk', ['Taqwa', 'Ijtihad']]));
      explanation = `Tawhid is the fundamental Islamic belief in the absolute oneness of God, rejecting any form of polytheism (shirk).`;
    } else {
      q = `Which statement about ${topic} is correct in Islamic Studies?`;
      ({ options, answer } = makeOptions(`It is a fundamental Islamic concept in the syllabus`, [`It belongs to Christian theology`, `It is not part of Islamic teachings`, `It is a secular concept`]));
      explanation = `${topic} is essential knowledge for Islamic Studies examinations.`;
    }
  }
  else if (sk.includes('literature') || sk.includes('lit')) {
    if (topicMatches(t, ['drama', 'play', 'tragedy', 'comedy', 'shakespeare', 'character', 'act', 'scene', 'protagonist', 'antagonist'])) {
      q = `A play with an unhappy ending, usually involving the death of the main character, is called a:`;
      ({ options, answer } = makeOptions('Tragedy', ['Comedy', 'Farce', 'Melodrama']));
      explanation = `A tragedy is a dramatic work with an unhappy ending, often caused by a flaw in the protagonist (hamartia).`;
    } else if (topicMatches(t, ['poetry', 'poem', 'stanza', 'verse', 'rhyme', 'metre', 'alliteration', 'assonance', 'sonnet', 'ode', 'lyric', 'ballad'])) {
      q = `The repetition of the same initial consonant sound in a line of poetry is called:`;
      ({ options, answer } = makeOptions('Alliteration', ['Assonance', 'Consonance', 'Onomatopoeia']));
      explanation = `Alliteration is the repetition of initial consonant sounds (e.g., "Peter Piper picked").`;
    } else if (topicMatches(t, ['prose', 'novel', 'short story', 'narrative', 'theme', 'plot', 'setting', 'conflict', 'climax', 'denouement'])) {
      q = `The sequence of events in a story is called the:`;
      ({ options, answer } = makeOptions('Plot', ['Theme', 'Setting', 'Mood']));
      explanation = `Plot is the arrangement of events in a narrative, typically including exposition, rising action, climax, falling action, and resolution.`;
    } else if (topicMatches(t, ['figurative', 'simile', 'metaphor', 'personification', 'hyperbole', 'imagery', 'symbol', 'irony', 'sarcasm'])) {
      q = `"The sun smiled at us" is an example of:`;
      ({ options, answer } = makeOptions('Personification', ['Simile', 'Metaphor', 'Hyperbole']));
      explanation = `Personification attributes human qualities to non-human things. The sun cannot literally smile.`;
    } else if (topicMatches(t, ['african', 'novel', 'chinua achebe', 'wole soyinka', 'ngugi', 'drama', 'poetry'])) {
      q = `Who wrote the novel "Things Fall Apart"?`;
      ({ options, answer } = makeOptions('Chinua Achebe', ['Wole Soyinka', 'Ngũgĩ wa Thiong\'o', 'Chimamanda Ngozi Adichie']));
      explanation = `Chinua Achebe's "Things Fall Apart" (1958) is a landmark African novel depicting pre-colonial Igbo society.`;
    } else {
      q = `Which of the following is correct about ${topic} in Literature?`;
      ({ options, answer } = makeOptions(`It is a literary concept tested in examinations`, [`It is a mathematical formula`, `It belongs exclusively to science`, `It is not part of the literature syllabus`]));
      explanation = `${topic} is included in the Literature-in-English syllabus.`;
    }
  }
  else if (sk.includes('geography')) {
    if (topicMatches(t, ['climate', 'weather', 'rainfall', 'temperature', 'wind', 'pressure', 'cloud', 'monsoon'])) {
      q = `Which instrument is used to measure atmospheric pressure?`;
      ({ options, answer } = makeOptions('Barometer', ['Thermometer', 'Hygrometer', 'Anemometer']));
      explanation = `A barometer measures atmospheric pressure. A thermometer measures temperature, a hygrometer measures humidity, and an anemometer measures wind speed.`;
    } else if (topicMatches(t, ['rock', 'igneous', 'sedimentary', 'metamorphic', 'weathering', 'erosion', 'denudation', 'earthquake', 'volcano'])) {
      q = `Rocks formed from cooled magma or lava are classified as:`;
      ({ options, answer } = makeOptions('Igneous rocks', ['Sedimentary rocks', 'Metamorphic rocks', 'Fossil rocks']));
      explanation = `Igneous rocks form from the cooling and solidification of magma (intrusive) or lava (extrusive).`;
    } else if (topicMatches(t, ['population', 'migration', 'birth rate', 'death rate', 'census', 'demography', 'overpopulation'])) {
      q = `The movement of people from rural to urban areas is known as:`;
      ({ options, answer } = makeOptions('Rural-urban migration', ['Emigration', 'Immigration', 'Seasonal migration']));
      explanation = `Rural-urban migration refers to the movement of people from countryside areas to cities, common in developing nations.`;
    } else if (topicMatches(t, ['map', 'scale', 'contour', 'relief', 'projection', 'grid', 'bearing', 'toposheet'])) {
      q = `On a map, the ratio 1:50,000 means that 1 cm on the map represents:`;
      ({ options, answer } = makeOptions('50,000 cm on the ground', ['50,000 km on the ground', '50,000 m on the ground', '50 cm on the ground']));
      explanation = `A representative fraction (RF) of 1:50,000 means 1 unit on the map = 50,000 of the same units on the ground (50,000 cm = 0.5 km).`;
    } else if (topicMatches(t, ['vegetation', 'forest', 'savanna', 'desert', 'tundra', 'biome', 'rainforest', 'mangrove'])) {
      q = `The tropical grassland region of Nigeria is called:`;
      ({ options, answer } = makeOptions('Savanna', ['Rainforest', 'Mangrove', 'Desert']));
      explanation = `The savanna is a tropical grassland with scattered trees, covering much of northern Nigeria.`;
    } else if (topicMatches(t, ['latitude', 'longitude', 'time', 'timezone', 'gmt', 'equator', 'tropic', 'arctic', 'antarctic'])) {
      q = `The latitude of the Equator is:`;
      ({ options, answer } = makeOptions('0°', ['90°N', '23.5°N', '66.5°S']));
      explanation = `The Equator is at 0° latitude, dividing the Earth into the Northern and Southern Hemispheres.`;
    } else if (topicMatches(t, ['river', 'lake', 'ocean', 'sea', 'delta', 'estuary', 'lagoon', 'hydrosphere'])) {
      q = `A triangular-shaped deposition of sediment at the mouth of a river is called a:`;
      ({ options, answer } = makeOptions('Delta', ['Estuary', ['Lagoon', 'Fjord']]));
      explanation = `A delta forms when a river deposits sediment faster than it can be removed by tides and currents.`;
    } else if (topicMatches(t, ['agriculture', 'farming', 'crop', 'livestock', 'irrigation', 'fertilizer', 'peasant'])) {
      q = `The type of agriculture practiced mainly for family consumption is called:`;
      ({ options, answer } = makeOptions('Subsistence farming', ['Commercial farming', ['Plantation agriculture', 'Mechanized farming']]));
      explanation = `Subsistence farming produces food primarily for the farmer's family, with little surplus for sale.`;
    } else {
      q = `Which statement about ${topic} is correct in Geography?`;
      ({ options, answer } = makeOptions(`It is a geographical concept in the syllabus`, [`It is purely historical`, `It belongs to physics`, `It is not examined`]));
      explanation = `${topic} is a core Geography topic tested in JAMB and WAEC.`;
    }
  }
  else if (sk.includes('economics')) {
    if (topicMatches(t, ['demand', 'supply', 'equilibrium', 'price', 'market', 'elasticity', 'monopoly', 'perfect competition'])) {
      q = `When price increases and quantity demanded decreases, this is consistent with:`;
      ({ options, answer } = makeOptions('The law of demand', ['The law of supply', 'Giffen paradox', 'Veblen effect']));
      explanation = `The law of demand states that, ceteris paribus, as price rises, quantity demanded falls (inverse relationship).`;
    } else if (topicMatches(t, ['scarcity', 'choice', 'opportunity cost', 'scale of preference', 'wants'])) {
      q = `The real cost of choosing one alternative over another is called:`;
      ({ options, answer } = makeOptions('Opportunity cost', ['Money cost', 'Sunk cost', 'Fixed cost']));
      explanation = `Opportunity cost is the value of the next best alternative foregone when a choice is made.`;
    } else if (topicMatches(t, ['production', 'factors of production', 'land', 'labour', 'capital', 'entrepreneur', 'division of labour'])) {
      q = `Which factor of production is described as a man-made resource used to produce goods and services?`;
      ({ options, answer } = makeOptions('Capital', ['Land', 'Labour', 'Entrepreneur']));
      explanation = `Capital refers to man-made aids to production such as machinery, tools, buildings, and equipment.`;
    } else if (topicMatches(t, ['money', 'bank', 'central bank', 'inflation', 'deflation', 'monetary policy', 'cbn', 'interest rate'])) {
      q = `Which institution is responsible for issuing currency in Nigeria?`;
      ({ options, answer } = makeOptions('Central Bank of Nigeria (CBN)', ['Nigerian Deposit Insurance Corporation', 'Ministry of Finance', 'Nigerian Stock Exchange']));
      explanation = `The CBN, established by the CBN Act of 1958 (amended), has the sole authority to issue legal tender in Nigeria.`;
    } else if (topicMatches(t, ['tax', 'fiscal policy', 'budget', 'government revenue', 'expenditure', 'public finance', 'vat', 'income tax'])) {
      q = `A tax that takes a larger percentage of income from the poor than from the rich is called:`;
      ({ options, answer } = makeOptions('Regressive tax', ['Progressive tax', 'Proportional tax', 'Direct tax']));
      explanation = `A regressive tax (e.g., VAT on essential goods) disproportionately burdens lower-income earners.`;
    } else if (topicMatches(t, ['trade', 'international trade', 'balance of payment', 'exchange rate', 'export', 'import', 'comparative advantage'])) {
      q = `When a country's imports exceed its exports, it is said to have a:`;
      ({ options, answer } = makeOptions('Trade deficit', ['Trade surplus', 'Balanced trade', 'Favorable balance of trade']));
      explanation = `A trade deficit (unfavorable balance of trade) occurs when import value exceeds export value.`;
    } else {
      q = `Which of the following is correct about ${topic} in Economics?`;
      ({ options, answer } = makeOptions(`It is an economic principle in the syllabus`, [`It is a biological concept`, `It is not examined`, `It applies only to foreign economies`]));
      explanation = `${topic} is a fundamental economics concept tested in JAMB and WAEC.`;
    }
  }
  else if (sk.includes('commerce') || sk.includes('business') || sk.includes('marketing') || sk.includes('insurance') || sk.includes('bookkeep') || sk.includes('account') || sk.includes('office') || sk.includes('store') || sk.includes('tourism') || sk.includes('clerical')) {
    if (topicMatches(t, ['trade', 'home trade', 'foreign trade', 'retail', 'wholesale', 'import', 'export', 'entreport'])) {
      q = `Buying goods in large quantities and selling them in smaller quantities is a function of:`;
      ({ options, answer } = makeOptions('Wholesaler', ['Retailer', 'Consumer', 'Manufacturer']));
      explanation = `Wholesalers purchase goods in bulk from manufacturers and break bulk for retailers.`;
    } else if (topicMatches(t, ['advertising', 'promotion', 'sales', 'marketing', 'product', 'branding', 'market segmentation'])) {
      q = `Which of the following is NOT a function of advertising?`;
      ({ options, answer } = makeOptions('Setting the factory price', ['Creating awareness', 'Persuading customers', 'Informing the public']));
      explanation = `Advertising informs, persuades, and reminds consumers. Price-setting is a pricing decision, not an advertising function.`;
    } else if (topicMatches(t, ['insurance', 'premium', 'policy', 'underwriter', 'indemnity', 'principle', 'pooling', 'risk'])) {
      q = `The amount paid periodically to an insurance company is called:`;
      ({ options, answer } = makeOptions('Premium', ['Indemnity', 'Policy', 'Claim']));
      explanation = `A premium is the regular payment made by the insured to the insurer to keep the insurance policy active.`;
    } else if (topicMatches(t, ['transport', 'communication', 'warehousing', 'banking', 'finance', 'auxiliary', ' aids to trade'])) {
      q = `Which mode of transport is most suitable for perishable goods over short distances?`;
      ({ options, answer } = makeOptions('Road transport', ['Sea transport', 'Air transport', 'Pipeline']));
      explanation = `Road transport offers door-to-door delivery, flexibility, and speed over short distances, making it ideal for perishables.`;
    } else if (topicMatches(t, ['account', 'bookkeeping', 'ledger', 'journal', 'balance sheet', 'trial balance', 'profit', 'loss', 'double entry'])) {
      q = `The book of original entry where transactions are first recorded is called the:`;
      ({ options, answer } = makeOptions('Journal', ['Ledger', 'Cash book', 'Trial balance']));
      explanation = `The journal (or book of original entry) is where transactions are first recorded chronologically before posting to the ledger.`;
    } else if (topicMatches(t, ['occupation', 'industry', 'production', 'tertiary', 'secondary', 'primary', 'extractive'])) {
      q = `Which sector of industry is concerned with the extraction of raw materials?`;
      ({ options, answer } = makeOptions('Primary sector', ['Secondary sector', 'Tertiary sector', 'Quaternary sector']));
      explanation = `The primary sector extracts raw materials (agriculture, mining, fishing). The secondary sector manufactures goods, and the tertiary sector provides services.`;
    } else if (topicMatches(t, ['business', 'organization', 'company', 'partnership', 'sole proprietorship', 'cooperative', 'limited liability'])) {
      q = `A business owned by one person who bears all the risks and enjoys all the profits is called:`;
      ({ options, answer } = makeOptions('Sole proprietorship', ['Partnership', ['Public company', 'Cooperative']]));
      explanation = `A sole proprietorship is the simplest form of business organization, owned and managed by a single individual.`;
    } else {
      q = `Which statement about ${topic} is correct in Commerce/Business Studies?`;
      ({ options, answer } = makeOptions(`It is a commercial concept in the syllabus`, [`It is a scientific law`, `It is not examined`, `It belongs to government studies`]));
      explanation = `${topic} is part of the Commerce syllabus and is regularly tested.`;
    }
  }
  else if (sk.includes('english') || sk.includes('use-of-english') || sk.includes('use of english')) {
    if (topicMatches(t, ['comprehension', 'passage', 'inference', 'summary', 'reading', 'cloze test'])) {
      q = `In reading comprehension, an inference is:`;
      ({ options, answer } = makeOptions('A conclusion drawn from evidence in the text', ['A direct quotation', 'The main title', 'A grammatical error']));
      explanation = `An inference is an educated conclusion reached by reasoning from evidence and clues provided in the passage.`;
    } else if (topicMatches(t, ['grammar', 'tense', 'parts of speech', 'clause', 'phrase', 'sentence', 'mood', 'voice', 'concord'])) {
      q = `Identify the grammatical function of the underlined word: "The man WHO CAME HERE is my uncle."`;
      ({ options, answer } = makeOptions('Relative pronoun', ['Personal pronoun', 'Demonstrative pronoun', 'Reflexive pronoun']));
      explanation = `"Who" introduces a relative clause and refers back to "the man," making it a relative pronoun.`;
    } else if (topicMatches(t, ['lexis', 'synonym', 'antonym', 'homonym', 'vocabulary', 'register', 'jargon', 'colloquial'])) {
      q = `A word that has the same meaning as another word is called a:`;
      ({ options, answer } = makeOptions('Synonym', ['Antonym', 'Homonym', 'Acronym']));
      explanation = `A synonym is a word with the same or nearly the same meaning as another word (e.g., happy/joyful).`;
    } else if (topicMatches(t, ['essay', 'writing', 'narrative', 'descriptive', 'argumentative', 'expository', 'letter', 'speech'])) {
      q = `An essay that tells a story is called:`;
      ({ options, answer } = makeOptions('Narrative essay', ['Descriptive essay', 'Argumentative essay', 'Expository essay']));
      explanation = `A narrative essay tells a story with a plot, characters, setting, and often a chronological sequence of events.`;
    } else if (topicMatches(t, ['phonetics', 'vowel', 'consonant', 'stress', 'intonation', 'syllable', 'diphthong'])) {
      q = `How many pure vowel sounds are there in English?`;
      ({ options, answer } = makeOptions('12', ['5', '8', '20']));
      explanation = `English has 12 pure vowel sounds (monophthongs) and 8 diphthongs in Received Pronunciation.`;
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

  return { id: 0, topic: topic || 'General', section: section || 'General', subtopic: topic || 'General', difficulty, question: q, options, answer, explanation };
}

// ========================
// VOCATIONAL BUILDERS
// ========================

function buildVocationalQuestion(topic, section, content, difficulty, subjectKey) {
  const t = (topic || '').toLowerCase();
  const sk = subjectKey.toLowerCase();
  let q = '', options = {}, answer = '', explanation = '';

  if (sk.includes('computer') || sk.includes('ict') || sk.includes('data processing')) {
    if (topicMatches(t, ['hardware', 'cpu', 'memory', 'input', 'output', 'storage', 'peripheral', 'ram', 'rom', 'hard disk'])) {
      q = `Which device is both an input and output device?`;
      ({ options, answer } = makeOptions('Touchscreen monitor', ['Keyboard', 'Printer', 'Scanner']));
      explanation = `A touchscreen accepts input (touch) and displays output, making it both an input and output device.`;
    } else if (topicMatches(t, ['software', 'operating system', 'application', 'program', 'algorithm', 'compiler', 'interpreter', 'utility'])) {
      q = `Which of the following is an example of system software?`;
      ({ options, answer } = makeOptions('Windows OS', ['Microsoft Word', 'Google Chrome', 'Adobe Photoshop']));
      explanation = `System software manages computer hardware and provides a platform for applications. Windows OS is system software; the others are application software.`;
    } else if (topicMatches(t, ['internet', 'network', 'www', 'email', 'protocol', 'domain', 'ip', 'browser', 'url', 'http'])) {
      q = `The protocol used for sending emails is:`;
      ({ options, answer } = makeOptions('SMTP', ['HTTP', 'FTP', 'TCP']));
      explanation = `SMTP (Simple Mail Transfer Protocol) is used for sending emails, while POP3/IMAP are used for receiving.`;
    } else if (topicMatches(t, ['programming', 'code', 'variable', 'loop', 'conditional', 'function', 'array', 'string', 'data type'])) {
      q = `In programming, a named storage location that holds a value is called a:`;
      ({ options, answer } = makeOptions('Variable', ['Constant', 'Function', 'Array']));
      explanation = `A variable is a named memory location whose value can change during program execution.`;
    } else if (topicMatches(t, ['database', 'dbms', 'sql', 'table', 'record', 'field', 'key', 'query', 'report'])) {
      q = `In a relational database, a row is called a:`;
      ({ options, answer } = makeOptions('Record', ['Field', 'Table', 'Query']));
      explanation = `In database terminology, a row represents a record (one complete set of data), while a column represents a field.`;
    } else if (topicMatches(t, ['computer evolution', 'generation', 'eniac', 'edvac', 'babbage', 'hollerith', 'vacuum tube', 'transistor', 'microprocessor'])) {
      q = `Which device is considered the first electronic digital computer?`;
      ({ options, answer } = makeOptions('ENIAC', ['EDVAC', ['UNIVAC', 'IBM PC']]));
      explanation = `ENIAC (Electronic Numerical Integrator and Computer), completed in 1945, is considered the first general-purpose electronic digital computer.`;
    } else {
      q = `Which of the following is correct about ${topic} in Computer Studies?`;
      ({ options, answer } = makeOptions(`It is a core ICT concept in the syllabus`, [`It is a biological process`, `It is not examined`, `It belongs to history`]));
      explanation = `${topic} is included in the Computer Studies/ICT syllabus.`;
    }
  }
  else if (sk.includes('home economics') || sk.includes('catering') || sk.includes('food') || sk.includes('home management')) {
    if (topicMatches(t, ['nutrition', 'protein', 'carbohydrate', 'vitamin', 'mineral', 'diet', 'balanced diet', ' deficiency'])) {
      q = `Which nutrient is primarily responsible for body building and repair?`;
      ({ options, answer } = makeOptions('Protein', ['Carbohydrate', 'Fat', 'Vitamin C']));
      explanation = `Proteins are body-building nutrients that repair tissues, produce enzymes, and support growth.`;
    } else if (topicMatches(t, ['food preservation', 'storage', 'canning', 'drying', 'refrigeration', 'freezing', 'pasteurization'])) {
      q = `Which method of food preservation works by slowing down microbial growth through low temperature?`;
      ({ options, answer } = makeOptions('Refrigeration', ['Drying', 'Smoking', 'Salting']));
      explanation = `Refrigeration slows bacterial growth by maintaining low temperatures, extending food shelf life.`;
    } else if (topicMatches(t, ['sewing', 'pattern', 'fabric', 'textile', 'garment', 'stitch', 'hem', 'seam'])) {
      q = `Which stitch is commonly used to finish raw edges of fabric to prevent fraying?`;
      ({ options, answer } = makeOptions('Overcasting stitch', ['Back stitch', 'Running stitch', 'Hemming stitch']));
      explanation = `Overcasting stitches wrap around the raw edge of fabric to prevent threads from unraveling.`;
    } else if (topicMatches(t, ['meal', 'planning', 'menu', 'course', 'breakfast', 'lunch', 'dinner', 'snack'])) {
      q = `A meal that contains all the required nutrients in the right proportions is called a:`;
      ({ options, answer } = makeOptions('Balanced diet', ['Heavy meal', ['Light meal', 'Fast food']]));
      explanation = `A balanced diet provides carbohydrates, proteins, fats, vitamins, minerals, water, and fiber in appropriate amounts.`;
    } else {
      q = `Which statement about ${topic} is correct in Home Economics?`;
      ({ options, answer } = makeOptions(`It is an important home economics concept`, [`It is a physics law`, `It is not examined`, `It belongs to commerce`]));
      explanation = `${topic} is part of the Home Economics syllabus.`;
    }
  }
  else if (sk.includes('art') || sk.includes('music') || sk.includes('ceramic') || sk.includes('textile') || sk.includes('paint') || sk.includes('basket') || sk.includes('wood') || sk.includes('sculpt') || sk.includes('decor')) {
    if (topicMatches(t, ['colour', 'pigment', 'primary', 'secondary', 'complementary', 'harmony', 'warm', 'cool', 'shade', 'tone', 'tint'])) {
      q = `Which of the following are primary colours?`;
      ({ options, answer } = makeOptions('Red, Yellow, Blue', ['Red, Green, Blue', 'Orange, Purple, Green', 'Black, White, Grey']));
      explanation = `The traditional primary colours in pigment/painting are Red, Yellow, and Blue, from which other colours are mixed.`;
    } else if (topicMatches(t, ['perspective', 'drawing', 'proportion', 'scale', 'line', 'shape', 'form', 'texture', 'value'])) {
      q = `The art technique used to create the illusion of depth on a flat surface is called:`;
      ({ options, answer } = makeOptions('Perspective', ['Composition', 'Texture', 'Colour harmony']));
      explanation = `Perspective uses vanishing points and converging lines to create the illusion of three-dimensional space.`;
    } else if (topicMatches(t, ['music', 'note', 'scale', 'rhythm', 'melody', 'harmony', 'time signature', 'clef', 'key signature', 'chord'])) {
      q = `How many beats does a minim (half note) receive in 4/4 time?`;
      ({ options, answer } = makeOptions('Two beats', ['One beat', 'Four beats', 'Three beats']));
      explanation = `In common time (4/4), a crotchet = 1 beat, a minim = 2 beats, and a semibreve = 4 beats.`;
    } else if (topicMatches(t, ['ceramic', 'clay', 'glaze', 'kiln', 'firing', 'pottery', 'earthenware', 'stoneware'])) {
      q = `At what stage is clay fired in a kiln to make it permanent and waterproof?`;
      ({ options, answer } = makeOptions('Bisque firing', ['Drying', 'Wedging', 'Slip casting']));
      explanation = `Bisque firing is the first firing of clay, making it hard and porous but ready for glazing.`;
    } else if (topicMatches(t, ['textile', 'weaving', 'spinning', 'dyeing', 'printing', 'batik', 'tie-dye'])) {
      q = `Which resist-dyeing technique uses wax to create patterns on fabric?`;
      ({ options, answer } = makeOptions('Batik', ['Tie-dye', ['Screen printing', 'Block printing']]));
      explanation = `Batik involves applying hot wax to fabric before dyeing; the waxed areas resist the dye and create patterns.`;
    } else {
      q = `Which statement about ${topic} is correct in Art/Music?`;
      ({ options, answer } = makeOptions(`It is a tested concept in creative arts`, [`It is a mathematical theorem`, `It is not examined`, `It belongs to science`]));
      explanation = `${topic} is included in the Art/Music syllabus.`;
    }
  }
  else if (sk.includes('auto') || sk.includes('mechanic') || sk.includes('welding') || sk.includes('building') || sk.includes('electric') || sk.includes('electronic') || sk.includes('radio') || sk.includes('refrigerat') || sk.includes('woodwork') || sk.includes('mining') || sk.includes('auto body') || sk.includes('spray') || sk.includes('part') || sk.includes('gsm') || sk.includes('basket') || sk.includes('fisher') || sk.includes('forestry') || sk.includes('animal husbandry')) {
    if (topicMatches(t, ['safety', 'precaution', 'ppe', 'hazard', 'first aid', 'workshop', 'fire extinguisher'])) {
      q = `In a workshop, PPE stands for:`;
      ({ options, answer } = makeOptions('Personal Protective Equipment', ['Public Protection Equipment', 'Personal Production Equipment', 'Plant Processing Equipment']));
      explanation = `PPE refers to protective clothing, helmets, goggles, gloves, and other garments designed to protect the wearer from injury.`;
    } else if (topicMatches(t, ['tool', 'equipment', 'machine', 'instrument', 'device', 'hand tool', 'power tool', 'measuring tool'])) {
      q = `Which tool is used for measuring internal dimensions?`;
      ({ options, answer } = makeOptions('Vernier caliper', ['Micrometer', 'Steel rule', 'Try square']));
      explanation = `A vernier caliper can measure internal dimensions (using the upper jaws), external dimensions, and depth.`;
    } else if (topicMatches(t, ['circuit', 'voltage', 'current', 'resistor', 'capacitor', 'transformer', 'diode', 'transistor', 'inductor'])) {
      q = `A device that steps up or steps down alternating voltage is called a:`;
      ({ options, answer } = makeOptions('Transformer', ['Resistor', 'Capacitor', 'Inductor']));
      explanation = `A transformer transfers electrical energy between circuits through electromagnetic induction, stepping voltage up or down.`;
    } else if (topicMatches(t, ['welding', 'solder', 'braze', 'arc', 'gas', 'electrode', 'flux'])) {
      q = `Which welding process uses a non-consumable tungsten electrode?`;
      ({ options, answer } = makeOptions('TIG welding', ['MIG welding', 'Arc welding', 'Oxy-acetylene welding']));
      explanation = `Tungsten Inert Gas (TIG) welding uses a non-consumable tungsten electrode and an inert shielding gas.`;
    } else if (topicMatches(t, ['joint', 'mortise', 'tenon', 'dovetail', 'housing', 'bridle', 'lap', 'butt', 'dowel'])) {
      q = `Which wood joint is commonly used for joining the corners of a drawer?`;
      ({ options, answer } = makeOptions('Dovetail joint', ['Butt joint', 'Mortise and tenon', 'Lap joint']));
      explanation = `Dovetail joints interlock like a puzzle, providing strong resistance to pulling forces, ideal for drawers.`;
    } else if (topicMatches(t, ['engine', 'piston', 'crankshaft', 'camshaft', 'cylinder', 'combustion', 'ignition', 'cooling'])) {
      q = `Which component of an internal combustion engine converts reciprocating motion to rotary motion?`;
      ({ options, answer } = makeOptions('Crankshaft', ['Camshaft', 'Piston', 'Connecting rod']));
      explanation = `The crankshaft converts the up-and-down motion of the pistons into rotational motion that drives the wheels.`;
    } else if (topicMatches(t, ['brake', 'clutch', 'gear', 'transmission', 'differential', 'suspension', 'steering'])) {
      q = `Which braking system uses hydraulic fluid to transfer force from the pedal to the brake pads?`;
      ({ options, answer } = makeOptions('Hydraulic brake', ['Mechanical brake', ['Air brake', 'Electric brake']]));
      explanation = `Hydraulic brakes use incompressible fluid to transmit force, providing smooth and powerful braking action.`;
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

  return { id: 0, topic: topic || 'General', section: section || 'General', subtopic: topic || 'General', difficulty, question: q, options, answer, explanation };
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
  if (name.includes('art') || name.includes('music') || name.includes('ceramic') || name.includes('textile') || name.includes('paint') || name.includes('basket') || name.includes('wood') || name.includes('sculpt') || name.includes('decor')) return 'vocational';
  if (name.includes('auto') || name.includes('mechanic') || name.includes('welding') || name.includes('building') || name.includes('electric') || name.includes('electronic') || name.includes('radio') || name.includes('refrigerat') || name.includes('mining') || name.includes('fisher') || name.includes('forestry') || name.includes('animal husbandry') || name.includes('gsm') || name.includes('part')) return 'vocational';
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

  const raw = fs.readFileSync(path.join(fullPath, syllabusFile), 'utf8');
  const syllabus = safeJsonParse(raw);

  if (!syllabus) {
    console.log(`Failed to parse syllabus for ${subjectDir}`);
    return;
  }

  const subjectName = syllabus.exam || syllabus.syllabus_title || syllabus.subject || subjectDir;
  const topics = extractTopics(syllabus);

  if (topics.length === 0) {
    console.log(`No topics found for ${subjectName}`);
    return;
  }

  console.log(`Generating for ${subjectName} (${topics.length} topics)...`);

  const questions = [];
  const difficulties = ['easy', 'medium', 'hard'];

  topics.forEach((tp, idx) => {
    const count = 3;
    for (let i = 0; i < count; i++) {
      const difficulty = difficulties[(idx + i) % 3];
      const q = buildQuestion(tp.topic, tp.section, tp.content, difficulty, subjectDir);
      q.id = questions.length + 1;
      questions.push(q);
    }
  });

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
