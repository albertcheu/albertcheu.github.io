var URL_BASE = "http://ec2-18-222-4-123.us-east-2.compute.amazonaws.com/";
//var URL_BASE = "http://ec2-18-222-4-123.us-east-2.compute.amazonaws.com";

var m = {
    //constants and objects for zooming
    minZoom:1,
    maxZoom:8,
    zoom:d3.zoom()
	.scaleExtent([1, 8])
	.on("zoom", zoomed),
    //the svg that will hold both world and us maps
    svg:null,
    //proportions of the svg
    width:960,
    height:500,
    scalingFactor:0
}

//the world map: the <g> element, 
var world = { map:null,
	      //the default scale/translation, 
	      identity: d3.zoomIdentity,
	      //the active country <path>,code2, and name,
	      active:d3.select(null),
	      activeCode:"",
	      activeName:"",
	      //the (Mercator) projection
	      path:null,
	      //arcData.activeCode = list of yes/no counts to be drawn in the tooltip
	      arcData:{'US':[0,0]},
	      maxTests:0,
	    };

//similarly for the us map
var us = { map:null, identity: d3.zoomIdentity, active:d3.select(null), activeCode:"", activeName:"",
	   path:null, arcData:{'Maine':[0,0]},maxTests:0};

//indicator variable for which map is currently visible
var inAmerica = false;
var inputISP = [];

var unSelected;

function initMaps(){
    d3.select("#countrySelector")
	.attr("style","width:60%;")
	.on("change",function(){
	    var code2 = $("#countrySelector").val()
	    //console.log(code2.length);
	    clickedCountry(d3.select("#cc"+code2).data()[0]);
	});
        
    //return to the world
    d3.select("#backButton").on("click",function(){
	
	swapMap(us,world);
	reset();

	//make the back button unclickable
	//I don't know why this raw dom javascript is required but d3/jquery selection doesnt work
	document.getElementById("backButton").disabled = true;
	$('#backButton').css('cursor','auto');

	//re-enable the dropdown for country
	document.getElementById("countrySelector").disabled = false;
    });
    
    //populate the map svg
    m.svg = d3.select("#map");
    //enable free zooming
    //m.svg.call(m.zoom);

    //svg has to fit inside the right div
    m.width = 0.95*d3.select(".rightpanel").node().getBoundingClientRect().width;
    m.scalingFactor = m.width / 960;
    m.height *= m.scalingFactor;
    console.log("Map dimensions: "+m.width+","+m.height);
    setsize("#map",m.width,m.height);

    //the ocean fills the svg
    setsize("#ocean",m.width,m.height);

    worldMap();

    usMap();

}

function worldMap(){
    
    //all child objects will be inside this group
    world.map = m.svg.append("g")
	.attr("class","worldmap animated");     
    
    var projection = d3.geoMercator();
    world.path = d3.geoPath().projection(projection);

    //account for the resizing
    world.identity = d3.zoomIdentity
    	.translate(0, m.height / 6)
    	.scale(m.scalingFactor);
    world.map.call( m.zoom.transform, world.identity);

    //draw the countries
    d3.json('http://albertcheu.github.io/NetVis/worldMap.json',
	    function(error, worldmapData) {
		//console.log(worldmapData.objects.countries.geometries[0])

		var pre = topojson.feature(worldmapData,worldmapData.objects.countries);
		var geojsonData = pre.features;
		fixMap(geojsonData);
		preprocessMap(geojsonData,true);
		
		//country = "path" element
		world.map.selectAll("path").data(geojsonData)
		    .enter().append("path")
		    .attr('d', world.path)
		    .attr('class','country region clickable animated fadeIn')
		//.style('stroke-width',0.5)
		    // .classed('overseasfrance',function(d){
		    // 	if (d.code2.startsWith('ZZ')) { return true; }
		    // 	return false;
		    // })
		    .attr('id',function(d){return "cc"+d.code2;})
		    .attr('name',function(d){return d.name;})
		    .on("click",clickedCountry)
		
		    .on("mouseover", function(d) {
			d3.select(this).style('stroke-width',0.5);
			d3.select(this).style('stroke','black');
			displayTooltip(d);
		    })				
		    .on("mouseout", function(d) {
			d3.select(this).style('stroke','white');
			d3.select(this).style('stroke-width',0.05);
			hideTooltip();
		    })
		;
		

		//the following is necessary for good-looking borders
		// world.map.append("path")
		//     .datum(topojson.mesh(worldmapData,worldmapData.objects.countries,
		// 			 function(a, b) { return a !== b; }))
		//     .attr("class", "mesh animated fadeIn")
		//     .attr("d", world.path);
	    }
	   );    
}

