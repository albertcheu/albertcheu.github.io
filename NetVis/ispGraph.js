function ispGraph(){

    barssvg = d3.select("#ispGraph");
    divWidth = d3.select(".leftpanel").node().getBoundingClientRect().width;
    divHeight = d3.select("#ispGraph").node().getBoundingClientRect().height;
    

    setsize("#ispGraph",divWidth,divHeight);
    document.getElementById('greyISP').setAttribute("style","width:" + String(divWidth) + "px;height:" + String(divHeight) + "px");
    
//    console.log("Bar chart and greyISP dimensions: " + divWidth+","+divHeight);
    
        
    divmargin = { top: 15,
		  left: 15,
		  right: 15,
		  bottom: 15 };
    
    var ispSelector = d3.select("#ispSelector")
    var i = 0;
    var isplist = ["AT&T","Sprint","T-Mobile","Verizon","Verizon Wireless","Vodafone","Ting","Vivo","MetroPCS","Airtel","Boost Mobile","Red Pocket","Etisalat","Telenor","Orange"]

    //add options to isp selector
    for (var i = 0; i < 10; i++){
    	ispSelector.append("option").attr("value",isplist[i]).html(isplist[i]);
    }
       
    //make sure it is wide enough
    
    $("#ispSelector").select2({placeholder:"Select ISPs and carriers"});
    $("#ispSelector").select2({maximumSelectionSize: 2,closeOnSelect: false});
    d3.select(".select2").attr("style","width:100%;");
    d3.select(".select2-selection__rendered").attr("style","width:100%;");
    d3.select(".select2-search__field").attr("style","width:100%;");


   //trigger events, call appropriate function
    $('#ispSelector').on("select2:close", function(e) {
	inputISP = $('#ispSelector').val(); //array containing selected values
    });

    $('#ispSelector').on("select2:unselect", function(e) {
	unSelected = $("#ispSelector").find('option').not(':selected');

	barssvg.selectAll("#" + unSelected[0].text).transition().delay(500).duration(1000).attr("fill","white").style("fill","white");
    });
    
}

function update_url() {
    //create http url, with proper encodings!
    
    var i,urlstring = '?isps=';
    
    for (i = 0; i < inputISP.length; i++) { 
	urlstring += encodeURIComponent(inputISP[i].toLowerCase()) + '&isps=';
    }
    
    modified_url = urlstring.substring(0, urlstring.length - 6);
    
    modified_url += '&country=' + encodeURIComponent(world.activeCode) + '&time=' + encodeURIComponent(timeframe.start) + '&time=' + encodeURIComponent(timeframe.end) + '&state=' + encodeURIComponent(us.ActiveName);
    console.log(URL_BASE + modified_url);
    return URL_BASE + modified_url;
}


function make_graph() {
    
    
    if ((inputISP.length > 0) && (world.activeCode != "") && (timeframe.start != "") && (timeframe.end != "")) {
	
	url = update_url();

	//update the overlay div
	
	document.getElementById('greyISP').style.color = 'white';
	document.getElementById('greyISP').style.zIndex = '200';

	//remove existing children elements of the barssvg
	barssvg.selectAll("*").remove();

	//get data from server
	d3.csv(url, function(error, data) {
	    //make the columns numerical
	    data.forEach(function(d){
		d.YesCount = +d.YesCount;
		d.NoCount = +d.NoCount;
	    });

	    //instead of keeping it csv, I am changing the format of the data to a more convenient one. 

	    var finaldata = {isps: [], counts: []};

	    for (i = 0;i < inputISP.length; i++){
		finaldata.isps.push(inputISP[i]);
	    }
	    
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
		barHeight = 25,
		groupHeight = barHeight * finaldata.counts.length,
		gapBetweenGroups = 20,
		spaceForLabels = 45,
		spaceForLegend = 45;
	    
	    // Zip the series data together (first yes values, then no values)
	    var zippedData = [];
	    for (var i = 0; i < finaldata.isps.length; i++) {
		for (var j = 0; j < finaldata.counts.length; j++) {
		    zippedData.push(finaldata.counts[j].values[i]);
		}
	    }

	    var color = d3.scaleOrdinal(["#FF5417","#000100"]); 
	    var chartHeight = barHeight * zippedData.length + gapBetweenGroups * finaldata.isps.length;

	    
	    var divxScale = d3.scaleLinear()
		.range([divWidth, 0]);
	    
	    var x = d3.scaleLinear()
		.domain([0, d3.max(zippedData)])
		.range([0, divWidth - divmargin.right - 60]);
	    
	    var y = d3.scaleLinear()
		.range([divHeight - divmargin.bottom - 25, 0]);
	    	    
	    var yAxis = d3.axisLeft().scale(y).tickFormat('').tickSize(0);
	    
	    var xAxis = d3.axisBottom().scale(x).tickFormat('').tickSize(0);
	    
	    // Create bars
	    var bar = barssvg.selectAll("g")
		.data(zippedData)
		.enter().append("g")
		.attr("transform", function(d, i) {
		    return "translate(" + (spaceForLabels + 15) + "," + (divmargin.top + 45 + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / finaldata.counts.length)))) + ")";
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
		    return x(d) - 15;
		})
		.attr("y", barHeight / 2)
		.attr("fill","white")
		.style("font-size", "11px")
		.style("font-weight", "bold")
		.attr("dy", ".25em")
		.text(function(d) {
		    return d;
		});
	    
	    // Add axis labels
	    bar.append("text")
		.attr("class", "label")
		.attr("x", function(d) {
		    return -7;
		})
		.attr("y", groupHeight / 2)
		.attr("dy", ".65em")
		.attr("fill", "black")
		.style("font-size", "12px")
		.style("font-weight", "bold")
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

	    //Draw axes
	    barssvg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + (spaceForLabels + 15) + ", " + (divmargin.top) + ")")
		.call(yAxis);
	    
	    barssvg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + (spaceForLabels + 15) + ", " + (divHeight - divmargin.bottom - 10) + ")")
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
	    
	    
	});
    }
    //if all filters aren't selected, display pop up!
    else {
	swal({
	    title: "Ooops!",
	    text: "Please select at least one ISP and one country!",
	    icon: "info",
	});
    }
}

//function to make the overlay div work.
function make_grey()
{
    document.getElementById('greyISP').style.color = '#E6E6FA';
    document.getElementById('greyISP').style.zIndex = '1000';
    document.getElementById('grey_content').innerHTML = "No Data Available!";
}

