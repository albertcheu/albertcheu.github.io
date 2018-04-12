function ispGraph(){
    //populate the graph svg,make x axis y axis

    barssvg = d3.select("#ispGraph");//.style("width","100%");
//    bars = barssvg.append("g").attr("class","comparecharts");

    //divHeight = document.getElementById('ispGraph').clientHeight;
    //divWidth = document.getElementById('ispGraph').clientWidth;
    divWidth = d3.select(".leftpanel").node().getBoundingClientRect().width;
    divHeight = d3.select("#ispGraph").node().getBoundingClientRect().height;
    
//    divHeight = d3.select(".leftpanel").node().getBoundingClientRect().height;
//    console.log("Bar chart dimensions:" + divWidth+","+divHeight);
    setsize("#ispGraph",divWidth,divHeight);
    
    divmargin = { top: 25,
		      left: 45,
		      right: 100,
		      bottom: 45 };

    divHeight = d3.select(".leftpanel").node().getBoundingClientRect().height;
    
    divmargin = { top: 15,
		      left: 15,
		      right: 15,
		      bottom: 15 };
    
    /*divxScale = d3.scaleBand().domain([0,100000]).range([divmargin.left,divWidth-divmargin.right]);
    divyScale = d3.scaleLinear().domain([0,5]).range([divHeight-divmargin.bottom,divmargin.top]);
    
    divxAxis = barssvg.append("g").attr("transform","translate(0," + (divHeight - divmargin.bottom) + ")" )
	.call(d3.axisBottom().ticks(50).scale(divxScale)).append("text").attr("x", divWidth / 2)
        .attr("y", divmargin.bottom * 0.9)
        .attr("dx", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start").text("Number of Tests");
*/
    //populate the isp selector
    var ispSelector = d3.select("#ispSelector")
    var i = 0;
/*    for (var i = 0; i < 10; i++){
    	ispSelector.append("option").attr("value",i).html("ISP number "+i);
	}*/

    ispSelector.append("option").attr("value","Verizon").html("Verizon");
    i = i + 1;
    ispSelector.append("option").attr("value","Sprint").html("Sprint");
    
    //make sure it is wide enough
    $("#ispSelector").select2({placeholder:"Select ISPs and carriers"});
    $("#ispSelector").select2({maximumSelectionSize: 2,closeOnSelect: false});
    d3.select(".select2").attr("style","width:100%;");
    d3.select(".select2-selection__rendered").attr("style","width:100%;");
    d3.select(".select2-search__field").attr("style","width:100%;");

    var unSelected;
    
    $('#ispSelector').on("select2:close", function(e) {
//	console.log("Hi");
//	console.log($('#ispSelector').select2("val"));
	var inputISP = $('#ispSelector').val(); //array containing selected values
//	console.log(inputISP[0])
	make_graph(inputISP);
    });


    $('#ispSelector').on("select2:unselect", function(e) {
	unSelected = $("#ispSelector").find('option').not(':selected');
	console.log("unselected value is: "+ unSelected[0].text);
	barssvg.attr("fill",function(d){console.log("reached");}).selectAll("#" + unSelected[0].text).transition().delay(500).duration(1000).attr("fill","white").style("fill","white");
    });
    
}

function update_url(ispInput) {
    //return URL_BASE + "?dest=" + document.getElementById("dest").value + "&time=" + document.getElementById("time").value + "&station=" + document.getElementById("station_select").value + "&day=" + document.getElementById("day_select").value;
    //put an if block check the input isps
    return URL_BASE + "?dest=" + ispInput[0] + "&dest2=" + ispInput[1];
}

// Convert csv data to number types
function type(d) {
  d.etd = +d.etd;
  d.count = +d.count;
  return d;
}

