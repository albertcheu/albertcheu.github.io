function setsize(selection,width,height){
    
    var container = d3.select(selection)
    container.attr("height",height);
    container.attr("width",width);

    container.style("height",height);
    container.style("width",width);
}
