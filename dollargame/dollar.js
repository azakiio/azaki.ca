var vertexin, edgein, diffin, canundo;
var undobutton;
var totalmoney, goodmoney;
var allcons = [];
var vertexcount = 10;
var edgecount = 20;
if (edgecount > vertexcount * (vertexcount - 1) * 0.5) {
  edgecount = vertexcount * (vertexcount - 1) * 0.5;
} else if (edgecount < vertexcount - 1) {
  edgecount = vertexcount - 1;
}

var genus = edgecount - vertexcount + 1;
var difficulty = 0; //0 is hardest 4 is easiest
var money = [];

var circles = [];
var moves = 0;



function setup() {
  var canvas = createCanvas(700, 700);
  canvas.parent("game");
  // canvas.style("visibility", "visible")
  
  background(0);

  htmlstuff();
  doMoney();
  doConnects();



  first();



}

function draw() {
  background(0);
  doLines();
  stroke(0)
  for (var c of circles) {
    c.show();
  }
  hovering();
  push()
  textSize(40)
  fill(255)
  textAlign(RIGHT,TOP)
  text('moves: ' + moves, width-10, 5)
  pop()



}

function mousePressed() {
  if (mouseButton === LEFT) {
    for (var c of circles) {
      if (dist(mouseX, mouseY, c.x, c.y) <= c.r) {
        c.update();
        canundo = c;
        moves++;
        for (var cprime of c.connectedto) {
          circles[cprime].value++;
        }
        break;
      }
    }
  }
}



function hovering() {
  var touching = false;
  for (var c of circles) {
    if (dist(mouseX, mouseY, c.x, c.y) <= c.r) {
      touching = true;
      c.hover();
      for (var cprime of c.connectedto) {
        circles[cprime].hover();
      }
    }
  }
  if (!touching) {
    for (c of circles) {
      c.nohover();
    }
  }
}

function first() {
  var count = 0;
  while (circles.length < vertexcount) {
    var overlap = false;
    var circle = new Circle();

    for (var c of circles) {
      if (dist(circle.x, circle.y, c.x, c.y) < circle.r + c.r + 45) {
        overlap = true;
        break;
      }
    }
    if (!overlap) {
      circle.value = money[count];
      circle.id = count;
      count++;
      circles.push(circle);
      circle.show();
    }
  }

  for (var truecon of allcons) {
    if (truecon.connected == true) {
      circles[truecon.src].connectedto.push(truecon.dst);
      circles[truecon.dst].connectedto.push(truecon.src);
    }
  }


}

function doMoney() {


  //setting up money
  totalmoney = Math.floor(random(genus, genus + difficulty * 5));

  goodmoney = false;

  while (!goodmoney) {
    tempmoney = totalmoney;
    for (var i = vertexcount - 1; i > 0; i--) {
      money[i] = Math.floor(random(-10, 11));
      tempmoney -= money[i];
    }
    if (abs(tempmoney) < 10) {
      money[0] = tempmoney;
      goodmoney = true;
    }
  }
}

function doConnects() {

  //initialize connections
  for (var i = 0; i < vertexcount - 1; i++) {
    for (var j = i + 1; j < vertexcount; j++) {
      var connection = {
        src: i,
        dst: j,
        connected: false
      };
      allcons.push(connection);
    }
  }


  //make sure each node is connected to the set
  var taken = new Set();
  testcons = allcons;
  while (taken.size != vertexcount) {

    chosen = random(testcons);
    //console.log(testcons);

    chosen.connected = true;
    taken.add(chosen.src);
    taken.add(chosen.dst);
    testcons = testcons.filter(element => ((taken.has(element.src) && !taken.has(element.dst)) || (!taken.has(element.src) && taken.has(element.dst))));

  }

  //make any other connections
  var k = 0;
  while (k < genus) {
    chosen = random(allcons);
    if (chosen.connected == true) {
      continue;
    } else {
      chosen.connected = true;
      k++;
    }
  }
}

function doLines() {
  stroke(200)
  for (var c of circles) {
    for (var value of c.connectedto) {
      line(c.x, c.y, circles[value].x, circles[value].y)
    }
  }
}

function undo() {
  if (canundo != null) {
    canundo.value += canundo.connectedto.length;
    for (var cprime of canundo.connectedto) {
      circles[cprime].value--;
    }
    canundo = null;
  }
}

function htmlstuff() {

  //undo button
  undobutton = createButton('undo');
  undobutton.position(10, 10)
  undobutton.parent("game"); 
  undobutton.mousePressed(undo);
  undobutton.addClass("form_btn red_btn")

  //moves tracker
}
