//An implementation of http://www.cs.nyu.edu/courses/fall07/V22.0453-001/cnf.pdf

function step1(grammar){
    //for each occurrence of terminal x in a string of length 2 or more on the right hand side of a rule, replace x by U_x

    var newRules = [];
    for (var prodName in grammar){
	var prod = grammar[prodName]

	for (var i = 0; i < prod.length; i++){
	    var alt = prod[i];
	    var size = alt.length;
	    if (size < 2) { continue; }

	    for (var j = 0; j < size; j++){
		var token = alt[j];
		if (typeof token !=='number' && token[0]=="'"){
		    var newRule = 's1nr'+token.substring(1,3);
		    newRules.push(newRule);
		    alt[j] = newRule;
		}
	    }
	}
    }

    for (var i = 0; i < newRules.length; i++){
	var newRule = newRules[i];
	grammar[newRule] = [["'"+newRule.substring(4,newRule.length)+"'"]];
    }
}

function step2(grammar){
    //For each rule with 3 or more variables on the righthand side, we replace it with a new collection of rules
    var newRuleCounter = 0;
    var newRuleDict = new Object();
    for (var prodName in grammar){
        var prod = grammar[prodName];
        for (var i = 0; i < prod.length; i++){
            var alt = prod[i];
            var numVars = alt.length;

	    if (numVars > 2){
                var newRule = 's2nr'+newRuleCounter.toString();
                newRuleCounter++;
                var oldList = prod[i].slice(1,prod[i].length);
                prod[i] = [prod[i][0], newRule];
                numVars--;
                var oldRule = newRule;

                while (numVars > 2){
                    newRule = 's2nr'+newRuleCounter.toString();
                    newRuleCounter++;
                    newRuleDict[oldRule] = [[oldList[0],newRule]];
                    oldList = oldList.slice(1,oldList.length);
                    oldRule = newRule;
                    numVars--;
		}

                newRuleDict[oldRule] = [oldList];

	    }
	}
    }

    for (var prodName in newRuleDict){
	grammar[prodName] = newRuleDict[prodName];
    }
}

function step3(grammar){
    //Replace each occurrence of the start symbol (here, 0) with the variable S (here, s3nr) and add 0 -> s3nr
    for (var prodName in grammar){
        var prod = grammar[prodName];
        for (var i = 0; i < prod.length; i++){
            var alt = prod[i];
	    for (var j = 0; j < alt.length; j++){
		if (alt[j] == 0) { alt[j] = 's3nr'; }
	    }	    
	}
    }
    var rhs = [];
    for(var i = 0; i < grammar[0].length; i++){
	rhs.push(Array.prototype.slice.call(grammar[0][i]));
    }
    grammar[0] = [['s3nr']];
    grammar['s3nr'] = rhs;
}


function findNullRules(grammar){
    //Find the variables that can generate the null string
    //This is a destructive function, so be sure to copy(grammar)

    var ans = [];
    for (var prodName in grammar){
        var prod = grammar[prodName];
	for (var i = 0; i < prod.length; i++){
	    if (prod[i].length == 0) {
		ans.push(prodName);
		break;
	    }
	}
    }

    var changed = true;
    while (changed){
	changed = false;
        for (var prodName in grammar){
            var prod = grammar[prodName];
	    var prodChanged = false;

            for (var i = 0; i < prod.length; i++){
                var reducedProd = [];
                for (var j = 0; j < prod[i].length; j++){
                    if (ans.indexOf(prod[i][j]) == -1) {
                        reducedProd.push(prod[i][j]);
		    }
		}

		if (reducedProd.length < prod[i].length){
		    prodChanged = prodChanged || true;
		    prod[i] = reducedProd;
		}
	    }
	    if (prodChanged) {
		ans.push(prodName);
		changed = true;
	    }
	}
    }
    return ans;
}

function step4(grammar){
    //This step removes rules of the form A -> [] (an empty list = blank string)
    //and creates new rules to ensure that the grammar describes the same lang.

    var nullSet = findNullRules($.extend(true,{},grammar));
    var newRules = new Object();

    for (var i = 0; i < nullSet.length; i++){
	var target = nullSet[i];
        for (var prodName in grammar){
            var prod = grammar[prodName];
            for (var j = 0; j < prod.length; j++){
		var alt = prod[j];
                if (alt.length == 2){
                    if (alt[0] == target){ newRules[prodName] = [alt[1]]; }
                    else if (alt[1] == target){ newRules[prodName] = [alt[0]]; }
		}
	    }

	    var blankIndices = [];
	    for(var k = 0; k < prod.length; k++){
		if (prod[k].length == 0) { blankIndices.push(k); }
	    }
	    for(var k = 0; k < blankIndices.length; k++){
		prod.splice(blankIndices[k]-k);
	    }
	}
    }

    for(var prodName in newRules){ grammar[prodName].push(newRules[prodName]); }
}

function getUnitDag(grammar){
    //Given a grammar, linearize the subtree rooted @ 0
    var seen = new Object();
    var postvisits = new Object();
    var stack = [0];
    var counter = 0;

    while (stack.length){
        var node = stack.pop();
        if (! seen[node]) {
            seen[node] = true;
	    for (var i = 0; i < grammar[node].length; i++){
		var alt = grammar[node][i];
                for (var j = 0; j < alt.length; j++){
		    var token = alt[j];
                    if (typeof token !=='number' && token[0]=="'") { continue; }
                    else { stack.push(token); }
		}
	    }

            postvisits[counter] = node;
            counter++;
	}
    }

    //Reverse order needed in next function
    var ans = [];
    for (var pv in postvisits) { ans.push([pv,postvisits[pv]]); }
    ans.sort(function(a,b){return b[0]-a[0];});
    return ans;
}

function step5(grammar){
    //This step removes rules of the form A -> B, which we call unit rules
    //Part 1: strongly connected components
    //This part is omitted, as the user is banned from loops other than self-ref

    //Part 2: chains
    var unitDag = getUnitDag(grammar);
    for (var i = 0; i < unitDag.length; i++){
        var B = unitDag[i][1];
	for (var j = i+1; j < unitDag.length; j++){
            var A = unitDag[j][1];

	    //Find unit rules A->B
	    var unitIndices = [];
	    for(var k = 0; k < grammar[A].length; k++){
		if (grammar[A][k].length == 1 && grammar[A][k][0] == B) {
		    unitIndices.push(k);
		}
	    }

            //If there is one or more unit rule A->B...	    
	    if (unitIndices.length) {
		console.log("Production "+A+" has a unit rule to "+B);

		//Eliminate them
		for(var k = 0; k < unitIndices.length; k++){
		    grammar[A].splice(unitIndices[k]-k,1);
		}

		//If B has self-ref productions, change to refer to A
		for(var k = 0; k < grammar[B].length; k++){
		    var alt = grammar[B][k];
		    for(var l = 0; l < alt.length; l++){
			if (alt[l]==B) { alt[l] = A; }
		    }
		}

		//replace with all of B's productions
		grammar[A] = grammar[A].concat(grammar[B]);
	    }
	}
    }
}

function convertToCNF (grammar){
    step1(grammar);
    //alert(JSON.stringify(grammar));

    step2(grammar);
    //alert(JSON.stringify(grammar));

    step3(grammar);
    //alert(JSON.stringify(grammar));

    step4(grammar);
    //alert(JSON.stringify(grammar));

    step5(grammar);
    //alert(JSON.stringify(grammar));

}
