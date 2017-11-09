// TODO
//https://stackoverflow.com/questions/34369116/to-integrate-d3-band-zoom-in-d3-heatmap
//https://www.visualcinnamon.com/2013/07/self-organizing-maps-creating-hexagonal.html
var ClusteringHeatmap = function(view, plotWidth, plotHeight, filePath){
	const s = this;
	const
		POINT_RADIUS = 50,
		AXIS_PAD = .1,
		PAD = 20,
		LEFT_PAD = 70, color = d3.schemeCategory10,
		COLOR_INIT = "red",
		COLOR_MEDIUM = "yellow",
		COLOR_FINAL = "green"
		POINTS_OPACITY = .7;

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
	    .style("opacity", 0)
	    .style("background", "lightgreen");
	}

	s.setGradientProperties = function(data){
		//Radial gradient with the center at one end of the circle, as if illuminated from the side
		var gradientRadial = svg.append("defs")
			.selectAll("radialGradient")
			.data(data)
			.enter()
			.append("radialGradient")
			// QUA POTREBBE ESSERE UTILE INSERIRE UN ID VERO
			.attr("id", function(d){ return "gradient-"+d.id; })
			.attr("cx", "50%")
			.attr("cy", "50%")
			.attr("r", "50%");
			//Append the color stops
		gradientRadial.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", function(d) { return d3.rgb(COLOR_INIT); });
		gradientRadial.append("stop")
			.attr("offset", function(d) {
				if(d.LOF<1.0){
					console.log("lof is",d.LOF);
					return "50%";
				}
				else if(d.LOF<1.5){
					console.log("lof is",d.LOF);
					return "30%";
				}
				console.log("lof is",d.LOF);
				return "10%"; })
			.attr("stop-color", function(d) { return d3.rgb(COLOR_MEDIUM); });
		gradientRadial.append("stop")
			.attr("offset",  "100%")
			.attr("stop-color", function(d) { return d3.rgb(255,255,255,.2); });
	}

	s.translateAndScale = function() {
		var divWidth = $(view).width();
		var divHeight = divWidth * .7;
		x = d3.scaleLinear().domain([xMin - AXIS_PAD, xMax + AXIS_PAD])
					.range([LEFT_PAD, divWidth - PAD]);
		y = d3.scaleLinear().domain([yMin - AXIS_PAD, yMax + AXIS_PAD])
					.range([divHeight - PAD, PAD]);
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
			s.setGradientProperties(newData);
			svg.selectAll("circle")
				.data(newData)
				.enter()
				.append("circle")
				.attr("cx", function(d) {return x(d.x); })
				.attr("cy", function(d) {return y(d.y); })
				.attr("r", POINT_RADIUS)
				// AL POSTO DI GRADIENT ANDREBBE MESSO L'ID
				.style("fill", function(d) { return "url(#gradient-"+d.id+")"; })
				.style("opacity", POINTS_OPACITY)
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

	s.updatePoints = function(){
		d3.csv(filePath, function(data) {
			newData = data.map(o =>{
				s.computeBounds(o.x,o.y);
				return o});

				s.setGradientProperties(newData);
				s.translateAndScale();

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

	s.drawLegend = function(){
		var legend = svg.selectAll(".legend")
				.data([{"color":d3.rgb(COLOR_INIT),"label":"Higher Local Density"},{"color":d3.rgb(COLOR_MEDIUM),"label":"Lower Local Density"}])
				.enter().append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
		legend.append("rect")
				.attr("x", plotWidth - 150)
				.attr("width", 20)
				.attr("height", 20)
				.style("fill", function(d) {return d.color});
		legend.append("text")
				.attr("x", plotWidth-120)
				.attr("y",10)
				.attr("dy", ".35em")
				.style("text-anchor", "start")
				.text(function(d) {return d.label});
	}
}
