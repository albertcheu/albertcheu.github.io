var t = {
    svg: null,
    width: null,
    height: null,
    width2: null,
    height2: null,
    x: null,
    x2: null,
    y: null,
    y2: null,
    xAxis: null,
    xAxis2: null,
    yAxis: null,
    yAxis2: null,
    margin: null,
    margin2: null,
    context: null,
    area: null
};

d3.selection.prototype.moveToFront = function(){
    return this.each(function(){
	this.parentNode.appendChild(this);
    })
	}

var gBrush = null;
var timeframe = {
    start: "",
    end: ""
};
var formatter = d3.timeFormat("%Y-%m-%d %H:%M:%S");
var brush = null;

//initializeTimeline()
//updateTimeline("PK")

function zoomedT() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var trans = d3.event.transform;
    t.x.domain(trans.rescaleX(t.x2).domain());
    t.focus.select(".area").attr("d", t.area);
    t.focus.select(".axis--x").call(t.xAxis);
    t.context.select(".brush").call(brush.move, t.x.range().map(trans.invertX, trans));
}

var total_data_state = [];
var total_data_country = [];
var total_data_world = [];

async function initializeTimeline() {
    d3.csv("https://gist.githubusercontent.com/00h-i-r-a00/0cf00514ba58869188a8504381df350c/raw/b73cf430f7df9ad3962b71e6dd1d2d8f998b1467/dates_count_country.csv", type, function(error, data) {
	total_data_country = data;
    });
    
    d3.csv("https://gist.githubusercontent.com/00h-i-r-a00/682338ea323dbdb81d00f1ea817a7e62/raw/a65df77fd517b4dad3097e59ebea820d66b1e671/state_specific_dates.csv", type, function(error, data) {
	total_data_state = data;
    });
    
    d3.csv("https://gist.githubusercontent.com/00h-i-r-a00/b4a5809236762e34320216d1ebd29741/raw/461f2a11150ea9277aa6881cb61ae4634a17b7d2/dates_unique.csv", type, function(error, data) {
	total_data_world = data;
    });
    
    
    
    t.svg = d3.select("#timeline"),
    marginPercentage = {
	top: 0,
	right: 4,
	bottom: 55,
	left: 6
    },
    marginPercentage2 = {
	top: 65,
	right: 4,
	bottom: 10,
	left: 6
    };
    var realHeight = +t.svg.attr("height"),
	realWidth = +t.svg.attr("width");

    t.margin = {
	top: marginPercentage.top * realHeight / 100,
	bottom: marginPercentage.bottom * realHeight / 100,
	left: marginPercentage.left * realWidth / 100,
	right: marginPercentage.right * realWidth / 100
    }
    t.margin2 = {
	top: marginPercentage2.top * realHeight / 100,
	bottom: marginPercentage2.bottom * realHeight / 100,
	left: marginPercentage2.left * realWidth / 100,
	right: marginPercentage2.right * realWidth / 100
    }
    t.width = +t.svg.attr("width") - t.margin.left - t.margin.right,
    t.height = +t.svg.attr("height") - t.margin.top - t.margin.bottom,
    t.height2 = +t.svg.attr("height") - t.margin2.top - t.margin2.bottom;



    t.x = d3.scaleTime().range([0, t.width]),
    t.x2 = d3.scaleTime().range([0, t.width]),
    t.y = d3.scaleLinear().range([t.height, 0]),
    t.y2 = d3.scaleLinear().range([t.height2, 0]);


    t.xAxis = d3.axisBottom(t.x),
    t.xAxis2 = d3.axisBottom(t.x2),
    t.yAxis = d3.axisLeft(t.y),

    t.yAxis2 = d3.axisLeft(t.y2).ticks(3, "s").tickPadding(10);

    brush = d3.brushX()
	.extent([
	    [0, 0],
	    [t.width, t.height2]
	])
	.on("brush end", brushed)

    t.zoomT = d3.zoom()
	.scaleExtent([1, Infinity])
	.translateExtent([
	    [0, 0],
	    [t.width, t.height]
	])
	.extent([
	    [0, 0],
	    [t.width, t.height]
	])
	.on("zoom", zoomedT);

    t.focus = t.svg.append("g")
	.attr("class", "focus")
	.attr("transform", "translate(" + t.margin.left + "," + t.margin.top + ")");

    t.context = t.svg.append("g")
	.attr("class", "context")
	.attr("transform", "translate(" + t.margin2.left + "," + t.margin2.top + ")")

    gBrush = t.context.append("g");
    gBrush
	.attr("class", "brush")
	.call(brush)

	.call(brush.move, [t.x.range()[0] + 100, t.x.range()[1] - 100]);

    timeframe.start = t.x2.invert(t.x.range()[0] + 100);
    timeframe.end = t.x2.invert(t.x.range()[1] - 100);
    
    function brushed() {
	make_grey();
	if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
	var s = d3.event.selection || t.x2.range();
	t.x.domain(s.map(t.x2.invert, t.x2));
	//focus.select(".area").attr("d", area);
	t.focus.select(".axis--x").call(t.xAxis);
	t.svg.select(".zoomT").call(t.zoomT.transform, d3.zoomIdentity
				    .scale(t.width / (s[1] - s[0]))
				    .translate(-s[0], 0));

	//console.log(s[0], s[1]);

	var midpointy = ((t.height + t.margin.bottom - t.height2 - t.margin2.bottom) - t.height) / 2 + t.height;
	var midpoint1 = t.margin.left.toString() + "," + midpointy.toString();
	var midpoint2 = (t.margin.left + t.width).toString() + "," + midpointy.toString();
	var point1 = (s[0] + t.margin.left).toString() + "," + (t.height + t.margin.bottom - t.height2 - t.margin2.bottom).toString();
	var point2 = (t.margin.left).toString() + "," + (t.height).toString(); //fixed
	var point3 = (t.margin.left + t.width).toString() + "," + (t.height).toString(); //fixed
	var point4 = (s[1] + t.margin.left).toString() + "," + (t.height + t.margin.bottom - t.height2 - t.margin2.bottom).toString();

	var points_position = point1 + " " + midpoint1 + " " + point2 + " " + point3 + " " + midpoint2 + " " + point4;

	// var points_position = point1 + " " + point2 + " " + point3 + " " + point4;

	t.svg.select("#polygon")
	    .attr("points", points_position)
	    .attr("fill", "lightgray")
	    .attr("stroke", "black")
	    .attr("stroke-width", "0.75")

	//Create a shape based on

	//Get the Date Range Over Here
	var start = t.x2.invert(s[0]);
	var end = t.x2.invert(s[1]);

	timeframe.start = formatter(start);
	timeframe.end = formatter(end);

	updateArcData();
    }

    t.svg.append("rect")
	.style("opacity", 0)
	.attr("class", "zoomT")
	.attr("width", t.width)
	.attr("height", t.height)
	.attr("transform", "translate(" + t.margin.left + "," + t.margin.top + ")")
	.call(t.zoomT);


} //function initialize end

