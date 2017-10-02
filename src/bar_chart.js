function drawBarChart(filename, key1, key2, stacked) {
	 
	 // console.log(key1);
	 // console.log(key2);
	var categories= [""];
	var dollars= [];
	
	document.getElementById("bar_chart").innerHTML= '';

	var colors_orig = d3.scale.category10();
	var colorScale = d3.scale.category10();

	var z = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	filename = "data/" + filename;

	d3.csv(filename, function(error, data) {
	  	data.forEach(function(d) {
	  		// console.log(d);
	   		categories.push(d[key1]);
	    	dollars.push(Number(d[key2]));
	 	});

		// console.log(categories);
		// console.log(dollars);
		var	keys = d3.keys(data[0]).filter(function(d){return d!=="" && d!=key1 && d!="total";});
		z.domain(keys);

		// console.log(keys);
	
		var grid = d3.range(25).map(function(i){
			return {'x1':0,'y1':0,'x2':0,'y2':950};
		});

		var tickVals = grid.map(function(d,i){
			if(i>0){ return 380+i*30; }
			else if(i===0){ return "";}
		});

		// console.log(tickVals);
		mini = d3.min(dollars);
		maxi = d3.max(dollars);
		// console.log(mini, maxi);
		frac = Math.floor((maxi-mini)/10)

		if(!stacked){
		var xscale = d3.scale.linear()
						.domain([mini-frac,maxi+frac])
						.range([0,722]);
		}else{
		var xscale = d3.scale.linear()
						.domain([0,maxi])
						.range([0,722]);
		}

		var yscale = d3.scale.linear()
						.domain([0,categories.length])
						.range([0,950]);


		// var colorScale = d3.scale.quantize()
		// 				.domain([0,categories.length])
		// 				.range(colors);

		var canvas = d3.select('#bar_chart')
						.append('svg')
						.attr({'width':1200,'height':1000});

		var grids = canvas.append('g')
						  .attr('id','grid')
						  .attr('transform','translate(380,0)')
						  .selectAll('line')
						  .data(grid)
						  .enter()
						  .append('line')
						  .attr({'x1':function(d,i){ return i*30; },
								 'y1':function(d){ return d.y1; },
								 'x2':function(d,i){ return i*30; },
								 'y2':function(d){ return d.y2; },
							})
						  .style({'stroke':'#adadad','stroke-width':'1px'});

		var	xAxis = d3.svg.axis();
			xAxis
				.orient('bottom')
				.scale(xscale);
				// .tickValues(tickVals);

		var	yAxis = d3.svg.axis();
			yAxis
				.orient('left')
				.scale(yscale)
				.tickSize(2)
				.tickFormat(function(d,i){ return categories[i]; })
				.tickValues(d3.range(categories.length));

		var y_xis = canvas.append('g')
						  .attr("transform", "translate(380,0)")
						  .attr('id','yaxis')
						  .call(yAxis);

		var x_xis = canvas.append('g')
						  .attr("transform", "translate(380,950)")
						  .attr('id','xaxis')
						  .call(xAxis)
						  .append("text")
							.attr("class", "label")
							.attr("x", 1280)
							.attr("y", -6)
							.style("text-anchor", "end")
							.text('App Count');;

		if(stacked){
		var layers = d3.layout.stack()(keys.map(function(c) {
			console.log(c);
					    return data.map(function(d) {
					      return {x: d[key1], y: Number(d[c]), k:c};
					    });
					  }));

		//console.log(layers);

		var chart = canvas.append('g')
							.selectAll("g")
						    .data(layers)
						    .enter().append("g")
							.attr("transform", "translate(380,0)")
							.selectAll('rect')
							.data(function(d) { return d; })
							.enter()
							.append('rect')
							.attr('id','bars')
							.attr("fill", function(d,i) {
						    	var ind=0; 
								keys.forEach(function(c,j){
									if(c==d.k){ind=j;}
								}); 
								return colorScale(ind); })
							.attr('height', 15)
							.attr({'x':function(d,i){//console.log(d); 
								return xscale(d.y0);},
								'y':function(d,i){ 
									var ind=0; 
									categories.forEach(function(c,j){
										if(c==d.x){ind=j;}
									}); 
									return yscale(ind)-5; }})
							.attr('width',function(d){ return xscale(d.y); });
							.on("mouseover", function(d,i) {
								console.log(d.y0);
							  	canvas.append("text")
								   .attr("id", "tooltip")
								   .attr("x", xscale(d.y0)+380)
								   .attr("y", yscale(i)+19)
								   .attr("text-anchor", "middle")
								   .attr("font-size", "14px")
								   .attr("fill", "black");
								   //.text(d);
					           	})
				           	.on("mouseout", function(d) {
				                d3.select("#tooltip").remove();
				             });
		}
		else{

		var chart = canvas.append('g')
							.attr("transform", "translate(380,0)")
							.attr('id','bars')
							.selectAll('rect')
							.data(dollars)
							.enter()
							.append('rect')
							.attr('height', 15)
							.attr({'x':0,'y':function(d,i){ return yscale(i)+19; }})
							.style('fill',function(d,i){ return colorScale(i); })
							.attr('width',function(d){ return 0; })
							.on("mouseover", function(d,i) {
								// console.log(d);
							  	canvas.append("text")
								   .attr("id", "tooltip")
								   .attr("x", xscale(d)+380)
								   .attr("y", yscale(i)+19)
								   .attr("text-anchor", "middle")
								   .attr("font-size", "14px")
								   .attr("fill", "black");
								   //.text(d);
					           	})
				           	.on("mouseout", function(d) {
				                d3.select("#tooltip").remove();
				             });

		}

		if(!stacked){
		var transit = d3.select("svg").selectAll("rect")
						    .data(dollars)
						    .transition()
						    .duration(1000) 
						    .attr("width", function(d) {return xscale(d); });
						}

		var transitext = d3.select('#bars')
							.selectAll('text')
							.data(dollars)
							.enter()
							.append('text')
							.attr({'x':function(d) {return xscale(d); },'y':function(d,i){ return yscale(i)+31; }})
							.text(function(d){ return d; }).style({'fill':'#000','font-size':'14px'});

	});

}