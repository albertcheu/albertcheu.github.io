
//constants and objects for zooming
var minZoom = 1;
var maxZoom = 8;
var zoom = d3.zoom()
    .scaleExtent([minZoom, maxZoom])
    .on("zoom", zoomed);
var identity = d3.zoomIdentity;
var URL_BASE = "http://ec2-18-222-4-123.us-east-2.compute.amazonaws.com/";
//var URL_BASE = "http://ec2-18-222-4-123.us-east-2.compute.amazonaws.com";

var svg, map, active, path, barssvg, divmargin, divHeight, divWidth, divxScale, divyScale, divxAxis, divyAxis;

//dimensions of the map
var width=960;
var height=500;

function worldmap(){
    //populate the map svg
    svg = d3.select("#map");
    active = d3.select(null);

    //svg has to fit inside the right div
    width = 0.9*d3.select(".rightpanel").node().getBoundingClientRect().width;
    var scalingFactor = width / 960;
    height *= scalingFactor;
    console.log("Map dimensions: "+width+","+height);
    setsize("#map",width,height);


    //the ocean
    var ocean = svg.append("rect").attr("id","ocean");
    ocean.on("click",reset);
    setsize("#ocean",width,height);
    
    //all child objects will be inside this group
    map = svg.append("g")
	.attr("class","worldmap");
    
    var projection = d3.geoMercator();
    path = d3.geoPath().projection(projection);

    //account for the resizing
    identity = d3.zoomIdentity
	.translate(0, height / 6)
	.scale(scalingFactor);
    svg.call( zoom.transform, identity);

    //draw the countries
    d3.json('http://albertcheu.github.io/scratch/bostock_topo.json',
	    function(error, mapData) {
		
		var geojsonData = topojson.feature(mapData,mapData.objects.countries).features;
		fixMap(geojsonData);

		//country = "path" element
		map.selectAll("path").data(geojsonData)
		    .enter().append("path")
		    .attr('d', path)
		    .attr('class','country')
		    .on("click",clicked);

		//the following is necessary for good-looking borders
		map.append("path")
		    .datum(topojson.mesh(mapData,mapData.objects.countries,
					 function(a, b) { return a !== b; }))
		    .attr("class", "mesh")
		    .attr("d", path);
	    }
	   );

    
    
}

//the callback for clicking on a country
function clicked(d) {
    console.log("You clicked on the country with ISO code "+d.id);

    //if I clicked the selected country, reset view
    if (active.node() === this) {
	return reset();
    }
    
    //otherwise deselect and change the active variable
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    //pan & zoom variables
    var bounds = path.bounds(d),
	dx = bounds[1][0] - bounds[0][0],
	dy = bounds[1][1] - bounds[0][1],
	x = (bounds[0][0] + bounds[1][0]) / 2,
	y = (bounds[0][1] + bounds[1][1]) / 2,
	scale = Math.max(minZoom, Math.min(maxZoom, 0.9 / Math.max(dx / width, dy / height))),
	translate = [width / 2 - scale * x, height / 2 - scale * y];

    //actually pan & zoom
    svg.transition()
	.duration(750)
	.call( zoom.transform,
	       d3.zoomIdentity.translate(translate[0],translate[1])
	       .scale(scale) ); // updated for d3 v4
}

//for when you click on a selected country or the ocean
function reset() {
    active.classed("active", false);
    active = d3.select(null);    
    svg.transition()
      .duration(750)
      .call( zoom.transform, identity ); // updated for d3 v4
}

//something from Bostock that is necessary for zooming
function zoomed() {
    map.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    map.attr("transform", d3.event.transform); // updated for d3 v4
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

//America and france have far-flung territories, but they mess up zooming and have no data
//So we make each disjoint island/land mass into its own "country" with its own ISO id
function fixMap(geojsonData){
    
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

    //USA (iso 840) is at index 226
    //separate Aleutian islands & Guam
    var allAmerica = geojsonData[226].geometry.coordinates;
    for (var i = 0; i < allAmerica.length; i++){
	var firstPoint = allAmerica[i][0][0];
	if (firstPoint[0] < -170 || firstPoint[0] > 0) {
	    geojsonData.push({type:"Feature",id:spareID,
			      geometry:{type:"Polygon",coordinates:allAmerica[i]}});
	    allAmerica[i] = [];
	    spareID++;
	}
    }

}
