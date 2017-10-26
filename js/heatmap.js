var ClusteringHeatmap = function(view, plotWidth, plotHeight, filePath){
	const s = this;
//TODO
	const
		POINT_RADIUS = 3,
		AXIS_PAD = .1,
		PAD = 20,
		LEFT_PAD = 70, color = d3.schemeCategory10;

	var svg, tooltip, newData,
		x, y, xAxis, yAxis,
		xMin = .0, xMax = .0, yMin = .0, yMax = .0;

	s.init = function(){
		s.putToView();
		s.translateAndScale();
		s.putInitialPoints();
	}

	s.putToView = function(){
		svg = d3.select(view)
			.append("svg")
			.attr("width", plotWidth)
			.attr("height", plotHeight);
		tooltip = d3.select("body")
			.append("div")
	    .attr("class", "tooltip")
	    .style("opacity", 0);
	}

	s.translateAndScale = function() {
		x = d3.scaleLinear().domain([xMin - AXIS_PAD, xMax + AXIS_PAD])
					.range([LEFT_PAD, plotWidth - PAD]);
		y = d3.scaleLinear().domain([yMin - AXIS_PAD, yMax + AXIS_PAD])
					.range([PAD, plotHeight - PAD*2]);
		xAxis = d3.axisBottom().scale(x);
		yAxis = d3.axisLeft().scale(y);
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0, "+(plotHeight - PAD)+")")
			.call(xAxis);
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate("+(LEFT_PAD - PAD)+", 0)")
			.call(yAxis);
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
	      .on("mouseover", function(d) {
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

	s.updatePoints = function(){
		s.translateAndScale();
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
	}

	s.computeBounds = function(xVal,yVal){
		xMax = (xMax == 0) ? xVal : Math.max(xMax, xVal);
		yMax = (yMax == 0) ? yVal : Math.max(yMax, yVal);
		xMin = (xMin == 0) ? xVal : Math.min(xMin, xVal);
		yMin = (yMin == 0) ? yVal : Math.min(yMin, yVal);
	}


	// setup fill color
	var cValue = function(o) { return (o.clusterCentre.localeCompare("false"));};
}
