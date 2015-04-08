function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

var color = d3.scale.ordinal().domain([0,10]).range(colorbrewer.Pastel1[9]);


d3.json("/repos", function(err, data){
    console.log(data)
var margin = {top: 20, right: 10, bottom: 10, left: 10},
    width = 1024 - margin.left - margin.right,
    height = 570 - margin.top - margin.bottom;

var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(false)
    .value(function(d) { return d.stargazers_count + 4; });

var div = d3.select("#display").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

 var node = div.datum(data).selectAll(".node")
      .data(treemap.nodes)
    .enter().append("a")
      .attr("href", function(d){return d.url;})
      .attr("class", "node")
      .call(position)
      .style("background", function(d) { return color(d.name); })
      .style("font-size", function(d){return 2*Math.log(d.stargazers_count)+8 + "px"})
        .append("div")
        .attr("class", "heading")
        .text(function(d){
            console.log(d.name)
            return d.name
        })
        .append("div")
        .attr("class", "nonh")
        .style("font-size", function(d){return 10 + Math.log(d.stargazers_count)*2 + "px"})
        .style("margin", function(d){return Math.log(d.stargazers_count)+"px"})
        .text(function(d){
            return d.description
        })


})