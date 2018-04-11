var URL_BASE = "http://ec2-18-222-4-123.us-east-2.compute.amazonaws.com/";
//var URL_BASE = "http://ec2-18-222-4-123.us-east-2.compute.amazonaws.com";

//constants and objects for zooming
var minZoom = 1;
var maxZoom = 8;
var zoom = d3.zoom()
    .scaleExtent([minZoom, maxZoom])
    .on("zoom", zoomed);

//the svg that will hold both world and us maps
var svg;

//proportions of the svg
var width=960;
var height=500;
var scalingFactor;

//the world map: the <g> element, the active country, the (Mercator) projection
var world = { map:null, identity: d3.zoomIdentity, active:d3.select(null), path:null};

//similarly for the us map
var us = { map:null, identity: d3.zoomIdentity, active:d3.select(null), path:null};
var usID = 840;
var inAmerica = false;

//what are those??
//var divmargin, divHeight, divWidth, divxScale, divyScale, divxAxis, divyAxis;

function initMaps(){
    //populate the map svg
    svg = d3.select("#map");

    //svg has to fit inside the right div
    width = 0.9*d3.select(".rightpanel").node().getBoundingClientRect().width;
    scalingFactor = width / 960;
    height *= scalingFactor;
    console.log("Map dimensions: "+width+","+height);
    setsize("#map",width,height);

    //the ocean fills the svg
    setsize("#ocean",width,height);

    worldMap();

    usMap();
}

function worldMap(){
    
    //all child objects will be inside this group
    world.map = svg.append("g")
	.attr("class","worldmap animated");     
    
    var projection = d3.geoMercator();
    world.path = d3.geoPath().projection(projection);

    //account for the resizing
    world.identity = d3.zoomIdentity
    	.translate(0, height / 6)
    	.scale(scalingFactor);
    world.map.call( zoom.transform, world.identity);

    //draw the countries
    //d3.json('http://albertcheu.github.io/scratch/bostock_topo.json',
    d3.json('http://albertcheu.github.io/scratch/worldMap.json',
	    function(error, worldmapData) {
		//console.log(worldmapData.objects.countries.geometries[0])

		var pre = topojson.feature(worldmapData,worldmapData.objects.countries);
		var geojsonData = pre.features;
		fixMap(geojsonData);
		
		//country = "path" element
		world.map.selectAll("path").data(geojsonData)
		    .enter().append("path")
		    .attr('d', world.path)
		    .attr('class','clickable animated fadeIn')
		    .on("click",clickedCountry);

		//the following is necessary for good-looking borders
		world.map.append("path")
		    .datum(topojson.mesh(worldmapData,worldmapData.objects.countries,
					 function(a, b) { return a !== b; }))
		    .attr("class", "mesh animated fadeIn")
		    .attr("d", world.path);
	    }
	   );    
}

function usMap(){
    
    //all child objects will be inside this group
    us.map = svg.append("g")
	.style("opacity","0")
	.attr("class","usmap animated");

    //handy back button
    var backButton = us.map.append("rect")
    	.attr("id","back")
	.attr("class","clickable")
    	.attr("x",0)
    	.attr("y",0)
	.on("click", function(){
	    swapMap(us,world);
	});
    us.map.append("text").text("Back")
	.attr("x",20).attr("y",20);
    
    var projection = d3.geoAlbersUsa();
    us.path = d3.geoPath().projection(projection);

    //account for the resizing
    us.identity = d3.zoomIdentity
    	.scale(scalingFactor);

    //draw the states
    d3.json('http://albertcheu.github.io/scratch/bostock_us_topo.json',
	    function(error, usmapData) {
		
		var geojsonData = topojson.feature(usmapData,usmapData.objects.states).features;
		
		//state = "path" element
		us.map.selectAll("path").data(geojsonData)
		    .enter().append("path")
		    .attr('d', us.path)
		    .attr('class','clickable')
		    .style('pointer-events','none')
		    .on("click",clickedState);

		//the following is necessary for good-looking borders
		us.map.append("path")
		    .datum(topojson.mesh(usmapData,usmapData.objects.states,
					 function(a, b) { return a !== b; }))
		    .attr('class','mesh')
		    .attr("d", us.path);		
	    }
	   );    
}

//switch between the american and world views
function swapMap(from, to){
    inAmerica = !inAmerica;
    
    from.map
	.classed("fadeIn",false)
	.classed("fadeOut",true);

    //clear out previous selections
    if (to.active) { to.active.classed("active", false); }
    to.active = d3.select(null);

    //reset to default THEN shift to us-centric view
    to.map.call( zoom.transform, d3.zoomIdentity);
    to.map.call( zoom.transform, to.identity);
    
    to.map
	.classed("fadeIn",true)
	.classed("fadeOut",false);        

    //toggle interactivity of the us map
    var val = "none";
    if (to === us) { val = "auto"; }
    us.map.selectAll("path")
	.style("pointer-events",val);
}

