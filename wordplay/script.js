var glove;
var progress = document.getElementById("model")

async function getEmbeddings() {
  const response = await fetch('embeddings.zip');
  const reader = response.body.getReader();
  const contentLength = +response.headers.get('Content-Length');

  // Step 3: read the data
  let receivedLength = 0; // received that many bytes at the moment
  let chunks = []; // array of received binary chunks (comprises the body)
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    progress.value = (receivedLength/contentLength)/2
  }
  let blob = new Blob(chunks);
  const content = blob
  const zip = await JSZip.loadAsync(content);
  progress.value = 0.75
  const text = await zip.file("embeddings.txt").async("string");
  progress.value = 0.9
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
  progress.value = 1.0
  loaded();
  glove = dict;
}

getEmbeddings();

function loaded() {
  document.getElementById("progress").classList.add("hidden")
  var buttons = document.getElementById("buttons")
  buttons.classList.add("buttons")
  buttons.classList.remove("hidden")
}

function solve() {
  input = document.getElementById("input").value;
  var output = document.getElementById("output");
  output.innerHTML = ''
  var invalid_flag = false;
  var inputs = input.split(/(\+|-)/).map(function (item) {
    var temp_item = item.trim().toLowerCase();
    if (!glove[temp_item]) {
      invalid_flag = true;
      output.innerHTML += `Invalid Word: ${temp_item}\n`
    } else {
      return temp_item
    }
  });

  if (invalid_flag) {
    return
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

  if (inputs.length > 1) var results = closestWord(final, false, true);
  else var results = closestWord(final, true, true);

  var i = 1;
  for (var row of results) {
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
  return similarity
  // return 1 - Math.acos(similarity) / Math.PI;
}

function dist(A, B) {
  var sum = 0;
  for (i = 0; i < A.length; i++) {
    sum += (A[i] - B[i]) ** 2;
  }

  return Math.sqrt(sum);
}

function closestWord(vec, skip_first = true, cosine = true) {
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

  if (skip_first) {
    return items.slice(1, 11);
  } else {
    return items.slice(0, 10);
  }
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
