
function getFinalSize (elem) {
    var computedStyle = getComputedStyle(elem,"");
    var elemW = parseInt(computedStyle.width.replace('px', ''), 10);
    var elemH = parseInt(computedStyle.height.replace('px', ''), 10);

    return {width:elemW,height:elemH};
}

function toPix(val){ return String(val)+"px"; }

function adjust(){
    var whH = getFinalSize($(".site-header")[0]);
    //headerWidth = whH.width;
    var headerHeight = whH.height;

    var whF = getFinalSize($(".site-footer")[0]);
    //footerWidth = whF.width;
    var footerHeight = whF.height+15;

    //console.log(headerHeight);
    //console.log(footerHeight);

    //page-content changes
    $(".page-content").css({
	"padding-top":toPix(headerHeight),
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

