// Vec2D - simple 2D vector class
// processing.unlekker.net

class orange.lib.Vec2D {
	var x,y,DEG_TO_RAD:Number;

	function Vec2D(_inx,_iny) {
		DEG_TO_RAD=Math.PI/180;
		if(arguments.length==0) {
			x=0;
			y=0;
		}
		else {
			x=_inx;
			y=_iny;
		}
	}

	function setTo(_inx,_iny) {
		if(arguments.length==1) {
			x=_inx.x;
			y=_inx.y;
		}
		else {
			x=_inx;
			y=_iny;
		}
	}

	function addTo(_inx,_iny) {
		if(arguments.length==1) {
			x=_inx.x;
			y=_inx.y;
		}
		else {
			x+=_inx;
			y+=_iny;
		}
	}

	function addDirection(dir,speed) {
		x+=Math.cos(dir*DEG_TO_RAD)*speed;
		y+=Math.sin(dir*DEG_TO_RAD)*speed;
	}

	function setCirclePos(dir,radius) {
		x=Math.cos(dir*DEG_TO_RAD)*radius;
		y=Math.sin(dir*DEG_TO_RAD)*radius;
	}

	function sub(_inx,_iny) {
		x-=_inx;
		y-=_iny;
	}

	function subV(v) {
		x-=v.x;
		y-=v.y;
	}

	function mult(m) {
		x*=m;
		y*=m;
	}

	function div(m) {
		x/=m;
		y/=m;
	}

	function lengthV() {
		return Math.sqrt(x*x+y*y);
	}

	function angle() {
		return Math.atan2(y,x);
	}

	static function findAngle(xd,yd) {
		return Math.atan2(yd,xd);
	}

	function  norm(m:Number) {
		var l=Math.sqrt(x*x+y*y);
		if(l!=0) {
			x/=l;
			y/=l;
		}
		if(m!=undefined) {
			x*=m;
			y*=m;
		}
	}

	function setToTangent(v1,v2) {
		x=-(v2.y-v1.y);
		y=v2.x-v1.x;
		var l=Math.sqrt(x*x+y*y);
		if(l!=0) {
			x/=l;
			y/=l;
		}
	}

	function tangent(v1,v2) {
		return new Vec2D(-y,x);
	}

	function rotate(val) {
		var cosval=Sys.COS(val);
		var sinval=Sys.SIN(val);
		var tmpx=x*cosval - y*sinval;
		var tmpy=x*sinval + y*cosval;

		x=tmpx;
		y=tmpy;
	}

	function toString():String {
		return "["+x+","+y+"]";
	}
}
