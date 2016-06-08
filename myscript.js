function loadSeason(seasonData, seasonNumber){
    var metadata = seasonData[0];
    var numLines = metadata.numLines;
    var lineNames = metadata.lineNames;
    var lineColors = metadata.lineColors;
    var boxColors = metadata.boxColors;

    var nameList = '<div style="display:inline-block;width:40%"></div>';
    for (var i = 0; i < numLines; i++){
	nameList += '<p class="character">' + lineNames[i] + "</p>";
    }

    var episodeList = "<ul class=\"timeline-both-side\">";
    for(var i = 1; i < seasonData.length; i++){
	episodeList += "<li>";

	var ep = seasonData[i];
	//title, description, (array of strings)
	var title = ep.title;
	var desc = ep.desc;

	episodeList += "<div class=\"border-line\"></div><div class=\"timeline-description\"><p>"+title+"</p></div><div class=\"dummy\"></div>";

	var events = ep.events;
	for(var j = 0; j < numLines; j++){	

	    episodeList += "<div class=\"vertical\" style=\"background-color:"+lineColors[j]+";";

	    //black stripe needs white border
	    if (lineColors[j] == "black") {
		episodeList += "border: 1px solid white;";
		if (i > 1) { episodeList += "border-top:none;"; }
		if (i < seasonData.length-1) { episodeList += "border-bottom: none;"; }
	    }

	    //first row needs round top
	    if (i == 1) {
		episodeList += "border-top-left-radius:5px;border-top-right-radius:5px;"
	    }
	    //last row needs round bottom
	    if (i == seasonData.length-1) {
		episodeList += "border-bottom-left-radius:5px;border-bottom-right-radius:5px;"
	    }

	    episodeList += "\">";

	    if (events[j] != "") {
		episodeList += "<div class=\"detail "+boxColors[j]+"LabelAnchor\"title=\""+events[j]+"\"></div>";
	    }

	    episodeList += '</div>';

	}

	episodeList += "</li>";
    }

    episodeList += "</ul>";
    var search = "#s"+seasonNumber.toString();
    $(search).html(nameList+episodeList);
    //$(search).html(episodeList);
}

/*Position labels above their lines*/
function centerLabels(){
    var labels = $('p.character');

    //get correct space between centers
    var w = $('.timeline-both-side').width();
    var space = 0.035*w+10;

    //assuming previous label is centered,
    //center this one

    for (var i = 1; i < labels.length; i++){
	var curHalfWidth = $(labels[i]).width() / 2;
	var prevHalfWidth = $(labels[i-1]).width() / 2;
	var margin = space-curHalfWidth-prevHalfWidth;
	$(labels[i]).css('margin-left',margin);
    }
}

$(function(){
    loadS1();

    $(".check").button();
    
    $(".yellowLabelAnchor").tooltip({
	tooltipClass:"yellowLabel"
    });
    $(".whiteLabelAnchor").tooltip({
	tooltipClass:"whiteLabel"
    });
    $(".redLabelAnchor").tooltip({
	tooltipClass:"redLabel"
    });

    $(window).load(centerLabels);
    $(window).resize(centerLabels);

    $(".detail").tooltip({
	position: {
            my: "center bottom-20",
            at: "center top",
            using: function( position, feedback ) {
		var ocolor = $(this).css("outline-color");

		$( this ).css( position );

		$( "<div>" )
//		    .addClass( "arrow" )
		    .addClass( feedback.vertical )
		    .addClass( feedback.horizontal )
		    .appendTo( this );
				
            }
	}
    });


    $("#seasons").accordion({
	heightStyle:"content"
    });
});
