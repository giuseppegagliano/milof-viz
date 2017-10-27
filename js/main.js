const	BASE_URL = "http://localhost:8000",
		REAL_TIME_SCATTERPLOT_FILE = BASE_URL + "/results/scatterplot_clustering.csv",
		OUTPUT_DIV_CLASS = ".chart",
		PLOT_WIDTH = 800,	PLOT_HEIGHT = 500,
		UPDATE_TIME = 5000;

const timer = window.setInterval(event, UPDATE_TIME);
var currentPage = 'Home';
var clusteringScatterPlot;

function event() {
	switch(currentPage) {
		case 'Scatterplot':
			clusteringScatterPlot.updatePoints();
			break;
		case 'Heatmap':
        break;
    default:
		}
}

function switchContent(content) {
		currentPage = content;
		const title = document.getElementById('title').innerHTML = content;
		switch(content) {
	    case 'Scatterplot':
					document.getElementsByClassName('chart')[0].innerHTML = "";
					clusteringScatterPlot = new ClusteringScatterPlot(OUTPUT_DIV_CLASS, PLOT_WIDTH, PLOT_HEIGHT, REAL_TIME_SCATTERPLOT_FILE);
					clusteringScatterPlot.init();
	        break;
	    case 'Heatmap':
					document.getElementsByClassName('chart')[0].innerHTML = "";
					clusteringScatterPlot = new ClusteringScatterPlot(OUTPUT_DIV_CLASS, PLOT_WIDTH, PLOT_HEIGHT, REAL_TIME_SCATTERPLOT_FILE);
					clusteringScatterPlot.init();
	        break;
	    default:
					document.getElementsByClassName('chart')[0].innerHTML = "<p>This website is a dashboard for MiLOF clustering</p>";
			}
}
