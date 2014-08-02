//Preload images
images = new Array();
function preload() {
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
    i = fname.length-5;
    ans = "";
    while(fname.charAt(i) != '/'){
	ans = fname.charAt(i) + ans;
	i -= 1;
    }
    return ans;
}

function anyMod(fname){
    if (fname.length == 2) { return fname.charAt(1); }
    return fname;
}

function mod(fname, color, colorChar){
    //Change the upper right letter
    if (fname == "red" || fname == "green" || fname == "blue"){ return color; }
    //Colorless shape
    if (fname.length == 1) { return colorChar + fname; }
    //Colored shape -> preserve second letter, change first
    return colorChar + fname.charAt(1);
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
	if (fname != 'or') { image.src = 'icons/'+f(fname)+'.png'; }
    });
}


$(document).ready(function(){

    preload();

    //Enable tabs
    $( "#tabs" ).tabs();

    //Enable radio selection work
    $("#colorSelection").buttonset();

    //Enable dragging and dropping
    $("#iconList li").draggable({
	helper:"clone",
	connectToSortable: ".iconTarget"
    });

    //Enable sorting
    $(".iconTarget").sortable({
	revert: true
    });
    //Dunno what this is, was part of the sample code I copied
    $( "#iconList, .iconTarget" ).disableSelection();

    //Enable radio buttons
    $(":radio").click(function(){
	changeImageColor($(this).attr('id'));
    });
});