function usMap(){
    
    //all child objects will be inside this group
    us.map = m.svg.append("g")
	.style("opacity","0")
	.attr("class","usmap animated");
    
    var projection = d3.geoAlbersUsa();
    us.path = d3.geoPath().projection(projection);

    //account for the resizing
    us.identity = d3.zoomIdentity
    	.scale(m.scalingFactor);

    //draw the states
    d3.json('http://albertcheu.github.io/NetVis/usMap.json',
	    function(error, usmapData) {
		
		var geojsonData = topojson.feature(usmapData,usmapData.objects.states).features;
		preprocessMap(geojsonData,false);
		
		//state = "path" element
		us.map.selectAll("path").data(geojsonData)
		    .enter().append("path")
		    .attr('d', us.path)
		    .attr('class','state region clickable')
		    .attr('id',function(d){return "state"+(d.name.replace(/ /g,''));})
		    .style('pointer-events','none')
		    .on("click",clickedState)
		    .on("mouseover", function(d) {
			d3.select(this).style('stroke-width',0.5);
			d3.select(this).style('stroke','black');
			displayTooltip(d);
		    })				
		    .on("mouseout", function(d) {
			d3.select(this).style('stroke','white');
			d3.select(this).style('stroke-width',0.05);
			hideTooltip();
		    })
		;


		//the following is necessary for good-looking borders
		// us.map.append("path")
		//     .datum(topojson.mesh(usmapData,usmapData.objects.states,
		// 			 function(a, b) { return a !== b; }))
		//     .attr('class','mesh')
		//     .attr("d", us.path);		
	    }
	   );    
}

//switch between the american and world views
function swapMap(from, to){
    inAmerica = !inAmerica;

    if (inAmerica) {
	d3.select("#maxTests").text(us.maxTests);
	d3.select("#colorbarTitle").html("Number of tests");
    }
    else {
	d3.select("#maxTests").text(world.maxTests);
	d3.select("#colorbarTitle").html("Number of tests (saturation log scale");
    }
    
    from.map
	.classed("fadeIn",false)
	.classed("fadeOut",true);
    from.map.selectAll("path").style("pointer-events","none");

    //clear out previous selections
    if (to.active) { to.active.classed("active", false); }
    to.active = d3.select(null);

    //reset to default THEN shift to us-centric view
    to.map.call( m.zoom.transform, d3.zoomIdentity);
    to.map.call( m.zoom.transform, to.identity);
    
    to.map
	.classed("fadeIn",true)
	.classed("fadeOut",false);        
    to.map.selectAll("path").style("pointer-events","auto");
}

//the callback for clicking on a country
function clickedCountry(d) {
    make_grey();
    console.log("You clicked on "+d.code2);
    //console.log(d3.selectAll(".mesh").length);
    
    //if I clicked the selected country, reset view
    if (world.activeCode === d.code2) {
	updateTimeline('ZZ','world');
	return reset();
    }
    updateTimeline(d.code2,'country');
        
    //otherwise deselect and change the active variable
    world.active.classed("active", false);

    world.active = d3.select("#cc"+d.code2);
    world.active.classed("active", true);
    world.activeCode = d.code2;
    world.activeName = d.name;

    //reflect change in the selector
    //console.log(world.activeName);
    $("#countrySelector").val(world.activeCode);
    
    if (d.code2 == 'US') {
	//activate the back button & deactivate the country selector
	document.getElementById("backButton").disabled = false;
	$('#backButton').css('cursor','pointer');
	document.getElementById("countrySelector").disabled = true;
	
	swapMap(world,us);
	return;
    }
    
    //pan & zoom variables
    var bounds = world.path.bounds(d);
    //console.log("x min: "+bounds[0][0]);
    //console.log("y min: "+bounds[0][1]);
    
    //weird bug fix for nz
    if (d.code2=='NZ'){ bounds[0][0] *= 100; }
    
    //fiji crosses the boundaries of the map
    //which leads to bounds[0][0] == -0.5; let's fix that
    else if (d.code2=='FJ') { bounds[0][0] = bounds[1][0]-30;}
    
    zoomToBox(bounds,world);
}

