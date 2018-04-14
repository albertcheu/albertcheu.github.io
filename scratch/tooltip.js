function abs(a,b){
    var amb = a-b;
    var bma = b-a;

    if (amb >= 0) { return amb; }
    return bma;
}

function displayTooltip(d){
    var whichMap = world;
    if (inAmerica) { whichMap = us; }
        
    var tooltip = d3.select("#countryTooltip");

    tooltip.html("<p>"+d.name+"</p>")
        .transition()
    	.duration(200)
    	.style("left", (d3.event.pageX+15) + "px")		
    	.style("top", (d3.event.pageY+15) + "px")
    	.style("opacity", .9);

    // if (abs(d3.event.pageX,tooltip.style("left")) < 100
    // 	&& abs(d3.event.pageY,tooltip.style("top")) < 100){
    // 	tooltip
    // 	    .transition()
    // 	    .duration(200)
    // 	    .style("left", (d3.event.pageX+15) + "px")		
    // 	    .style("top", (d3.event.pageY+15) + "px")
    // 	    .style("opacity", .9);
    // }
    // else {
    // 	tooltip
    // 	    .style("left", (d3.event.pageX+15) + "px")		
    // 	    .style("top", (d3.event.pageY+15) + "px")
    // 	    .transition()
    // 	    .duration(200)
    // 	    .style("opacity", .9);
    // }

}

function hideTooltip(){
    d3.select("#countryTooltip")
	.transition()		
	.duration(500)		
	.style("opacity", 0);
}

