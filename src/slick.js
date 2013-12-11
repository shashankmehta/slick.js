/*global jQuery */
(function ($, root) {
    'use strict';

    $.fn.exists = function () {
        return this.length !== 0;
    };

    var Slick = function (container, config) {
        this.options = {
            source: undefined,
            start: undefined,
            end: undefined,
            next: '.next',
            prev: '.prev',
            contentClass: '.slick-content',
            keyControl: true,
            container: container,
            content: undefined
        };

        for (var option in this.options) {
            if (this.options.hasOwnProperty(option)) {
                this.options[option] = config[option] !== undefined ? config[option] : this.options[option];
            }
        }

        this.options.content = this.options.container + ' ' + this.options.contentClass;

        this.state = {
            // Stores slide url no that is visible
            current: this.options.start-1,
            
            start: this.options.start,
            end: this.options.end,
            getNext: false,

            // Stores values that is shown in controls
            slide: {
                current: 0,
                difference: (this.options.start - 1),
                total: (this.options.end - this.options.start + 1),
                maxHit: 0
            }
        };
        
        this.init.apply(this);
    };

    var SlickProto = Slick.prototype;

    SlickProto.hooks = {

        // Main function for handling next/forwarding of slides
        next: function() {
            var slick = this;

            if(slick.state.slide.current < slick.state.slide.total){
                var step = ++slick.state.slide.current + slick.state.slide.difference;
                slick.hooks.setSlide.apply(this, [step]);
            }
        },

        // Main function for handling going backward
        prev: function(){
            var slick = this;

            if(slick.state.slide.current > 1){
                var step = --slick.state.slide.current + slick.state.slide.difference;
                slick.hooks.setSlide.apply(this, [step]);
            }
        },

        setSlide: function(step){
            var slick = this;
            var slideStatus = slick.hooks.slideStatus.apply(slick, [step]);
            slick.state.slide.current = step - slick.state.slide.difference;

            if($(slick.options.container + ' .skip.current-no').is(':input')){
                $(slick.options.container + ' .current-no').val(slick.state.slide.current);
            }
            else {
                $(slick.options.container + ' .skip').val(slick.state.slide.current);
                $(slick.options.container + ' .current-no').html(slick.state.slide.current);
            }
            
            if(slideStatus === 1){
                $(slick.options.content + ' img.current').removeClass('current').addClass('cached-slide').hide();
                $(slick.options.content + ' img[data-slide=' + step + ']').removeClass('cached-slide').addClass('current').show();
                slick.state.current = step;
                slick.hooks.getSlide.apply(slick, [step+1]);
                return;
            }
            else if(slideStatus === 2){
                slick.hooks.slideSwitch.apply(this, [step]);
            }
            else if(slideStatus === 0){
                // Removing on load from all previous still loading images 
                $(slick.options.content + ' img.loading').off('load.slideSwitch').remove();
                slick.hooks.getSlide.apply(slick, [step]);
                slick.hooks.slideSwitch.apply(this, [step]);
            }
        },

        // Gets the slide for the step
        getSlide: function(step){
            var slick = this;
            if(slick.hooks.slideStatus.apply(this, [step]) === 0 && step <= slick.state.end){
                $(slick.options.content).append('<img src="'+ slick.hooks.imagePath.apply(slick, [step]) +'" data-slide=' + step + ' class="loading">');
                $(slick.options.content + ' img.loading').hide();
                $(slick.options.content + ' img.loading').load(function(){
                    $(this).removeClass('loading').addClass('cached-slide');
                });
            }
        },

        slideSwitch: function(step){
            var slick = this;
            $(slick.options.content + ' img[data-slide=' + step + ']').on('load.slideSwitch', function(){
                $(slick.options.content + ' img.current').removeClass('current').addClass('cached-slide').hide();
                $(this).removeClass('cached-slide').addClass('current').show();
                slick.state.current = step;
                slick.hooks.getSlide.apply(slick, [step+1]);
            });
        },

        // Returns the status of a slide
        // 0: Not requested yet
        // 1: cached
        // 2: loading
        slideStatus: function(step){
            var slick = this;
            var el = slick.options.content + ' img[data-slide=' + step + ']';
            if($(el).exists()){
                if($(el).hasClass('loading')){
                    return 2;
                }
                else {
                    return 1;
                }
            }
            else {
                return 0;
            }
        },

        // Returns the path with the current no inserted
        imagePath: function(step){
            var parts = this.options.source.split('*');
            return parts[0] + step + parts[1];
        },

        skip: function(val){
            if($.isNumeric(val)){
                var slick = this;

                var step = parseInt(val) + slick.state.slide.difference;
                slick.hooks.getSlide.apply(slick, [step]);
                slick.hooks.setSlide.apply(slick, [step]);
            }
        }

    };

    SlickProto.init = function(){
        var slick = this;

        // Sets the first slide
        if(typeof slick.options.source === 'string'){
            slick.hooks.next.apply(slick);
        }

        // Attaches event listeners for next/prev buttons
        $(slick.options.container + ' ' + slick.options.next).click(function(e){
            e.preventDefault();
            slick.hooks.next.apply(slick);
        });
        $(slick.options.container + ' ' + slick.options.prev).click(function(e){
            e.preventDefault();
            slick.hooks.prev.apply(slick);
        });
        $(slick.options.container + ' .total').html(slick.state.end - slick.state.start + 1);

        // Ataches keyboard control
        if(slick.options.keyControl){
            $(document).keyup(function(e) {
                if (e.keyCode ===  39 || e.keyCode ===  40) {
                    slick.hooks.next.apply(slick);
                }
                if (e.keyCode ===  37 || e.keyCode ===  38) {
                    slick.hooks.prev.apply(slick);
                }
            });
        }
        
        $(slick.options.container + ' .skip').keypress(function(e){
            if(e.keyCode === 13){
                slick.hooks.skip.apply(slick, [$(this).val()]);
                $(this).blur();
            }
        });
    };

    window.Slick = Slick;

    // Exposing programmatic access
    Slick.next = function(slick){
        if(slick.constructor === Slick){
            slick.hooks.next.apply(slick);
        }
    };

    Slick.prev = function(slick){
        if(slick.constructor === Slick){
            slick.hooks.prev.apply(slick);
        }
    };

    Slick.skip = function(slick, step){
        if(slick.constructor === Slick){
            slick.hooks.skip.apply(slick, [step]);
        }
    };

}(jQuery, window));