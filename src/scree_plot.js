function plot_scree(filename){

  filename = "./data/" + filename;

  var margin = {top: 100, right: 100, bottom: 300, left: 400},
    width = 1500 - margin.left - margin.right,
    height = 850 - margin.top - margin.bottom;

    var svg = d3.select("svg");
    svg.selectAll('*').remove();

  svg = svg
    .attr("id", "_line")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // var x = d3.scale.ordinal().rangeRound([0, width]);
  //var x = d3.scaleOrdinal().range([0, width]);

  var x = d3.scale.ordinal().rangePoints([50, width]);
  var y = d3.scale.linear().rangeRound([height, 0]);

  var line = d3.svg.line()
        .x(function(d) { return x(d.c1); })
        .y(function(d) { return y(+d.c2); });

  d3.csv(filename, function(error, data) {
    if (error) throw error;

    columns = d3.keys(data[0]).filter(function(d){return d!=="";});
    f1 = columns[0];
    f2 = columns[1];

    data.forEach(function(d){
      d.c1 = (d[f1]);
      d.c2 = Number(d[f2]);
    });

    x.domain(data.map(function(d) { return d.c1; }));
    //y.domain(d3.extent(data, function(d) { return +d.c2; }));
    y.domain([d3.min(data, function(d){return +d.c2;})-0.1, d3.max(data, function(d){return +d.c2;})+0.1])

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom").tickSize(6))
      .attr("class", "x axis")
      .attr("stroke-width", 1.5)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -12)
      .attr("dy", "0.71em")
      .style("text-anchor", "end")
      .style("font-size", "14px")
      .text(f1);

    g.append("g")
      .call(d3.svg.axis().scale(y).orient("left").tickSize(6))
      .attr("class", "y axis")
      .attr("stroke-width", 1.5)
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .style("font-size", "14px")
      .text(f2);

    g.append("path")
      .datum(data)
      .attr("id", "line1")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d){return x(d.c1);})
      .attr("cy", function(d){return y(d.c2);})
      .style("fill", "black")
      .on("mouseover", function(d) {
          g.append("text")
             .attr("id", "tooltip")
             .attr("x", (x(d.c1)))
             .attr("y", y(d.c2)-10)
             .attr("text-anchor", "middle")
             .attr("font-size", "14px")
             .attr("fill", "black")
             .text(d.c1+','+parseFloat(d.c2).toFixed(2));
                    })
            .on("mouseout", function(d) {
                    d3.select("#tooltip").remove();
             });

    });
}