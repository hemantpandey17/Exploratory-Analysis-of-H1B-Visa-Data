function plot_scree_multi_1(filename) {
        refresh();

    filename = "./data/" + filename;
    // console.log(filename);
    svg.selectAll("*").remove();
    
    color = ["Red","Blue","Green"];
    var width = 940,
    size = 300,
    padding = 20;
    var left_pad = 100;
    // Load data
    var xScale = d3.scale.linear().range([left_pad, w-pad]);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    
    var yScale = d3.scale.linear().range([h-pad*2,pad]);
    var yAxis = d3.svg.axis().scale(yScale).orient("left");
    
    d3.csv(filename, function(error, data) {
        data.forEach(function(d) {
            d.year = +d.year
            if(d.type==='random')
              d.x = +d.x;
            else
              d.x = +d.x
            d.y = +d.y;
            
        });

        var xValueR = function(d) { return d.x;};
        var yValueR = function(d) { return d.y;};
       
       xScale.domain([d3.min(data, xValueR), d3.max(data, xValueR)]);
        yScale.domain([d3.min(data, yValueR), d3.max(data, yValueR)]);
        
        var valueline = d3.svg.line()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); });

        svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0, "+(h-pad)+")")
          .call(xAxis)
          .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", left_pad-80)
        .attr("x",h-400)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Component A")
          
            ;
 
        svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate("+(left_pad-pad)+", 0)")
          .call(yAxis)
          .append("text")
        //.attr("transform", "rotate(-20)")
        .attr("y", left_pad+560)
        .attr("x",h-200)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Component B");


        var result = {};
        data.forEach(function(elem) {
          if(result[elem.type])
            result[elem.type].push(elem);
          else
            result[elem.type] = [elem];
        });

        for(var prop in result) {
          svg.append('path')
          .datum(result[prop])
          .attr('fill', 'none')
          .attr('stroke', function(d) { return prop === "random" ? color[0] : color[1]; })
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 1.5)
          .attr('d', valueline);
        }

        // if($scope.viewData[$scope.currentIndex].valueLine) {
        //   g.append('line')
        //   .style('stroke', '#aaa')
        //   .style('stroke-width', '2.5px')
        //   .style('stroke-dasharray', ('3, 3'))
        //   .attr('x1', 0)
        //   .attr('y1', yScale(1))
        //   .attr('x2', width)
        //   .attr('y2', yScale(1));
        // }

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d){
                return xScale(d.x);
            }) 
            .attr("cy", function(d){
                return yScale(d.y);
            }) 
            .attr("fill", function(d) { return d.type === "random" ? color[0] : color[1]; })
            .attr("stroke", "black")
            //.attr("stroke-width", function(d) {return d/2;});
            ;

        console.log("Circles printed for all samples")

        // draw legend
  var legend = svg.selectAll(".legend")
      .data(typeArr)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d, i) { return color[i]; });
      

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
         
    });

}


function plot_scree_multi(filename){

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

  var line1 = d3.svg.line()
        .x(function(d) { return x(d.c1); })
        .y(function(d) { return y(+d.c2); });

  var line2 = d3.svg.line()
        .x(function(d) { return x(d.c1); })
        .y(function(d) { return y(+d.c3); });

  var line3 = d3.svg.line()
        .x(function(d) { return x(d.c1); })
        .y(function(d) { return y(+d.c4); });

  d3.csv(filename, function(error, data) {
    if (error) throw error;

    columns = d3.keys(data[0]).filter(function(d){return d!=="";});
    f1 = columns[0];
    f2 = columns[1];
    f3 = columns[2];
    f4 = columns[3];

    data.forEach(function(d){
      d.c1 = (d[f1]);
      d.c2 = Number(d[f2]);
      d.c3 = Number(d[f3]);
      d.c4 = Number(d[f4]);
    });

    arr = [];
    data.forEach(function(d){
      t = {};
      t.c1 = d.c1;
      t.c2 = d.c2;
      arr.push(t);
      t = {};
      t.c1 = d.c1;
      t.c2 = d.c3;
      arr.push(t);
      t = {};
      t.c1 = d.c1;
      t.c2 = d.c4;
      arr.push(t);
    });

    // console.log(arr);

    x.domain(data.map(function(d) { return d.c1; }));
    //y.domain(d3.extent(data, function(d) { return +d.c2; }));

    ymin = d3.min([d3.min(data, function(d){return +d.c2;}),d3.min(data, function(d){return +d.c3;}),d3.min(data, function(d){return +d.c4;})]);
    ymax = d3.max([d3.max(data, function(d){return +d.c2;}),d3.max(data, function(d){return +d.c3;}),d3.max(data, function(d){return +d.c4;})]);
    y.domain([ymin, ymax]);

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
      .text("Number of Applications");

    g.append("path")
      .datum(data)
      .attr("id", "line1")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line1);

    g.append("path")
      .datum(data)
      .attr("id", "line2")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line2);

    g.append("path")
      .datum(data)
      .attr("id", "line3")
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line3);

    g.selectAll(".dot")
      .data(arr)
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

      var color_arr = ["red","steelblue","green"];
      var legend_arr = [f2,f3,f4];

      var legend = svg.selectAll(".legend")
        .data(legend_arr)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { var w = height/4+i*20; return "translate(" + width/4 + "," + w + ")"; });

      // draw legend colored rectangles
      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d,i){return color_arr[i];});

      // draw legend text
      legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;});

    });
}