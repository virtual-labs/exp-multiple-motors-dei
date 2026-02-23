/* ============================================================
   main.js — Virtual Stepper Motor
   CodeMirror editor with editable parameters at the top.
   ============================================================ */

// -- Image-tracker state -------------------------------------
var image_tracker = "off";
var editor = null;

function changePower() {
    var startBtn = document.getElementById("startBtn");
    var img = document.getElementById("ifimg");
    var label = document.getElementById("arduinoLabel");
    var codeBox = document.querySelector(".code-box");

    if (image_tracker === "off") {
        clearError();
        var err = validateCode();
        if (err) {
            showError(err);
            return;
        }

        // Rebuild the motor visuals to match the actual code
        var spr = getStepsPerRevFromEditor();
        buildStepTicks(spr);
        buildRotorTeeth(spr / 4); // Usually rotor teeth = steps / 4 for standard hybrids

        startBtn.innerHTML = '<span class="play-icon">&#9209;</span> Stop Simulation';
        startBtn.className = "control-btn stop-btn";
        image_tracker = "On";
        img.src = "./src/images/stepper_on.gif";
        img.classList.add("running");
        if (label) { label.textContent = "Arduino Uno \u2014 Running"; label.classList.add("running"); }
        if (codeBox) codeBox.classList.add("running-glow");

        startRotation();
    } else {
        startBtn.innerHTML = '<span class="play-icon">&#9654;</span> Start Simulation';
        startBtn.className = "control-btn start-btn";
        image_tracker = "off";
        img.src = "./src/images/stepper_off.png";
        img.classList.remove("running");
        if (label) { label.textContent = "Arduino Uno \u2014 Idle"; label.classList.remove("running"); }
        if (codeBox) codeBox.classList.remove("running-glow");

        resetMotor();
    }
}

function changeImageLeft() { /* kept for compatibility */ }

// -- CodeMirror logic --
function initCodeMirror() {
    var ta = document.getElementById("arduinoCode");
    if (!ta) return;

    editor = CodeMirror.fromTextArea(ta, {
        mode: "text/x-c++src",
        lineNumbers: true,
        matchBrackets: true,
        theme: "monokai",
        tabSize: 2,
        indentUnit: 2,
        lineWrapping: false,
        scrollbarStyle: "native",
    });

    // Lock all lines except line 0 and 1
    editor.on("beforeChange", function (cm, change) {
        if (change.from.line > 1 || change.to.line > 1) {
            change.cancel();
        }
    });

    // Visual read-only/editable classes
    editor.on("change", function () { applyReadonlyClasses(); });
    applyReadonlyClasses();
}

function applyReadonlyClasses() {
    if (!editor) return;
    var count = editor.lineCount();
    for (var i = 0; i < count; i++) {
        if (i <= 1) {
            editor.removeLineClass(i, "background", "readonly-line");
            editor.addLineClass(i, "background", "editable-line");
        } else {
            editor.removeLineClass(i, "background", "editable-line");
            editor.addLineClass(i, "background", "readonly-line");
        }
    }
}

// -- Validation --
function validateCode() {
    if (!editor) return null;

    var line0 = editor.getLine(0);
    var line1 = editor.getLine(1);

    // Robust regex validation
    if (!/int\s+steps\s*=\s*\d+\s*;/.test(line0)) {
        return "❌ Syntax Error (Line 1): Expected 'int steps = <value>;'";
    }
    if (!/int\s+speed\s*=\s*\d+\s*;/.test(line1)) {
        return "❌ Syntax Error (Line 2): Expected 'int speed = <value>;'";
    }

    var steps = getStepsFromEditor();
    var speed = getSpeedFromEditor();

    if (isNaN(steps) || steps < 1) return "❌ Value Error (Line 1): steps must be a positive number.";
    if (isNaN(speed) || speed < 1 || speed > 1000) return "❌ Value Error (Line 2): speed must be 1 to 1000 RPM.";

    return null;
}

// -- Reading from editor --
function getStepsFromEditor() {
    if (!editor) return 2048;
    var line = editor.getLine(0);
    var match = line.match(/int\s+steps\s*=\s*(\d+)/);
    return match ? parseInt(match[1], 10) : NaN;
}

