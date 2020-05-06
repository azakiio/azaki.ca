colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b"]

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
		fillColor: colors[Math.floor(Math.random() * colors.length)],
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
var texts = [];
var names = ["Calc\nSolver", "Sudoku\nSolver", "Dollar\nGame", "Flappy\nBird", "CS:GO\nPredictor", "WordPlay"];
var links = ["/calcsolver/", "/sudokusolver/", "/dollargame/", "/flappybird/", "/csgomodel/", "/wordplay/"];

var numBalls = 5;
for (var i = 0; i < numBalls; i++) {
	factor = Math.min(Math.max(view.size._width, view.size._height) / 15, 60)
	var radius = Math.random() * factor + factor;
	var position = Point.random() * (view.size - 2 * radius) + radius;
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
		fontSize: 10 + radius / 6,
		justification: 'center'
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
		texts[i].onMouseEnter = function () {
			view.element.style.cursor = "pointer";
		}
	}
}

function onResize() {
	for (var i = 0; i < balls.length; i++) {
		factor = Math.min(Math.max(view.size._width, view.size._height) / 17, 60)
		balls[i].radius = Math.random() * factor + factor;
		balls[i].point = Point.random() * (view.size - 2 * balls[i].radius) + balls[i].radius;
		texts[i].fontSize = 12 + balls[i].radius / 6
	}
}

function openLinks(i){
	return function() {
		window.open(links[i], "_self")
	};
}

for (var i = 0, l = balls.length; i < l; i++) {
	balls[i].path.onClick = openLinks(i);
	texts[i].onClick = openLinks(i);
}