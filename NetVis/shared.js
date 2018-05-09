function setsize(selection,width,height){
    
    var container = d3.select(selection)
    container.attr("height",height);
    container.attr("width",width);
    container.style("height",height);
    container.style("width",width);
//    console.log("HIIIIIIIIIIII " + "style is " + container.style);
}

function init(){
    //initializeTimeline();
    initializeWrapper();
    initColorbar();
    initMaps();
    ispGraph();

    initTooltip();
    
    d3.selectAll('.content').style('overflow','hidden');

    d3.selectAll('.panel')
	.on('mouseover',function(){
	    d3.select(this).style('background','lightgray');
	})
	.on('mouseleave',function(){
	    d3.select(this).style('background','white');
	});
    
}
