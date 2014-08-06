//Preload images
images = new Array();
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

function getGrammar(){
    //Make grammar from the rule rows (productions)
    var grammar = [];
    $('.ruleRow').each(function(){
	var production = [];
	if (countChildren($(this)) > 0){
	    $(this).children().each(function(){
		var tile = shortenFilename($(this).children()[0].src);
		if (tile.length==2 && tile.charAt(0)=='t') {
		    tile = parseInt(tile.charAt(1));
		}
		production.push(tile);
	    });
	}
	grammar.push(production);
    });
    return grammar;
}

function checkOR(grammar){
    //Check if each production is well formed
    //i.e. does not end or begin with OR; no ORs are adjacent
    for (var i = 0; i < 4; i++){
	var size = grammar[i].length;
	if (grammar[i][0] == 'or' || grammar[i][size-1] == 'or'){
	    alert('Hey, a rule row should not begin or end with OR');
	    return false;
	}
	for(var j = 1; j < size; j++){
	    if (grammar[i][j] == 'or' && grammar[i][j-1] == 'or'){
		alert('Hey, there should be something between two ORs');
		return false;
	    }
	}
    }
    return true;
}

function checkStructure(grammar){
    //Check if the grammar's structure is a tree (rooted at row 1)
    //I.e. do DFS to make sure we have a DAG (acronyms ahoy)

    var explore = function(grammar, visited, index, pre, post){
	pre[index] = counter++;
	visited[index] = true;

	if (grammar[index].length == 0) {
	    alert('Hey, you need tiles in row '+(index+1).toString());
	    return false;
	}
	var neighbors = [false,false,false,false];
	for (var i = 0; i < grammar[index].length; i++){
	    //convert to zero based indexing
	    token = grammar[index][i];
	    if (typeof token === 'number' && token-1 != index){
		token -= 1;
		if (! visited[token] ){ neighbors[token] = true; }
	    }
	}
	post[index] = counter++;
	for (var i = 0; i < 4; i++){
	    if (neighbors[i] &&
		! explore(grammar, visited, i, pre, post))
	    { return false; }
	}

	for (var i = 0; i < 4; i++){
	    if (neighbors[i]){
		if (pre[i] > pre[index] && post[i] < post[index]) {
		    alert('Hey, you can not have a back reference');
		    return false;
		}
	    }
	}
	return true;
    };

    var counter = 0;
    var visited = [false,false,false,false];
    var pre = [-1,-1,-1,-1];
    var post = [-1,-1,-1,-1];
    if (! explore(grammar, visited, 0, pre, post)) { return false; }

    for (var i = 1; i < 4; i++){
	if (! visited[i]) {
	    if (grammar[i].length > 0) {
		alert('Hey, only rows reachable from 1 can have tiles');
		return false;
	    }
	}
    }
    return true;
}

function checkSelfLoops(grammar){
    //Handle self-reference: only one allowed in each OR-separated term
    for (var i = 0; i < grammar.length; i++){
	var counter = 0;
	for (var j = 0; j < grammar[i].length; j++){
	    var token = grammar[i][j];
	    if (token == 'or'){
		if (counter > 1) {
		    alert('Hey, only one self reference is allowed per term');
		    return false;
		}
		counter = 0;
	    }
	    if (token == i) { counter++; }
	}
    }
    return true;
}

function stringifyGrammar(grammar){
    //Convert the doubly-nested array into a string
    //to pass to PEG.buildParser
    var ans = '';
    for(var i = 0; i < 4; i++){
	var prod = grammar[i];
	if (prod.length > 0) { ans += 'prod'+i.toString()+' = '; }
	for(var j = 0; j < prod.length; j++){
	    var selfref = false;
	    if (prod[j] == 'or') { ans += ' / '; }
	    //Refer to another rule row/production
	    else if (typeof prod[j] === 'number') {
		ans += ' prod'+(prod[j]-1).toString();
		selfref = true;
	    }
	    //Shape set & color class
	    else if (prod[j].length != 2) { ans += ' '+prod[j]+' '; }
	    //Specific symbol (terminal)
	    else { ans += " '"+prod[j]+"' "; }
	}
	//Make sure there is no infinite regress by putting a dummy terminal
	if (selfref) { ans += " / ''"; }
	if (prod.length > 0) { ans += '\n'; }
    }
    return ans;
}

function validateInput(problemArray){
    var grammar = getGrammar();
    if(checkOR(grammar) && checkStructure(grammar) && checkSelfLoops(grammar)){

	var s = stringifyGrammar(grammar);
	$.get('grammar',function(data){
	    var lines = data.split('\n');
	    for (var i = 0; i < lines.length; i++) { s += lines[i]+'\n'; }
	    var parser = PEG.buildParser(s);
	    //Check if each row of the problem belongs
	    //i.e. parse the contents of problemArray
	    for (var i = 0; i < problemArray.length; i++){
		var tokenString = problemArray[i];
		try {
		    var parseData = parser.parse(tokenString);
		    alert('Your solution works!');
		    return true;
		}
		catch (err) {
		    alert('Your solution does not work!');
		    console.log(tokenString);
		    console.log(err.toString());
		    return false;
		}
	    }
	},'text');
    }
}

$(document).ready(function(){
    var problem = 1;
    var codes = [];
    var limit = 6;
    var ruleRowSizes = [0,0,0,0];

    preloadImages();


    //By default, we are on the 'any color' selection; we shouldnt see
    // the last tile
    $("#iconList li:last").hide();

    //Get the codes for the problems
    $.get('problemCodes',function(data){
	var lines = data.split('\n');
	for (var i = 0; i < lines.length; i++) {
	    var problemArray = lines[i].split(' ');
	    codes.push(problemArray);
	}
    },'text');

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
	    problem = ui.value;
	    $('#problemPic').attr('src','problems/p'+ui.value+'.png');
	}
    });
    $("#whichProblem").val($("#problemSelect").slider('value'));

    //Enable submit button
    $('button').button().click(function(){
	validateInput(codes[problem-1])
    });

    //Make the 'any' button the chosen one, the button who lived, Harry Button
    var radios = document.getElementsByName('radio');
    for (var i = 0; i < radios.length; i++){
	radios[i].checked = false;
    }
    document.getElementById('any').checked = true;

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

	//Upon letting go of a tile...
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
    $(".trash").droppable({
	accept: ".ruleRow > li",
	drop: function(event, ui){ ui.draggable.remove(); }
    }).click(function(){
	//The rule row is a cousin of the trash cell
	var ruleRow = $($(this).parent().prev().children()[0]);
	ruleRow.empty();
    });

});