function clickedState(d){
    //console.log("You clicked on "+d.name);
    make_grey();
    //if I clicked an already selected state, reset view
    if (us.activeCode === d.code2) {
	updateTimeline('US','country');
	return reset();
    }
    updateTimeline(d.name,'state');
    
    //otherwise deselect and change the active variable
    us.active.classed("active", false);
    us.active = d3.select("#state"+(d.name.replace(/ /g,'')));
    us.active.classed("active", true);
    us.activeName = d.name;
    us.activeCode = d.code2;
    
    //pan & zoom variables
    var bounds = us.path.bounds(d);

    zoomToBox(bounds,us);
}

function zoomToBox(bounds,whichMap){
    var dx = bounds[1][0] - bounds[0][0],
	dy = bounds[1][1] - bounds[0][1],
	x = (bounds[0][0] + bounds[1][0]) / 2,
	y = (bounds[0][1] + bounds[1][1]) / 2;
    var scale = Math.max(m.minZoom, Math.min(m.maxZoom, 0.9 / Math.max(dx / m.width, dy / m.height))),
	translate = [m.width / 2 - scale * x, m.height / 2 - scale * y];

    //actually pan & zoom
    whichMap.map.transition()
	.duration(750)
	.call( m.zoom.transform,
	       d3.zoomIdentity.translate(translate[0],translate[1])
	       .scale(scale) ); // updated for d3 v4

}

//for when you click on a selected country or the ocean
function reset() {
    make_grey();
    
    var whichMap = world;
    if (inAmerica) {
	updateTimeline('US','country');
	whichMap = us;
    }
    else {
	updateTimeline('ZZ','world');
	$("#countrySelector").val("default");
    }
    
    whichMap.active.classed("active", false);
    whichMap.active = d3.select(null);
    whichMap.activeName = "";
    whichMap.activeCode = "";
    
    whichMap.map.transition()
      .duration(750)
	.call( m.zoom.transform, whichMap.identity ); // updated for d3 v4
    
    //whichMap.map.selectAll(".clickable").style("stroke-width", 0.5);
}

//something from Bostock that is necessary for zooming
function zoomed() {
    var whichMap = world;
    if (inAmerica) { whichMap = us; }
    
    //whichMap.map.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    //whichMap.map.selectAll(".clickable").style("stroke-width", 0.2 / d3.event.transform.k + "px");
    //whichMap.map.selectAll(".clickable").style("stroke-width", 0.05);
    whichMap.map.attr("transform", d3.event.transform); // updated for d3 v4
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
}


function preprocessMap(geojsonData,isWorld){
    var contested = 0;
    var contestedNames = ["Northern Cyprus","?","Contested Pakistan/India","Kosovo","Somaliland"];
    
    for (var i = 0; i < geojsonData.length; i++){
	//promote code2 and name	
	var code2 = geojsonData[i].properties.code2,
	    name = geojsonData[i].properties.name;
	if (code2 === undefined) {
	    code2 = 'Z'+contested;
	    name = contestedNames[contested];
	    contested++;
	}
	geojsonData[i].code2 = code2;
	geojsonData[i].name = name;
	
	if (isWorld) {
	    //add country name to selector
	    d3.select("#countrySelector").append("option")
		.attr("value",geojsonData[i].code2)
		.html(geojsonData[i].name);
	}

    }
    
    //if world map, skip over 12 since 15 already contains AUstralia
    if (isWorld) {
	for (var i = 12; i < geojsonData.length-1; i++){
	    geojsonData[i] = geojsonData[i+1];
	}
	geojsonData.pop();
    }
}

