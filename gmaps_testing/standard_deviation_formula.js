//found by taking the square root of the average of the squared differences of the values from their average value




function standardDeviation(array) {
    var avg = average(array);

    var squareDiffs = array.map(function(value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

function average(array) {

    var total = 0;
    array.forEach(function(val) {
        total += val;
    });

    var avg = total / array.length;
    console.log(avg)
}
