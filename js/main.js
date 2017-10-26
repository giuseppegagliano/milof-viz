const	BASE_URL = "http://localhost:8000",
		REAL_TIME_SCATTERPLOT_FILE = BASE_URL + "/results/scatterplot_clustering.csv",
		OUTPUT_DIV_CLASS = ".chart",
		PLOT_WIDTH = 500,	PLOT_HEIGHT = 500,
		UPDATE_TIME = 5000;

const timer = window.setInterval(event, UPDATE_TIME);
var svg, x, y, xAxis, yAxis, newData;
var clusteringScatterPlot;

window.onload = function(e){
	clusteringScatterPlot = new ClusteringScatterPlot(OUTPUT_DIV_CLASS, PLOT_WIDTH, PLOT_HEIGHT, REAL_TIME_SCATTERPLOT_FILE);
	clusteringScatterPlot.init();
}

function event() {
	clusteringScatterPlot.updatePoints();
}
