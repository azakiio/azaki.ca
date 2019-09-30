// kynd.info 2014
function Ball(r, p, v) {
	this.radius = r;
	this.point = p;
	this.vector = v;
	this.maxVec = 1;
	this.numSegment = Math.floor(r / 3 + 2);
	this.boundOffset = [];
	this.boundOffsetBuff = [];
	this.sidePoints = [];
	this.path = new Path({
		fillColor: {
			hue: Math.random() * 220,
			saturation: 1,
			brightness: 1
		},
		blendMode: 'lighter'
	});


	for (var i = 0; i < this.numSegment; i++) {
		this.boundOffset.push(this.radius);
		this.boundOffsetBuff.push(this.radius);
		this.path.add(new Point());
		this.sidePoints.push(new Point({
			angle: 360 / this.numSegment * i,
			length: 1
		}));
	}

}

Ball.prototype = {
	iterate: function () {
		this.checkBorders();
		if (this.vector.length > this.maxVec)
			this.vector.length = this.maxVec;
		this.point += this.vector;
		this.updateShape();
	},

	checkBorders: function () {
		var size = view.size;
		if (this.point.x < this.radius)
			this.vector.angle = (180 + this.vector.angle) * -1
		if (this.point.x > size.width - this.radius)
			this.vector.angle = (180 + this.vector.angle) * -1
		if (this.point.y < this.radius)
			this.vector.angle = -this.vector.angle;
		if (this.point.y > size.height - this.radius)
			this.vector.angle = -this.vector.angle;
	},

	updateShape: function () {
		var segments = this.path.segments;
		for (var i = 0; i < this.numSegment; i++)
			segments[i].point = this.getSidePoint(i);

		this.path.smooth();
		for (var i = 0; i < this.numSegment; i++) {
			if (this.boundOffset[i] < this.radius / 4)
				this.boundOffset[i] = this.radius / 4;
			var next = (i + 1) % this.numSegment;
			var prev = (i > 0) ? i - 1 : this.numSegment - 1;
			var offset = this.boundOffset[i];
			offset += (this.radius - offset) / 15;
			offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
			this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
		}
	},

	react: function (b) {
		var dist = this.point.getDistance(b.point);
		if (dist < this.radius + b.radius && dist != 0) {
			var overlap = this.radius + b.radius - dist;
			var direc = (this.point - b.point).normalize(overlap * 0.015);
			this.vector += direc;
			b.vector -= direc;

			this.calcBounds(b);
			b.calcBounds(this);
			this.updateBounds();
			b.updateBounds();
		}
	},

	getBoundOffset: function (b) {
		var diff = this.point - b;
		var angle = (diff.angle + 180) % 360;
		return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
	},

	calcBounds: function (b) {
		for (var i = 0; i < this.numSegment; i++) {
			var tp = this.getSidePoint(i);
			var bLen = b.getBoundOffset(tp);
			var td = tp.getDistance(b.point);
			if (td < bLen) {
				this.boundOffsetBuff[i] -= (bLen - td) / 2;
			}
		}
	},

	getSidePoint: function (index) {
		return this.point + this.sidePoints[index] * this.boundOffset[index];
	},

	updateBounds: function () {
		for (var i = 0; i < this.numSegment; i++)
			this.boundOffset[i] = this.boundOffsetBuff[i];
	}
};

//--------------------- main ---------------------

var balls = [];

// ADD AN ARRAY TO HOLD SOME RASTERS
var texts =[]
var names = ["CalcSolver", "SudokuSolver", "DollarGame", "FlappyCircle"];
var links = ["/calcsolver/index.html", "/sudokusolver/index.html", "/dollargame/index.html", "/flappycircle/index.html"]

var numBalls = 4;
for (var i = 0; i < numBalls; i++) {
	var radius = Math.random() * 60 + 60;
	var position = Point.random() * (view.size - 2*radius) + radius;
	var vector = new Point({
		angle: 360 * Math.random(),
		length: Math.random() * 1
	});
	
	balls.push(new Ball(radius, position, vector));

	// ADD RASTERS AND CLIP TO EACH "BALL"

	var text = new PointText({
		content: names[i],
		fillColor: 'Black',
		fontFamily: 'Rubik',
		fontWeight: 'bold',
		fontSize: radius/3.5
	});
	texts.push(text)
}

function onFrame() {
	for (var i = 0; i < balls.length - 1; i++) {
		for (var j = i + 1; j < balls.length; j++) {
			balls[i].react(balls[j]);
		}
	}
	for (var i = 0, l = balls.length; i < l; i++) {
		balls[i].iterate();
		balls[i].path.onMouseEnter = function () {
			view.element.style.cursor = "pointer";
		}
		balls[i].path.onMouseLeave = function () {
			view.element.style.cursor = "default";
		}
		texts[i].position = balls[i].path.position;
	}
}

balls[0].path.onClick = function () {
	window.open(links[0], "_self")
}
balls[1].path.onClick = function () {
	window.open(links[1], "_self")
}
balls[2].path.onClick = function () {
	window.open(links[2], "_self")
}
balls[3].path.onClick = function () {
	window.open(links[3], "_self")
}
texts[0].onClick = function () {
	window.open(links[0], "_self")
}
texts[1].onClick = function () {
	window.open(links[1], "_self")
}
texts[2].onClick = function () {
	window.open(links[2], "_self")
}
texts[3].onClick = function () {
	window.open(links[3], "_self")
}
