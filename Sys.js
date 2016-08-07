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

import orange.lib.*;

class orange.lib.Sys {
	public static var rndSeed:Number=-1;
	public static var MITER:String="miter";
	public static var ROUND:String="round";
	public static var BEVEL:String="bevel";
	public static var SQUARE:String="square";
	public static var NONE:String="none";
	public static var NORMAL:String="normal";

	public static var PI = Math.PI;
	public static var HALF_PI:Number= PI / 2.0;
	public static var THIRD_PI:Number= PI / 3.0;
	public static var QUARTER_PI:Number= PI / 4.0;
	public static var TWO_PI:Number= PI * 2.0;
	public static var SINCOS_PRECISION:Number=0.1;
	public static var SINCOS_LENGTH:Number=(360/SINCOS_PRECISION);
	public static var DEG_TO_RAD:Number = PI/180.0;
	public static var RAD_TO_DEG:Number = 180.0/PI;
	public static var cosLUT,sinLUT:Array;

	var mc:MovieClip;
	var col:ColorPalette;
	var tmpbez:Array;

	var strokeMiter,strokeScale,strokeCaps,strokeW,strokeC;
	static var width,height;

	public static var rbcol:Array;

	function Sys(_mc) {
		mc=_mc;
		col=new ColorPalette();

		strokeMiter=ROUND;
		strokeScale=NORMAL;
		strokeCaps=ROUND;
		strokeW=1;
		strokeC=0;
	}

	public static function initLUT() {
		SINCOS_PRECISION=0.1;
		SINCOS_LENGTH=Math.floor(360/SINCOS_PRECISION);
		// Init AppConstants

		sinLUT=new Array();
		cosLUT=new Array();
		for (var i=0; i<SINCOS_LENGTH; i++) {
			sinLUT[i]= Math.sin(i*DEG_TO_RAD*SINCOS_PRECISION);
			cosLUT[i]= Math.cos(i*DEG_TO_RAD*SINCOS_PRECISION);
//			out(" "+i+" "+sinLUT[i]+","+cosLUT[i]);
	   }

	   width=Stage.width;
	   height=Stage.height;

		if(rbcol==null) {
			rbcol=new Array();
			rbcol[0]=0xfd000b;
			rbcol[1]=0xff6915;
			rbcol[2]=0xfeed01;
			rbcol[3]=0x5fc42a;
			rbcol[4]=0x007ed3;
			rbcol[5]=0x530268;

		 	// updated
			rbcol[0]=0xff4316;
			rbcol[1]=0xff7900;
			rbcol[2]=0xffde00;
			rbcol[3]=0x16cc93;
			rbcol[4]=0x158acd;
			rbcol[5]=0xaf61db;
		}
	}

	public static function SIN(deg:Number):Number {
		if(!(deg<360)) deg=deg%360;
		else if(deg<0) deg=360-(Math.abs(deg)%360);
		deg/=SINCOS_PRECISION;
		return sinLUT[Math.floor(deg)];
	}

	public static function COS(deg:Number):Number {
		if(!(deg<360)) deg=deg%360;
		else if(deg<0) deg=360-(Math.abs(deg)%360);
		deg/=SINCOS_PRECISION;
		return cosLUT[Math.floor(deg)];
	}


	/////////////////////////////////////////////////////
	// drawing functions

	function ellipse (x, y, radius, yRadius) {
		// init variables
		var theta,theta2, xrCtrl, yrCtrl, angle, angleMid, px, py, cx, cy;
		// if only yRadius is undefined, yRadius = radius
		if (yRadius == undefined) yRadius = radius;

		// covert 45 degrees to radians for our calculations
		theta = 45;
		theta2 = 22.5;

		// calculate the distance for the control point
		xrCtrl = radius/COS(theta2);
		yrCtrl = yRadius/COS(theta2);
		// start on the right side of the circle
		angle = 0;
		mc.moveTo(x+radius, y);
		// this loop draws the circle in 8 segments
		for (var i = 0; i<8; i++) {
			// increment our angles
			angle += theta;
			angleMid = angle-(theta2);
			if(angle==360) angle=0;

			// calculate our control point
			cx = x+COS(angleMid)*xrCtrl;
			cy = y+SIN(angleMid)*yrCtrl;
			// calculate our end point
			px = x+COS(angle)*radius;
			py = y+SIN(angle)*yRadius;
			// draw the circle segment
			mc.curveTo(cx, cy, px, py);
		}
	};

	function drawArc (x, y, startAngle,arc, radius) {

		// Init vars
		var theta, angle, angleMid, segs, ax, ay, bx, by, cx, cy;

		arc-=startAngle;

		// no sense in drawing more than is needed :)
		if (Math.abs(arc)>360) arc = 360;

		// Flash uses 8 segments per circle, to match that, we draw in a maximum
		// of 45 degree segments. First we calculate how many segments are needed
		// for our arc.
		segs = Math.ceil(Math.abs(arc)/45);
		// Now calculate the sweep of each segment

		theta=(arc/segs);
		angle=startAngle;


		// find our starting points (ax,ay) relative to the secified x,y
		//mc.moveTo(x,y);
		ax = x-COS(angle)*radius;
		ay = y-SIN(angle)*radius;
		// if our arc is larger than 45 degrees, draw as 45 degree segments
		// so that we match Flash's native circle routines.

		if (segs>0) {
			// Loop for drawing arc segments
			for (var i = 0; i<segs; i++) {
				// increment our angle
				angle += theta;

				// find the angle halfway between the last angle and the new
				angleMid = angle-(theta/2);
				// calculate our end point
				bx = ax+COS(angle)*radius;
				by = ay+SIN(angle)*radius;
				// calculate our control point
				cx = ax+COS(angleMid)*(radius/COS(theta/2));
				cy = ay+SIN(angleMid)*(radius/COS(theta/2));
				// draw the arc segment

				mc.curveTo(cx, cy, bx, by);
			}
		}
		// In the native draw methods the user must specify the end point
		// which means that they always know where they are ending at, but
		// here the endpoint is unknown unless the user calculates it on their
		// own. Lets be nice and let save them the hassle by passing it back.
		return {x:bx, y:by};
	};

