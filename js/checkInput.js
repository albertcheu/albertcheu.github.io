function getGrammar(){
    //Make grammar from the rule rows (productions)
    //The returned object is a doubly nested array of strings
    //i.e. the number of arrays is NUMROWS
    //Each array contains strings, which are the filenames of the tiles

    var grammar = [];
    $('.ruleRow').each(function(){
	var production = [];

	if (countChildren($(this)) > 0){
	    $(this).children().each(function(){
		var tile = shortenFilename($(this).children()[0].src);

		if (tile.length==2){
		    if (tile.charAt(0)=='t') {
			tile = parseInt(tile.charAt(1)) - 1;
		    }
		    else if (tile!='or') { tile = "'"+tile+"'"; }
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
    for (var i = 0; i < NUMROWS; i++){
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
	    var token = grammar[index][i];
	    if (typeof token === 'number' && token != index){
		if (! visited[token] ){ neighbors[token] = true; }
	    }
	}

	post[index] = counter++;
	for (var i = 0; i < NUMROWS; i++){
	    if (neighbors[i] &&
		! explore(grammar, visited, i, pre, post))
	    { return false; }
	}

	for (var i = 0; i < NUMROWS; i++){
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

    for (var i = 1; i < NUMROWS; i++){
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
    for (var i = 0; i < NUMROWS; i++){
	var counter = 0;
	var selfref = false;
	for (var j = 0; j < grammar[i].length; j++){
	    var token = grammar[i][j];
	    if (token == i) {

		if (++counter > 1) {
		    alert('Sorry, only one self-reference is allowed per row');
		    return false;
		}

		selfref = true;
	    }
	}

	//If there is self-reference, mark it
	if (selfref) { grammar[i].push('*'); }
    }
    return true;
}

function convertToObject(g){
    //Given the previous grammar object (just a nested array),
    //Copy the data into an Object
    //Instead of the 'or' string, each term will be in its own array
    //So the structure is Obj->key->Array of Arrays->String/Integer
    var grammar = new Object();
    for (var i = 0; i < NUMROWS; i++){
	grammar[i] = [[]];
	for (var j = 0; j < g[i].length; j++){

	    if (g[i][j]!='or') {
		//Put a blank array in place of the marker (i.e. null string)
		if (g[i][j]=='*') { grammar[i].push([]); }

		//Put the tile/file/production name in the last term's array
		else { grammar[i][grammar[i].length-1].push(g[i][j]); }
	    }

	    //Put a blank array in preparation for the next term
	    else { grammar[i].push([]); }
	}
    }
    return grammar;
}

function validateInput(problemArray, cachedInput, maxScores, index){
    var g = getGrammar();
    if(checkOR(g) && checkStructure(g) && checkSelfLoops(g)){
	//Convert to object (hash table)
	var grammar = convertToObject(g);

	//Read basic data from the file
	$.get('grammar',function(data){
	    var lines = data.split('\n');
	    for (var i = 0; i < lines.length; i++) {
		var tokens = lines[i].split(' ');
		var prod = [];
		var rhs = tokens.slice(1,tokens.length);
		for (var j = 0; j < rhs.length; j++){ prod.push([rhs[j]]); }
		grammar[tokens[0]] = prod;
	    }

	    //Convert to CNF
	    convertToCNF(grammar);
	    console.log(JSON.stringify(grammar));

	    //Check if each row of the problem belongs
	    //i.e. parse the contents of problemArray
	    var validInput = true;
	    for (var i = 0; i < problemArray.length; i++){
		var row = problemArray[i];
		var tokens = [];
		for(var j = 0; j < row.length; j += 2){
		    tokens.push(row.substring(j,j+2));
		}
		validInput = validInput && cyk(tokens, grammar);
	    }

	    if (validInput){
		//If all rows of the grid belong in our grammar, compute points
		var points = 50;
		for(var i = 0; i < NUMROWS; i++){
		    points -= countChildren($('#rr'+i.toString()));
		}
		var ps = points.toString();
		alert('Your solution works!\nYou get '+ps+' points.');
		if (points > maxScores[index]) {
		    //Update our records
		    maxScores[index] = points;
		    $('#scoreDisp').val(points);
		}
	    }

	    else{ alert('Your solution does not work!'); }

	    //Save user input & scores
	    storeUserInput(cachedInput,maxScores);

	},'text');

    }
}