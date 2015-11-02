/**
 * Created by lirui on 15/10/28.
 */
var YdUiKit = function () {
}
YdUiKit.prototype.slider = function (setting) {
	var def = {
		controller: '.slider li',
		delay: 3000,
		dots: true,
		dots_controller: '.dots'
	}
	var option = $.extend(def, setting);
	if ($(option.controller).length < 2) {
		return false;
	}
	$(option.controller).each(function () {
		var width = $(this).parent().parent().width();
		$(this).width(width);
	});
	var timer;
	if (option.dots && option.dots_controller) {
		var dots = $(option.dots_controller);
		$($(option.controller)).each(function () {
			dots.append("<li></li>");
		});
	}
	function activedots(k) {
		//console.log(k)
		if (option.dots && option.dots_controller) {
			$(option.dots_controller).find('li').removeClass('active');
			$(option.dots_controller).find('li').eq(k).addClass('active');
		}

	}

	function picmove(i, delay) {
		clearTimeout(timer);
		var j = $(option.controller).length;
		var w = $(option.controller).width();
		var parent = $(option.controller).parent();
		var mv;
		if(delay){
			if(i<j){
				mv=-(i*w);
				parent.css({'-webkit-transform':'translate('+mv+'px, 0px)','transform':'translate('+mv+'px, 0px)'});
				activedots(i);
				i++;
				timer = setTimeout(function(){
					picmove(i,delay);

				},delay)

			}
			else{
				i=0;
				parent.css({'-webkit-transform':'translate(0px, 0px)','transform':'translate(0px, 0px)'});
				picmove(i,delay);
				activedots(i);
			}
		}
		else{
			if(i<0){
				mv = 0;
				parent.css({'-webkit-transform':'translate('+mv+'px, 0px)','transform':'translate('+mv+'px, 0px)'});
				//activedots(i);
			}
			else if(i<j){
				mv=-(i*w);
				parent.css({'-webkit-transform':'translate('+mv+'px, 0px)','transform':'translate('+mv+'px, 0px)'});
				//i++;
				//picmove(i);
				activedots(i);
			}
			else{
				i=0;
				parent.css({'-webkit-transform':'translate(0px, 0px)','transform':'translate(0px, 0px)'});
				//picmove(i);
				activedots(i);
			}
		}


	}

	picmove(0, option.delay);
	$(option.controller).swipeLeft(function () {
		var idx = $(this).index();
		picmove(idx + 1);

	});
	$(option.controller).swipeRight(function () {
		var idx = $(this).index();
		picmove(idx - 1);

	});
	//$(option.controller).flickable();
}
