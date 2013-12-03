$(document).ready(function(){
	slick = {};

	slick.state = {
		current: 0,
		start: 0,
		end: 36
	}

	slick.hooks = {
		next: function(){
			if(slick.state.current < slick.state.end){
				slick.state.current++;
				$('.slick-content').append('<img src="/slide/out-'+slick.state.current+'.jpg" class="loader">');
				$('.slick-content img.loader').load(function(){
					$('.slick-content img.current').remove();
					$('.slick-content img.loader').addClass('current').removeClass('loader');
				})
				$('.slick .current-no').html(slick.state.current+1);
			}
		},

		back: function(){
			if(slick.state.current > slick.state.start){
				slick.state.current--;
				$('.slick-content').append('<img src="/slide/out-'+slick.state.current+'.jpg" class="loader">');
				$('.slick-content img.loader').load(function(){
					$('.slick-content img.current').remove();
					$('.slick-content img.loader').addClass('current').removeClass('loader');
				})
				$('.slick .current-no').html(slick.state.current+1);
			}
		}
	}

	slick.init = function(){
		$('.slick-controls .next').click(function(){
			slick.hooks.next();
		});
		$('.slick-controls .back').click(function(){
			slick.hooks.back();
		});
		$('.slick .current-no').html(slick.state.current+1);
		$('.slick .total').html(slick.state.end+1);
	}

	slick.init();

	$(document).keyup(function(e) {
		if (e.keyCode ===  39 || e.keyCode ===  40) {
			slick.hooks.next();        
		}
		if (e.keyCode ===  37 || e.keyCode ===  38) {
			slick.hooks.back();
		}
	});
});