function fixMap(geojsonData){
    //France has far-flung territories, but they mess up zooming!
    //So we make each disjoint island/land mass into its own country

    //France is at index 72
    //France consists of Metro (European) France and Overseas France
    var allFrance = geojsonData[72].geometry.coordinates;
    var overseas = 0;
    var overseasNames = ['Reunion','Mayotte','French Guiana','Martinique','Guadeloupe'];
    var overseasCodes = ['RE','YT','GF','MQ','GP'];
    
    for (var i = 0; i < allFrance.length; i++){
	//an x,y coordinate pair (long,lat)
	var firstPoint = allFrance[i][0][0];
	
	//F. Guiana, Martinique, Guadeloupe (far west)
	if (firstPoint[0] < -30 ||
	    //Reunion & Mayotte (far south)
	    firstPoint[1] < -10) {

	    var poly = allFrance[i];
	    if (overseas < 5) {
		geojsonData.push({type:"Feature",
				  properties:{code2:overseasCodes[overseas],
					      name:overseasNames[overseas]},
				  geometry:{type:"Polygon",coordinates:poly}});
	    }
	    
	    //guadeloupe is the set consisting of the final three shapes; merge them	    
	    else {
		for (var j = 0; j < poly.length; j++){
		    geojsonData[geojsonData.length-1].geometry.coordinates.push(poly[j]);  
		}
	    }
	    
	    allFrance[i] = [];
	    overseas++;
	}

    }

}

//call this function when the timeframe is changed
function updateArcData(){    
    updateArcDataHelper(world,countryPrefix, 'country');
    updateArcDataHelper(us,statePrefix, 'state');

    if (inAmerica) {
	d3.select("#maxTests").text(us.maxTests);
    }
    else {
	d3.select("#maxTests").text(world.maxTests);
    }
}

function updateArcDataHelper(whichMap,prefices,className){
    //empty what was present
    whichMap.arcData = {};
    
    var start = timeframe.start;
    var end = timeframe.end;
    //console.log(start);

    //
    var maxTests = 0;
    var testMap = {};
    
    //for each country in countryPrefix / state in statePrefix
    for (var region in prefices) {
	var data = prefices[region];
	
	////binary search for the data in the range
	var searcher = d3.bisector(function(d) { return d[0]; }).left;
	var startIndex = searcher(data,start);
	searcher = d3.bisector(function(d) { return d[0]; }).right;
	var endIndex = searcher(data,end);

	if (startIndex >= data.length || endIndex < 0) {
	    testMap[region] = 0;
	    whichMap.arcData[region] = [0, 0];
	    continue;
	}
	
	if (startIndex < 0) { startIndex = 0; }
	if (endIndex == data.length) { endIndex = data.length-1; }

	//console.log(startIndex+','+endIndex);

	var numPosStart = 0, numNegStart = 0;
	if (startIndex > 0) {
	    numPosStart = data[startIndex-1][1];
	    numNegStart = data[startIndex-1][2];
	}
	
	var numPosEnd = data[endIndex][1];
	var numNegEnd = data[endIndex][2];
	
	//take the difference
	var numPos = numPosEnd - numPosStart;
	var numNeg = numNegEnd - numNegStart;

	//console.log(country+','+numPos+','+numNeg);
	
	//update arcData
	whichMap.arcData[region] = [numPos, numNeg];

	var numTests = numPos + numNeg;
	var posRatio = numPos / numTests;
	if (className == 'country') {
	    numTests = Math.log2(numTests);
	}
	
	testMap[region] = [numTests, posRatio];
	if (maxTests < numTests) { maxTests = numTests; }
	
    }
    
    whichMap.maxTests = (className=="state")?maxTests:Math.floor(Math.pow(2,maxTests));

    d3.selectAll("."+className)
	.classed('fadeIn',false)
	.style('opacity',function(d) {
	    var r = d.code2;
	    if (className == 'state') { r = d.name; }
	    
	    if (! testMap.hasOwnProperty(r)) { testMap[r] = [0,0]; }

	    return testMap[r][0] / maxTests;
	})
	// .style('fill',function(d){
	//     var r = d.code2;
	//     if (className == 'state') { r = d.name; }

	//     if (testMap[r][0] == 0) { return 'none'; }
	    
	//     var begin = new Color({r:0,g:0,b:0});
	//     var end = new Color({r:255,g:0,b:0});
	//     return LinearColorInterpolator.findColorBetween(begin,end,testMap[r][1] * 100).asRgbCss();
	// })
    ;
}