function getSpeedFromEditor() {
    if (!editor) return 15;
    var line = editor.getLine(1);
    var match = line.match(/int\s+speed\s*=\s*(\d+)/);
    return match ? parseInt(match[1], 10) : NaN;
}

/**
 * Dynamically parse the Stepper constructor to see how many steps 
 * actually make a full revolution according to the code.
 */
function getStepsPerRevFromEditor() {
    if (!editor) return 2048;
    var code = editor.getValue();

    // Pattern: Stepper myStepper(VALUE, ...)
    var match = code.match(/Stepper\s+\w+\s*\(\s*([^,)]+)/);
    if (!match) return 2048;

    var val = match[1].trim();

    // If it's a numeric constant
    if (/^\d+$/.test(val)) {
        return parseInt(val, 10);
    }

    // If it's the variable 'steps', use its value
    if (val === "steps") {
        return getStepsFromEditor();
    }

    // Attempt to find a variable or const definition earlier in the code
    var varMatch = code.match(new RegExp("(?:int|const\\s+int)\\s+" + val + "\\s*=\\s*(\\d+)"));
    if (varMatch) {
        return parseInt(varMatch[1], 10);
    }

    // Default to the user's specific requirement
    return 2048;
}

// -- Error display --
function showError(msg) {
    var el = document.getElementById("errorMsg");
    if (el) { el.textContent = msg; el.style.display = "block"; }
}
function clearError() {
    var el = document.getElementById("errorMsg");
    if (el) { el.textContent = ""; el.style.display = "none"; }
}

// -- Motor state --
var currentAngleDeg = 0;
var totalStepsDone = 0;
var isRotating = false;
var animFrameId = null;
var animStartAngle = 0;
var animTargetAngle = 0;
var animStartTime = null;
var animDuration = 0;

// -- Init on page load --
window.addEventListener("DOMContentLoaded", function () {
    buildStatorPoles();
    buildRotorTeeth(50);
    buildStepTicks(200);
    updateRotorTransform(0);
    initCodeMirror();
});

// -- Start a rotation cycle --
function startRotation() {
    if (image_tracker !== "On" || isRotating) return;

    var stepsToMove = getStepsFromEditor();
    var stepsPerRev = getStepsPerRevFromEditor();
    var rpm = getSpeedFromEditor();

    if (isNaN(stepsToMove) || isNaN(stepsPerRev) || isNaN(rpm)) return;

    // Calculation precisely following Arduino Stepper Lib
    var angleToRotate = (stepsToMove / stepsPerRev) * 360;
    var durationMs = (Math.abs(stepsToMove) * 60000) / (rpm * stepsPerRev);

    animStartAngle = currentAngleDeg;
    animTargetAngle = currentAngleDeg + angleToRotate;
    animDuration = Math.max(durationMs, 50); // Minimum 50ms for visibility
    animStartTime = null;
    isRotating = true;

    requestAnimationFrame(animateStep);
}

// -- Animation loop --
function animateStep(ts) {
    if (!animStartTime) animStartTime = ts;
    var elapsed = ts - animStartTime;
    var t = Math.min(elapsed / animDuration, 1);

    // Constant speed for stepper accuracy (linear rotation within a cycle)
    currentAngleDeg = animStartAngle + (animTargetAngle - animStartAngle) * t;

    updateRotorTransform(currentAngleDeg);

    // Pulse coils based on actual step count covered
    var spr = getStepsPerRevFromEditor();
    var stm = getStepsFromEditor();
    var currentSteps = Math.floor(t * stm);
    animateCoilsForStep(currentSteps);

    if (t < 1) {
        animFrameId = requestAnimationFrame(animateStep);
    } else {
        currentAngleDeg = animTargetAngle;
        totalStepsDone += stm;
        updateRotorTransform(currentAngleDeg);
        resetCoils();
        isRotating = false;

        if (image_tracker === "On") {
            setTimeout(startRotation, 500);
        }
    }
}

function updateRotorTransform(angle) {
    var rotor = document.getElementById("rotorGroup");
    if (rotor) {
        rotor.setAttribute("transform", "rotate(" + (angle % 360) + ", 200, 200)");
    }
}

