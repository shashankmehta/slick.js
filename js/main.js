(function($, root){

	var defaults = {
		next: '.next',
		prev: '.prev',
		serialSource: false,
		contentClass: '.slick-content',
		keyControl: true
	};

	Slick = function(container, config){
		this.options = {};

		this.options.container = container;

		for(option in config){
			this.options[option] = config[option];
		}
		
		for(option in defaults){
			this.options[option] = this.options[option] == undefined ? defaults[option] : this.options[option];
		}


		this.state = {
			current: this.options.start-1,
			start: this.options.start,
			end: this.options.end,

			slide: {
				current:0,
				total: this.options.end,
			}
		};
		
		// this.init();
	};

	var SlickProto = Slick.prototype;

	SlickProto.hooks = {
		next: function(){
			if(this.state.slide.current <= this.state.slide.total){
				var container = this.options.container;
				if(this.options.serialSource === true){
					var step = ++this.state.current;
				}
				$(container + ' ' + this.options.contentClass).append('<img src="'+ this.hooks.imagePath.apply(this, [step]) +'" class="loader">');
				
				var that = this;
				$(container + ' '+this.options.contentClass+' img.loader').load(function(){
					$(container + ' '+that.options.contentClass+' img.current').remove();
					$(container + ' '+that.options.contentClass+' img.loader').addClass('current').removeClass('loader');
				})
				$(container + ' .current-no').html(++this.state.slide.current);
			}
		},

		prev: function(container){
			if(this.state.current > 0){
				var container = this.options.container;
				if(this.options.serialSource === true){
					var step = --this.state.current;
				}
				$(container + ' '+this.options.contentClass).append('<img src="'+ this.hooks.imagePath.apply(this, [step]) +'" class="loader">');

				var that  = this;
				$(container + ' '+this.options.contentClass+' img.loader').load(function(){
					$(container + ' '+that.options.contentClass+' img.current').remove();
					$(container + ' '+that.options.contentClass+' img.loader').addClass('current').removeClass('loader');
				})
				$(container + ' .current-no').html(--this.state.slide.current);
			}
		},

		imagePath: function(step){
			var parts = this.options.source.split('*');
			return parts[0] + step + parts[1];
		}
	};

	SlickProto.init = function(){
		var that = this;

		if(this.options.serialSource === true){
			if(typeof this.options.source === "string"){
				this.hooks.next.apply(this);
			}
		}
		$(this.options.container + ' ' +this.options.next).click(function(e){
			e.preventDefault();
			that.hooks.next.apply(that);
		});
		$(this.options.container + ' ' +this.options.prev).click(function(e){
			e.preventDefault();
			that.hooks.prev.apply(that);
		});
		$(this.options.container + ' .current-no').html(this.state.current+1);
		$(this.options.container + ' .total').html(this.state.end+1);

		if(this.options.keyControl){
			$(document).keyup(function(e) {
				if (e.keyCode ===  39 || e.keyCode ===  40) {
					that.hooks.next.apply(that);        
				}
				if (e.keyCode ===  37 || e.keyCode ===  38) {
					that.hooks.prev.apply(that);
				}
			});
		}
	};

}(jQuery, window));