/*READING & WRITING TO LOCALSTORAGE*/
function accessStorage(f){
    //http://www.javascriptkit.com/javatutors/domstorage.shtml
    var storage = window.localStorage || 
	(window.globalStorage ? globalStorage[location.hostname] : null);
    if (storage) return f(storage);
    else return false;
}

function readStorage(name){
    //Read from localstorage
    return accessStorage(function(storage){
	var x = storage.getItem(name);
	try { var oldData = JSON.parse(x); }
	catch (e) { var oldData = x.split(','); }
	return oldData;
    });
}

function storeUserInput(cachedInput,maxScores){
    //Put cache & scores in localstorage

    function storeCache(cachedInput, storage){
	//For every combo of problem no. and rule row, have a storage entry
	for(var i = 0; i < NUMPROBLEMS; i++){
	    for(var j = 0; j < NUMROWS; j++){
		var currentRow = cachedInput[i][j];
		var size = currentRow.length;
		if (size) {
		    storage.setItem('p'+i.toString()+'rr'+j.toString(),
				    JSON.stringify(currentRow));
		}
	    }
	}
    }
    return accessStorage(function(storage){
	storage.clear();
	storeCache(cachedInput, storage);
	storage.setItem('maxScores',JSON.stringify(maxScores));
    });

}

/*INITIALIZE CACHE (ARRAY OF RULE ROWS) AND MAXSCORES (ARRAY OF POINTS)*/

function initCache(){
    //An array containing instances of X, with length NUMPROBLEMS
    //Each X is an array of rule rows (either 4 empty arrays, or 4 html tags)

    function loadCacheRow(problem, row){
	var oldData = readStorage('p'+problem.toString()+'rr'+row.toString());
	if (oldData) { return oldData; }
	return [];
    }

    var ans = [];
    for (var i = 0; i < NUMPROBLEMS; i++){
	ans.push([]);
	for (var j = 0; j < NUMROWS; j++){ ans[i].push(loadCacheRow(i,j)); }
    }
    return ans;
}

function initScores(){
    var oldData = readStorage('maxScores');
    if (oldData) { return oldData; }
    //An array containing 0, NUMPROBLEMS times
    var ans = [];
    for (var i = 0; i < NUMPROBLEMS; i++){ ans.push(0); }
    return ans;
}

/*READING AND WRITING TO CACHE*/

function updateCache(cachedInput, problem){
    //<li><img class="icon" alt="b" src="icons/b.png"></li>
    var left = '<li><img class="icon" alt="';
    var mid = '" src="icons/';
    var right = '.png"></li>';

    for (var i = 0; i < NUMROWS; i++){
	//Store what is in the rule rows
	var currentRuleRow = $('#rr'+i.toString());
	cachedInput[problem][i] = '';
	$.each(currentRuleRow.children(), function(){
	    var imageDom = $(this).children()[0];
	    var src = shortenFilename(imageDom.src);
	    cachedInput[problem][i] += left+src+mid+src+right;
	});
    }
}

function loadFromCache(cachedInput, problem){
    //Fill rule-rows with data from cache
    for (var i = 0; i < NUMROWS; i++){
	//Load rule rows for the chosen problem		
	var currentRuleRow = $('#rr'+i.toString());
	currentRuleRow.empty();

	var ruleRowData = cachedInput[problem][i];
	currentRuleRow.append(ruleRowData);
    }
}
