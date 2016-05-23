
function getFinalSize (elem) {
    var computedStyle = getComputedStyle(elem,"");
    var elemW = parseInt(computedStyle.width.replace('px', ''), 10);
    var elemH = parseInt(computedStyle.height.replace('px', ''), 10);

    return {width:elemW,height:elemH};
}

function toPix(val){ return String(val)+"px"; }

//fix bottom padding to account for footer height
function adjust(){
    var whF = getFinalSize($(".site-footer")[0]);
    var footerHeight = whF.height+15;

    $(".page-content").css({
	"padding-bottom":toPix(footerHeight),
    });
}

$(document).ready(function(){

    $(window).load(function() {
	adjust();
    });

    $(window).resize(function(){
	adjust();
    });

});

