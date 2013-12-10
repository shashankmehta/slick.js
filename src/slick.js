/*global jQuery */
(function ($, root) {
    'use strict';

    var Slick = function (container, config) {
        this.options = {
            source: undefined,
            start: undefined,
            end: undefined,
            next: '.next',
            prev: '.prev',
            contentClass: '.slick-content',
            keyControl: true,
            container: container
        };

        for (var option in this.options) {
            if (this.options.hasOwnProperty(option)) {
                this.options[option] = config[option] !== undefined ? config[option] : this.options[option];
            }
        }

        this.state = {
            // Stores slide no that is visible
            current: this.options.start-1,
            
            start: this.options.start,
            end: this.options.end,
            getNext: false,

            // Stores values that is shown in controls
            slide: {
                current:0,
                total: this.options.end,
            }
        };
        
        this.init.apply(this);
    };

    var SlickProto = Slick.prototype;

    SlickProto.hooks = {

        // Main function for handling next/forwarding of slides
        next: function() {
            var slick = this;
            var container = slick.options.container;

            if(slick.state.slide.current <= slick.state.slide.total){

                // Setting and displaying the current slide no
                $(container + ' .current-no').html(++slick.state.slide.current);

                // Checking if next image has loaded
                if(slick.state.getNext){
                    slick.hooks.switchNext.apply(slick);
                    slick.hooks.getNext.apply(slick);
                }
                // Waiting for the next image to load
                else {
                    $(container + ' ' + slick.options.contentClass + ' img.loader-next').load(function(){
                        slick.hooks.switchNext.apply(slick);
                        slick.hooks.getNext.apply(slick);
                    });
                }
            }
        },

        // Handles fetching of image
        getNext: function(){
            var slick = this;

            if(slick.state.slide.current <= slick.state.slide.total){
                slick.state.getNext = false;
                var container = slick.options.container;

                //Removing all previous instances of loader-next to ensure no multiples
                $(container + ' ' + slick.options.contentClass + ' img.loader-next').remove();

                var step = slick.state.current + 1;
                $(container + ' ' + slick.options.contentClass).append('<img src="'+ slick.hooks.imagePath.apply(slick, [step]) +'" class="loader-next">');
                $(container + ' ' + slick.options.contentClass + ' img.loader-next').hide();

                $(container + ' ' + slick.options.contentClass + ' img.loader-next').load(function(){
                    slick.state.getNext = true;
                });
            }
        },

        // Handles changing of images
        switchNext: function(){
            var slick = this;

            slick.state.current++;
            var container = slick.options.container;
            $(container + ' ' + slick.options.contentClass + ' img.current').remove();
            $(container + ' ' + slick.options.contentClass + ' img.loader-next').addClass('current').removeClass('loader-next').show();
        },

        // Handles loading and switching for going back a slide
        prev: function(){
            var slick = this;

            if(slick.state.current > 0){
                var container = slick.options.container;
                var step = --slick.state.current;

                $(container + ' ' + slick.options.contentClass).append('<img src="' + slick.hooks.imagePath.apply(slick, [step]) + '" class="loader-back">');
                $(container + ' ' + slick.options.contentClass + ' img.loader-back').hide();

                $(container + ' ' + slick.options.contentClass + ' img.loader-back').load(function(){
                    $(container + ' ' + slick.options.contentClass + ' img.current').remove();
                    $(container + ' ' + slick.options.contentClass + ' img.loader-back').addClass('current').removeClass('loader-back').show();
                    slick.hooks.getNext.apply(slick);
                });
                $(container + ' .current-no').html(--slick.state.slide.current);
            }
        },

        // Returns the path with the current no inserted
        imagePath: function(step){
            var parts = this.options.source.split('*');
            return parts[0] + step + parts[1];
        },

    };

    SlickProto.init = function(){
        var slick = this;

        // Sets the first slide
        if(typeof slick.options.source === 'string'){
            slick.hooks.getNext.apply(slick);
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
    };

    window.Slick = Slick;

}(jQuery, window));