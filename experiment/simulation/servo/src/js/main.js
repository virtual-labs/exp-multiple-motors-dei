// ===== CONSTANTS =====
const CX = 250, CY = 178;
const ARM_LEN = 118;
const PROTO_R = 148;

// ===== STATE =====
let currentAngle = 0;
let running = false;
let speedMultiplier = 10;
let activeTimeouts = [];
let editor = null;

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  buildServoSVG();
  updateServoDisplay(0);
  initCodeMirror();
  document.getElementById('speedSlider').addEventListener('input', e => {
    speedMultiplier = Number(e.target.value);
    document.getElementById('speedLabel').textContent = speedMultiplier + 'x';
  });
});

// ===== CODEMIRROR INIT =====
function initCodeMirror() {
  editor = CodeMirror.fromTextArea(document.getElementById('arduinoCode'), {
    mode: 'text/x-c++src',
    lineNumbers: true,
    matchBrackets: true,
    theme: 'monokai',
    tabSize: 2,
    indentUnit: 2,
    lineWrapping: false,
    scrollbarStyle: 'native',
    autofocus: false
  });

  // ── Lock all lines except line 0 (the angle variable) ──
  editor.on('beforeChange', (cm, change) => {
    // Allow only changes that are fully within line 0
    if (change.from.line !== 0 || change.to.line !== 0) {
      change.cancel();
    }
  });

  // ── Visual: dim the read-only lines ──
  editor.on('change', () => applyReadonlyClasses());
  applyReadonlyClasses();
}

function applyReadonlyClasses() {
  if (!editor) return;
  const total = editor.lineCount();
  for (let i = 0; i < total; i++) {
    if (i === 0) {
      editor.removeLineClass(i, 'background', 'readonly-line');
      editor.addLineClass(i, 'background', 'editable-line');
    } else {
      editor.removeLineClass(i, 'background', 'editable-line');
      editor.addLineClass(i, 'background', 'readonly-line');
    }
  }
}

