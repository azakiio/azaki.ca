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