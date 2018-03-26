
var minZoom = 1;
var maxZoom = 8;

var zoom = d3.zoom()
    .scaleExtent([minZoom, maxZoom])
    .on("zoom", zoomed);
var identity = d3.zoomIdentity;

var svg, active, map, path;
var width=960;
var height=500;

//$(document).ready(function(){

//});

function worldmap(){
    var ispSelector = d3.select("#ispSelector")
    for (var i = 0; i < 10; i++){
    	ispSelector.append("option").attr("value",i).html("abcdefghijklmnop "+i);
    }
    
    $("#ispSelector").select2({placeholder:"Select ISPs and carriers"});
    //d3.select(".select2-selection .select2-selection__rendered .select2-search__field")
//	.attr("width",0.9*d3.select(".leftpanel").node().getBoundingClientRect().width);
    
    svg = d3.select("svg");
    active = d3.select(null);

    width = 0.9*d3.select(".rightpanel").node().getBoundingClientRect().width;
    var scalingFactor = width / 960;
    height *= scalingFactor;
    console.log(scalingFactor);

    setsize(width,height);
    
    svg.append("rect").attr("width",width).attr("height",height).on("click",reset);
    
    
    //all child objects will be inside this group
    map = svg.append("g")
	.attr("class","worldmap");
    
    var projection = d3.geoMercator()
	//.translate([width / 2, 3*height / 5]);
    path = d3.geoPath()
	.projection(projection);

    identity = d3.zoomIdentity
	.translate(0, height / 6)
	.scale(scalingFactor);
    svg.call( zoom.transform, identity);
    
    d3.json('http://albertcheu.github.io/scratch/bostock_topo.json',
	    function(error, mapData) {
		
		var geojsonData = topojson.feature(mapData,mapData.objects.countries).features;
		fixMap(geojsonData);
		
		map.selectAll("path").data(geojsonData)
		    .enter().append("path")
		    .attr('d', path)
		    .attr('class','country').on("click",clicked);
		
		map.append("path")
		    .datum(topojson.mesh(mapData,mapData.objects.countries,
					 function(a, b) { return a !== b; }))
		    .attr("class", "mesh")
		    .attr("d", path);
	    }
	   );
}

function clicked(d) {
    //if I clicked the selected country, reset view
    if (active.node() === this) {
	return reset();
    }
    
    //otherwise deselect and change the active variable
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
	dx = bounds[1][0] - bounds[0][0],
	dy = bounds[1][1] - bounds[0][1],
	x = (bounds[0][0] + bounds[1][0]) / 2,
	y = (bounds[0][1] + bounds[1][1]) / 2,
	scale = Math.max(minZoom, Math.min(maxZoom, 0.9 / Math.max(dx / width, dy / height))),
	//scale = 8,
	translate = [width / 2 - scale * x, height / 2 - scale * y];

    //console.log(translate);
    
    svg.transition()
	.duration(750)
	.call( zoom.transform,
	       d3.zoomIdentity.translate(translate[0],translate[1])
	       .scale(scale) ); // updated for d3 v4
}

function reset() {
    active.classed("active", false);
    active = d3.select(null);    
    svg.transition()
      .duration(750)
      .call( zoom.transform, identity ); // updated for d3 v4
}

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

    //console.log(spareID);

}