// ===== SVG BUILD =====
function buildArduino() {
  // --- ArduinoUno.svg original viewBox: 285.2 x 209 ---
  // Board rendered at:
  const imgX = 115, imgY = 287;
  const imgW = 270, imgH = 198; // scale = 270/285.2 = 0.9467
  const sc = imgW / 285.2;     // ≈ 0.9467

  // Pin positions measured in ORIGINAL SVG coordinates (285.2 x 209):
  //   Digital header top row (y ≈ 19):
  //     Holes at x = 97.3, 106.3 ... 178.3 (first group) then 192.7 ... 255.7 (second group)
  //     Spacing = 9 px.  Mapping: AREF=97.3, GND=106.3, 13=115.3 ... ~9=151.3 ...
  //   Power header bottom row (y ≈ 190):
  //     Left group: IOREF=129.7, RST=138.7, 3.3V=147.7, 5V=156.7, GND=165.7, GND=174.7, VIN=183.7
  const origPin9 = { x: 151.3, y: 19 };   // digital ~9
  const origVcc = { x: 156.7, y: 190 };   // power 5V
  const origGnd = { x: 165.7, y: 190 };   // power GND

  // Rendered pixel positions
  const p9x = imgX + origPin9.x * sc;  // ≈ 258.3
  const p9y = imgY + origPin9.y * sc;  // ≈ 305.0
  const vx = imgX + origVcc.x * sc;  // ≈ 263.4
  const vy = imgY + origVcc.y * sc;  // ≈ 467.1
  const gx = imgX + origGnd.x * sc;  // ≈ 271.9
  const gy = imgY + origGnd.y * sc;  // ≈ 467.1

  let html = '';

  // ── WIRES drawn BEFORE the image so they tuck under the board edges ──

  // Signal wire (orange): pin ~9 → servo SIG connector (x≈231, y=277)
  html += `<path d="M${p9x.toFixed(1)} ${p9y.toFixed(1)} C${p9x.toFixed(1)} 291 231 285 231 277"
    fill="none" stroke="#f97316" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;

  // VCC wire (red): 5V bottom pin → route down → right around board → up → servo VCC (x≈244)
  html += `<path d="M${vx.toFixed(1)} ${vy.toFixed(1)} L${vx.toFixed(1)} 484 L412 484 L412 264 L244 264 L244 277"
    fill="none" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;

  // GND wire (near-black): GND bottom pin → route down → right (slightly less) → up → servo GND (x≈258)
  html += `<path d="M${gx.toFixed(1)} ${gy.toFixed(1)} L${gx.toFixed(1)} 490 L418 490 L418 269 L258 269 L258 277"
    fill="none" stroke="#292524" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ── THE REAL ARDUINO SVG ──
  html += `<image href="./ArduinoUno.svg" x="${imgX}" y="${imgY}" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid meet"/>`;

  // ── Pin highlight rings (drawn ON TOP of the image) ──
  // ~9 pin (orange ring)
  html += `<circle cx="${p9x.toFixed(1)}" cy="${p9y.toFixed(1)}" r="5.5" fill="rgba(249,115,22,0.25)" stroke="#f97316" stroke-width="2"/>`;
  // 5V pin (red ring)
  html += `<circle cx="${vx.toFixed(1)}" cy="${vy.toFixed(1)}" r="5.5" fill="rgba(239,68,68,0.25)" stroke="#ef4444" stroke-width="2"/>`;
  // GND pin (dark ring)
  html += `<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="5.5" fill="rgba(41,37,36,0.35)" stroke="#6b7280" stroke-width="2"/>`;

  // ── Pin callout labels ──
  html += `<rect x="${(p9x + 7).toFixed(1)}" y="${(p9y - 7).toFixed(1)}" width="22" height="11" rx="3" fill="rgba(0,0,0,0.7)"/>`;
  html += `<text x="${(p9x + 18).toFixed(1)}" y="${(p9y + 1).toFixed(1)}" text-anchor="middle" fill="#fb923c" font-size="7" font-family="Arial" font-weight="bold">~11</text>`;

  html += `<rect x="${(vx - 26).toFixed(1)}" y="${(vy - 14).toFixed(1)}" width="22" height="11" rx="3" fill="rgba(0,0,0,0.7)"/>`;
  html += `<text x="${(vx - 15).toFixed(1)}" y="${(vy - 6).toFixed(1)}" text-anchor="middle" fill="#f87171" font-size="7" font-family="Arial" font-weight="bold">5V</text>`;

  html += `<rect x="${(gx + 5).toFixed(1)}" y="${(gy - 14).toFixed(1)}" width="28" height="11" rx="3" fill="rgba(0,0,0,0.7)"/>`;
  html += `<text x="${(gx + 19).toFixed(1)}" y="${(gy - 6).toFixed(1)}" text-anchor="middle" fill="#94a3b8" font-size="7" font-family="Arial" font-weight="bold">GND</text>`;

  // ── Wire endpoint dots at servo connector ──
  html += `<circle cx="231" cy="277" r="4.5" fill="#f97316"/>`;
  html += `<circle cx="244" cy="277" r="4.5" fill="#ef4444"/>`;
  html += `<circle cx="258" cy="277" r="4.5" fill="#4b5563"/>`;

  // ── Wire legend (top-right of diagram) ──
  const lx = 380, ly = 290;
  html += `<rect x="${lx}" y="${ly}" width="72" height="50" rx="5" fill="rgba(15,23,42,0.75)" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>`;
  [['#f97316', '~11', 'Signal'], ['#ef4444', '5V', 'VCC'], ['#94a3b8', 'GND', 'GND']].forEach(([c, p, t], i) => {
    const ry = ly + 12 + i * 14;
    html += `<line x1="${lx + 7}" y1="${ry}" x2="${lx + 18}" y2="${ry}" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`;
    html += `<text x="${lx + 22}" y="${ry + 4}" fill="${c}" font-size="6.5" font-family="Arial" font-weight="bold">${p}</text>`;
    html += `<text x="${lx + 38}" y="${ry + 4}" fill="rgba(255,255,255,0.5)" font-size="6" font-family="Arial">${t}</text>`;
  });

  return html;
}






