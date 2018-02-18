const mDataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';



fetch(mDataUrl)
  .then(d => d.json())
  .then(d => chart(d));

function chart(data) {

  var width = '100%',
      height = '100%';

  var projection = d3.geoMercator()
                      .scale(100)
                     .translate([600,300]);

  var path = d3.geoPath()
               .projection(projection);

  var svg = d3.select('#graph')
              .append('svg')
              .attr('width',1000)
              .attr('height',800);

      svg.append('rect')
         .attr('width',width)
         .attr('height',height)
         .attr('fill','blue');

  var map = svg.append('g');

 d3.json('https://d3js.org/world-50m.v1.json', function(json)
{
  map.selectAll('path')
     .data(topojson.feature(json,json.objects.countries).features)
     .enter()
     .append('path')
    .attr('fill', '#95E1D3')
    .attr('stroke', '#266D98')
    .attr('d', path)

})
}
