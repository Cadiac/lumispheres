import "./style.css";
import { run } from "./demo.js";
import { CPlayer } from "./player-small.js";

import song from "./song";

const button = document.querySelector("#start");

button.addEventListener("click", (event) => {
  var t0 = new Date();
  var player = new CPlayer();
  player.init(song);

  var done = false;
  setInterval(function () {
    if (done) {
      return;
    }

    done = player.generate() >= 1;

    if (done) {
      var t1 = new Date();
      console.log("done (" + (t1 - t0) + "ms)");

      // Put the generated song in an Audio element.
      var wave = player.createWave();
      var audio = document.createElement("audio");
      audio.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
      audio.play();

      // Start an oscilloscope animation.
      //   var ctx = document.getElementById("canvas").getContext("2d");
      //   setInterval(function () {
      //     // Get currently playing data.
      //     var t = audio.currentTime;
      //     var data = player.getData(t, 300);

      //     // Clear background.
      //     ctx.fillStyle = "rgb(0,30,0)";
      //     ctx.fillRect(0, 0, 300, 200);
      //     ctx.fillStyle = "rgb(0,30,60)";
      //     ctx.fillRect(0, 0, 300 * (t / audio.duration), 200);

      //     ctx.strokeStyle = "rgb(255,255,255)";

      //     // Plot left channel.
      //     ctx.beginPath();
      //     ctx.moveTo(0, 50 + 90 * data[0]);
      //     for (var k = 1; k < 300; ++k) {
      //       ctx.lineTo(k, 50 + 90 * data[k * 2]);
      //     }
      //     ctx.stroke();

      //     // Plot right channel.
      //     ctx.beginPath();
      //     ctx.moveTo(0, 150 + 90 * data[1]);
      //     for (var k = 1; k < 300; ++k) {
      //       ctx.lineTo(k, 150 + 90 * data[k * 2 + 1]);
      //     }
      //     ctx.stroke();
      //   }, 16);

      // var data = player.getData(t, 300);

      run();
    }
  }, 0);
});
