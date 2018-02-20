
function toNumber(d) {
    // coerce to number
    d.obesity = +d.obesity;
    d.adiposity = +d.adiposity;
    return d;
}

function scatterplot(){
    var width = 960,
	height = 500;
    
    var fitY = d3.scaleLinear().range([height-2,0]);
    var fitX = d3.scaleLinear().range([0,width-2])

    var container = d3.select("svg")
	.attr("height",height)
    	.attr("width",width);

    container.selectAll("*").remove();
  
    d3.csv("https://albertcheu.github.io/scratch/sahd.csv",toNumber,
	   function(error,data){

	       fitY.domain([d3.min(data,function(d) { return d.obesity; }),
			    d3.max(data,function(d) { return d.obesity; })]);
	       fitX.domain([d3.min(data,function(d) { return d.adiposity; }),
			    d3.max(data,function(d) { return d.adiposity; })]);

	       var point = container.selectAll(".point")
		   .data(data)
		   .enter().append("g")
		   .attr("transform", function(d, i) { return "translate("+fitX(d.adiposity)+","+fitY(d.obesity)+")"});
	       
	       point.append("circle")
		   .attr("r",2);	       
	   }
	  );
}
