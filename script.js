//Preload images
images = new Array();
function preloadImages() {
    var filenames = [];
    var color = ['','r','g','b'];
    var shape = ['b','t','x','s','f','c'];
    for (i = 0; i < 4; i++){
	for (j = 0; j < 6; j++){
	    filenames.push('icons/'+color[i]+shape[j]+'.png');
	}
    }
    for (i = 0; i < 5; i++){
	filenames.push('problems/p'+(i.toString()+1)+'.png');
    }

    for (i = 0; i < filenames.length; i++) {
	images[i] = new Image();
	images[i].src = filenames[i];
    }
}

function shortenFilename(fname){
    //the filename is something like /blah.../blah/foo.png
    //we just want foo
    var i = fname.length-5;
    var ans = "";
    while(fname.charAt(i) != '/'){
	ans = fname.charAt(i) + ans;
	i -= 1;
    }
    return ans;
}

function anyMod(image, fname){
    //User clicked the 'any color' radio button
    if (fname == "red" || fname == "green" || fname == "blue") { return; }
    else if (fname.length == 2) { ans = fname.charAt(1); }
    else { ans = fname; }
    image.src = 'icons/'+ans+'.png';
}

function mod (color) {
    //user clicked a radio button that isn't the 'any color' one
    //change the image sources of the icons accordingly
    return function (image, fname) {
	var colorChar = color.charAt(0);

	//Change the color class
	if (fname == "red" || fname == "green" || fname == "blue"){
	    if (fname == color) { return; }
	    ans = color;
	}

	//Colorless shape
	else if (fname.length == 1) { ans = colorChar + fname; }

	//Colored shape -> preserve second letter, change first
	else { ans = colorChar + fname.charAt(1); }

	image.src = 'icons/'+ans+'.png';
    }
}

function changeImageColor(radioId){
    //Clicked a radio button to change the colors of the icons
    if (radioId == 'any') {
	var f = anyMod;
	$("#iconList li:last").hide();
    }
    else {
	var f = mod(radioId);
	$("#iconList li:last").show();
    }

    //Iterate through the iconList and change the source of each image if needed
    $("#iconList li").each(function(i){
	var image = $(this).children()[0];
	var fname = shortenFilename(image.src);
	if (fname != 'or') { f(image, fname); }
    });
}

function countChildren(jqObj){
    //count the number of children (of a rule row)
    var size = jqObj.children().length;
    var actualSize = 0;
    for(var i = 0; i < size; i++){
	var ih = jqObj.children()[i].innerHTML;
	if (ih != "") { actualSize++; }
    }
    return actualSize;
}

function getConnectors(ruleRowSizes, limit){
    //Given the number of icons in each rule row,
    //produce a list of ids that correspond to those rows with empty space
    var ans = [];
    for(var i = 0; i < ruleRowSizes.length; i++){
	if (ruleRowSizes[i] < limit) { ans.push('#rr'+(i+1).toString()); }
    }
    return ans;
}

function updateSizes(ruleRowSizes){
    //Update the array that lists the number of icons in each rule row
    for(var i = 0; i < ruleRowSizes.length; i++){
	ruleRow = $('#rr'+(i+1).toString());
	c = countChildren(ruleRow);
	ruleRowSizes[i] = c;
    }
}

$(document).ready(function(){
    var limit = 6;
    var ruleRowSizes = [0,0,0,0];
    preloadImages();
    $("#iconList li:last").hide();

    //Enable tabs
    $( "#tabs" ).tabs();

    //Enable slider
    $("#problemSelect").slider({
	range:'min',
	value:1,
	min:1,
	max:5,
	slide:function(event, ui){
	    $('#whichProblem').val(ui.value);
	},
	stop:function(event,ui){
	    $('#problemPic').attr('src','problems/p'+ui.value+'.png');
	}
    });

    //Enable submit button
    $('button').button();

    //Enable radio buttons
    $("#colorSelection").buttonset();
    $(":radio").click(function(){
	changeImageColor($(this).attr('id'));
    });

    //Enable dragging and dropping
    var params = { helper:"clone", connectToSortable: ".ruleRow" };
    $("#iconList li").draggable(params);
    $("#numList li").draggable(params);

    //Enable sorting, movement from one rule row to another
    $(".ruleRow").sortable({
	connectWith: '.ruleRow',
	//Do not receive if limit is reached
	deactivate: function(){
	    updateSizes(ruleRowSizes);
	    //Only connect with rule rows that have space (i.e. size < limit)
	    connectors = getConnectors(ruleRowSizes, limit);
	    $(".ruleRow").sortable('option','connectWith',connectors);

	    var params = {helper:'clone',connectToSortable:connectors.join()};
	    $("#iconList li").draggable(params);
	    $("#numList li").draggable(params);

	}
    });

    //Dunno what this is, was part of the sample code I copied
    $( "#iconList, #numList, .ruleRow" ).disableSelection();

    //Enable deletion
    $("#trash").droppable({
	accept:".ruleRow > li",
	drop: function(event, ui){
	    ui.draggable.remove();
	}
    });

});