
function worldmap(){
    
    var width = 960,
	height = 500;

    var projection = d3.geoMercator().translate([width / 2, height / 2]);
    var path = d3.geoPath()
	.projection(projection);
    
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

    setsize(width+margin.left+margin.right,height+margin.top+margin.bottom)

    var container = d3.select("svg")
    //all child objects will be offset by the margin using this anchor
	.append("g").attr("transform",
			  "translate(" + margin.left + "," + margin.top + ")")
	.attr("class","worldmap");
    
    d3.json('http://albertcheu.github.io/scratch/bostock_topo.json',
    //d3.json("https://bl.ocks.org/mbostock/raw/4090846/world-50m.json",
	    function(error, mapData) {
		//var features = mapData.objects.(0,50);

		container.selectAll("path").data(topojson.feature(mapData,
								  mapData.objects.countries).features)
		    .enter().append("path")
		    .attr('d', path)
		    .attr('class','country')
		
		container.append("path")
		    .datum(topojson.mesh(mapData,mapData.objects.countries,
					 function(a, b) { return a !== b; }))
		    .attr("class", "mesh")
		    .attr("d", path);
	    }
	   );
}
