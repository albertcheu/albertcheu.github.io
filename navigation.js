//show most recent post, LIMIT per 'page'
var LIMIT = 2;

var pageNumber = 0;
var posts;
var pl;

$(document).ready(function(){
    posts = $('.post-list-item');
    pl = posts.length;

    //if there are more than LIMIT posts
    if (pl > LIMIT) {
	//handle data hiding
	changePage();

	//initialize a selector to allow viewing of different 'pages'
	for (var i = 0; i < Math.ceil(posts.length / LIMIT); i++) {
	    $('select').append(`<option value="${i}">${i}</option>`);
	}
    }

    else {
	$('.nav').css('display','none');
    }

    //when the user makes a selection,
    //hide everything except for those posts that fall in range
    $("select").change(function(){
	var posts = $('.post-list-item');
	var pl = posts.length;

	//get the chosen page number
	var selectedOption = $( "select option:selected" )[0];
	pageNumber = parseInt($(selectedOption).attr('value'));

	changePage();
    });

    $('#newer').click(function(){
	pageNumber--;
	$('select').val(pageNumber);
	changePage()
    });

    $('#older').click(function(){
	pageNumber++;
	$('select').val(pageNumber);
	changePage()
    });

});

function changePage(){
    for (var i = 0; i < pl; i++){
	if (i < pageNumber*LIMIT || i >= (pageNumber+1)*LIMIT) {
	    $(posts[i]).css('display','none');
	}
	else {
	    $(posts[i]).css('display','initial');
	}
    }

    if (pageNumber == 0) {
	$('#newer').css('display','none');
    }
    else { $('#newer').css('display','initial'); }

    if (pageNumber == Math.ceil(pl/LIMIT) -1) {
	$('#older').css('display','none');
    }
    else { $('#older').css('display','initial'); }

}
