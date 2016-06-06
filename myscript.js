function loadSeason(seasonData, seasonNumber){
    var metadata = seasonData[0];
    var numLines = metadata.numLines;
    var lineNames = metadata.lineNames;
    var lineColors = metadata.lineColors;
    var boxColors = metadata.boxColors;

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
	    if (lineColors[j] == "black")
	    { episodeList += "border: 1px solid white; border-top:none; border-bottom: none;"; }

	    episodeList += "\">";

	    if (events[j] != "") {
		var boxColor = boxColors[j];
		//if (events[j].boxColor) { boxColor = events[j].boxColor; }
		episodeList += "<div class=\"detail "+boxColor+"LabelAnchor\"title=\""+events[j]+"\"></div>";
	    }

	    episodeList += "</div>";
	}

	episodeList += "</li>";
    }

    episodeList += "</ul>";
    var search = "#s"+seasonNumber.toString();
    $(search).html(episodeList);
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
