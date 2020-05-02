use.load().then(model => {
    // Embed an array of sentences.
    const sentences = [
        'king',
        'man',
        'woman',
        'queen'
    ];
    model.embed(sentences).then(embeddings => {
        // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
        // So in this example `embeddings` has the shape [2, 512].
        // embeddings.print(true /* verbose */);
        embeddings.array().then(array => {
            var king = array[0], man = array[1], woman = array[2], queen = array[3];
            console.log(cosinesim(king, queen))
            console.log(cosinesim(man, king))
            console.log(cosinesim(addArr(queen, man), king))
            console.log(cosinesim(addArr(subArr(king,man), woman), queen))
        });
  });
});




function cosinesim(A,B){
    var dotproduct=0;
    var mA=0;
    var mB=0;
    for(i = 0; i < A.length; i++){ // here you missed the i++
        dotproduct += (A[i] * B[i]);
        mA += (A[i]*A[i]);
        mB += (B[i]*B[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = (dotproduct)/((mA)*(mB)) // here you needed extra brackets
    return (1 - Math.acos(similarity)/Math.PI)
}


function addArr(A, B){
    var sum = []
    for(var i = 0; i < A.length; i++){
        sum.push(A[i] + B[i]);
     }
    return sum
}

function subArr(A, B){
    var sum = []
    for(var i = 0; i < A.length; i++){
        sum.push(A[i] - B[i]);
     }
    return sum
}
