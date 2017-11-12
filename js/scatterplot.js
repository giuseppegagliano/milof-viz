var ClusteringScatterPlot = function(view, plotWidth, plotHeight, filePath){
	const s = this;

	const
		POINT_RADIUS = 5,
		AXIS_PAD = .1, PAD = 20, LEFT_PAD = 70,
		color = d3.schemeCategory10,
		OUTLIER_THS = 1.5;

	var svg, tooltip, newData,
		x, y, xAxis, yAxis,
		xMin = .0, xMax = .0, yMin = .0, yMax = .0;

	s.init = function(){
		s.putToView();
		s.putInitialPoints();
		s.drawLegend();
	}

	s.putToView = function(){
		svg = d3.select(view)
			.append("svg")
			.attr("width", plotWidth)
			.attr("height", plotHeight);
		tooltip = d3.select("body")
			.append("div")
	    .attr("class", "tooltip")
	    .style("opacity", 0.99)
	    .style("background", "lightblue");
	}

	s.translateAndScale = function() {
		var divWidth = $(view).width();
		var divHeight = Math.max($("BODY").height() - $("#title").height() - PAD, 100);
		x = d3.scaleLinear().domain([xMin - AXIS_PAD, xMax + AXIS_PAD])
					.range([LEFT_PAD, divWidth - PAD]);
		y = d3.scaleLinear().domain([yMin - AXIS_PAD, yMax + AXIS_PAD])
					.range([divHeight-PAD, PAD]);
		xAxis = d3.axisBottom().scale(x);
		yAxis = d3.axisLeft().scale(y);
		d3.selectAll(".axis").remove();
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0, "+(divHeight - PAD)+")")
			.call(xAxis);
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate("+(LEFT_PAD - PAD)+", 0)")
			.call(yAxis);
		svg.attr('width', divWidth).attr('height', divHeight);
	}

	s.putInitialPoints = function() {
		d3.csv(filePath, function(data) {
			newData = data.map(o =>{
				s.computeBounds(o.x,o.y);
				return o;});
			s.translateAndScale();
			svg.selectAll("circle")
				.data(newData)
				.enter()
				.append("circle")
				.attr("cx", function(d) {return x(d.x); })
				.attr("cy", function(d) {return y(d.y); })
				.attr("r", 	POINT_RADIUS)
				.style("fill", function(d) {return color[cValue(d)];})
				.style("opacity", function(d) {if(cValue(d)==0) {return .5} else{ return 1;}})
	      .on("click", function(d) {
	          tooltip.transition()
	               .duration(200)
	               .style("opacity", .9);
	          tooltip.html(
							"<b> Point: (" + d.x + "," + d.y + ")</b>" +
							"<br/> <b>clusterCentre</b>: " + d.clusterCentre +
							"<br/> <b>k-distance</b>: " + d.kDist +
							"<br/> <b>LRD</b>: " + d.LRD +
							"<br/> <b>LOF</b>: " + d.LOF )
	               .style("left", (d3.event.pageX + 5) + "px")
	               .style("top", (d3.event.pageY - 28) + "px");})
	      .on("mouseout", function(d) {
	          tooltip
							.transition()
							.duration(800)
							.style("opacity", 0);});
		});
	}

	s.drawLegend = function(){
		var legend = svg.selectAll(".legend")
				.data([{"color":1,"label":"Outlier"},{"color":0,"label":"Inlier"},{"color":2,"label":"Cluster Center"}])
				.enter().append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
		legend.append("rect")
				.attr("x", plotWidth - 150)
				.attr("width", 20)
				.attr("height", 20)
				.style("fill", function(d) {return color[d.color]});
		legend.append("text")
				.attr("x", plotWidth-120)
				.attr("y",10)
				.attr("dy", ".35em")
				.style("text-anchor", "start")
				.text(function(d) {return d.label});
	}

	s.updatePoints = function(){
		d3.csv(filePath, function(data) {
			newData = data.map(o =>{
				s.computeBounds(o.x,o.y);
				return o});

			svg.selectAll("circle")
				.data(newData)
				.attr("cx", function(d) {return x(d.x); })
				.attr("cy", function(d) {return y(d.y); })
				.attr("r", 	POINT_RADIUS);
		});
		s.translateAndScale();
	}

	s.computeBounds = function(xVal,yVal){
		xMax = (xMax == 0) ? xVal : Math.max(xMax, xVal);
		yMax = (yMax == 0) ? yVal : Math.max(yMax, yVal);
		xMin = (xMin == 0) ? xVal : Math.min(xMin, xVal);
		yMin = (yMin == 0) ? yVal : Math.min(yMin, yVal);
	}

	// setup fill color
	var cValue = function(o) {
		if(o.clusterCentre.localeCompare("true")==0){
						return 2;} // GREEN
		if(o.LOF<OUTLIER_THS){			return 0;} // BLUE SEE schemeCategory10  https://github.com/d3/d3-scale
		return 1; // ORANGE
	};
	//
	//
	//
	// s.render = function() {
	//
	// 	//get dimensions based on window size
	// 	updateDimensions(window.innerWidth);
	//
	// 	//update x and y scales to new dimensions
	// 	x.range([0, width]);
	// 	y.range([height, 0]);
	//
	// 	//update svg elements to new dimensions
	// 	svg
	// 		.attr('width', width + margin.right + margin.left)
	// 		.attr('height', height + margin.top + margin.bottom);
	// 	chartWrapper.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
	//
	// 	//update the axis and line
	// 	xAxis.scale(x);
	// 	yAxis.scale(y);
	//
	// 	svg.select('.x.axis')
	// 		.attr('transform', 'translate(0,' + height + ')')
	// 		.call(xAxis);
	//
	// 	svg.select('.y.axis')
	// 		.call(yAxis);
	//
	// 	path.attr('d', line);
	// }
	//
	// s.updateDimensions = function(winWidth) {
	// 	margin.top = 20;
	// 	margin.right = 50;
	// 	margin.left = 50;
	// 	margin.bottom = 50;
	//
	// 	width = winWidth - margin.left - margin.right;
	// 	height = 500 - margin.top - margin.bottom;
	// }
	//
	// return {
	// 	render : render
	// }
	//


}
