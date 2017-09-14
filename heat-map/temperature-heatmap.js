const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

fetch(url)
    .then(d => d.json())
    .then(d => makeChart(d));



function makeChart(data) {

    const MONTHS = ["January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];



    const colors = ['#00004c',
        '#0000cc',
        '#7f7fff',
        '#ccccff',
        '#fbf2e2',
        '#f3d9a8',
        '#edc77d',
        '#E4AB3C',
        '#ffb2b2',
        '#ff7f7f',
        '#ff3232'
    ];

    const margins = {
        top: 20,
        right: 20,
        bottom: 90,
        left: 100
    }

    const WIDTH = window.innerWidth - window.innerWidth / 4;
    const HEIGHT = window.innerHeight - window.innerHeight / 4;

    const BASE_TEMP = data.baseTemperature;

    const DATA_MONTHWISE = data.monthlyVariance;

    const LOWEST_VAR = d3.min(DATA_MONTHWISE, d => d.variance);
    const HIGHEST_VAR = d3.max(DATA_MONTHWISE, d => d.variance);

    const LOWEST_TEMP_VAR = LOWEST_VAR + BASE_TEMP;
    const HIGHEST_TEMP_VAR = HIGHEST_VAR + BASE_TEMP;

    const MIN_YEAR = DATA_MONTHWISE[0].year;
    const MAX_YEAR = DATA_MONTHWISE[DATA_MONTHWISE.length - 1].year;

    const CELL_HEIGHT = HEIGHT / MONTHS.length;

    //Since X axis will be based on years, and years are repeated in the data, we have to 
    //calculate individual cell width based off a unique array of years present in data.
    var data_yearly = DATA_MONTHWISE.map(d => d.year);
    data_yearly = data_yearly.filter((v, i) => data_yearly.indexOf(v) === i);
    const CELL_WIDTH = WIDTH / data_yearly.length;



    var colorScale = d3.scaleQuantile()
        .domain([LOWEST_TEMP_VAR, HIGHEST_TEMP_VAR]) // Ranges of our temperature https://github.com/d3/d3-array#quantile
        .range(colors) //The number of values in (the cardinality, or length, of) the range array determines the number of quantiles that are computed. 

    const MIN_DATE = new Date(MIN_YEAR, 0),
        MAX_DATE = new Date(MAX_YEAR, 0);

    var x = d3.scaleTime()
        .domain([MIN_DATE, MAX_DATE])
        .range([0, WIDTH]);


    var infoCard = d3.select(".content").append("div")
        .attr("class", "info")
        .style("opacity", 0);

    var svg = d3.select('.chart')
        .attr('width', WIDTH + margins.left + margins.right)
        .attr('height', HEIGHT + margins.top + margins.bottom);

    var g = svg.append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    g.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + HEIGHT + ')')
        .call(d3.axisBottom(x).ticks(15));

    g.selectAll('.months')
        .data(MONTHS)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', 0)
        .attr('y', (d, i) => i * CELL_HEIGHT)
        .style('text-anchor', 'end')
        .attr('transform', 'translate(-6,' + CELL_HEIGHT / 2 + ')');

    var cells =
        g.selectAll('.cell')
        .data(DATA_MONTHWISE)
        .enter().append('rect')
        .attr('class', 'cell')
        .attr('x', d => x(new Date(d.year, 0)))
        .attr('y', d => (d.month - 1) * CELL_HEIGHT) // SVG origin (0,0) is at top left.
        .attr('height', CELL_HEIGHT)
        .attr('width', CELL_WIDTH)
        .attr('fill', d => colorScale(d.variance + BASE_TEMP));



    cells.on('mouseover', (d) => {
            let month = d.month,
                year = d.year,
                temp = (d.variance + BASE_TEMP).toFixed(2),
                vari = d.variance;


            infoCard.transition()
                .duration(200)
                .style('opacity', 0.8);

            infoCard.html('<span>' + MONTHS[month - 1] + '-' + year + '</span><br/><span>' + temp + '</span></br><span>' + vari + '</span>')
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 80) + "px");

        })
        .on("mouseout", function() {
            infoCard.transition()
                .duration(500)
                .style("opacity", 0);
        });








}