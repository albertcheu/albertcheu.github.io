function setsize(width,height){
    
    var container = d3.select("svg")
	if (container.attr("height") != height){
        container.attr("height",height);
    }
    if (container.attr("width") != width){
    	container.attr("width",width);
    }
}