const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

fetch(url)
    .then(d => d.json())
    .then(d => makeChart(d))

function makeChart(data) {
    //Left and bottom margins are more to adjust for the offsetting and axis descriptions.
    var margins = {
        top: Math.ceil(0.05 * window.innerHeight),
        right: Math.ceil(0.10 * window.innerWidth),
        left: Math.ceil(0.05 * window.innerWidth),
        bottom: Math.ceil(0.10 * window.innerHeight)
    }
    const maxTime = data[data.length - 1].Seconds;
    const minTime = data[0].Seconds;
    const secondsRange = maxTime - minTime;



    const chartWidth = window.innerWidth - window.innerWidth / 8 - margins.right - margins.left;
    const chartHeight = window.innerHeight - window.innerHeight / 8 - margins.bottom - margins.top;

    var svg = d3.select('.chart')
        .attr('width', window.innerWidth - window.innerWidth / 8)
        .attr('height', window.innerHeight - window.innerHeight / 8);

    var g = svg.append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    //Initialise scales.

    var x = d3.scaleLinear()
        .domain([secondsRange + 5, 0])
        .range([0, chartWidth]);

    var y = d3.scaleLinear()
        .domain([1, data.length + 1])
        .range([0, chartHeight]);

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
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .call(d3.axisBottom(x))

    .append('text')
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        .text('Time difference in seconds')
        .attr('x', chartWidth)
        .attr('y', -20)
        .attr('dy', '0.71em');

    //Adding div to display info about currently selected
    var infoCard = d3.select('.content').append("div")
        .attr("class", "info")
        .style("opacity", 0);

    g.append('text')
        .attr('transform', 'translate(' + (chartWidth - margins.right) + ',' + (chartHeight / 2 + margins.bottom) + ')')
        .attr('class', 'legend')
        .text('Legend ');

    g.append('text')
        .attr('transform', 'translate(' + (chartWidth - margins.right + 12) + ',' + (chartHeight / 2 + margins.bottom + 29) + ')')
        .attr('class', 'legend')
        .text('Cyclists with doping allegations.');

    g.append('text')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (chartWidth - margins.right + 12) + ',' + (chartHeight / 2 + margins.bottom + 54) + ')')
        .text('Cyclists without doping allegations.');


    g.append('circle')
        .attr('class', 'red legend-dot')
        .attr('r', 4)
        .attr('cx', chartWidth - margins.right + 4)
        .attr('cy', chartHeight / 2 + margins.bottom + 25);


    g.append('circle')
        .attr('class', 'green legend-dot')
        .attr('r', 4)
        .attr('cx', chartWidth - margins.right + 4)
        .attr('cy', chartHeight / 2 + margins.bottom + 50);

    g.selectAll('.dot')
        .data(data)
        .enter().append('circle')

    .attr('class', 'dot')
        .attr('r', 4)
        .attr('cx', d => x(d.Seconds - minTime))
        .attr('cy', d => y(d.Place))
        .attr('class', d => d.Doping === '' ? 'green dot' : 'red dot')
        .on('mouseover', (d) => {
            let name = d.Name;
            let time = d.Time;
            let pos = d.Place;
            let doping = d.Doping;
            let nation = d.Nationality;

            infoCard.transition()
                .duration(200)
                .style('opacity', 0.8)
                .style('background', doping === '' ? 'lightblue' : 'lightsalmon')
                .style('color', doping === '' ? 'green' : 'red');


            infoCard.html('<span >' + name + ' </span><br><span >  Position:&nbsp;' + pos + '&nbsp; Time:' + time + '</span> <br><span > Doping:&nbsp; ' + (doping === '' ? 'No Doping charges.' : doping) + '</span>')
                .style("left", margins.left + 200 + 'px')
                .style("top", margins.top + 100 + 'px');

        })
        .on("mouseout", function() {
            infoCard.transition()
                .duration(250)
                .style("opacity", 0);

        });
}