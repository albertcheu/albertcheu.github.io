//http://jsfiddle.net/gp4e9d3z/3/

function getBackgroundSize (elem,callback) {
    var computedStyle = getComputedStyle(elem,""),
    src = computedStyle.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0],
    cssSize = computedStyle.backgroundSize,
    elemW = parseInt(computedStyle.width.replace('px', ''), 10),
    elemH = parseInt(computedStyle.height.replace('px', ''), 10),
    elemDim = [elemW, elemH],
    computedDim = [],
    ratio;
/*
    console.log(elemDim);
	callback( {
            width: elemDim[0],
            height: elemDim[1]
	}); 
*/
    var image = new Image();
    image.src = src;
    image.onload = function() {

	ratio = ((image.width > image.height) ? image.width / image.height : image.height / image.width);

	cssSize = cssSize.split(' ');
	computedDim[0] = cssSize[0];
	computedDim[1] = cssSize.length > 1 ? cssSize[1] : 'auto';

	if(cssSize[0] === 'cover') {
            if(elemDim[0] > elemDim[1] && elemDim[0] / elemDim[1] >= ratio) {
		//console.log("foo");
		computedDim[0] = elemDim[0];
		computedDim[1] = "auto";
	    } else {
		//console.log("bar");
		computedDim[0] = "auto";
		computedDim[1] = elemDim[1];
	    }
	}

	else if(cssSize[0] === 'contain') {
            if(elemDim[0] < elemDim[1] || elemDim[0] / elemDim[1] < ratio) {
		computedDim[0] = elemDim[0];
		computedDim[1] = 'auto';
            } else {
		computedDim[0] = 'auto';
		computedDim[1] = elemDim[1];
	    } 
	} else {
            for(var i = cssSize.length; i--;) {
		if (cssSize[i].indexOf('px') > -1) {
                    computedDim[i] = cssSize[i].replace('px', '');
		} else if (cssSize[i].indexOf('%') > -1) {
                    computedDim[i] = elemDim[i] * (cssSize[i].replace('%', '') / 100);
		}
            }
	}

	if (computedDim[0] === 'auto' && computedDim[1] === 'auto') {
            computedDim[0] = image.width;
            computedDim[1] = image.height;
	}


	else {

            ratio = ((computedDim[0] === "auto") ? image.height / computedDim[1] : image.width / computedDim[0]);
	    console.log(ratio);
            computedDim[0] = ((computedDim[0] === "auto") ? image.width / ratio : computedDim[0]);
            computedDim[1] = ((computedDim[1] === "auto") ? image.height / ratio : computedDim[1]);
	}

	callback( {
            width: computedDim[0],
            height: computedDim[1]
	});
    }

}

$(document).ready(function(){    
    $(window).load(function() {
    getBackgroundSize($(".page-content")[0], function(wh){
	back_width = parseInt(wh.width,10);
	back_height = parseInt(wh.height,10);
	console.log(back_width);
	console.log(back_height);
    });
    });

    $.fn.followTo = function (pos) {
	var $this = this,
        $window = $(window),
        $doc = $('body');

	$window.scroll(function (e) {
	    var fromBottom = $doc.height()-$window.height()-$window.scrollTop();

	    var newsizeS = String(Math.max($window.width(),back_width))+"px "
		+String(Math.max($window.height(),back_height))+"px";

            if (fromBottom < pos) {
//		console.log(back_width);
//		console.log(back_height);
		var newy = String($window.height()/2 - pos - 5);
		var newyS = "50% "+newy+"px";
		
		//console.log(newsizeS);
		$this.css({
		    'background-origin': 'content-box',
		    'background-position': newyS,
		    //'background-size': newsizeS,
		    //'background-size': String($window.width())+"px "+String($window.height())+"px",
		    'background-attachment':'scroll'
		});
            } else {
		$this.css({
		    //'background-size':'cover',
		    'background-position': 'center center',
		    //'background-size': newsizeS,
		    'background-attachment':'fixed'
		});
            }
	});
    };


    $('.page-content').followTo(74);
});

