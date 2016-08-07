// Infinite Rainbows
// This code is adapted from Infinite Rainbows,
// a generative animation by [Marius Watz](http://mariuswatz.com/).
// The original Actionscript version was commissioned by
// [POKE](http://pokelondon.com) as part of Good Things Should Never End,
// an online brand experience for Orange UK.

// Marius Watz and Poke have generously given permission
// for this p5.js port started by Daniel Shiffman for use
// on the YouTube channel "Coding Rainbow."

// This work is licensed under a Creative Commons
// Attribution-NonCommercial 4.0 International License
// http://creativecommons.org/licenses/by-nc/4.0/).

// Still in progress!

function ColorPalette() {
  this.num = 0;
  this.c = new Array();
}

ColorPalette.prototype.rgb2hex = function(r, g, b) {
  return '0x' + (r << 16 | g << 8 | b).toString(16);
}

// add a single color entry
ColorPalette.prototype.addCol = function(_col) {
  c[num] = _col;
  num++;
}

ColorPalette.prototype.addRGB = function(r, g, b) {
  addCol(rgb2hex(r, g, b));
}

// add interpolated range of colors
ColorPalette.prototype.addRange = function(numrange, r, g, b, r2, g2, b2) {
  var fract;
  r2 = (r2 - r);
  g2 = (g2 - g);
  b2 = (b2 - b);
  for (var i = 0; i < numrange; i++) {
    fract = i / (numrange - 1);
    fract *= fract;
    addCol(rgb2hex(r + r2 * fract, g + g2 * fract, b + b2 * fract));
  }
}

ColorPalette.prototype.getFract = function(fract) {
  return c[Math.floor(fract * num)];
}

ColorPalette.prototype.getRandom = function() {
  return c[Math.floor(Math.random() * num)];
}
