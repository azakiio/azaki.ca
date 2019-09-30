var bird;
var pipes = [];
var score = 0;
var highscore = 0;

function preload() {
  // Get the most recent earthquake in the database
}

function setup() {
  var canvas = createCanvas(1000, 480);
  var highscores = loadTable('mdko.csv', 'csv');
  //alert('Press \'space\' or press the mouse to jump\nspeed increases over time');
  canvas.parent('sketch');
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  background(0);

  text('Score = ' + score, 20, 20);
  text('HighScore = ' + highscore, 20, 40);
  //text('HighScore = ' + highscores.get(0,0), 20, 40);

  score += 1;
  speed += 1 / 60;

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    if (pipes[i].hits(bird) && score > 10) {
      resetSketch();
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  bird.update();
  bird.show();

  if (score % 50 == 0 && score != 0) {
    pipes.push(new Pipe());
  }
}

function resetSketch() {
  bird = new Bird();
  if (score > highscore) {
    highscore = score;
  }
  document.getElementById("hs").placeholder = highscore;
  score = 0;
  speed = 5;
}

function keyPressed() {
  if (key == ' ') {
    bird.up();
    //speed += 1;
    //console.log("SPACE");
  }
}

function mousePressed() {
  bird.up();
}

function writescore() {

  var formInfo = document.forms['info'];

  var name = formInfo.elements["name"].value;
  var last = highscore;

  alert(name + ' ' + last);

}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable2");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

// function insertTable() {
//   var table = document.getElementById("scores");
//     for (var r = 0; r < highscores.getRowCount(); r++) {
//     var row = table.insertRow(0);
//     var left = row.insertCell(0);
//     var right = row.insertCell(1);
//     left.innerHTML = highscores.getString(r, 0);
//     right.innerHTML = highscores.getNum(r, 1);
//   }
// }