function animateCoilsForStep(stepCount) {
    var phase = Math.abs(stepCount) % 4;
    for (var i = 0; i < 8; i++) {
        var el = document.getElementById("coil-" + i);
        if (!el) continue;

        // Active pair of poles based on full-step sequence
        var active = (i % 4 === phase);

        el.setAttribute("opacity", active ? "1" : "0.25");
        el.setAttribute("fill", active
            ? (i % 2 === 0 ? "#f6ad55" : "#63b3ed")
            : (i % 2 === 0 ? "#c05621" : "#2b6cb0"));

        if (active) el.setAttribute("filter", "url(#glow)");
        else el.removeAttribute("filter");
    }
}

function resetCoils() {
    for (var i = 0; i < 8; i++) {
        var el = document.getElementById("coil-" + i);
        if (el) {
            el.setAttribute("opacity", "0.55");
            el.setAttribute("fill", i % 2 === 0 ? "#c05621" : "#2b6cb0");
            el.removeAttribute("filter");
        }
    }
}

function resetMotor() {
    if (isRotating) {
        cancelAnimationFrame(animFrameId);
        isRotating = false;
        resetCoils();
    }
    currentAngleDeg = 0;
    totalStepsDone = 0;
    updateRotorTransform(0);
}

// -- SVG Builders --
function buildStatorPoles() {
    var g = document.getElementById("statorPoles");
    var coilG = document.getElementById("coilWindings");
    if (!g || !coilG) return;
    g.innerHTML = "";
    coilG.innerHTML = "";

    for (var i = 0; i < 8; i++) {
        var angleDeg = (i * 360) / 8 - 90;
        var angleRad = (angleDeg * Math.PI) / 180;
        var cx = 200 + Math.cos(angleRad) * 128;
        var cy = 200 + Math.sin(angleRad) * 128;

        var pole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pole.setAttribute("cx", cx);
        pole.setAttribute("cy", cy);
        pole.setAttribute("r", 14);
        pole.setAttribute("fill", "#1e3a5f");
        pole.setAttribute("stroke", "#2d5a9a");
        pole.setAttribute("stroke-width", "1.5");
        g.appendChild(pole);

        var ccx = 200 + Math.cos(angleRad) * 108;
        var ccy = 200 + Math.sin(angleRad) * 108;
        var coil = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        coil.setAttribute("cx", ccx);
        coil.setAttribute("cy", ccy);
        coil.setAttribute("r", 10);
        coil.setAttribute("fill", i % 2 === 0 ? "#c05621" : "#2b6cb0");
        coil.setAttribute("opacity", "0.55");
        coil.setAttribute("id", "coil-" + i);
        coilG.appendChild(coil);
    }
}

function buildRotorTeeth(count) {
    var g = document.getElementById("rotorTeeth");
    if (!g) return;
    g.innerHTML = "";
    var actualCount = Math.max(8, Math.min(count, 100)); // Limit for performance
    for (var i = 0; i < actualCount; i++) {
        var angleDeg = (i * 360) / actualCount;
        var angleRad = (angleDeg * Math.PI) / 180;
        var r = 84;
        var cx = 200 + Math.cos(angleRad) * r;
        var cy = 200 + Math.sin(angleRad) * r;

        var t = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        t.setAttribute("cx", cx);
        t.setAttribute("cy", cy);
        t.setAttribute("r", actualCount > 50 ? 2 : 4);
        t.setAttribute("fill", "#2d4a7a");
        t.setAttribute("stroke", "#3a6aa0");
        t.setAttribute("stroke-width", "0.8");
        g.appendChild(t);
    }
}

function buildStepTicks(count) {
    var g = document.getElementById("stepTicks");
    if (!g) return;
    g.innerHTML = "";
    var actualCount = Math.max(8, Math.min(count, 400));
    for (var i = 0; i < actualCount; i++) {
        var isMajor = i % (actualCount / 8) === 0;
        var angleDeg = (i * 360) / actualCount - 90;
        var angleRad = (angleDeg * Math.PI) / 180;
        var r1 = 162, r2 = isMajor ? 175 : 166;
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", 200 + r1 * Math.cos(angleRad));
        line.setAttribute("y1", 200 + r1 * Math.sin(angleRad));
        line.setAttribute("x2", 200 + r2 * Math.cos(angleRad));
        line.setAttribute("y2", 200 + r2 * Math.sin(angleRad));
        line.setAttribute("stroke", isMajor ? "#38bdf8" : "#2d4a7a");
        line.setAttribute("stroke-width", isMajor ? "2" : "1");
        g.appendChild(line);
    }
}
