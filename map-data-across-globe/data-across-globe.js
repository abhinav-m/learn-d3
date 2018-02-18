const mDataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';



fetch(mDataUrl)
  .then(d => d.json())
  .then(d => chart(d));

function chart(data) {

var width = window.innerWidth;
var height = window.innerHeight;



  var projection = d3.geoMercator()
                      .scale(120)
                     .translate([width/2,height/2]); //Translate projection to center of svg.

  var zoom = d3.zoom()
                .on('zoom',zoomed);

  var path = d3.geoPath()
               .projection(projection);

  var svg = d3.select('#graph')
              .append('svg')
              .attr('width',width)
              .attr('height',height)
              .call(zoom);

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

});

function zoomed() {
var transform = d3.zoomTransform(this);
this.setAttribute('transform',transform);
}
}
