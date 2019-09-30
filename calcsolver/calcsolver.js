function solve() {
    var start = document.getElementById('start').value
    var goal = document.getElementById('goal').value
    var moves = document.getElementById('moves').value
    var operations = document.getElementById('operations').value.split('\n');

    var parsed = [];
    var results = new Map();
    var poss = operations.length;
    var loop = Math.pow(poss, moves);


    for (var i = 0; i < poss; i++) {
        if (/[+\-/*x^] *-*\d+/.test(operations[i])) {
            var obj = {
                a: operations[i].charAt(0),
                b: operations[i].slice(1).trim(),
                func: stdmath
            }
            parsed.push(obj);

        }
        else if (/\d+ *=> *\d+/.test(operations[i])) {
            var res = operations[i].split("=>");
            var obj = {
                a: res[0].trim(),
                b: res[1].trim(),
                func: replace
            }
            parsed.push(obj);

        }
        else if (operations[i].includes("+/-")) {
            var obj = {
                a: null,
                b: null,
                func: changesign
            }
            parsed.push(obj);

        }
        else if (operations[i].includes("<<")) {
            var obj = {
                a: null,
                b: null,
                func: step
            }
            parsed.push(obj);

        }

        else if (/\d+/.test(operations[i])) {
            var obj = {
                a: operations[i],
                b: null,
                func: addnum
            }
            parsed.push(obj);

        }

        else if (operations[i].toLowerCase() == "rev") {

            var obj = {
                a: null,
                b: null,
                func: rev
            }
            parsed.push(obj);
        }

        else {
            console.error("invalid operation");
        }

    }


    for (var i = 0; i < loop; i++) {
        var symb = i.toString(poss)
        var inter = [];
        while (symb.length != moves) {
            symb = '0' + symb;
        }
        var test = start;
        inter.push(parseInt(test));
        for (var j = 0; j < symb.length; j++) {
            var char = parseInt(symb.charAt(j));
            test = parsed[char].func(test.toString(), parsed[char].a, parsed[char].b);
            inter.push(test);
            if (test == goal) {
                results.set(symb.slice(0, j + 1), inter)
                break;
            }
        }

    }

    var div = document.getElementById("output");
    if (results.size == 0) {
        var para = document.createElement("p");
        var node = document.createTextNode("Couldn't find Answer");
        para.appendChild(node);
        div.appendChild(para);
    } else {
        for (let result of results.keys()) {
            var para = document.createElement("p");
            var P = results.get(result)[0];
            for (var i = 0; i < results.get(result).length-1; i++) {
                P += ` <span class=\"operations\">(${operations[result.charAt(i)]})</span> \u25B6\uFE0F ${results.get(result)[i+1]} `;
            }
            para.innerHTML = P;
            div.appendChild(para);
        }
    }

}

function clearResults() {
    document.getElementById("output").innerHTML = "";
}

function giveExample() {
    
    example_start = [171, 0];
    example_goal = [23, 210];
    example_moves = [4, 5];
    example_ops = ["x2\n-9\n<<", "-5\n+5\n5\n2"];

    let r = Math.floor(Math.random() * example_start.length);
    document.getElementById('start').value = example_start[r] 
    document.getElementById('goal').value = example_goal[r]
    document.getElementById('moves').value = example_moves[r]
    document.getElementById('operations').value = example_ops[r]
}




//Math functions:
function stdmath(n, sign, val) {
    n = parseFloat(n);
    val = parseInt(val);
    switch (sign) {
        case "+":
            return n + val;
        case "-":
            return n - val;
        case "x" || "*":
            return n * val;
        case "/":
            return n / val;
        case "^":
            return Math.pow(n,val);
    }

}

function replace(n, a, b) {
    var reg = new RegExp(a,"g")
    return parseFloat(n.replace(reg,b));
}

function step(n, a, b) {
    if (n.length == 1) {
        return 0;
    } else {
        return parseFloat(n.slice(0, -1));
    }
}

function changesign(n, a, b) {
    if (n.charAt(0) == '-') {
        return parseFloat(n.replace('-', ''));
    } else {
        n = '-' + n;
        return parseFloat(n)
    }
}

function addnum(n, a, b) {
    n = n + a;
    return parseFloat(n);
}

function rev(n, a, b) {
    return parseFloat(n.split("").reverse().join(""));
}