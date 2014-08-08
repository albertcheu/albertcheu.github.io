
function getGrammar(){
    //Make grammar from the rule rows (productions)
    var grammar = [];
    $('.ruleRow').each(function(){
	var production = [];
	if (countChildren($(this)) > 0){
	    $(this).children().each(function(){
		var tile = shortenFilename($(this).children()[0].src);
		if (tile.length==2 && tile.charAt(0)=='t') {
		    tile = parseInt(tile.charAt(1)) - 1;
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
	for (var j = 0; j < grammar[i].length; j++){
	    var token = grammar[i][j];
	    if (token == i) {
		if (j == 0) {
		    alert('Please position the self-reference elsewhere');
		    return false;
		}
		if (++counter > 1) {
		    alert('Sorry, only one self-reference is allowed per row');
		    return false;
		}
	    }
	}
    }
    return true;
}

function recursionKluge(prodArr, index){
    //Given an array of strings, where each string represents a tile
    //and one of those tiles (at index) is a self-ref,
    //change the production to make it compatible with PEG
    
    return;
}

function stringifyGrammar(grammar){
    //Convert the doubly-nested array into a string
    //to pass to PEG.buildParser
    var ans = '';
    for(var i = 0; i < NUMROWS; i++){
	var prod = grammar[i];
	var prodArr = [];
	if (prod.length > 0) { ans += 'prod'+i.toString()+' = '; }
	for(var j = 0; j < prod.length; j++){
	    var index = -1;
	    if (prod[j] == 'or') { prodArr.push('/'); }
	    //Refer to another rule row/production
	    else if (typeof prod[j] === 'number') {
		if (i == prod[j]) { index = j; }
		prodArr.push('prod'+prod[j].toString());
	    }
	    //Shape set & color class
	    else if (prod[j].length != 2) { prodArr.push(prod[j]); }
	    //Specific symbol (terminal)
	    else { prodArr.push("'"+prod[j]+"'"); }
	}

	if (prod.length > 0) { ans += prodArr.join(' ')+'\n'; }
    }
    return ans;
}

function validateInput(problemArray, cachedInput, maxScores, index){
    var grammar = getGrammar();
    if(checkOR(grammar) && checkStructure(grammar) && checkSelfLoops(grammar)){
	var s = stringifyGrammar(grammar);
	$.get('grammar',function(data){
	    var lines = data.split('\n');
	    for (var i = 0; i < lines.length; i++) { s += lines[i]+'\n'; }
	    var parser = PEG.buildParser(s);

	    //Check if each row of the problem belongs
	    //i.e. parse the contents of problemArray
	    var bad = false;
	    for (var i = 0; i < problemArray.length; i++){
		try { var parseData = parser.parse(problemArray[i]); }
		catch (err) {
		    console.log(problemArray[i]);
		    console.log(err.toString());
		    bad = true;
		}
	    }

	    if (! bad){
		//If all rows of the grid belong in our grammar, compute points
		var points = 50;
		for(var i = 0; i < NUMROWS; i++){ points -= grammar[i].length; }
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
