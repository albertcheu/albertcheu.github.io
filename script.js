
function shortenFilename(fname){
    //the filename is something like /blah.../blah/foo.png
    //we just want foo
    i = fname.length-5;
    ans = "";
    while(fname.charAt(i) != '/'){
	ans = fname.charAt(i).concat(ans);
	i -= 1;
    }
    return ans;
}

function anyMod(fname){
    if (fname.length == 2 && fname != 'or') { return fname.charAt(1); }
    return fname;
}

function mod(fname, color, colorChar){
    if (fname == "red" || fname == "green" || fname == "blue"){ return color; }
    else if (fname != "or"){
	if (fname.length == 1) { return colorChar + fname; }
	return colorChar + fname.charAt(1);
    }
    return fname;
}

function redMod(fname){ return mod(fname, 'red', 'r'); }
function greenMod(fname){ return mod(fname, 'green', 'g'); }
function blueMod(fname){ return mod(fname, 'blue', 'b'); }

function changeImageColor(radioId){
    if (radioId == 'any') { var f = anyMod; }
    else if (radioId == 'red') { var f = redMod; }
    else if (radioId == 'green') { var f = greenMod; }
    else { var f = blueMod; }

    //Iterate through the iconList and change the source of each image if needed
    $("#iconList li").each(function(i){
	var image = $(this).children()[0];
	var fname = shortenFilename(image.src);
	image.src = 'icons/'+f(fname)+'.png';
    });
}

$(document).ready(function(){
    //Make tabs work
    $( "#tabs" ).tabs();

    //Make radio selection work
    $("#colorSelection").buttonset();

    //Enable dragging and dropping
    $("#iconList li").draggable({
	helper:"clone",
	connectToSortable: "#iconTargets"
    });

    //Enable sorting
    $("#iconTargets").sortable({
	revert: true
    });
    //Dunno what this is, was part of the sample code I copied
    $( "#iconList, #iconTargets" ).disableSelection();

    $(":radio").click(function(){
	changeImageColor($(this).attr('id'));
    });
});