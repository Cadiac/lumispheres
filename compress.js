import demolished from "demolishedcompressor";

const html =
  '<body style="background:#000" onclick="run()"><p style="color:#fff">Click!</p>';

demolished.Compressor.Pngify("4k/demo.min.js", "entry/spheres.html", html);
