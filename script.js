$(document).ready(function(){
    $("button").click(function(){
	var val = this.id;
	var text = $("#theText").val();

	//If C, clear text box
	if (val == "C") {
	    alert("We must clear the textbox");
	}
	//elif E, compute
	else if (val == "E"){
	    alert("We must compute");
	}
	//Else, append to string
	else {
	    alert("We add to the string");
	}
    });
});