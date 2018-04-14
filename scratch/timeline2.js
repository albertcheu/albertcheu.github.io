var t = {svg:null,width:null,height:null,width2:null,height2:null};

function timeline2() {
    //Add grab-hands on both sides of the timeline

    
    t.svg = d3.select("#timeline"),
    marginPercentage = {top: 0, right: 4, bottom: 55, left: 4},
    marginPercentage2 = {top: 65, right: 4, bottom: 10, left: 4};
    var realHeight = +t.svg.attr("height"),
	realWidth = +t.svg.attr("width");
    var margin = {top:marginPercentage.top * realHeight / 100,
		  bottom:marginPercentage.bottom * realHeight / 100,
		  left:marginPercentage.left * realWidth / 100,
		  right:marginPercentage.right * realWidth / 100
		 }
    var margin2 = {top:marginPercentage2.top * realHeight / 100,
		   bottom:marginPercentage2.bottom * realHeight / 100,
		   left:marginPercentage2.left * realWidth / 100,
		   right:marginPercentage2.right * realWidth / 100
		  }
    t.width = +t.svg.attr("width") - margin.left - margin.right,
    t.height = +t.svg.attr("height") - margin.top - margin.bottom,
    t.height2 = +t.svg.attr("height") - margin2.top - margin2.bottom;

    var parseDate = d3.timeParse("%Y-%m-%d");

    var x = d3.scaleTime().range([0, t.width]),
	x2 = d3.scaleTime().range([0, t.width]),
	y = d3.scaleLinear().range([t.height, 0]),
	y2 = d3.scaleLinear().range([t.height2, 0]);

    var xAxis = d3.axisTop(x),
	xAxis2 = d3.axisBottom(x2),
	yAxis = d3.axisLeft(y),
	yAxis2 = d3.axisLeft(y2).ticks(3);


    var brush = d3.brushX()
	.extent([[0, 0], [t.width, t.height2]])
	.on("brush end", brushed)

    var zoomT = d3.zoom()
    	.scaleExtent([1, Infinity])
    	.translateExtent([[0, 0], [t.width, t.height]])
    	.extent([[0, 0], [t.width, t.height]])
    	.on("zoom", zoomedT);

    var area = d3.area()
	.curve(d3.curveMonotoneX)
	.x(function(d) { return x(d.date); })
	.y0(t.height)
	.y1(function(d) { return y(d.count); });

    var area2 = d3.area()
	.curve(d3.curveMonotoneX)
	.x(function(d) { return x2(d.date); })
	.y0(t.height2)
	.y1(function(d) {console.log(d.count, y2(d.count)); return y2(d.count); });

    t.svg.append("defs").append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", t.width)
	.attr("height", t.height2);

    var focus = t.svg.append("g")
    	.attr("class", "focus")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = t.svg.append("g")
	.attr("class", "context")
	.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    d3.csv("https://gist.githubusercontent.com/00h-i-r-a00/b4a5809236762e34320216d1ebd29741/raw/c3161683e22e107c51da3df1db7db89e46608097/dates_unique.csv", type, function(error, data) {
	if (error) throw error;

	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain([0, d3.max(data, function(d) { return Number(d.count); })]);
	x2.domain(x.domain());
	y2.domain(y.domain());
	// focus.append("path")
	//     .datum(data)
	//     .attr("class", "area")
	//     .attr("d", area);

	focus.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + t.height + ")")
	    .call(xAxis);

	//   focus.append("g")
	//       .attr("class", "axis axis--y")
	//       .call(yAxis);

	context.append("path")
	    .datum(data)
	    .attr("class", "area")
	    .attr("d", area2);

	context.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + t.height2 + ")")
	    .call(xAxis2);


	context.append("g")
	    .attr("class", "axis axis--y")
	    .call(yAxis2);



	var gBrush  = context.append("g")
	    .attr("class", "brush")
	    .call(brush)
	    .call(brush.move, [x.range()[0] + 100, x.range()[1] - 100]);
	

	t.svg.append("rect")
	    .style("opacity",0)
	    .attr("class", "zoomT")
	    .attr("width", t.width)
	    .attr("height", t.height)
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	    .call(zoomT);
    });


    function brushed() {
	if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
	var s = d3.event.selection || x2.range();
	x.domain(s.map(x2.invert, x2));
	focus.select(".area").attr("d", area);
	focus.select(".axis--x").call(xAxis);
	t.svg.select(".zoomT").call(zoomT.transform, d3.zoomIdentity
				    .scale(t.width / (s[1] - s[0]))
				    .translate(-s[0], 0));
	//Get the data
	console.log(s[0], s[1]);

	var midpointy = ((t.height + margin.bottom - t.height2 - margin2.bottom) - t.height)/2  + t.height;
	var midpoint1 = margin.left.toString() + "," + midpointy.toString();
	var midpoint2 = (margin.left + t.width).toString() + "," + midpointy.toString();
	var point1 = (s[0] + margin.left).toString() + "," + (t.height + margin.bottom - t.height2 - margin2.bottom).toString();
	var point2 = (margin.left).toString() + "," + (t.height).toString(); //fixed
	var point3 = (margin.left + t.width).toString() + "," + (t.height).toString() ; //fixed
	var point4 = (s[1] + margin.left).toString() + "," + (t.height + margin.bottom - t.height2 - margin2.bottom).toString();
	
	var points_position = point1 + " " + midpoint1 + " " + point2 + " " + point3 + " " + midpoint2 + " " + point4;

	// var points_position = point1 + " " + point2 + " " + point3 + " " + point4;

	t.svg.select("#polygon")
	    .attr("points", points_position)
	    .attr("fill", "lightgray")
	    .attr("stroke", "black")
	    .attr("stroke-width", "0.75")

	//Create a shape based on

	//Get the Date Range Over Here
	//console.log("Start: " + x2.invert(s[0]));
	//console.log("End: " + x2.invert(s[1]));
    }

    function zoomedT() {
	if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
	var t = d3.event.transform;
	x.domain(t.rescaleX(x2).domain());
	focus.select(".area").attr("d", area);
	focus.select(".axis--x").call(xAxis);
	context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }

    function type(d) {
	d.date = parseDate(d.date);
	d.price = +d.count;
	return d;
    }




}
