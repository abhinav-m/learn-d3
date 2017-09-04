const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

fetch(url)
    .then(d => d.json())
    .then(d => makeChart(d))

function makeChart(data) {
    //Left and bottom margins are more to adjust for the offsetting and axis descriptions.
    var margins = {
        top: 20,
        right: 20,
        left: 50,
        bottom: 30
    }



    const secondsRange = data[data.length - 1] - data[0];

    var svg = d3.select('.svg');

    const width = svg.attr('width') - margins.left - margins.right;
    const height = svg.attr('height') - margins.right - margins.bottom;

    const barwidth = Math.ceil(width / data.length);

    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


}


function makeTimeRange(start, end) {
    let minutes = +end[0] - +start[0];
    let seconds = +end[1] - +start[1];
    minutes *= 60;
    return minutes + seconds;
}