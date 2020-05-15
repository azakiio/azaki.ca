var glove;
var progress = document.getElementById("model");

async function getEmbeddings() {
  const response = await fetch("vectors.zip");
  const reader = response.body.getReader();
  // console.log(+response.headers.get("Content-Length"))
  var contentLength = Math.max(
    +response.headers.get("Content-Length"),
    34870246
  );

  let receivedLength = 0;
  let chunks = [];
  var i = 0;
  while (true) {
    i++;
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;
    progress.value = receivedLength / contentLength / 2;
  }
  var blob = new Blob(chunks);
  const zip = await JSZip.loadAsync(blob);
  const text = await zip
    .file("embeddings.txt")
    .async("string", function updateCallback(metadata) {
      progress.value = 0.5 + metadata.percent / 200
    });
  var dict = {};
  var splitline;
  var word;
  var embedding;
  var lines = text.split(/\r?\n/);
  for (var line of lines) {
    splitline = line.split(" ");
    word = splitline[0];
    embedding = splitline.slice(1).map(Number);
    dict[word] = embedding;
  }
  loaded();
  glove = dict;
}

getEmbeddings();

function loaded() {
  document.getElementById("progress").classList.add("hidden");
  var buttons = document.getElementById("buttons");
  buttons.classList.add("buttons");
  buttons.classList.remove("hidden");

  var input = document.getElementById("input");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      solve();
    }
  });
}

function solve() {
  input = document.getElementById("input").value;
  var output = document.getElementById("output");
  output.innerHTML = "";
  var invalid_flag = false;
  var inputs = input.split(/ (\+|-) /).map(function (item) {
    var temp_item = item.trim().toLowerCase();
    if (!glove[temp_item]) {
      invalid_flag = true;
      output.innerHTML += `<p class="red">Invalid Word: ${temp_item}</p>`;
    } else {
      return temp_item;
    }
  });

  if (invalid_flag) {
    return;
  }

  var final = glove[inputs[0]];
  for (let i = 1; i < inputs.length - 1; i += 2) {
    if (inputs[i] == "+") {
      final = addArr(final, glove[inputs[i + 1]]);
    } else {
      final = subArr(final, glove[inputs[i + 1]]);
    }
  }

  var output = document.getElementById("output");
  var table = ``;
  table = `<table class="table">
  <tr>
    <th>Rank</th>
    <th>Word</th>
    <th>Similarity</th>
  </tr>`;

  var results = closestWord(final, true);

  var i = 1;
  for (var row of results) {
    if (i > 10) break;
    if (inputs.includes(row[0])) continue;
    table += `
    <tr>
      <td>${i++}</td>
      <td>${row[0]}</td>
      <td>${(row[1] * 100).toFixed(2)}%</td>
    </tr>`;
  }
  table += `</table>`;

  output.innerHTML = table;
}

function sim(A, B) {
  var dotproduct = 0;
  var mA = 0;
  var mB = 0;
  for (i = 0; i < A.length; i++) {
    dotproduct += A[i] * B[i];
    mA += A[i] * A[i];
    mB += B[i] * B[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  var similarity = dotproduct / (mA * mB);
  return similarity;
  // return 1 - Math.acos(similarity) / Math.PI;
}

function dist(A, B) {
  var sum = 0;
  for (i = 0; i < A.length; i++) {
    sum += (A[i] - B[i]) ** 2;
  }

  return Math.sqrt(sum);
}

function closestWord(vec, cosine = true) {
  values = {};
  for (var key of Object.keys(glove)) {
    if (cosine) {
      values[key] = sim(vec, glove[key]);
    } else {
      values[key] = dist(vec, glove[key]);
    }
  }

  var items = Object.keys(glove).map(function (key) {
    return [key, values[key]];
  });

  items.sort(function (a, b) {
    if (cosine) {
      return b[1] - a[1];
    } else {
      return a[1] - b[1];
    }
  });

  return items.slice(0, 20);
}

function addArr(A, B) {
  result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = A[i] + B[i];
  }
  return result;
}

function subArr(A, B) {
  result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = A[i] - B[i];
  }
  return result;
}
