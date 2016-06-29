
//Make the timeline for a season
function loadSeason(seasonData, seasonNumber){
    //first element will have metadata
    var metadata = seasonData[0];
    var numLines = metadata.numLines;
    var lineNames = metadata.lineNames;
    var lineColors = metadata.lineColors;
    var boxColors = metadata.boxColors;

    //Label the timelines by the characters they correspond to
    //(position names over the lines: need left offset below)
    var nameList = '<div style="display:inline-block;width:36.05%"></div>';
    for (var i = 0; i < numLines; i++){
	nameList += '<p class="character">' + lineNames[i] + "</p>";
    }

    //construct the timeline
    var episodeList = "<ul class=\"timeline-both-side\">";

    //One row for every episode in the season
    for(var i = 1; i < seasonData.length; i++){
	episodeList += "<li>";

	var ep = seasonData[i];

	//the horizontal line that connects description to main vertical line
	episodeList += '<div class="border-line"></div>';

	//begin the episode's description
	episodeList += `<div class="timeline-description"><p>${ep.title} (${i.toString()}/${(seasonData.length-1).toString()})</p>`;

	//inside, put the numbers...
	
	for (var j = 0; j < ep.numbers.length; j++) {
	    episodeList += '<div class="episodeStripe"><p>';
	    if (ep.numbers[j][0] != '*') {
		episodeList += `Subject: ${ep.numbers[j]}`;
		episodeList += '</p></div>';
	    }
	    else {
		var nameLength = ep.numbers[j].length;
		episodeList += `Alias: ${ep.numbers[j].substr(1,nameLength)}`;
		episodeList += '</p></div>';
	    }
	}

	//and description
	var desc = ep.desc;	
	episodeList += `<p class="episodeDescription">${desc}</p>`;

	//close the episode's description
	episodeList += '</div>';
	
	//put distance between description and timelines
	episodeList += '<div class="dummy"></div>';

	//now, the actual timelines
	var events = ep.events;
	for(var j = 0; j < numLines; j++){	

	    //begin the timeline segment
	    episodeList += '<div ';

	    //open inline style
	    episodeList += 'style="background-color:'+lineColors[j]+';';
	    //no white top/bottom border for black stripe (usually)
	    if (lineColors[j] == "black") {
		if (i > 1) { episodeList += 'border-top:none;'; }
		if (i < seasonData.length-1)
		{ episodeList += 'border-bottom:none;'; }
	    }
	    //close inline style
	    episodeList += '"';

	    //open general style
	    episodeList += 'class="vertical ';
	    //first row needs round top
	    if (i == 1) { episodeList += 'roundTop '; }
	    //last row needs round bottom
	    if (i == seasonData.length-1) { episodeList += 'roundBottom '; }
	    //black stripe needs white border
	    if (lineColors[j] == 'black') { episodeList += 'whiteBorder '; }
	    //close general style (and div definition)
	    episodeList += '">';

	    //if something happened to this character
	    if (events[j] != "") {
		//<color>LabelAnchor will make the tooltip have <color> border
		episodeList += `<div class="detail ${boxColors[j]}LabelAnchor" title="${events[j]}"`;

		//override normal circle color when background is black
		if (lineColors[j] == "black") {
		    episodeList += 'style="height:8px;width:8px;border-radius:4px;border:hidden"';
		}
		episodeList += '></div>';
	    }

	    //close the timeline segment
	    episodeList += '</div>';

	}

	//close the row
	episodeList += "</li>";
    }

    //close the timeline
    episodeList += "</ul>";

    //insert the html
    var search = "#s"+seasonNumber.toString();
    $(search).html(nameList+episodeList);

    return numLines;
}

function obtainSpace(w,numLines){
    //constant for now
    return 3.5;
}

function adjustLines(){
    w = $('.timeline-both-side').width();

    for (var season = 1; season < 3; season++){
	/* Change the spacing of the lines */
	var lines = $('#s'+season.toString()+' .roundTop');
	var numLines = lines.length;
	var space = obtainSpace(w,numLines);
		    
	/* Position labels above their lines */
	var labels = $('#s'+season.toString()+' .character');

	for(var i = 0; i < lines.length; i++){
	    var o = $(lines[i]).offset();
	    o.top -= 20;
	    o.left -= $(labels[i]).width()/2 - 5;
	    $(labels[i]).offset(o);
	}

    }
}

$(function(){
    //load season data (function from different script)
    loadS1();
    loadS2();

    var boxColors = ['yellow','white','red','royalBlue'];
    for (var i = 0; i < boxColors.length; i++){
	//use jQuery to set class of the tooltip
	$('.'+boxColors[i]+'LabelAnchor').tooltip({
	    tooltipClass:boxColors[i]+'Label'
	});

	//then apply tooltip's border color
	var style = $('<style>.'+boxColors[i]+'Label { border: 6px dashed '+boxColors[i]+'; }</style>');
	$('html > head').append(style);
    }

    //adjust the spacing of lines & labels upon creation/resize
    w = 1024;
    $(window).load(function(){
	adjustLines();
    });
    $(window).resize(function(){
	adjustLines();
    });

    //make the tooltip nice
    $(".detail").tooltip({
	position: {
            my: "center bottom-20",
            at: "center top",
            using: function( position, feedback ) {
		var ocolor = $(this).css("outline-color");

		$( this ).css( position );

		$( "<div>" )
		    .addClass( feedback.vertical )
		    .addClass( feedback.horizontal )
		    .appendTo( this );
				
            }
	}
    });

    //enable the accordion functionality
    $("#seasons").accordion({
	heightStyle:"content",
	collapsible:true
    });


    $( "#seasons" ).on( "accordionactivate", function( event, ui ) {
	adjustLines();
    } );

});
