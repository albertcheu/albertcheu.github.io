
function toNumber(d) {
    // coerce to number
    d.obesity = +d.obesity;
    d.adiposity = +d.adiposity;
    return d;
}

function scatterplot(){
    //hide bar chart
    d3.select(".barchart").style("opacity",0)//remove()

    //if we made a scatterplot already, show it and quit
    var sp = d3.select(".scatterplot");
    if (! sp.empty()) {
	sp.style("opacity",1);
	return;
    }

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
        
    var fitY = d3.scaleLinear().range([height-2,0]);
    var fitX = d3.scaleLinear().range([0,width-2])

    var container = d3.select("svg")
	.attr("height",height)
    	.attr("width",width)
	.append("g").attr("class","scatterplot")
    
    d3.csv("https://albertcheu.github.io/scratch/sahd.csv",toNumber,
	   function(error,data){

	       fitY.domain([d3.min(data,function(d) { return d.obesity; }),
			    d3.max(data,function(d) { return d.obesity; })]);
	       fitX.domain([d3.min(data,function(d) { return d.adiposity; }),
			    d3.max(data,function(d) { return d.adiposity; })]);

	       var point = container.selectAll(".point")
		   .data(data)
		   .enter().append("g")
	       	   .attr("class","point")
		   .attr("transform", function(d, i) { return "translate("+fitX(d.adiposity)+","+fitY(d.obesity)+")"});
	       
	       point.append("circle")
		   .attr("r",2);

	       point.exit().remove();
	   }
	  );
}