function make_graph(inputISP) {
    //update_slider(+document.getElementById("time").value);
//    if (!unSelected[0].text){
    url = update_url(inputISP);
    d3.csv(url, type, function(error, data) {
	data.forEach(function(d){
	    d.YesCount = +d.YesCount;
	    d.NoCount = +d.NoCount;
	});

	var finaldata = {isps: [], counts: []};
	finaldata.isps.push(inputISP[0]);
	finaldata.isps.push(inputISP[1]);

	finaldata.counts.push({Throttling: "Yes",values: []});
	finaldata.counts.push({Throttling: "No",values: []});

	var j = 0;
	for (i = 0; i < data.length; i++) { 
	    finaldata.counts[j].values.push(data[i].YesCount);
	}
	j+=1;
	for (i=0; i <data.length; i++) {
	    finaldata.counts[j].values.push(data[i].NoCount);
	}
	var chartWidth = divWidth,
	    barHeight = 20,
	    groupHeight = barHeight * finaldata.counts.length,
	    gapBetweenGroups = 20,
	    spaceForLabels = 45,
	    spaceForLegend = 45;

	// Zip the series data together (first values, second values, etc.)
	var zippedData = [];
	for (var i = 0; i < finaldata.isps.length; i++) {
	    for (var j = 0; j < finaldata.counts.length; j++) {
		zippedData.push(finaldata.counts[j].values[i]);
	    }
	}
//	console.log(zippedData);
	// Color scale
	var color = d3.scaleOrdinal(["#000100", "#FF5417"]);
//	var chartHeight = barHeight * zippedData.length + gapBetweenGroups * finaldata.isps.length;


	var chartHeight = barHeight * zippedData.length + gapBetweenGroups * finaldata.isps.length;
	
	var divxScale = d3.scaleLinear()
	    .range([divWidth, 0]);
	
	var x = d3.scaleLinear()
	    .domain([0, d3.max(zippedData)])
	    .range([0, divWidth - divmargin.right - 60]);
	
	var y = d3.scaleLinear()
	    .range([divHeight - divmargin.bottom - 25, 0]);
	
//	var barssvg = d3.select("#ispGraph").attr("width", spaceForLabels + chartWidth + spaceForLegend).attr("height", chartHeight);
	
	var yAxis = d3.axisLeft().scale(y).tickFormat('').tickSize(0);

	var xAxis = d3.axisBottom().scale(x).tickFormat('').tickSize(0);

	// Create bars
	var bar = barssvg.selectAll("g")
	    .data(zippedData)
	    .enter().append("g")
	    .attr("transform", function(d, i) {
		console.log("hi i is: " + i);
		return "translate(" + (spaceForLabels + 20) + "," + (divmargin.top + 45 + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / finaldata.counts.length)))) + ")";
	    });
	
	// Create rectangles of the correct width
	bar.append("rect")
	    .attr("fill", function(d, i) {
		return color(i % finaldata.counts.length);
	    })
	    .attr("class", "bar")
	    .attr("width", x)
	    .attr("height", barHeight - 1)
	    .attr("id", function(d, i) {
		if (i % finaldata.counts.length === 0){
		    
		    return finaldata.isps[Math.floor(i / finaldata.counts.length)];}
		else{
		    
		    return finaldata.isps[Math.floor((i - 1) / finaldata.counts.length)];}
	    });
	
	// Add text label in bar
	bar.append("text")
	    .attr("x", function(d) {
		return x(d) - 20;
	    })
	    .attr("y", barHeight / 2)
	    .attr("fill","white")
	    .attr("dy", ".35em")
	    .text(function(d) {
		return d;
	    });
	
	// Draw labels
	bar.append("text")
	    .attr("class", "label")
	    .attr("x", function(d) {
		return -15;
	    })
	    .attr("y", groupHeight / 2)
	    .attr("dy", ".45em")
	    .attr("fill", "black")
	    .text(function(d, i) {
		if (i % finaldata.counts.length === 0)
		    return finaldata.isps[Math.floor(i / finaldata.counts.length)];
		else
		    return ""
	    })
	    .attr("id", function(d, i) {
		if (i % finaldata.counts.length === 0)
		    return finaldata.isps[Math.floor(i / finaldata.counts.length)];
		else
		    return ""
	    });
	
	barssvg.append("g")
	    .attr("class", "y axis")
	    .attr("transform", "translate(" + (spaceForLabels + 20) + ", " + (divmargin.top) + ")")
	    .call(yAxis);

	barssvg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(" + (spaceForLabels + 20) + ", " + (divHeight - divmargin.bottom - 10) + ")")
	    .call(xAxis);
	
	// Draw legend
	var legendRectSize = 18,
	    legendSpacing = 4;
	
	var legend = barssvg.selectAll('.legend')
	    .data(finaldata.counts)
	    .enter()
	    .append('g')
	    .attr('transform', function(d, i) {
		var height = legendRectSize + legendSpacing;
		var offset = -gapBetweenGroups / 2;
		var horz = divWidth - divmargin.right - 50;
		var vert = i * height - offset;
		return 'translate(' + horz + ',' + vert + ')';
	    });
	console.log(chartWidth - divmargin.right);
	legend.append('rect')
	    .attr('width', legendRectSize+20)
	    .attr('height', legendRectSize)
	    .style('fill', function(d, i) {
		return color(i);
	    })
	    .style('stroke', function(d, i) {
		return color(i);
	    });
	
	legend.append('text')
	    .attr('class', 'legend')
	    .attr('x', legendRectSize + legendSpacing -10)
	    .attr('y', legendRectSize - legendSpacing)
	    .attr("fill","white")
	    .text(function(d) {
		return d.Throttling;
	    });

	
	/*
	
	var divy0Scale = d3.scaleBand()
	    .rangeRound([0, divHeight]).paddingInner(0.2);
	
	var divy1Scale = d3.scaleOrdinal();

	var divxScale = d3.scaleLinear()
	    .range([divWidth, 0]);
	
	//	divxScale = d3.scaleLinear().range([divmargin.left,divWidth-divmargin.right]);
	//	divyScale = d3.scaleBand().range([divHeight-divmargin.bottom,divmargin.top]);
	
	console.log("hi");
//	console.log(d3.max([data[0].YesCount,data[0].NoCount]));
	divxScale.domain([0, d3.max(data, function(d) { return d3.max([d.YesCount,d.NoCount]); })]);
	
	divy0Scale.domain(data.map(function(d) { return d.ISP; }));

	divy1Scale.domain(["Yes","No"]).range([0,divy0Scale.bandwidth()]);
	
	divxAxis = barssvg.append("g").attr("transform","translate(0," + (divHeight - divmargin.bottom) + ")" )
	    .call(d3.axisBottom().scale(divxScale).ticks(10).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-divHeight]))
	    .append("text")
	    .attr("x", divWidth / 2)
            .attr("y", divmargin.bottom * 0.9)
            .attr("dx", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle").text("Number of Tests");

Not needed anymore, not using this.-----------------
	
=======

>>>>>>> d6c09ba0ca96d602d6b36346f57d65f5191d7c1d
	data2 = data.filter(function(d){return d.diff == 'True';});

	data3 = data.filter(function(d){return d.diff == 'False';});

	data4 = d3.nest().key(function(d) { return d.diff; })
	    .rollup(function(v) { return d3.sum(v, function(d) { return 1; }); }).entries(data2);
	
	data5 = d3.nest().key(function(d) { return d.diff; })
	    .rollup(function(v) { return d3.sum(v, function(d) { return 1; }); }).entries(data3);
	
	divyAxis = barssvg.append("g").attr("transform","translate(" + divmargin.left + ",0)" )
	    .call(d3.axisLeft().scale(divyScale).tickSize(0))
	    .append("text").attr("x", divmargin.left)
            .attr("y", divHeight / 2)
            .attr("dx", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start").text("ISP");
	
<<<<<<< HEAD
	var barwidth = 30;
	var bars = barssvg.append("g").selectAll("#truebars")
	    .attr("id","truebars")
	    .data(data)
	    .enter()
	    .append("rect")
	    .attr("x",function(d){return divmargin.left;})
	    .attr("y",function(d){return divyScale(2)+20;})
	    .attr("height",barwidth)
	    .attr("width",function(d){return divWidth - divmargin.left - divxScale(d.YesCount);})
	    .attr("fill","red")
	    .attr("stroke","black")
	    .attr("stroke-width",2);
======
	var barwidth = 20;
	var bars = barssvg.selectAll("rect")
	    .data(data4)
	    .enter()
	    .append("rect")
	    .attr("x",function(d){return 0;})
	    .attr("y",function(d){return divyScale(4);})
	    .attr("height",barwidth)
	    .attr("width",function(d){return divWidth - divmargin.left - xScale(d.value);})
	    .attr("fill","red")
	    .attr("stroke","black")
	    .attr("stroke-width",2);
>>>>>>> d6c09ba0ca96d602d6b36346f57d65f5191d7c1d */
    });
    }

