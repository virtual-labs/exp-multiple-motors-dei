function changepage() {
  var x = document.getElementById("pagechanger").value;
  if (x == 1) document.getElementById("sm1").click();
  else if (x == 2) document.getElementById("sm2").click();
  else if (x == 3) document.getElementById("sm3").click();
  else if (x == 4) document.getElementById("sm4").click();
  else document.getElementById("sm5").click();
}

let image_tracker = "off";
function changeImage() {
  let image = document.getElementById("ifimg");
  if (image_tracker == "off") {
    image.src = "./src/images/LedOn.jpeg";
    image_tracker = "on";
  } else {
    image.src = "./src/images/LedOff.jpeg";
    image_tracker = "off";
  }
}

let image_tracker2 = "off";
function changeBuzzerImage() {
  let image = document.getElementById("ifimg2");
  if (image_tracker2 == "off") {
    image.src = "./src/images/BuzzerOn.gif";
    image_tracker2 = "on";
  } else {
    image.src = "./src/images/BuzzerOff.jpg";
    image_tracker2 = "off";
  }
}

let audioElement = document.getElementById("myAudio");
function togglePlay() {
  if (audioElement.paused) {
    audioElement.play();
    audioElement.loop = true;
  } else {
    audioElement.pause();
  }
}
