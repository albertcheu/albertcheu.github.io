function findProd(B,C,grammar){
    //Given two sets of productions, find productions that yield them
    var ans = new Object();
    for (var prodName in grammar){
	for (var i = 0; i < grammar[prodName].length; i++){
	    var alt = grammar[prodName][i];
            if (alt.length==2 && B[alt[0]] && C[alt[1]]){ans[prodName] = true;}
	}
    }
    return ans;
}

function coordToString(i,j){ return i.toString()+','+j.toString(); }

function cyk (word, grammar){
    //http://www.cs.bgu.ac.il/~michaluz/seminar/CKY1.pdf
    //word = list of 2-character strings (i.e. ['rb','bs',...])
    //We build a table nxn, where n = len(word)
    //table[i][j] is a set of productions that yield word[i:j]
    //Actually, we use a hash table instead of a nested array, to save space
    var table = new Object();

    //Fill diagonal: what productions yield each individual symbol?
    for (var i = 0; i < word.length; i++){
        table[coordToString(i,i+1)] = new Object();
        for (var prodName in grammar){
	    var prod = grammar[prodName];
	    for(var j = 0; j < prod.length; j++){
		if (prod[j].length==1 && prod[j][0] == "'"+word[i]+"'"){
		    table[coordToString(i,i+1)][prodName] = true;
		    break;
		}
	    }
	}
    }
    
    //Fill the remainder using dynamic programming
    for (var j = 2; j < word.length+1; j++){
        for (var i = j-2; i > -1; i--){
	    for (var k = i+1; k < j; k++){
                var A = table[coordToString(i,j)];
		if (! A) { A = new Object(); }
                var B = table[coordToString(i,k)];
		if (! B) { C = new Object(); }
                var C = table[coordToString(k,j)];
                if (! C) { C = new Object(); }
                table[coordToString(i,j)] = $.extend(true, A, findProd(B,C,grammar));
	    }
	}
    }

    console.log(JSON.stringify(table));
    
    //The value is true if the word is parsed correctly, undefined otherwise
    return table[coordToString(0,word.length)][0];
}