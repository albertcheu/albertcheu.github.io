function abs(a,b){
    var amb = a-b;
    var bma = b-a;

    if (amb >= 0) { return amb; }
    return bma;
}

var tooltipWidth = 0;

function initTooltip(){
    
    //tooltip always follows mouse
    $(document).on('mousemove',function(e){
	$("#regionTooltip").css({
	    top:e.pageY-25,
	    left:e.pageX-tooltipWidth/2
	});
    });
    //take away the space that the tooltip uses once it ceases to be relevant
    m.svg.on('mouseleave',function(){
	d3.select('#regionTooltip').style('display','none');
    });
    
    d3.select('#arcDiff').attr("transform", "translate(30,30)");
    d3.select('#arcNoDiff').attr("transform", "translate(30,30)");
    d3.select('#donutHole').attr("transform", "translate(30,30)");
    d3.select('#numTestsInRegion').attr("transform", "translate(30,30)");

}

function displayTooltip(d){
    var whichMap = world;
    if (inAmerica) { whichMap = us; }

    //change the name
    d3.select('#regionName').html("<p>"+d.name+"</p>");

    var degree = -1;
    var arcData = [];
    
    if (inAmerica && us.arcData.hasOwnProperty(d.name)) {
	arcData = whichMap.arcData[d.name];
    }
    else if (!inAmerica && world.arcData.hasOwnProperty(d.code2)) {
	arcData = whichMap.arcData[d.code2];
    }

    //something to show
    if (arcData.length > 0 && arcData[0]+arcData[1] > 0) {
	var ratio = 1;
	if (arcData[1] > 0) { ratio = arcData[0] / arcData[1]; }
	degree = ratio * 2*Math.PI;
	
	//change the arcs
	var arcDiff = d3.arc()
	    .innerRadius(24)
	    .outerRadius(30)
	    .startAngle(0)
	    .endAngle(degree);
	d3.select('#arcDiff')
	    .style('opacity',1)
	    .attr('d',arcDiff);

	var arcNoDiff = d3.arc()
	    .innerRadius(24)
	    .outerRadius(30)
	    .startAngle(degree)
	    .endAngle(2*Math.PI);
	d3.select('#arcNoDiff')
	    .style('opacity',1)
	    .attr('d',arcNoDiff);

	d3.select('#numTestsInRegion').text(arcData[0]+arcData[1]);
    }
    
    else{
	d3.select('#arcDiff')
	    .style('opacity',0);
	d3.select('#arcNoDiff')
	    .style('opacity',0)
	d3.select('#numTestsInRegion').text('No tests');
    }
    
    //keep track of width
    tooltipWidth = d3.select("#regionTooltip").node().getBoundingClientRect().width;
    
    var tooltip = d3.select("#regionTooltip");

    tooltip
        .transition()
    	.duration(400)
	.style("opacity", 1)
	.style('display','block')
}

function hideTooltip(){
    d3.select("#regionTooltip")
    	.transition()		
    	.duration(400)
    .style("opacity", 0)
  //      	.style('display','none')
}

