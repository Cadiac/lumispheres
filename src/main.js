import "./style.css";
import { run } from "./demo.js";
import { CPlayer } from "./player-small.js";

import song from "./song";

const button = document.querySelector("#start");

button.addEventListener("click", (event) => {
  const t0 = new Date();
  const player = new CPlayer(song);
  const audioCtx = new AudioContext();

  while (player.generate() < 1);

  const t1 = new Date();
  console.log("done (" + (t1 - t0) + "ms)");

  // Put the generated song in an Audio element.
  const wave = player.createWave();
  const audio = document.createElement("audio");
  audio.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
  audio.onplay = () => audioCtx.resume();

  // Create an analyser
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(audio);

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  audio.play();

  run(audioCtx, analyser);
});
