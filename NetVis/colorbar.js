function initColorbar(){
    var cWidth = 400;
    var cHeight = 30;

    var leftMargin = 15;
    var rightMargin = 40;

    var cbarSvg = d3.select("#colorbar")
	.attr("width",cWidth)
	.attr("height",cHeight);
    var cbar = cbarSvg.append("g");
    
    var bars = cbar.selectAll(".colorstrip")
	.data(d3.range(cWidth-(leftMargin+rightMargin)), function(d) { return d; })
	.enter().append("rect")
	.attr("class", "colorstrip")
	.attr("x", function(d, i) { return i+leftMargin; })
	.attr("y", 0)
	.attr("height", cHeight)
	.attr("width", 1)
	.style("fill","purple")
	.style("opacity",function(d,i) { return d / (cWidth-(leftMargin+rightMargin));})
	//.style("fill", function(d, i) { return colorScale(d); })

      cbar.selectAll(".bars")
        .transition()
	.style("opacity",function(d,i) { return d / cWidth;})
    //.style("fill", function(d) { return colorScale(d); });
    cbarSvg.append("text").text(0).attr("transform","translate("+(leftMargin/2)+","+(cHeight/2)+")");
    cbarSvg.append("text")
	.attr("id","maxTests")
	.text(10000)
	.attr("transform","translate("+(cWidth-rightMargin/2)+","+(cHeight/2)+")");
}