function buildServoSVG() {
  const svg = document.getElementById('servoSVG');
  svg.setAttribute('viewBox', '20 5 465 480');
  svg.innerHTML = `
    <defs>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#3b82f6"/>
        <stop offset="100%" style="stop-color:#1e40af"/>
      </linearGradient>
      <linearGradient id="tabGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#2563eb"/>
        <stop offset="100%" style="stop-color:#1e3a8a"/>
      </linearGradient>
      <radialGradient id="shaftGrad" cx="40%" cy="35%">
        <stop offset="0%" style="stop-color:#64748b"/>
        <stop offset="100%" style="stop-color:#1e293b"/>
      </radialGradient>
      <filter id="dropshadow">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-opacity="0.25"/>
      </filter>
    </defs>

    <!-- Protractor outer ring -->
    <path d="M ${CX - PROTO_R} ${CY} A ${PROTO_R} ${PROTO_R} 0 0 1 ${CX + PROTO_R} ${CY}"
          fill="none" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>

    <!-- Angle sweep fill (dynamic) -->
    <path id="angleSweep" d="" fill="rgba(16,185,129,0.13)" stroke="rgba(16,185,129,0.5)" stroke-width="1.5"/>

    <!-- Tick marks -->
    ${buildTicks()}

    <!-- Servo body -->
    <rect x="175" y="${CY + 14}" width="150" height="78" rx="9" fill="url(#bodyGrad)" filter="url(#dropshadow)"/>
    <!-- Body highlight -->
    <rect x="184" y="${CY + 22}" width="132" height="22" rx="5" fill="rgba(255,255,255,0.12)"/>
    <!-- Brand text -->
    <text x="${CX}" y="${CY + 54}" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="13" font-family="Arial" font-weight="bold">SERVO</text>
    <text x="${CX}" y="${CY + 68}" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="9" font-family="Arial" letter-spacing="2">SG90</text>

    <!-- Mounting tabs -->
    <rect x="148" y="${CY + 22}" width="30" height="32" rx="5" fill="url(#tabGrad)" filter="url(#dropshadow)"/>
    <circle cx="163" cy="${CY + 38}" r="7" fill="none" stroke="#93c5fd" stroke-width="2"/>
    <circle cx="163" cy="${CY + 38}" r="2.5" fill="#60a5fa"/>

    <rect x="322" y="${CY + 22}" width="30" height="32" rx="5" fill="url(#tabGrad)" filter="url(#dropshadow)"/>
    <circle cx="337" cy="${CY + 38}" r="7" fill="none" stroke="#93c5fd" stroke-width="2"/>
    <circle cx="337" cy="${CY + 38}" r="2.5" fill="#60a5fa"/>

    <!-- Connector cable -->
    <rect x="220" y="${CY + 88}" width="60" height="14" rx="3" fill="#1e3a8a"/>
    <!-- SIG = orange, VCC = red, GND = near-black (left to right) -->
    <rect x="226" y="${CY + 91}" width="9" height="8" rx="1.5" fill="#f97316"/>
    <rect x="240" y="${CY + 91}" width="9" height="8" rx="1.5" fill="#ef4444"/>
    <rect x="254" y="${CY + 91}" width="9" height="8" rx="1.5" fill="#1c1917"/>
    <rect x="226" y="${CY + 102}" width="37" height="18" rx="2" fill="#111827" opacity="0.7"/>
    <text x="${CX}" y="${CY + 115}" text-anchor="middle" fill="#6b7280" font-size="8" font-family="Arial">SIG · VCC · GND</text>

    <!-- Shaft collar -->
    <circle cx="${CX}" cy="${CY}" r="19" fill="url(#shaftGrad)" filter="url(#dropshadow)"/>
    <circle cx="${CX}" cy="${CY}" r="14" fill="#334155"/>
    <circle cx="${CX}" cy="${CY}" r="5" fill="#0f172a"/>

    <!-- Rotating arm -->
    <g id="servoArm" transform="rotate(180, ${CX}, ${CY})">
      <rect x="${CX - 6}" y="${CY - 6}" width="${ARM_LEN}" height="12" rx="6" fill="#fbbf24" filter="url(#dropshadow)"/>
      <circle cx="${CX + ARM_LEN - 6}" cy="${CY}" r="8" fill="#f59e0b" stroke="#fcd34d" stroke-width="1.5"/>
      <circle cx="${CX + ARM_LEN - 6}" cy="${CY}" r="3" fill="#92400e"/>
      <!-- Center cap -->
      <circle cx="${CX}" cy="${CY}" r="9" fill="#475569"/>
      <circle cx="${CX}" cy="${CY}" r="4" fill="#0f172a"/>
    </g>

    <!-- Angle indicator dashed line -->
    <line id="angleIndicator" x1="${CX}" y1="${CY}" x2="${CX - PROTO_R}" y2="${CY}"
          stroke="#10b981" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>

    <!-- Labels -->
    <text x="${CX - PROTO_R - 18}" y="${CY + 5}" text-anchor="middle" fill="#64748b" font-size="12" font-family="Arial" font-weight="600">0°</text>
    <text x="${CX}" y="${CY - PROTO_R - 12}" text-anchor="middle" fill="#64748b" font-size="12" font-family="Arial" font-weight="600">90°</text>
    <text x="${CX + PROTO_R + 20}" y="${CY + 5}" text-anchor="middle" fill="#64748b" font-size="12" font-family="Arial" font-weight="600">180°</text>


    <!-- ===== ARDUINO UNO + WIRES (generated by buildArduino()) ===== -->
    ${buildArduino()}
  `;
}