function updateTimeline(countryCode, regionType) {
    //delete all the elements
    //defs
    d3.select("defs").remove()
    d3.select(".area").remove()
    //d3.select(".zoomT").remove()
    d3.select("#topTimelineAxis").remove();
    d3.select("#bottomTimelineAxis").remove();
    d3.select("#sideTimelineAxis").remove();

    t.area = d3.area()
	.curve(d3.curveMonotoneX)
	.x(function(d) {
	    return t.x(d.date);
	})
	.y0(t.height)
	.y1(function(d) {
	    return t.y(d.counts);
	});

    var area2 = d3.area()
	.curve(d3.curveMonotoneX)
	.x(function(d) {
	    return t.x2(d.date);
	})
	.y0(t.height2)
	.y1(function(d) {
	    //console.log(d.counts, t.y2(d.counts));
	    return t.y2(d.counts);
	});

    t.svg.append("defs").append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", t.width)
	.attr("height", t.height2);

    /////////////////////////////////////////////////update country d3.csv////////////////////////////////////////
    index_mappings = {
  "LV": {
    "index_start": 756,
    "index_end": 760
  },
  "BE": {
    "index_start": 0,
    "index_end": 9
  },
  "BG": {
    "index_start": 10,
    "index_end": 14
  },
  "BM": {
    "index_start": 15,
    "index_end": 16
  },
  "BO": {
    "index_start": 17,
    "index_end": 17
  },
  "BH": {
    "index_start": 18,
    "index_end": 21
  },
  "JO": {
    "index_start": 22,
    "index_end": 23
  },
  "BR": {
    "index_start": 24,
    "index_end": 67
  },
  "BZ": {
    "index_start": 68,
    "index_end": 68
  },
  "RU": {
    "index_start": 69,
    "index_end": 73
  },
  "RS": {
    "index_start": 74,
    "index_end": 76
  },
  "RE": {
    "index_start": 77,
    "index_end": 77
  },
  "RO": {
    "index_start": 78,
    "index_end": 88
  },
  "GT": {
    "index_start": 89,
    "index_end": 94
  },
  "GR": {
    "index_start": 95,
    "index_end": 98
  },
  "GP": {
    "index_start": 99,
    "index_end": 102
  },
  "JP": {
    "index_start": 103,
    "index_end": 107
  },
  "GG": {
    "index_start": 108,
    "index_end": 108
  },
  "GE": {
    "index_start": 109,
    "index_end": 109
  },
  "GD": {
    "index_start": 110,
    "index_end": 112
  },
  "GB": {
    "index_start": 113,
    "index_end": 147
  },
  "GL": {
    "index_start": 148,
    "index_end": 148
  },
  "OM": {
    "index_start": 149,
    "index_end": 149
  },
  "HR": {
    "index_start": 151,
    "index_end": 156
  },
  "HU": {
    "index_start": 157,
    "index_end": 164
  },
  "HK": {
    "index_start": 165,
    "index_end": 169
  },
  "HN": {
    "index_start": 170,
    "index_end": 172
  },
  "PR": {
    "index_start": 173,
    "index_end": 188
  },
  "PS": {
    "index_start": 189,
    "index_end": 189
  },
  "PT": {
    "index_start": 190,
    "index_end": 212
  },
  "PY": {
    "index_start": 213,
    "index_end": 215
  },
  "PA": {
    "index_start": 216,
    "index_end": 219
  },
  "UY": {
    "index_start": 220,
    "index_end": 226
  },
  "PE": {
    "index_start": 227,
    "index_end": 230
  },
  "PK": {
    "index_start": 231,
    "index_end": 232
  },
  "PH": {
    "index_start": 233,
    "index_end": 243
  },
  "PL": {
    "index_start": 244,
    "index_end": 257
  },
  "EE": {
    "index_start": 258,
    "index_end": 261
  },
  "EG": {
    "index_start": 262,
    "index_end": 266
  },
  "ZA": {
    "index_start": 267,
    "index_end": 274
  },
  "EC": {
    "index_start": 275,
    "index_end": 275
  },
  "IT": {
    "index_start": 799,
    "index_end": 813
  },
  "ES": {
    "index_start": 278,
    "index_end": 299
  },
  "MD": {
    "index_start": 300,
    "index_end": 301
  },
  "MA": {
    "index_start": 302,
    "index_end": 304
  },
  "US": {
    "index_start": 305,
    "index_end": 351
  },
  "MU": {
    "index_start": 352,
    "index_end": 352
  },
  "MT": {
    "index_start": 353,
    "index_end": 354
  },
  "MW": {
    "index_start": 355,
    "index_end": 355
  },
  "MV": {
    "index_start": 356,
    "index_end": 357
  },
  "MQ": {
    "index_start": 358,
    "index_end": 359
  },
  "IM": {
    "index_start": 838,
    "index_end": 838
  },
  "MY": {
    "index_start": 382,
    "index_end": 389
  },
  "MX": {
    "index_start": 390,
    "index_end": 407
  },
  "AT": {
    "index_start": 839,
    "index_end": 853
  },
  "FR": {
    "index_start": 443,
    "index_end": 476
  },
  "FI": {
    "index_start": 477,
    "index_end": 487
  },
  "FJ": {
    "index_start": 488,
    "index_end": 488
  },
  "NI": {
    "index_start": 489,
    "index_end": 489
  },
  "NL": {
    "index_start": 490,
    "index_end": 511
  },
  "NO": {
    "index_start": 512,
    "index_end": 532
  },
  "NC": {
    "index_start": 533,
    "index_end": 533
  },
  "NZ": {
    "index_start": 534,
    "index_end": 544
  },
  "NP": {
    "index_start": 545,
    "index_end": 547
  },
  "CH": {
    "index_start": 548,
    "index_end": 566
  },
  "CO": {
    "index_start": 567,
    "index_end": 570
  },
  "CL": {
    "index_start": 571,
    "index_end": 577
  },
  "CA": {
    "index_start": 578,
    "index_end": 616
  },
  "CZ": {
    "index_start": 617,
    "index_end": 622
  },
  "CY": {
    "index_start": 623,
    "index_end": 624
  },
  "CR": {
    "index_start": 625,
    "index_end": 629
  },
  "SX": {
    "index_start": 630,
    "index_end": 630
  },
  "KE": {
    "index_start": 631,
    "index_end": 631
  },
  "KH": {
    "index_start": 632,
    "index_end": 632
  },
  "SV": {
    "index_start": 633,
    "index_end": 634
  },
  "KR": {
    "index_start": 635,
    "index_end": 639
  },
  "SI": {
    "index_start": 640,
    "index_end": 645
  },
  "KW": {
    "index_start": 646,
    "index_end": 648
  },
  "KZ": {
    "index_start": 649,
    "index_end": 650
  },
  "SA": {
    "index_start": 651,
    "index_end": 665
  },
  "SG": {
    "index_start": 666,
    "index_end": 673
  },
  "SE": {
    "index_start": 674,
    "index_end": 691
  },
  "DO": {
    "index_start": 692,
    "index_end": 699
  },
  "DK": {
    "index_start": 700,
    "index_end": 713
  },
  "DE": {
    "index_start": 714,
    "index_end": 733
  },
  "DZ": {
    "index_start": 734,
    "index_end": 738
  },
  "MK": {
    "index_start": 739,
    "index_end": 740
  },
  "LB": {
    "index_start": 741,
    "index_end": 742
  },
  "TW": {
    "index_start": 743,
    "index_end": 743
  },
  "TT": {
    "index_start": 744,
    "index_end": 747
  },
  "TR": {
    "index_start": 748,
    "index_end": 754
  },
  "LK": {
    "index_start": 755,
    "index_end": 755
  },
  "TN": {
    "index_start": 150,
    "index_end": 150
  },
  "LT": {
    "index_start": 761,
    "index_end": 763
  },
  "LU": {
    "index_start": 764,
    "index_end": 768
  },
  "TH": {
    "index_start": 769,
    "index_end": 772
  },
  "AE": {
    "index_start": 773,
    "index_end": 791
  },
  "AG": {
    "index_start": 792,
    "index_end": 792
  },
  "VG": {
    "index_start": 793,
    "index_end": 793
  },
  "VI": {
    "index_start": 794,
    "index_end": 795
  },
  "IS": {
    "index_start": 796,
    "index_end": 798
  },
  "AL": {
    "index_start": 276,
    "index_end": 277
  },
  "VN": {
    "index_start": 814,
    "index_end": 823
  },
  "AR": {
    "index_start": 824,
    "index_end": 837
  },
  "AU": {
    "index_start": 360,
    "index_end": 381
  },
  "IL": {
    "index_start": 408,
    "index_end": 442
  },
  "IN": {
    "index_start": 854,
    "index_end": 874
  },
  "IE": {
    "index_start": 875,
    "index_end": 892
  },
  "ID": {
    "index_start": 893,
    "index_end": 903
  },
  "UA": {
    "index_start": 904,
    "index_end": 904
  },
  "QA": {
    "index_start": 905,
    "index_end": 905
  }
};


    
    var index_mappings_states = {
  "Mississippi": {
    "index_start": 0,
    "index_end": 25
  },
  "Oklahoma": {
    "index_start": 77,
    "index_end": 109
  },
  "Wyoming": {
    "index_start": 411,
    "index_end": 419
  },
  "Minnesota": {
    "index_start": 126,
    "index_end": 163
  },
  "Illinois": {
    "index_start": 164,
    "index_end": 208
  },
  "Georgia": {
    "index_start": 954,
    "index_end": 993
  },
  "Arkansas": {
    "index_start": 209,
    "index_end": 234
  },
  "New Mexico": {
    "index_start": 235,
    "index_end": 258
  },
  "Ohio": {
    "index_start": 1245,
    "index_end": 1284
  },
  "Indiana": {
    "index_start": 259,
    "index_end": 297
  },
  "Maryland": {
    "index_start": 298,
    "index_end": 334
  },
  "Louisiana": {
    "index_start": 335,
    "index_end": 363
  },
  "Texas": {
    "index_start": 364,
    "index_end": 410
  },
  "Arizona": {
    "index_start": 420,
    "index_end": 460
  },
  "Iowa": {
    "index_start": 26,
    "index_end": 58
  },
  "Michigan": {
    "index_start": 500,
    "index_end": 542
  },
  "Kansas": {
    "index_start": 543,
    "index_end": 575
  },
  "Utah": {
    "index_start": 576,
    "index_end": 614
  },
  "Virginia": {
    "index_start": 615,
    "index_end": 655
  },
  "Oregon": {
    "index_start": 656,
    "index_end": 692
  },
  "Connecticut": {
    "index_start": 693,
    "index_end": 718
  },
  "New York": {
    "index_start": 1520,
    "index_end": 1565
  },
  "California": {
    "index_start": 757,
    "index_end": 803
  },
  "Idaho": {
    "index_start": 804,
    "index_end": 824
  },
  "West Virginia": {
    "index_start": 825,
    "index_end": 842
  },
  "South Carolina": {
    "index_start": 843,
    "index_end": 871
  },
  "New Hampshire": {
    "index_start": 872,
    "index_end": 894
  },
  "Massachusetts": {
    "index_start": 895,
    "index_end": 938
  },
  "Vermont": {
    "index_start": 939,
    "index_end": 953
  },
  "Delaware": {
    "index_start": 110,
    "index_end": 125
  },
  "North Dakota": {
    "index_start": 994,
    "index_end": 1009
  },
  "Pennsylvania": {
    "index_start": 1010,
    "index_end": 1050
  },
  "Florida": {
    "index_start": 1051,
    "index_end": 1095
  },
  "Hawaii": {
    "index_start": 1096,
    "index_end": 1120
  },
  "Kentucky": {
    "index_start": 1121,
    "index_end": 1151
  },
  "Alaska": {
    "index_start": 1152,
    "index_end": 1178
  },
  "Nebraska": {
    "index_start": 1179,
    "index_end": 1204
  },
  "Missouri": {
    "index_start": 1205,
    "index_end": 1244
  },
  "Wisconsin": {
    "index_start": 461,
    "index_end": 499
  },
  "Alabama": {
    "index_start": 1285,
    "index_end": 1313
  },
  "Rhode Island": {
    "index_start": 1314,
    "index_end": 1332
  },
  "South Dakota": {
    "index_start": 59,
    "index_end": 76
  },
  "Colorado": {
    "index_start": 1359,
    "index_end": 1399
  },
  "\"Washington": {
    "index_start": 1333,
    "index_end": 1358
  },
  "New Jersey": {
    "index_start": 1400,
    "index_end": 1441
  },
  "Washington": {
    "index_start": 1442,
    "index_end": 1481
  },
  "North Carolina": {
    "index_start": 1482,
    "index_end": 1519
  },
  "Tennessee": {
    "index_start": 719,
    "index_end": 756
  },
  "Montana": {
    "index_start": 1566,
    "index_end": 1584
  },
  "Nevada": {
    "index_start": 1585,
    "index_end": 1622
  },
  "Maine": {
    "index_start": 1623,
    "index_end": 1646
  }
};


    
    var data = [];

    ////get data for country///////////////////////////////////////////////////////////////
    if (regionType == 'country') {
	if (!index_mappings.hasOwnProperty(countryCode)) {
	    data.push(type({date:"2018-01-01",counts:"0"}));
	    data.push(type({date:"2018-03-01",counts:"0"}));
	}


	//var j = 0;
	else {
	    var index_start = index_mappings[countryCode].index_start;
	    var index_end = index_mappings[countryCode].index_end;

	    total_data_country.forEach(function(d, i) {

		if (i >= index_start && i <= index_end) {
		    //console.log(d)
		    data.push(d);
		}

	    });
	}
    }
    ///////////////////////////////////////////////////////////////////


    ////////get data for states####################
    if (regionType == 'state') {
	if (!index_mappings_states.hasOwnProperty(countryCode)) {
	    data.push(type({date:"2018-01-01",counts:"0"}));
	    data.push(type({date:"2018-03-01",counts:"0"}));
	}


	//var j = 0;
	else {
	    var index_start = index_mappings_states[countryCode].index_start;
	    var index_end = index_mappings_states[countryCode].index_end;

	    total_data_state.forEach(function(d, i) {

		if (i >= index_start && i <= index_end) {
		    //console.log(d)
		    data.push(d);
		}

	    });
	}
    }

    ////////////get data for the world//////////////////
    /////////////////

    if (regionType == 'world') {
	
	total_data_world.forEach(function(d, i) {

	    data.push(d);

	});

    }
    ///////////////////////////////////////////////
    t.x.domain(d3.extent(data, function(d) {
	return d.date;
    }));
    t.y.domain([0, d3.max(data, function(d) {
	return d.counts;
    })]);
    t.x2.domain(t.x.domain());
    t.y2.domain(t.y.domain());

    t.xAxis = d3.axisTop(t.x),
    t.xAxis2 = d3.axisBottom(t.x2),
    t.yAxis = d3.axisLeft(t.y),
    t.yAxis2 = d3.axisLeft(t.y2).ticks(3, "s").tickPadding(10);;

    t.focus.append("g")
	.attr("id","topTimelineAxis")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + t.height + ")")
	.call(t.xAxis);

    t.context.append("g")
      	.attr("id","bottomTimelineAxis")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + t.height2 + ")")
	.call(t.xAxis2);


    t.context.append("g")
      	.attr("id","sideTimelineAxis")
	.attr("class", "axis axis--y")
	.call(t.yAxis2);
    
    t.context.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - t.margin.left + 5)
        .attr("x",0 - (t.height2 / 2))
        .attr("dy", "0.7em")
        .attr("dy", "0.5em")
        .style("font-size", "9")
        .style("text-anchor", "middle")
        .text("Number of Tests");

    
    t.context.append("path")
	.datum(data) //.attr("foobar",function(d){console.log(t.area2)})
	.attr("class", "area")
	.attr("d", area2);
    
    gBrush.moveToFront();
    
    
} //function update end

function type(d) {
    var parseDate = d3.timeParse("%Y-%m-%d");
    d.date = parseDate(d.date);
    d.counts = +d.counts;
    return d;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initializeWrapper() {
    initializeTimeline();
    await sleep(2000);
    updateArcData();
    updateTimeline('', 'world');

}

