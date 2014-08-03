//Preload images
images = new Array();
function preloadImages() {
    var filenames = [];
    var color = ['','r','g','b'];
    var shape = ['b','t','x','s','f','c'];
    for (i = 0; i < 4; i ++){
	for (j = 0; j < 6; j++){
	    filenames.push('icons/'+color[i]+shape[j]+'.png');
	}
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

function anyMod(fname){
    //User clicked the 'any color' radio button
    if (fname.length == 2) { return fname.charAt(1); }
    return fname;
}

function mod (color) {
    //user clicked a radio button that isn't the 'any color' one
    //change the image sources of the icons accordingly
    return function (fname) {
	//Change the upper right letter
	if (fname == "red" || fname == "green" || fname == "blue")
	{ return color; }

	var colorChar = color.charAt(0);

	//Colorless shape
	if (fname.length == 1) { return colorChar + fname; }

	//Colored shape -> preserve second letter, change first
	return colorChar + fname.charAt(1);
    }
}

function changeImageColor(radioId){
    if (radioId == 'any') { var f = anyMod; }
    else { var f = mod(radioId); }

    //Iterate through the iconList and change the source of each image if needed
    $("#iconList li").each(function(i){
	var image = $(this).children()[0];
	var fname = shortenFilename(image.src);
	if (fname != 'or') { image.src = 'icons/'+f(fname)+'.png'; }
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

    //Enable tabs
    $( "#tabs" ).tabs();

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