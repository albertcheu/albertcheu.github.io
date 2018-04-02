function ispGraph(){
    //populate the graph svg,make x axis y axis

    barssvg = d3.select("#ispGraph");//.style("width","100%");
    bars = barssvg.append("g").attr("class","comparecharts");

    //divHeight = document.getElementById('ispGraph').clientHeight;
    //divWidth = document.getElementById('ispGraph').clientWidth;
    divWidth = d3.select(".leftpanel").node().getBoundingClientRect().width;
    divHeight = d3.select(".leftpanel").node().getBoundingClientRect().height;
    console.log("Bar chart dimensions:" + divWidth+","+divHeight);
    setsize("#ispGraph",divWidth,divHeight);
    
    divmargin = { top: 15,
		      left: 15,
		      right: 15,
		      bottom: 15 };
    
    divxScale = d3.scaleBand().domain([0,100000]).range([divmargin.left,divWidth-divmargin.right]);
    divyScale = d3.scaleLinear().domain([0,5]).range([divHeight-divmargin.bottom,divmargin.top]);
    
    divxAxis = barssvg.append("g").attr("transform","translate(0," + (divHeight - divmargin.bottom) + ")" )
	.call(d3.axisBottom().ticks(50).scale(divxScale)).append("text").attr("x", divWidth / 2)
        .attr("y", divmargin.bottom * 0.9)
        .attr("dx", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start").text("Number of Tests");

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
    $("#ispSelector").select2({maximumSelectionSize: 1});
    d3.select(".select2").attr("style","width:100%;");
    d3.select(".select2-selection__rendered").attr("style","width:100%;");
    d3.select(".select2-search__field").attr("style","width:100%;");

    $('#ispSelector').on("change", function(e) {
//	console.log("Hi");
//	console.log($('#ispSelector').select2("val"));
	var inputISP = $('#ispSelector').val();
//	console.log(inputISP[0])
	make_graph(inputISP[0],divmargin);
    });
}

function update_url(ispInput) {
    //return URL_BASE + "?dest=" + document.getElementById("dest").value + "&time=" + document.getElementById("time").value + "&station=" + document.getElementById("station_select").value + "&day=" + document.getElementById("day_select").value;
    return URL_BASE + "?dest=" + ispInput;
}

// Convert csv data to number types
function type(d) {
  d.etd = +d.etd;
  d.count = +d.count;
  return d;
}

function make_graph(inputISP) {
  //update_slider(+document.getElementById("time").value);
    url = update_url(inputISP);
    console.log(url);
    d3.csv(url, type, function(error, data) {

	data2 = data.filter(function(d){return d.diff == 'True';});

	data3 = data.filter(function(d){return d.diff == 'False';});

	data4 = d3.nest().key(function(d) { return d.diff; })
	    .rollup(function(v) { return d3.sum(v, function(d) { return 1; }); }).entries(data2);
	
	data5 = d3.nest().key(function(d) { return d.diff; })
	    .rollup(function(v) { return d3.sum(v, function(d) { return 1; }); }).entries(data3);
	
	divyAxis = barssvg.append("g").attr("transform","translate(" + divmargin.left + ",0)" )
.call(d3.axisLeft().scale(divyScale)).append("text").attr("x", divmargin.bottom - 120)
            .attr("y", divHeight / 2)
            .attr("dx", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start").text("ISP");
	
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
    });
}
