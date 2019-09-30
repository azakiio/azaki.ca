function solve() {


  //var result = this.responseText.split(" ");
  var puzzle = document.getElementById("puzzle");
  var data = "";
  for (var index = 0; index < 81; index++) {
    var row = Math.floor(index / 9);
    var col = index % 9;
    data += (puzzle.rows[row].cells[col].children[0].value != "") ? puzzle.rows[row].cells[col].children[0].value : "0";
  }

  var xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      var result = this.responseText.split(" ");
      if (result.length != 82) {
        document.getElementById("error").innerHTML += "Sudoku is invalid. Please confirm input<br>"
        return;
      }
      var table = document.getElementById("puzzle");
      for (var index = 0; index < 81; index++) {
        var row = Math.floor(index / 9);
        var col = index % 9;
        table.rows[row].cells[col].children[0].value = result[index];
      }
      document.getElementById("error").innerHTML = "";



    }
  });


  xhr.open("POST", "https://us-central1-azakica.cloudfunctions.net/sudoku");
  xhr.setRequestHeader("Content-Type", "text/plain");

  xhr.send(data);
}


function giveExample() {
  var table = document.getElementById("puzzle");
  example = [[0,0,1],[0,3,5],[0,4,7],[0,6,3],[1,6,5],[1,7,7],[2,0,6],[2,4,9],[2,8,8],[3,7,4],[3,8,1],[4,3,6],[4,5,3],[5,0,7],[5,1,2],[5,2,8],[6,1,9],[6,3,2],[6,5,6],[7,5,1],[7,6,2],[7,8,3],[8,0,3],[8,1,5],[8,2,2],[8,6,9]]
  
  for (let clue of example){
    table.rows[clue[0]].cells[clue[1]].children[0].value = clue[2];
  }
}