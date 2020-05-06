var glove;

async function getEmbeddings() {
  let response = await fetch("https://drive.google.com/u/0/uc?export=download&confirm=h1ql&id=1DqIy-f1FKIJxv66V-dgC2LJAKFYtGS6g");
  let data = await response.text();
  var dict = {};
  var splitline;
  var word;
  var embedding;
  var lines = data.split(/\r?\n/);
  for (var line of lines) {
    splitline = line.split(" ");
    word = splitline[0];
    embedding = splitline.slice(1).map(Number);
    dict[word] = embedding;
  }
  loaded();
  glove = dict;
  return dict
}

getEmbeddings()

function loaded() {
  console.log("button is ready");
  //make button ready
}

function solve() {
  input = document.getElementById('input').value;
  var inputs = input.split(/(\+|-)/).map(function (item) {
    return item.trim();
  });

  var final = glove[inputs[0]];
  for (let i = 1; i < inputs.length - 1; i += 2) {
    if (inputs[i] == "+") {
      final = addArr(final, glove[inputs[i + 1]]);
    } else {
      final = subArr(final, glove[inputs[i + 1]]);
    }
  }

  var output = document.getElementById('output')
  var table = ``
  table = `<table id='table'>
  <tr>
    <th>Rank</th>
    <th>Word</th>
    <th>Similarity</th>
  </tr>`
  
  if (inputs.length > 1)
    var results = closestWord(final, false, true)
  else
    var results = closestWord(final, true, true)
  
  var i = 1
  for(var row of results) {
    table += `
    <tr>
      <td>${i++}</td>
      <td>${row[0]}</td>
      <td>${(row[1]*100).toFixed(2)}%</td>
    </tr>`
  }
  table += `</table>`

  output.innerHTML = table
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
  return 1 - Math.acos(similarity) / Math.PI;
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

  if(skip_first) {
    return items.slice(1, 11);
  } else {
    return items.slice(0,10)
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
