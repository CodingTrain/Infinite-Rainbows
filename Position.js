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

// function Position {
// 	var OSCILLATE=0;
//   var AVOID=1;
// 	var APPROACH=2;
//
// 	var p,pOld,tan,dirV:Vec2D;
//
// 	var speed,dirD:DeltaVal;
// 	var dir,dirGoal,speedSpan,vel,newvel:Number;
// 	var distTravelled:Number;
//
// 	var w,wD,wMax,wMin:Number;
// 	var minY,maxY:Number;
//
// 	var birthCnt,dieCnt,dieT,dieD:Number;
// 	var dead:Boolean;
//
// 	var isAvoiding:Boolean;
// 	var avoidSpeed:Number;
// 	var goalX,goalY:Number;
//
// 	private var _id:Number;

function Position(id) {
  this._id = id;
  //trace("Position("+id+")");
  this.p = new createVector();
  this.pOld = new createVector();
  this.tan = new createVector();
  this.dirV = new createVector();
  this.speed = new DeltaVal();
  this.dirD = new DeltaVal();

  this.wMax = 10;
  this.wMin = 1;
}

Position.prototype.setSpeed = function(min, max) {
  this.speedSpan = max - min;
  this.speed.setTo(min + this.speedSpan * 0.25, min, max,
    this.speedSpan / 100, this.speedSpan / 1000);
  this.speed.D = this.speed.maxD;
}

Position.prototype.setCurvature = function(maxrot) {
  this.dirD.setTo(0, -maxrot, maxrot, maxrot / 50, maxrot / 500);
}

Position.prototype.setPosition = function(x, y) {
  this.minY = y - height * 0.5;
  this.maxY = y + height * 0.5;
  this.p.setTo(x, y);
}


Position.prototype.reinit = function(px, py, minspeed, maxspeed, maxrot) {
  //trace("a Pos reinit");
  this.p.set(px, py);

  this.dir = rndF(360);
  this.isAvoiding = false;

  this.setSpeed(minspeed, maxspeed);
  this.setCurvature(maxrot);

  this.vel = 0;
  this.distTravelled = 0;
  this.birthCnt = rndI(30, 50);
  this.dieT = 0;
  this.dieD = 1 / this.birthCnt;
  this.w = 0;
  this.wD = 0;
  this.dead = false;
}

Position.prototype.updateOldPoint = function() {
  this.pOld.set(this.p.x, this.p.y);
}

Position.prototype.die = function() {
  //trace("a die");
  this.dieCnt = 80;
  this.dieT = 0;
  this.dieD = 1 / dieCnt;
}

Position.prototype.update = function() {
  this.speed.update();

  // if not already avoiding, check edge
  if (!this.isAvoiding) {
    if ((this.p.x + this.dirV.x < 0) ||
      (this.p.x + this.dirV.x > 970) ||
      (this.p.y + this.dirV.y > maxY) ||
      (this.p.y + this.dirV.y < minY)) {
      this.goalX = width / 2 + rndF(-200, 100);
      this.goalY = (this.minY + this.maxY) / 2 + rndF(-200, 100);
      this.isAvoiding = true;
      this.avoidSpeed = 0;
    }
  }

  // if avoiding, calculate goal direction and move towards it
  if (this.isAvoiding) {
    // check to see if we can stop
    if ((this.p.x + this.dirV.x > 0) && (this.p.x + this.dirV.x < 970) &&
      (this.p.y + this.dirV.y < this.maxY) && (this.p.y + this.dirV.y > this.minY)) {
      this.isAvoiding = false;
      //trace("a stop avoiding");
    } else {
      this.dirGoal = Math.atan2(this.goalY - this.p.y, this.goalX - this.p.x) * RAD_TO_DEG;
      //if(avoidSpeed==0) trace("a dirGoal "+dirGoal+" dir "+(dir));
      this.dirGoal = this.dirGoal - this.dir;
      if (this.dirGoal > 180) dirGoal -= 360;
      else if (this.dirGoal < -180) dirGoal += 360;

      if (this.avoidSpeed < 1) this.avoidSpeed = this.avoidSpeed + 0.025;
      this.dirD.val += this.dirGoal * this.avoidSpeed * this.avoidSpeed * 0.02;
      if (this.dirGoal < 0) this.dirD.nudge(-1);
      else this.dirD.nudge(1);
    }
  }

  this.dirD.update();

  this.dir += this.dirD.val;
  if (this.dir > 360) this.dir -= 360;
  else if (this.dir < 0) this.dir = this.dir + 360;

  this.dirV.set(COS(this.dir), SIN(this.dir));
  this.p.add(this.dirV.x * this.speed.val, this.dirV.y * this.speed.val);
  this.tan.setToTangent(this.pOld, this.p);
  this.dirV.mult(200);

  this.distTravelled = this.distTravelled + this.speed.val;


  this.newvel = (this.speed.val - this.speed.minVal) / this.speedSpan;
  this.newvel = this.newvel * this.newvel;
  this.vel = this.vel * 0.9 + this.newvel * 0.1;
  var neww = (this.vel + 0.02) * this.wMax + this.wMin;

  if (this.birthCnt > 0) {
    this.dieT += this.dieD;
    this.wD = (this.neww - this.w) * 0.05 * this.dieT;
    this.birthCnt--;
  } else if (this.dieCnt > 0) {
    this.dieT += this.dieD;
    this.wD += (1 - this.w) * 0.008 * this.dieT * this.dieT * this.dieT;
    this.dieCnt--;
    if (this.dieCnt < 1) {
      //ViewRainbowManager.getInstance().onRainbowPositionDead(_id);
      //trace("a dead ");
      this.dead = true;
    }
    //			trace("a "+dieCnt+" - "+w+" "+wD);
  } else {
    this.wD = (this.neww - this.w) * 0.05;
  }
  this.w += this.wD;
  if (this.w < 0.1) this.w = 0.1;
}
