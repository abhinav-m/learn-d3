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
    const maxTime = data[data.length - 1].Seconds;
    const minTime = data[0].Seconds;
    const secondsRange = maxTime - minTime;

    var svg = d3.select('.chart');

    const width = svg.attr('width') - margins.left - margins.right;
    const height = svg.attr('height') - margins.right - margins.bottom;

    var g = svg.append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    var x = d3.scaleLinear()
        .domain([secondsRange + 5, 0])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([1, data.length + 1])
        .range([0, height]);

    //Making and rendering y axis.

    var yAxis = d3.axisLeft(y);

    //Rendering
    g.append('g')
        .attr('class', 'axis')
        .call(yAxis)

    .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .style('text-anchor', 'end')
        .text('Cyclist rankings');


    //Making and rendering x axis.

    g.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    g.selectAll('.dot')
        .data(data)
        .enter().append('circle')

    .attr('class', 'dot')
        .attr('r', 2)
        .attr('cx', d => x(d.Seconds - minTime))
        .attr('cy', d => y(d.Place))

}