//the callback for clicking on a country
function clickedCountry(d) {
    //console.log("You clicked on the country with 2-letter code "+d.properties.code2);
    
    //if I clicked the selected country, reset view
    if (world.active.node() === this) {
	return reset(world);
    }
        
    //otherwise deselect and change the active variable
    world.active.classed("active", false);
    world.active = d3.select(this).classed("active", true);

    if (d.id == usID) {
	console.log("You clicked on USA");
	swapMap(world,us);
	return;
    }
    
    //pan & zoom variables
    var bounds = world.path.bounds(d);
    //console.log("x min: "+bounds[0][0]);
    //console.log("y min: "+bounds[0][1]);
    
    //weird bug fix for nz
    if (d.id==554){ bounds[0][0] *= 100; }
    
    //fiji crosses the boundaries of the map
    //which leads to bounds[0][0] == -0.5; let's fix that
    else if (d.id==242) { bounds[0][0] = bounds[1][0]-30;}

    zoomToBox(bounds,world);
}

function clickedState(d){
    //console.log("You clicked on the state with ISO code "+d.id);
    
    //if I clicked an already selected state, reset view
    if (us.active.node() === this) {
	return reset(us);
    }
    
    //otherwise deselect and change the active variable
    us.active.classed("active", false);
    us.active = d3.select(this).classed("active", true);

    //pan & zoom variables
    var bounds = us.path.bounds(d);

    zoomToBox(bounds,us);
}

function zoomToBox(bounds,whichMap){
    var dx = bounds[1][0] - bounds[0][0],
	dy = bounds[1][1] - bounds[0][1],
	x = (bounds[0][0] + bounds[1][0]) / 2,
	y = (bounds[0][1] + bounds[1][1]) / 2;
    var scale = Math.max(minZoom, Math.min(maxZoom, 0.9 / Math.max(dx / width, dy / height))),
	translate = [width / 2 - scale * x, height / 2 - scale * y];

    //actually pan & zoom
    whichMap.map.transition()
	.duration(750)
	.call( zoom.transform,
	       d3.zoomIdentity.translate(translate[0],translate[1])
	       .scale(scale) ); // updated for d3 v4

}

//for when you click on a selected country or the ocean
function reset() {
    var whichMap = world;
    if (inAmerica) { whichMap = us; }
    
    whichMap.active.classed("active", false);
    whichMap.active = d3.select(null);

    whichMap.map.transition()
      .duration(750)
      .call( zoom.transform, whichMap.identity ); // updated for d3 v4
}

//something from Bostock that is necessary for zooming
function zoomed() {
    var whichMap = world;
    if (inAmerica) { whichMap = us; }
    
    whichMap.map.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    whichMap.map.attr("transform", d3.event.transform); // updated for d3 v4
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
}


function fixMap(geojsonData){
    //promote code2 and name
    for (var i = 0; i < geojsonData.length; i++){
	geojsonData[i].code2 = geojsonData[i].properties.code2;
	geojsonData[i].name = geojsonData[i].properties.name;
    }
    
    //France has far-flung territories, but they mess up zooming and have no data
    //So we make each disjoint island/land mass into its own "country"
    //TO DO: give each colony in overseas its correct iso id and code2
    
    //spare ids start from 900
    var spareID = 900;
    
    //France (iso 250) is at index 72
    //France consists of Metro (European) France and Overseas France
    var allFrance = geojsonData[72].geometry.coordinates;
    
    for (var i = 0; i < allFrance.length; i++){
	//an x,y coordinate pair (long,lat)
	var firstPoint = allFrance[i][0][0];
	
	//F. Guiana (254), Martinique (474), Guadeloupe (312) (far west)
	if (firstPoint[0] < -30 ||
	    //Reunion(638) & Mayotte(175) (far south)
	    firstPoint[1] < -10) {
	    geojsonData.push({type:"Feature",id:spareID,
			      geometry:{type:"Polygon",coordinates:allFrance[i]}});
	    allFrance[i] = [];
	    spareID++;
	}

    }
    //console.log(spareID);

    //USA (iso 840) is at index 226
    //separate Aleutian islands & Guam
    // var allAmerica = geojsonData[226].geometry.coordinates;
    // for (var i = 0; i < allAmerica.length; i++){
    // 	var firstPoint = allAmerica[i][0][0];
    // 	if (firstPoint[0] < -170 || firstPoint[0] > 0) {
    // 	    geojsonData.push({type:"Feature",id:spareID,
    // 			      geometry:{type:"Polygon",coordinates:allAmerica[i]}});
    // 	    allAmerica[i] = [];
    // 	    spareID++;
    // 	}
    // }

}
