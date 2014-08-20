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

//Preload images
var images = [];
function preloadImages() {
    //Load when page is loaded and never after
    var filenames = [];

    //Tiles, aka icons
    var color = ['','r','g','b'];
    var shape = ['b','t','x','s','f','c'];
    for (i = 0; i < 4; i++){
	for (j = 0; j < 6; j++){
	    filenames.push('icons/'+color[i]+shape[j]+'.png');
	}
    }
    //The problem image/picture
    for (i = 0; i < NUMPROBLEMS; i++){
	filenames.push('problems/p'+(i+1).toString()+'.png');
    }

    for (i = 0; i < filenames.length; i++) {
	images.push(new Image());
	images[i].src = filenames[i];
    }
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

function getConnectors(ruleRowSizes){
    //Given the number of icons in each rule row,
    //produce a list of ids that correspond to those rows with empty space
    var ans = [];
    for(var i = 0; i < NUMROWS; i++){
	if (ruleRowSizes[i] < LIMIT) { ans.push('#rr'+i.toString()); }
    }
    return ans;
}

function updateSizes(ruleRowSizes){
    //Update the array that lists the number of icons in each rule row
    for(var i = 0; i < NUMROWS; i++){
	var ruleRow = $('#rr'+i.toString());
	ruleRowSizes[i] = countChildren(ruleRow);
    }
}