	function rect(x, y, w, h) {
		mc.moveTo(x, y);
		mc.lineTo(x+w, y);
		mc.lineTo(x+w, y+h);
		mc.lineTo(x, y+h);
		mc.lineTo(x, y);
	}

	function bezier(x1,y1,x2,y2,x3,y3,x4,y4) {
		if(arguments.length==4) // args are Vec2D
			CubicBezier.drawBezierMidpoint(mc,x1,y1,x2,y2);
		else if(arguments.length==8){
			if(tmpbez==null) {
				tmpbez=new Array();
				for(var i=0; i<4; i++) tmpbez[i]=new Vec2D();
			}
			tmpbez[0].setTo(x1,y1);
			tmpbez[1].setTo(x2,y2);
			tmpbez[2].setTo(x3,y3);
			tmpbez[3].setTo(x4,y4);
			CubicBezier.drawBezierMidpoint(
				mc,tmpbez[0],tmpbez[1],tmpbez[2],tmpbez[3]);
		}
	}

	function beziers(intPoints) {
		CubicBezier.drawBeziers(mc, intPoints);
	}


	/////////////////////////////////////////////////////
	// update & init functions


	function draw() {
	}

	function clear() {
		mc.clear();
	}

	function update() {
	}

	function reinit() {
	}

	function hide() {
		mc._visible=false;
	}

	function show() {
		mc._visible=true;
	}


	public static function out(str:String) {
		//trace("a "+str);
	}

	public function mousePressed() {

	}

	/////////////////////////////////////////////////////
	// random number functions

	public static function rndSetSeed(_seed) {
		if(_seed==undefined) {
			var d:Date= new Date();
			_seed=d.getMilliseconds();
		}

		rndSeed=_seed;
		rndF(100);
	}

	public static function rndBool():Boolean {
		var val:Number;
		rndSeed = (rndSeed * 16807) % 2147483647;
		val = (rndSeed/2147483647)*100;
		return val>50;
	}

	public static function rndProb(prob:Number):Boolean {
		var val:Number;
		rndSeed = (rndSeed * 16807) % 2147483647;
		val = (rndSeed/2147483647)*100;
		return val>prob;
	}

	public static function rndI(min:Number,max:Number):Number {
		var val:Number;
		rndSeed = (rndSeed * 16807) % 2147483647;
		val = (rndSeed/2147483647);
		if(max==undefined) return Math.floor(val*min);
		return Math.floor(val*(max-min)+min);
	}

	public static function rndF(min:Number,max:Number):Number {
		var val:Number;
		rndSeed = (rndSeed * 16807) % 2147483647;
		val = (rndSeed/2147483647);
		if(max==undefined) return val*min;
		return val*(max-min)+min;
	}

	/////////////////////////////////////////////////////
	// graphic functions

	function fill(c,a) {
		if(a==undefined) mc.beginFill(c);
		else mc.beginFill(c,a);
	}

	function fillRGB(_r:Number,_g:Number,_b:Number){
		mc.beginFill(_r << 16 | _g << 8 | _b);
	}

	function fillRGBA(_r,_g,_b,_a:Number){
		mc.beginFill(_r << 16 | _g << 8 | _b, _a);
	}

	function stroke(_c,_w,_miter,_scale,_caps:String) {
		if(arguments.length>0) strokeC=_c;
		strokeW=_w;
		if(arguments.length>2) strokeMiter=_miter;
		if(arguments.length>3) strokeScale=_scale;
		if(arguments.length>4) strokeCaps=_caps;

		mc.lineStyle(strokeW, strokeC, 100, false,
			strokeScale, strokeCaps, strokeMiter, 4);
	}

	function noStroke() {
		mc.lineStyle(undefined,strokeC, 100, false,
			strokeScale, strokeCaps, strokeMiter, 4);
	}

	function endFill() {
		mc.endFill();
	}

	function rgb2hex(r,g,b:Number){
		return (r << 16 | g << 8 | b);
	}

	public function translate(_x,_y:Number) {
		mc._x+=_x;
		mc._y+=_y;
	}

	public function translateAbs(_px,_py:Number) {
		mc._x=_px;
		mc._y=_py;
	}

	public function scale(_mult:Number) {
		mc._xscale*=_mult;
		mc._yscale*=_mult
	}

	public function scaleAbs(_xs,_ys:Number) {
		mc._xscale=_xs;
		mc._yscale=_ys;
	}

	public function rotate(_rot:Number) {
		mc._rotation+=_rot;
	}

	public function rotateAbs(_rot:Number) {
		mc._rotation=_rot;
	}


}
