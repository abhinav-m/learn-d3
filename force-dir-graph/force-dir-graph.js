const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';


fetch(url)
    .then(d => d.json())
    .then(d => makeChart(d))

function makeChart(data) {
const nodeDist = 100;

  var chart = d3.select('.chart');
  const width = parseInt(chart.style("width"));
  const height = parseInt(chart.style("height"));

  var svg = chart.append('svg')
      .attr('width',width)
      .attr('height',height);

  var simulation = d3.forceSimulation()
                     .force('link',d3.forceLink().distance(50))
                     .force('charge',d3.forceManyBody().strength(-1))
                     .force('collide',d3.forceCollide().radius(4))
                     .force('center',d3.forceCenter(width/2,height/2));

 var link = svg.append('g')
            .attr('class','links')
            .selectAll('line')
            .data(data.links)
            .enter().append('line')
            .attr('stroke-width', 1);

var node =    chart.select('.flagbox')
              .selectAll('.nodes')
              .data(data.nodes)
              .enter().append('img')
          		.attr('class', d => 'flag flag-' + d.code)
              .call(d3.drag()
         .on("start", dragstarted)
         .on("drag", dragged)
         .on("end", dragended));


simulation
  .nodes(data.nodes)
  .on('tick',ticked);

simulation
.force("link")
.links(data.links);


function ticked() {
  link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .style("left", function(d) { return (d.x-8) +'px' })
        .style("top", function(d) { return (d.y-5) +'px' });
  }

  function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

}
