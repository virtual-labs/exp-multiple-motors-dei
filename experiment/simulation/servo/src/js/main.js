let image_tracker = "off";

function changePower() {
  let image = document.getElementById("ifimg");
  const pushButton = document.getElementById("pushbutton");
  const startBtn = document.getElementById("startBtn");
  
  if (image_tracker == "off") {
    image.src = "./src/images/servo_on.gif";
    startBtn.innerHTML = '<span class="play-icon">⏹</span> Stop Simulation';
    startBtn.className = "control-btn stop-btn";
    image_tracker = "On";
    if (pushButton) pushButton.style.display = "inline-block";
  } else {
    image.src = "./src/images/servo_off.png";
    startBtn.innerHTML = '<span class="play-icon">▶</span> Start Simulation';
    startBtn.className = "control-btn start-btn";
    image_tracker = "off";
    if (pushButton) pushButton.style.display = "none";
  }
}

function changeImage() {
  // Placeholder for button interaction if needed
}
