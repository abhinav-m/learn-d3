const mDataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';



fetch(mDataUrl)
  .then(d => d.json())
  .then(d => chart(d));

function chart(data) {

var width = window.innerWidth;
var height = window.innerHeight;



  var projection = d3.geoMercator()
                      .scale(300)
                     .translate([width/2,height/2]); //Translate projection to center of svg.

  var zoom = d3.zoom()
                .scaleExtent([1,8])
                .on('zoom',zoomed);

  var path = d3.geoPath()
               .projection(projection);

  var svg = d3.select('#graph')
              .append('svg')
              .attr('width',width)
              .attr('height',height)
              .on("click", stopped, true);

var meteorites,radiusScale,colorScale,opacityScale;


      svg.append('rect')
         .attr('width',width)
         .attr('height',height)
         .attr('fill','blue')
         .on("click", reset);

  var map = svg.append('g');

  svg.call(zoom);

 d3.json('https://d3js.org/world-50m.v1.json', function(json)
{
  map.selectAll('path')
     .data(topojson.feature(json,json.objects.countries).features)
     .enter()
     .append('path')
     .attr('fill', '#95E1D3')
     .attr('stroke', '#266D98')
     .attr('d', path)
     .on('click',clicked);



  //Getting rid of extra data.
   data.features = data.features.filter( m =>   m.geometry!== null && m.properties.mass!== null );

   data.features.sort((a,b) => b.properties.mass - a.properties.mass);


    var max = data.features.reduce( (a,b) => parseInt(a.properties.mass)  > parseInt(b.properties.mass) ? a : b).properties.mass;
    var min = data.features.reduce( (a,b) => parseInt(a.properties.mass)  < parseInt(b.properties.mass) ? a : b).properties.mass;

    radiusScale = d3.scalePow()
                    .domain([min,max])
                    .range([2,60])
                    .clamp(true)
                    .exponent(0.5);

   colorScale = d3.scaleSequential(d3.interpolateRainbow)
                        .domain([2, 60]);

  opacityScale = d3.scaleLinear()
                   .domain([2,60])
                   .range([1,0.5]);


   console.log('rmin'+radiusScale(min));
   console.log('rmax'+radiusScale(max));
    console.log('max '+max);
    console.log('min '+min);

   meteorites =   svg.selectAll('.meteor')
    .append('g')
    .data(data.features)
    .enter()
    .append('circle')
    .attr('class','meteor')
    .attr('r', function(d){
     return   Math.floor(radiusScale(d.properties.mass)) ;
    } )
    .attr("cx", function(d) {
				return projection([d.properties.reclong,d.properties.reclat])[0];})
		.attr("cy", function(d) {
				return projection([d.properties.reclong,d.properties.reclat])[1];})
    .attr('fill', d => colorScale(Math.floor(radiusScale(d.properties.mass))))
    .attr('opacity',d => opacityScale(Math.floor(radiusScale(d.properties.mass)))  )





});


function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
}

function zoomed() {
  map.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  map.attr("transform", d3.event.transform); // updated for d3 v4
  meteorites.attr("transform", d3.event.transform);
}

function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

}
