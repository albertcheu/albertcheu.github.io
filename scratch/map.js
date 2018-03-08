
var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var svg, active, width, height, container, path;

function worldmap(){

    svg = d3.select("svg");
    active = d3.select(null);
    width = 960, height = 500;

    svg.append("rect").attr("width",width).attr("height",height).on("click",reset);
    
    //all child objects will be inside this group
    container = svg.append("g")
	.attr("class","worldmap");
    
    var projection = d3.geoMercator().translate([width / 2, 3*height / 5]);
    path = d3.geoPath()
	.projection(projection);

    setsize(width,height);

    d3.json('http://albertcheu.github.io/scratch/bostock_topo.json',
	    //d3.json("https://bl.ocks.org/mbostock/raw/4090846/world-50m.json",
	    function(error, mapData) {
		
		var geojsonData = topojson.feature(mapData,mapData.objects.countries).features;
		fixMap(geojsonData);
		
		container.selectAll("path").data(geojsonData)
		    .enter().append("path")
		    .attr('d', path)
		    .attr('class','country').on("click",clicked);
		
		container.append("path")
		    .datum(topojson.mesh(mapData,mapData.objects.countries,
					 function(a, b) { return a !== b; }))
		    .attr("class", "mesh")
		    .attr("d", path);
	    }
	   );
}

function clicked(d) {
    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
	dx = bounds[1][0] - bounds[0][0],
	dy = bounds[1][1] - bounds[0][1],
	x = (bounds[0][0] + bounds[1][0]) / 2,
	y = (bounds[0][1] + bounds[1][1]) / 2,
	scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
	//scale = 8,
	translate = [width / 2 - scale * x, height / 2 - scale * y];

    //console.log(translate);
    
    svg.transition()
	.duration(750)
	.call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
}

function reset() {
    active.classed("active", false);
    active = d3.select(null);
    
    svg.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
}

function zoomed() {
    container.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    container.attr("transform", d3.event.transform); // updated for d3 v4
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
