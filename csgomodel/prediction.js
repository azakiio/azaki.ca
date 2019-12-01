function solve() {

  var link = document.getElementById("link").value;

  var data = "{\"match\":\"https://www.hltv.org/matches/2337794/liquid-vs-fnatic-ecs-season-8-finals\"}";

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      console.log(this.responseText);
    }
  });
  
  xhr.open("POST", "https://us-central1-azakica.cloudfunctions.net/csgo_predict");
  xhr.setRequestHeader("Content-Type", "application/json");
  
  xhr.send(data);
}