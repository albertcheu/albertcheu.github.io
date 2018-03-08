
var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var svg, active, width, height, container, path;

function worldmap(){

    // var svg = d3.select("svg");
    // var active = d3.select(null);
    // var width = 960, height = 500;
    // //all child objects will be inside this group
    // var container = svg.append("g")
    // //.attr("transform","translate(" + margin.left + "," + margin.top + ")")
    // 	.attr("class","worldmap");

    svg = d3.select("svg");
    active = d3.select(null);
    width = 960, height = 500;

    svg.append("rect").attr("width",width).attr("height",height).on("click",reset);
    
    //all child objects will be inside this group
    container = svg.append("g")
    //.attr("transform","translate(" + margin.left + "," + margin.top + ")")
	.attr("class","worldmap");

    
    var projection = d3.geoMercator().translate([width / 2, 3*height / 5]);
    path = d3.geoPath()
	.projection(projection);

    // var margin = {top: 20, right: 30, bottom: 30, left: 40},
    //     width = 960 - margin.left - margin.right,
    //     height = 500 - margin.top - margin.bottom;
    //setsize(width+margin.left+margin.right,height+margin.top+margin.bottom)

    setsize(width,height);
    d3.json('http://albertcheu.github.io/scratch/bostock_topo.json',
	    //d3.json("https://bl.ocks.org/mbostock/raw/4090846/world-50m.json",
	    function(error, mapData) {
		
		var geojsonData = topojson.feature(mapData,mapData.objects.countries).features;

		//USA (iso 840) is at index 226: remove coordinates east of 165E
		//console.log(geojsonData[226]);
		//console.log(geojsonData[226].geometry.coordinates[0])

		//France (iso 250) is at index 72
		//separate South America (French Guiana/Martinique/Guadeloupe) and Africa (Reunion/Mayotte)
		var allFrance = geojsonData[72].geometry.coordinates;

		//arc groups
		for (var i = 0; i < allFrance.length; i++){
		    var firstPoint = allFrance[i][0][0];

		    //stored as x,y coordinates (long,lat)
		    
		    //territories in SA (far west)
		    if (firstPoint[0] < -30) {
			allFrance[i] = [];
		    }

		    //Reunion & Mayotte (far south)
		    if (firstPoint[1] < -10) {
			allFrance[i] = [];
		    }
		}
		//geojsonData[72].geometry.coordinates = allFrance;
		
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
