
function toNumber(d) {
  d.age = +d.age; // coerce to number
  return d;
}

function barchart(){
    var width = 960,
	height = 500;

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

    var fitWidth = d3.scaleBand().range([0,width])
    
    var fitHeight = d3.scaleLinear()
	.range([height,0]);
    
    var container = d3.select("svg")
	.attr("height",height+margin.top+margin.bottom)
    	.attr("width",width+margin.left+margin.right)    
    //all child objects will be offset by the margin using this anchor
	.append("g").attr("transform",
			  "translate(" + margin.left + "," + margin.top + ")");
    
    container.selectAll("*").remove();
    
    d3.csv("https://albertcheu.github.io/scratch/sahd.csv",toNumber,
	   function(error,data){
	       //all axis objects will be offset using this second anchor
	       container.append("g")
		   .attr("transform", "translate(0," + height + ")")
		   .call(d3.axisBottom(fitWidth));

	       //plot only the first few rows to avoid skinny bars
	       data = data.slice(1,40)
	       fitWidth.domain(Array(40))
	       fitHeight.domain([0, d3.max(data,function(d) { return d.age; })]);
	       //console.log(data)

	       var barWidth = width / data.length;
	       //container.attr("height", barHeight * data.length);
	       
	       var bar = container.selectAll(".bar")
		   .data(data)
		   .enter().append("g")
		   .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });
	       
	       bar.append("rect")
		   .attr("y", function(d) { return fitHeight(d.age); })
		   .attr("height", function(d) { return height - fitHeight(d.age); })
		   .attr("width", barWidth - 1);

	       bar.append("text")
		   .attr("x", barWidth / 2)
		   .attr("y", function(d) { return fitHeight(d.age) + 3; })
		   .attr("dy", ".75em")
		   .text(function(d) { return d.age; });
	   }
	  );
}