function buildTicks() {
  let out = '';
  for (let a = 0; a <= 180; a += 10) {
    const major = a % 30 === 0;
    const rad = (180 + a) * Math.PI / 180;
    const oR = PROTO_R, iR = oR - (major ? 14 : 7);
    const x1 = CX + oR * Math.cos(rad), y1 = CY + oR * Math.sin(rad);
    const x2 = CX + iR * Math.cos(rad), y2 = CY + iR * Math.sin(rad);
    out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${major ? '#94a3b8' : '#cbd5e1'}" stroke-width="${major ? 2 : 1}"/>`;
    if (major && a !== 0 && a !== 90 && a !== 180) {
      const lr = oR + 16;
      out += `<text x="${(CX + lr * Math.cos(rad)).toFixed(1)}" y="${(CY + lr * Math.sin(rad) + 4).toFixed(1)}" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="Arial">${a}°</text>`;
    }
  }
  return out;
}

// ===== SERVO DISPLAY UPDATE =====
function updateServoDisplay(angle) {
  currentAngle = Math.max(0, Math.min(180, Number(angle) || 0));

  const arm = document.getElementById('servoArm');
  if (arm) arm.setAttribute('transform', `rotate(${180 + currentAngle}, ${CX}, ${CY})`);

  // Indicator line
  const ind = document.getElementById('angleIndicator');
  if (ind) {
    const rad = (180 + currentAngle) * Math.PI / 180;
    ind.setAttribute('x2', (CX + PROTO_R * Math.cos(rad)).toFixed(2));
    ind.setAttribute('y2', (CY + PROTO_R * Math.sin(rad)).toFixed(2));
  }

  // Sweep arc
  updateSweep(currentAngle);

  // Live angle badge
  const badge = document.getElementById('liveAngle');
  if (badge) badge.textContent = Math.round(currentAngle);
}

function updateSweep(angle) {
  const el = document.getElementById('angleSweep');
  if (!el) return;
  if (angle <= 0.5) { el.setAttribute('d', ''); return; }
  const r = PROTO_R - 22;
  const a1 = 180 * Math.PI / 180;
  const a2 = (180 + angle) * Math.PI / 180;
  const x1 = (CX + r * Math.cos(a1)).toFixed(2);
  const y1 = (CY + r * Math.sin(a1)).toFixed(2);
  const x2 = (CX + r * Math.cos(a2)).toFixed(2);
  const y2 = (CY + r * Math.sin(a2)).toFixed(2);
  el.setAttribute('d', `M ${CX} ${CY} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`);
}

// ===== RUN / STOP =====
function changePower() {
  if (running) {
    stopSim();
  } else {
    runSim();
  }
}

function runSim() {
  clearError();
  const err = validateLine1();
  if (err) {
    showError(err);
    return;
  }
  const code = editor ? editor.getValue() : document.getElementById('arduinoCode').value;
  interpretCode(code);
}

// ── Validate that line 1 is exactly: int angle = <0-180>; ──
function validateLine1() {
  const raw = editor ? editor.getLine(0) : '';
  const line = raw.trim();

  // Must start with 'int'
  if (!line.startsWith('int')) {
    return `❌ Syntax Error (Line 1): Declaration must start with "int".\n   Found: "${line}"\n   Expected: int angle = <value>;`;
  }

  // Must contain 'angle' as the variable name
  if (!/\bangle\b/.test(line)) {
    return `❌ Syntax Error (Line 1): Variable must be named "angle".\n   Found: "${line}"\n   Expected: int angle = <value>;`;
  }

  // Must have '='
  if (!line.includes('=')) {
    return `❌ Syntax Error (Line 1): Missing "=" assignment operator.\n   Found: "${line}"\n   Expected: int angle = <value>;`;
  }

  // Must end with ';'
  if (!line.endsWith(';')) {
    return `❌ Syntax Error (Line 1): Missing semicolon ";" at end of statement.\n   Found: "${line}"\n   Expected: int angle = <value>;`;
  }

  // Extract value between '=' and ';'
  const match = line.match(/int\s+angle\s*=\s*([^;]+);/);
  if (!match) {
    return `❌ Syntax Error (Line 1): Could not parse statement.\n   Expected format: int angle = <value>;\n   Example: int angle = 90;`;
  }

  const rawVal = match[1].trim();

  // Value must be numeric (integer)
  if (!/^-?\d+(\.\d+)?$/.test(rawVal)) {
    return `❌ Value Error (Line 1): "${rawVal}" is not a valid number.\n   Only integers are accepted (e.g. 0, 45, 90, 180).\n   Example: int angle = 90;`;
  }

  const num = Number(rawVal);

  // Must not be a decimal
  if (!Number.isInteger(num)) {
    return `❌ Value Error (Line 1): "${rawVal}" is a decimal — only whole numbers are allowed.\n   Example: int angle = 90;`;
  }

  // Must be in range 0–180
  if (num < 0 || num > 180) {
    return `❌ Range Error (Line 1): Angle "${num}" is out of range.\n   Valid range is 0 to 180 degrees.\n   Example: int angle = 90;`;
  }

  return null; // ✅ All good
}


