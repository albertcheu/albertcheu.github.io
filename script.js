function wellFormed(textVal){
    //a valid string begins with a sequence of numbers
    //followed by zero or more [+-*/][numbers]
    var res = textVal.match(/([\d]+)([-\+\*\/]([\d]+))*/);
    for (var i = 0; i < res.length; i++){
	if (res[i] == textVal) return true;
    }
    return false;
}

function tokenize(textVal){
    ans = [];
    cur = "";
    for (var i = 0; i < textVal.length; i++){
	c = textVal.charAt(i);
	if (c=='+' || c=='-' || c=='*' || c=='/'){
	    ans.push(cur);
	    cur = "";
	    ans.push(c);
	}
	else { cur += c; }
    }
    ans.push(cur);
    return ans;
}

function computeHalf(tokens, c1,c2, f){
    var i = 0;
    while (true) {
	c = tokens[i];
	if (c==c1||c==c2) {
	    rep = f(tokens[i-1],c,tokens[i+1]);
	    tokens.splice(i-1,3,rep);
	}
	else i++;
	if (i >= tokens.length) { break; }
    }
}

function handleMD(snum1,op,snum2){
    num1 = parseFloat(snum1);
    num2 = parseFloat(snum2);
    if (op=='*') { return num1 * num2; }
    return num1 / num2;
}
function handleAS(snum1,op,snum2){
    num1 = parseFloat(snum1);
    num2 = parseFloat(snum2);
    if (op=='+') { return num1 + num2; }
    return num1 - num2;
}

function compute(textVal){
    if (wellFormed(textVal)) {
	tokens = tokenize(textVal);
	//Multiplication and division come first
	computeHalf(tokens,'/','*',handleMD);
	//Then addition and subtraction
	computeHalf(tokens,'+','-',handleAS);
	$("#theText").val(tokens[0]);
    }
    else { alert("The input is not well-formed"); }
}

$(document).ready(function(){
    $("li").hover(
	function(){
	    var id = this.id;
	    $("#"+id).css("background-color","yellow");
	},
	function(){
	    var id = this.id;
	    $("#"+id).css("background-color","orange");
	}
    );
    $("button").click(function(){
	var val = this.id;
	var textBox = $("#theText");
	var textVal = textBox.val();

	//If C, clear text box
	if (val == "C") { textBox.val(""); }
	//elif E, compute
	else if (val == "E"){ compute(textVal); }
	//Else, append to string
	else { textBox.val(textVal+val); }
    });
});