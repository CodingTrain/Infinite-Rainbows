// This code is adapted from Rainbows, a commissioned piece,
// originally created by Marius Watz for POKE as part of an
// online brand experience for Orange UK.

// It was also included in MOMA's 2011 "Talk to Me" Exhibition
// https://www.flickr.com/photos/watz/6283617649
// http://moma.org/interactives/exhibitions/2011/talktome/objects/146216/

// Ported to p5.js by Daniel Shiffman


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
