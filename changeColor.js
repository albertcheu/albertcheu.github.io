
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