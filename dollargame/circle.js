function Circle() {
  this.id;
  this.r = 50;
  this.x = round(random(this.r + this.r/2, width - this.r - this.r/2));
  this.y = round(random(this.r + this.r/2, height - this.r - this.r/2));
  this.value;

  this.connectedto = [];
  this.txtsize = 30;
  this.outline = color(0);



  this.show = function() {
    if (this.value >= 0) {
      fill(0, 191, 111)
    } else {
      fill(175, 0, 0)
    }


    push();
    stroke(this.outline);
    strokeWeight(2)
    ellipse(this.x, this.y, 2 * this.r);
    fill(255);
    stroke(0)
    textSize(this.txtsize);
    textAlign(CENTER, CENTER);
    text(this.value, this.x, this.y);
    pop();
  }

  this.update = function() {
    this.value = this.value - this.connectedto.length;
  }

  this.hover = function() {
    if (this.r == 50) {

      this.r *= 1.5;
      this.txtsize = 35;
      this.outline = color(255);
    }
  }

  this.nohover = function() {
    this.r = 50;
    this.txtsize = 30;
    this.outline = color(0);
  }

}
