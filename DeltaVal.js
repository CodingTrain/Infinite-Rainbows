function DeltaVal() {
  // var val, maxVal, minVal, maxD, maxDiff;
  // var nudgeCnt, nudgeDir;
  //
  // var doInterpolate;
  // var interD, interCnt, interStart, interGoal;
}

DeltaVal.prototype.setTo = function(_val, _min, _max, _maxD, _maxDiff) {
  this.doInterpolate = false;

  this.val = _val;
  this.maxVal = _max;
  this.minVal = _min;
  this.maxD = _maxD;
  this.maxDiff = _maxDiff;
  this.D = Math.random() * this.maxD - this.maxD / 2;
}

DeltaVal.prototype.nudge = function(_nudgeDir) {
  this.nudgeCnt = 10;
  this.nudgeDir = _nudgeDir;
}

DeltaVal.prototype.update = function() {
  if (this.nudgeCnt > 0) {
    this.nudgeCnt--;
    this.D += this.maxD * 5 * this.nudgeDir;
  } else {
    if (this.val < this.minVal) this.D += Math.abs(this.maxDiff);
    else if (this.val > this.maxVal) this.D -= Math.abs(this.maxDiff);
    else this.D += Math.random() * (this.maxDiff * 2) - this.maxDiff;
  }

  if (this.D > this.maxD) this.D = this.maxD;
  else if (this.D < -this.maxD) this.D = -this.maxD;

  this.val += this.D;
  if (this.maxVal >= 0 && this.val > this.maxVal * 1.25) this.val = this.maxVal * 1.25;
  else if (this.maxVal < 0 && this.val < this.maxVal * 1.25) this.val = this.maxVal * 1.25;
  else if (this.minVal >= 0 && this.val < this.minVal * 0.75) this.val = this.minVal * 0.75;
  else if (this.minVal < 0 && this.val < this.minVal * 1.25) this.val = this.minVal * 1.25;
}

DeltaVal.prototype.reverseDir = function() {
  trace("reverseDir " + D);
  D += -D * 0.2;
}

DeltaVal.prototype.mult = function(m) {
  val *= m;
  maxVal *= m;
  minVal *= m;
  maxD *= m;
  maxDiff *= m;
  D *= m;
}
