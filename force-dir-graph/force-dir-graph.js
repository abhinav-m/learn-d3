const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';


fetch(url)
    .then(d => d.json())
    .then(d => makeChart(d))

function makeChart(data) {


  var chart = d3.select('.chart');
  const width = parseInt(chart.style("width"));
  const height = parseInt(chart.style("height"));


  var svg = chart.append('svg')
      .attr('width',width)
      .attr('height',height);

  var simulation = d3.forceSimulation()
                     .force('link',d3.forceLink().distance(50).strength(1))//Link strength between nodes.
                     .force('charge',d3.forceManyBody().strength(-60))//Charge and force strength amongst nodes.
                     .force('center',d3.forceCenter(width/2,height/2))//Center of the force applied.
                     .force('x',d3.forceX(1)) //Force towards x axis [0,1]
                     .force('y',d3.forceY(1)); //Force towards y axis [0,1]


var info = d3.select('.info');

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
         .on("end", dragended))
         .on("mouseover", function(d){
       info.transition()
         .duration(100)
         .style("opacity", 1);
         info.html('<span>'+d.country+'</span>');
         info.style("left",  (d3.event.pageX + 5) + "px")
             .style("top", (d3.event.pageY - 25)+'px');

     })
     .on("mouseout", function(){
       info.transition()
         .duration(100)
         .style("opacity", 0);
       info
         .style("left", "-999px")
         .style("top", "-999px");
     });


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
  if (!d3.event.active) simulation.alphaTarget(1).restart();
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
