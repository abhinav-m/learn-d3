const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

fetch(url)
    .then(d => d.json())
    .then(d => makeChart(d));



function makeChart(data) {

    const MONTHS = ["January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];


    const colors = ["#0000FF", "#b2b2ff", "#66c2a5", "#abdda4",
        "#7fff7f", "#ffffbf", "#fee08b", "#fdae61",
        "#f46d43", "#d53e4f", "#b20000", "#330000"
    ];

    const margins = {
        top: 20,
        right: 20,
        bottom: 90,
        left: 100
    }

    const WIDTH = window.innerWidth / 2;
    const HEIGHT = window.innerHeight / 2;

    const BASE_TEMP = data.baseTemperature;

    const DATA_MONTHWISE = data.monthlyVariance;

    const LOWEST_VAR = d3.min(DATA_MONTHWISE, d => d.variance);
    const HIGHEST_VAR = d3.max(DATA_MONTHWISE, d => d.variance);

    const LOWEST_TEMP_VAR = LOWEST_VAR + BASE_TEMP;
    const HIGHEST_TEMP_VAR = HIGHEST_VAR + BASE_TEMP;

    const MIN_YEAR = DATA_MONTHWISE[0].year;
    const MAX_YEAR = DATA_MONTHWISE[DATA_MONTHWISE.length - 1].year;

    const CELL_WIDTH = WIDTH / DATA_MONTHWISE.length;
    const CELL_HEIGHT = HEIGHT / MONTHS.length;

    var colorScale = d3.scaleQuantile()
        .domain([LOWEST_TEMP_VAR, HIGHEST_TEMP_VAR]) // Ranges of our temperature https://github.com/d3/d3-array#quantile
        .range(colors) //The number of values in (the cardinality, or length, of) the range array determines the number of quantiles that are computed. 

    const MIN_DATE = new Date(MIN_YEAR, 0),
        MAX_DATE = new Date(MAX_YEAR, 0);

    var x = d3.scaleTime()
        .domain([MIN_DATE, MAX_DATE])
        .range(0, WIDTH);

    var svg = d3.select('.chart')
        .attr('width', WIDTH + margins.left + margins.right)
        .attr('height', HEIGHT + margins.top + margins.bottom);

    var g = svg.append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    g.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + HEIGHT + ')')
        .call(d3.axisBottom(x).ticks(10));

    g.selectAll('.months')
        .data(MONTHS)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', 0)
        .attr('y', (d, i) => i * CELL_HEIGHT)
        .style('text-anchor', 'end')
        .attr('transform', 'translate(-6,' + CELL_HEIGHT / 2 + ')');










}