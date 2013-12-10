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
            current: this.options.start-1,
            start: this.options.start,
            end: this.options.end,
            getNext: false,

            slide: {
                current:0,
                total: this.options.end,
            }
        };
        
        this.init.apply(this);
    };

    var SlickProto = Slick.prototype;

    SlickProto.hooks = {
        next: function() {
            var slick = this;

            if(slick.state.slide.current <= slick.state.slide.total){
                if(slick.state.getNext){
                    slick.hooks.switchNext.apply(slick);
                    slick.hooks.getNext.apply(slick);
                }
                else {
                    var container = slick.options.container;
                    $(container + ' '+slick.options.contentClass+' img.loader-next').load(function(){
                        slick.hooks.switchNext.apply(slick);
                        slick.hooks.getNext.apply(slick);
                    });
                }
            }
        },

        getNext: function(){
            var slick = this;

            if(slick.state.slide.current <= slick.state.slide.total){
                slick.state.getNext = false;
                var container = slick.options.container;
                $(container + ' '+slick.options.contentClass+' img.loader-next').remove();
                var step = slick.state.current + 1;
                $(container + ' '+slick.options.contentClass).append('<img src="'+ slick.hooks.imagePath.apply(slick, [step]) +'" class="loader-next">');
                slick.hooks.hideElement(container + ' img.loader-next');
                
                $(container + ' '+slick.options.contentClass+' img.loader-next').load(function(){
                    slick.state.getNext = true;
                });
            }
        },

        switchNext: function(){
            var slick = this;

            slick.state.current++;
            var container = slick.options.container;
            $(container + ' '+slick.options.contentClass+' img.current').remove();
            $(container + ' '+slick.options.contentClass+' img.loader-next').addClass('current').removeClass('loader-next');
            slick.hooks.showElement(container + ' '+slick.options.contentClass+' img.current');
            $(container + ' .current-no').html(++slick.state.slide.current);
        },

        prev: function(){
            var slick = this;

            if(slick.state.current > 0){
                var container = slick.options.container;
                var step = --slick.state.current;

                $(container + ' '+slick.options.contentClass).append('<img src="'+ slick.hooks.imagePath.apply(slick, [step]) +'" class="loader-back">');
                slick.hooks.hideElement(container + ' img.loader-back');

                $(container + ' '+slick.options.contentClass+' img.loader-back').load(function(){
                    $(container + ' '+slick.options.contentClass+' img.current').remove();
                    $(container + ' '+slick.options.contentClass+' img.loader-back').addClass('current').removeClass('loader-back');
                    slick.hooks.showElement(container + ' '+slick.options.contentClass+' img.current');
                    slick.hooks.getNext.apply(slick);
                });
                $(container + ' .current-no').html(--slick.state.slide.current);
            }
        },

        imagePath: function(step){
            var parts = this.options.source.split('*');
            return parts[0] + step + parts[1];
        },

        hideElement: function(element){
            $(element).css({
                'width': '0px',
                'display': 'none'
            });
        },

        showElement: function(element){
            $(element).css({
                'width': 'inherit',
                'display': 'inline'
            });
        }

    };

    SlickProto.init = function(){
        var slick = this;

        if(typeof slick.options.source === 'string'){
            slick.hooks.getNext.apply(slick);
            slick.hooks.next.apply(slick);
        }
        $(slick.options.container + ' ' +slick.options.next).click(function(e){
            e.preventDefault();
            slick.hooks.next.apply(slick);
        });
        $(slick.options.container + ' ' +slick.options.prev).click(function(e){
            e.preventDefault();
            slick.hooks.prev.apply(slick);
        });
        $(slick.options.container + ' .current-no').html(slick.state.current+1);
        $(slick.options.container + ' .total').html(slick.state.end+1);

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