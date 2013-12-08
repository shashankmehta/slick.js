(function($, root, undefined){

	slick = {};

	slick.state = {
		current: 0,
		start: 0,
		end: 0,

		slide: {
			current:0,
			total: 0,
		}
	};

	slick.hooks = {
		next: function(){
			if(slick.state.current < slick.state.end){
				if(slick.config.serial_source === true){
					var step = ++slick.state.current;
				}
				$('.slick-content').append('<img src="'+ slick.hooks.imagePath(step) +'" class="loader">');
				$('.slick-content img.loader').load(function(){
					$('.slick-content img.current').remove();
					$('.slick-content img.loader').addClass('current').removeClass('loader');
				})
				$('.slick .current-no').html(++slick.state.slide.current);
			}
		},

		back: function(){
			if(slick.state.current > slick.state.start){
				if(slick.config.serial_source === true){
					var step = --slick.state.current;
				}
				$('.slick-content').append('<img src="'+ slick.hooks.imagePath(step) +'" class="loader">');
				$('.slick-content img.loader').load(function(){
					$('.slick-content img.current').remove();
					$('.slick-content img.loader').addClass('current').removeClass('loader');
				})
				$('.slick .current-no').html(--slick.state.slide.current);
			}
		},

		imagePath: function(step){
			var parts = slick.config.source.split('*');
			return parts[0] + step + parts[1];
		}
	};

	slick.init = function(){
		if(slick.config.serial_source === true){
			if(typeof slick.config.source === "string"){
				slick.state.current = slick.config.start - 1;
				slick.state.end = slick.config.end;
				slick.hooks.next();
			}
		}
		$('.slick-controls .next').click(function(){
			slick.hooks.next();
		});
		$('.slick-controls .back').click(function(){
			slick.hooks.back();
		});
		$('.slick .current-no').html(slick.state.current+1);
		$('.slick .total').html(slick.state.end+1);
	};

	$(document).keyup(function(e) {
		if (e.keyCode ===  39 || e.keyCode ===  40) {
			slick.hooks.next();        
		}
		if (e.keyCode ===  37 || e.keyCode ===  38) {
			slick.hooks.back();
		}
	});
}(jQuery, window));