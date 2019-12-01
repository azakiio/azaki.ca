function solve() {

  var link = document.getElementById("link").value;
  var xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      var stats = this.responseText.split(" ")
      var matchup = document.getElementById('matchup')
      var table = document.getElementById('stats')
      document.getElementById('output').style.display = "block"
      matchup.innerHTML = stats[0] + " VS " + stats[1]

      table.rows[0].cells[0].innerHTML = "Model's Prediction<br>" + (parseFloat(stats[2])*100).toFixed(2) + "%"
      table.rows[0].cells[2].innerHTML = "Model's Prediction<br>" + (parseFloat(stats[3])*100).toFixed(2) + "%"
      table.rows[1].cells[0].innerHTML = "Betting Odds<br>" + stats[4]
      table.rows[1].cells[2].innerHTML = "Betting Odds<br>" + stats[5]
      table.rows[2].cells[0].innerHTML = "% Implied by Odds<br>" + (100/parseFloat(stats[4])).toFixed(2) + "%"
      table.rows[2].cells[2].innerHTML = "% Implied by Odds<br>" + (100/parseFloat(stats[5])).toFixed(2) + "%"
      
      var k1 = 100 * ((parseFloat(stats[4]) - 1) * parseFloat(stats[2]) - parseFloat(stats[3]))/(parseFloat(stats[4]) - 1)
      var k2 = 100 * ((parseFloat(stats[5]) - 1) * parseFloat(stats[3]) - parseFloat(stats[2]))/(parseFloat(stats[5]) - 1)

      if (k1 < 1 && k2 < 1){
        table.rows[1].cells[1].innerHTML = "<b>Skip</b>"
      }
      else if (k1 > 0){
        table.rows[1].cells[1].innerHTML = "Bet <b>" + (k1/2).toFixed() + "%</b> on <b>" + stats[0] + "</b>"
      }
      else if (k2 > 0){
        table.rows[1].cells[1].innerHTML = "Bet <b>" + (k2/2).toFixed() + "%</b> on <b>" + stats[1] + "</b>"
      }

    }
  });

  xhr.open("GET", "https://us-central1-azakica.cloudfunctions.net/csgo_predict?match=" + link);

  xhr.send();
}