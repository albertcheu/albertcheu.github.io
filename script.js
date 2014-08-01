$(document).ready(function(){
    $("#iconList li").draggable({
	helper:"clone",
	connectToSortable: "#iconTargets"
    });
    $( "#iconTargets" ).sortable({
	revert: true
    });
    $( "#iconList, #iconTargets" ).disableSelection();
    $( "#tabs" ).tabs();
});