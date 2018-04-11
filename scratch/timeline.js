function timeline(){
    
    var data = ['2018-01-19 20:36:2', '2018-01-20 20:36:2', '2018-01-21 20:36:2', '2018-01-22 20:36:2', '2018-01-23 20:36:2', '2018-01-24 20:36:2', '2018-01-25 20:36:2']

    var width = d3.select("#timelineDiv").node().getBoundingClientRect().width;
    
    var margin = {top: 200, right: 40, bottom: 200, left: 40},
	height = 500 - margin.top - margin.bottom;
    width = width - margin.left - margin.right;
    
    var tl = d3.select("#timeline");
    setsize("#timeline",width,height);

    tl.append("rect")
	.attr("width", width)
	.attr("height", height)
	.attr("fill", "gray")
	.attr("stroke", "black");    
    //ADD TICKS
    //define date in terms of range


    var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");


    var xScale = d3.scaleLinear()
	.domain(d3.extent(data, function(d){return parseTime(d);}))
	.range([0, width]);
    
    tl.append("g")
	.call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y-%m-%d")))
	.selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")    
    ;

    var brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", function(){
	    if (!d3.event.sourceEvent) return; // Only transition after input.
	    if (!d3.event.selection) return; // Ignore empty selections.
	    var d0 = d3.event.selection.map(xScale.invert),
		d1 = d0.map(d3.timeDay);
	    
	    //data works
	    console.log(d0);
	});
    
    tl.append("g")
	.attr("class", "brush")
	.call(brush);
}
