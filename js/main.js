const	BASE_URL = "http://localhost:8000",
		REAL_TIME_SCATTERPLOT_FILE = BASE_URL + "/results/scatterplot_clustering.csv",
		OUTPUT_DIV_CLASS = ".chart",
		UPDATE_TIME = 5000;

//const timer = window.setInterval(event, UPDATE_TIME);
var currentPage = 'Home';
var plot = new ClusteringScatterPlot(OUTPUT_DIV_CLASS, REAL_TIME_SCATTERPLOT_FILE);

window.addEventListener('resize', function() {
		plot.updatePoints();
		plot.translateAndScale();
});

function event() {
	console.log("updating ...");
		plot.updatePoints();
}

function resizeIframe(obj) {
  obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

function switchContent(content) {
		currentPage = content;
		const title = document.getElementById('title').innerHTML = content;
		switch(content) {
	    case 'Scatterplot':
					document.getElementsByClassName('chart')[0].innerHTML = "";
					plot = new ClusteringScatterPlot(OUTPUT_DIV_CLASS, REAL_TIME_SCATTERPLOT_FILE);
					plot.init();
	        break;
			case 'Scatterplot ELKI':
					document.getElementsByClassName('chart')[0].innerHTML = "";
					plot = new ClusteringELKIScatterPlot(OUTPUT_DIV_CLASS, REAL_TIME_SCATTERPLOT_FILE);
					plot.init();
	        break;
	    case 'Heatmap':
					document.getElementsByClassName('chart')[0].innerHTML = "";
					plot = new ClusteringHeatmap(OUTPUT_DIV_CLASS, REAL_TIME_SCATTERPLOT_FILE);
					plot.init();
	        break;
			case 'Metrics':
					document.getElementsByClassName('chart')[0].innerHTML = "";
					var height = $("BODY").height() - $("#title").height() - 30;
					document.getElementsByClassName('chart')[0].innerHTML = '<iframe  src="content/metrics.html" width="100%" height="'+height+'" frameborder="0"/>';
	        break;
	    default:
					document.getElementsByClassName('chart')[0].innerHTML = "<p>This website is a dashboard for MiLOF clustering</p>";
			}
}
