import demolished from "demolishedcompressor";

const html =
  '<body style="background:#000" onclick="z()"><p style="color:#fff">Click!</p>';

demolished.Compressor.Pngify("tmp/demo.min.js", "entry/spheres.html", html);
