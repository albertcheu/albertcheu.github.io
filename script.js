$(document).ready(function(){
    $( "#draggable" ).draggable({ containment: "parent",
				  revert: "invalid"
				});
    $( "#droppable" ).droppable({
	activeClass: "ui-state-default",
	hoverClass: "ui-state-hover",
	drop: function( event, ui ) {
	    $( this )
		.addClass( "ui-state-highlight" )
		.find( "p" )
		.html( "Dropped!" );
	}
    });
    
    $( "#tabs" ).tabs();
});