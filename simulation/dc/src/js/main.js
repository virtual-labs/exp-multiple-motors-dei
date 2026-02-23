let image_tracker = "off";
let currentSpeed = 20;
let editorInstance = null;

// Apply code changes from editor
function applyCodeChanges() {
  if (!editorInstance) return;
  
  const code = editorInstance.getValue();
  
  // Extract the analogWrite value from line 8
  const lines = code.split('\n');
  const line8 = lines[7]; // 0-indexed, so line 8 is index 7
  
  // Match analogWrite(11, NUMBER);
  const match = line8.match(/analogWrite\s*\(\s*\d+\s*,\s*(\d+)\s*\)/);
  
  if (match) {
    const value = parseInt(match[1]);
    
    // Validate
    if (value >= 0 && value <= 255) {
      currentSpeed = value;
      
      // Update display
      document.getElementById("speedValue").textContent = currentSpeed;
      const percentage = Math.round((currentSpeed / 255) * 100);
      document.getElementById("speedPercentage").textContent = `(${percentage}%)`;
      
      // Update motor if running
      if (image_tracker === "On") {
        updateMotorSpeed(currentSpeed);
      }
      
      // Visual feedback
      const btn = document.getElementById("applyCodeBtn");
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="apply-icon">✓</span> Applied!';
      btn.style.backgroundColor = "#28a745";
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = "";
      }, 1500);
    } else {
      alert("PWM value must be between 0 and 255");
    }
  } else {
    alert("Error: Could not find analogWrite() on line 8. Please use format: analogWrite(11, value);");
  }
}

// Update motor rotation speed based on PWM value
function updateMotorSpeed(speed) {
  const motorIndicator = document.getElementById("motorIndicator");
  
  if (speed === 0) {
    motorIndicator.classList.remove("rotating");
  } else {
    // Calculate rotation duration (inversely proportional to speed)
    // Speed 255 = 0.2s (very fast), Speed 1 = 5s (very slow)
    const duration = Math.max(0.2, 5 - (speed / 255) * 4.8);
    motorIndicator.style.animationDuration = `${duration}s`;
    motorIndicator.classList.add("rotating");
  }
}

// Initialize editor when DOM is loaded
function initializeEditor() {
  editorInstance = CodeMirror.fromTextArea(document.getElementById("arduinoCode"), {
    mode: "text/x-c++src",
    lineNumbers: true,
    matchBrackets: true,
    theme: "monokai",
    readOnly: false,
    tabSize: 2,
    indentUnit: 2,
    lineWrapping: false,
    scrollbarStyle: "native"
  });
  
  // Highlight line 8 for editing
  editorInstance.addLineClass(7, "background", "editable-line");
  
  // Add change listener to detect edits
  editorInstance.on("change", function() {
    const applyBtn = document.getElementById("applyCodeBtn");
    if (applyBtn) {
      applyBtn.classList.add("code-modified");
    }
  });
}

function changePower() {
  let image = document.getElementById("ifimg");
  const pushButton = document.getElementById("pushbutton");
  const startBtn = document.getElementById("startBtn");
  const motorIndicator = document.getElementById("motorIndicator");
  
  if (image_tracker == "off") {
    image.src = "./src/images/dc_on.gif";
    startBtn.innerHTML = '<span class="play-icon">⏹</span> Stop Simulation';
    startBtn.className = "control-btn stop-btn";
    image_tracker = "On";
    if (pushButton) pushButton.style.display = "inline-block";
    
    // Start motor rotation at current speed
    updateMotorSpeed(currentSpeed);
  } else {
    image.src = "./src/images/dc_off.png";
    startBtn.innerHTML = '<span class="play-icon">▶</span> Start Simulation';
    startBtn.className = "control-btn start-btn";
    image_tracker = "off";
    if (pushButton) pushButton.style.display = "none";
    
    // Stop motor rotation (shaft remains visible)
    motorIndicator.classList.remove("rotating");
  }
}

function changeImage() {
  // Placeholder for button interaction if needed
}