function stopSim() {
  running = false;
  activeTimeouts.forEach(t => clearTimeout(t));
  activeTimeouts = [];
  updateButton(false);
}

function updateButton(isRunning) {
  const btn = document.getElementById('startBtn');
  if (!btn) return;
  if (isRunning) {
    btn.innerHTML = '<span class="play-icon">⏹</span> Stop Simulation';
    btn.className = 'control-btn stop-btn';
  } else {
    btn.innerHTML = '<span class="play-icon">▶</span> Run Code';
    btn.className = 'control-btn start-btn';
  }
}

// ===== INTERPRETER =====
async function interpretCode(rawCode) {
  running = true;
  updateButton(true);

  try {
    let code = preprocess(rawCode);
    const globals = extractGlobals(code);
    const loopBody = extractBody(code, 'loop');

    if (!loopBody && loopBody !== '') {
      showError('No void loop() found. Please define a loop() function.');
      return;
    }

    const fullCode = `${globals}\nwhile(__running__()){\n${loopBody}\nawait __sleep__(0);\n}`;
    const AsyncFn = Object.getPrototypeOf(async function () { }).constructor;
    const fn = new AsyncFn('__write__', '__sleep__', '__running__', fullCode);

    await fn(
      async (a) => { if (!running) throw new Error('STOP'); await servoWriteAnim(a); },
      (ms) => asyncSleep(ms),
      () => running
    );
  } catch (e) {
    if (e.message !== 'STOP') showError('Code error: ' + e.message);
  } finally {
    running = false;
    updateButton(false);
  }
}

function preprocess(code) {
  code = code.replace(/#include\s*[<"][^>"]+[>"]/g, '');
  code = code.replace(/\b(int|float|double|long|byte|unsigned int|unsigned long|short)\s+/g, 'let ');
  code = code.replace(/\bboolean\s+/g, 'let ');
  code = code.replace(/\bServo\s+/g, 'let ');
  code = code.replace(/\bservo\.write\s*\(/g, 'await __write__(');
  code = code.replace(/\bservo\.attach\s*\([^)]*\)\s*;?/g, '');
  code = code.replace(/\bServo\s*\(\s*\)/g, '{}');
  code = code.replace(/\bdelay\s*\(/g, 'await __sleep__(');
  code = code.replace(/\bSerial\.\w+\s*\([^)]*\)\s*;?/g, '');
  code = code.replace(/\bpinMode\s*\([^)]*\)\s*;?/g, '');
  code = code.replace(/\bdigitalWrite\s*\([^)]*\)\s*;?/g, '');
  return code;
}

function extractGlobals(code) {
  const m1 = code.search(/void\s+setup\s*\(/);
  const m2 = code.search(/void\s+loop\s*\(/);
  const end = Math.min(m1 < 0 ? Infinity : m1, m2 < 0 ? Infinity : m2);
  return end === Infinity ? '' : code.substring(0, end);
}

function extractBody(code, fnName) {
  const re = new RegExp(`void\\s+${fnName}\\s*\\(\\s*\\)\\s*\\{`);
  const m = re.exec(code);
  if (!m) return null;
  let depth = 1, i = m.index + m[0].length;
  const start = i;
  while (i < code.length && depth > 0) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}') depth--;
    i++;
  }
  return code.substring(start, i - 1);
}

async function servoWriteAnim(angle) {
  if (!running) throw new Error('STOP');
  updateServoDisplay(angle);
}

async function asyncSleep(ms) {
  if (!running) throw new Error('STOP');
  const actual = Math.max(ms / speedMultiplier, 0);
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      if (!running) reject(new Error('STOP'));
      else resolve();
    }, actual);
    activeTimeouts.push(t);
  });
}

// ===== ERROR / INFO =====
function showError(msg) {
  const el = document.getElementById('errorMsg');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function clearError() {
  const el = document.getElementById('errorMsg');
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}

// Legacy function kept for multipleLed.html if referenced
function changeImage() { }
