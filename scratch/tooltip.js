
function tooltip(){
    var tooltip = d3.select(".tooltip");

    d3.select("#hoverhelp").on("mouseover", function(d) {		
	tooltip.transition()		
            .duration(200)		
            .style("opacity", .9);		
	tooltip	
            .style("left", (d3.event.pageX+15) + "px")		
            .style("top", (d3.event.pageY+15) + "px");	
    })				
	.on("mouseout", function(d) {		
            tooltip.transition()		
		.duration(500)		
		.style("opacity", 0);	
	});
}
