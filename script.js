var NUMROWS = 4;
var NUMPROBLEMS = 8;
var LIMIT = 6;

$(document).ready(function(){
    var problem = 0;
    var codes = [];

    var cachedInput = initCache();
    loadFromCache(cachedInput, 0);
    var maxScores = initScores();

    var ruleRowSizes = [0,0,0,0];
    updateSizes(ruleRowSizes);

    //Enable tabs
    $( "#tabs" ).tabs();
/*
    if (window.innerWidth > 1290) { $('#tabs').width(window.innerWidth-30); }
    $(window).resize(function(){
	if (window.innerWidth > 1290) {
	    $('#tabs').width(window.innerWidth-30);
	}
	else { $('#tabs').width(1240); }
    });
    */
    preloadImages();

    //By default, we are on the 'any color' selection; we shouldnt see
    // the last tile
    $("#iconList li:last").hide();

    //Get the codes for the problems
    $.get('problemCodes',function(data){
	var lines = data.split('\n');
	for (var i = 0; i < NUMPROBLEMS; i++) {
	    var problemArray = lines[i].split(' ');
	    codes.push(problemArray);
	}
    },'text');

    //Initialize the score display
    $('#scoreDisp').val(maxScores[0]);

    //Enable slider
    $("#problemSelect").slider({
	range:'min', value:1, min:1, max:NUMPROBLEMS,

	//While sliding the slider
	slide:function(event, ui){
	    $('#whichProblem').val(ui.value);
	    $('#scoreDisp').val(maxScores[ui.value-1]);
	    $('#problemPic').attr('src','problems/p'+ui.value+'.png');
	},

	//Let go of slider
	stop:function(event,ui){
	    problem = ui.value-1;
	    loadFromCache(cachedInput, problem);
	}
    });
    $("#whichProblem").val($("#problemSelect").slider('value'));

    //Enable submit button
    $('#submitButton').button().click(function(){
	var problemArray = codes[problem];
	validateInput(problemArray, cachedInput, maxScores, problem);
    });

    //Make the 'any' button the chosen one, the button who lived, Harry Button
    var radios = document.getElementsByName('radio');
    for (var i = 0; i < radios.length; i++){ radios[i].checked = false; }
    document.getElementById('any').checked = true;

    //Enable radio buttons
    $("#colorSelection").buttonset();
    $(":radio").click(function(){ changeImageColor($(this).attr('id'));  });

    //Enable dragging and dropping
    var params = { helper:"clone", connectToSortable: ".ruleRow" };
    $("#iconList li").draggable(params);
    $("#numList li").draggable(params);

    //Enable sorting, movement from one rule row to another
    $(".ruleRow").sortable({
	connectWith: '.ruleRow',

	//Upon letting go of a tile...
	deactivate: function(){
	    updateSizes(ruleRowSizes);
	    updateCache(cachedInput,problem);

	    //Only connect with rule rows that have space (i.e. size < limit)
	    var connectors = getConnectors(ruleRowSizes);
	    $(".ruleRow").sortable('option','connectWith',connectors);

	    var params = {helper:'clone',connectToSortable:connectors.join()};
	    $("#iconList li").draggable(params);
	    $("#numList li").draggable(params);

	}
    });

    //Dunno what this is, was part of the sample code I copied
    $( "#iconList, #numList, .ruleRow" ).disableSelection();

    //Enable deletion
    $(".trash").droppable({
	accept: ".ruleRow > li",
	drop: function(event, ui){
	    ui.draggable.remove();
	    updateCache(cachedInput,problem);
	}
    }).click(function(){
	//The rule row is the older sibling of the trash div
	var ruleRow = $(this).prev();
	ruleRow.empty();
	updateCache(cachedInput,problem);
    });

});