/*!
* slick.js
* v0.5.0 - 2013-12-10
* https://github.com/shashankmehta/slick.js
* (c) Shashank Mehta; MIT License
*/
/*global jQuery */
(function ($, root) {
    'use strict';

    var Slick = function (container, config) {
        this.options = {
            source: undefined,
            serialSource: false,
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
            if(this.state.slide.current <= this.state.slide.total){
                if(this.options.serialSource === true){

                    if(this.state.getNext){
                        this.hooks.switchNext.apply(this);
                        this.hooks.getNext.apply(this);
                    }
                    else {
                        var that = this;
                        var container = this.options.container;
                        $(container + ' '+this.options.contentClass+' img.loader-next').load(function(){
                            that.hooks.switchNext.apply(that);
                            that.hooks.getNext.apply(that);
                        });
                    }
                }
            }
        },

        getNext: function(){
            if(this.state.slide.current <= this.state.slide.total){
                this.state.getNext = false;
                var container = this.options.container;
                $(container + ' '+this.options.contentClass+' img.loader-next').remove();
                var step = this.state.current + 1;
                $(container + ' '+this.options.contentClass).append('<img src="'+ this.hooks.imagePath.apply(this, [step]) +'" class="loader-next">');
                this.hooks.hideElement(container + ' img.loader-next');
                
                var that = this;
                $(container + ' '+this.options.contentClass+' img.loader-next').load(function(){
                    that.state.getNext = true;
                });
            }
        },

        switchNext: function(){
            this.state.current++;
            var container = this.options.container;
            $(container + ' '+this.options.contentClass+' img.current').remove();
            $(container + ' '+this.options.contentClass+' img.loader-next').addClass('current').removeClass('loader-next');
            this.hooks.showElement(container + ' '+this.options.contentClass+' img.current');
            $(container + ' .current-no').html(++this.state.slide.current);
        },

        prev: function(){
            if(this.state.current > 0){
                var container = this.options.container;
                if(this.options.serialSource === true){
                    var step = --this.state.current;

                    $(container + ' '+this.options.contentClass).append('<img src="'+ this.hooks.imagePath.apply(this, [step]) +'" class="loader-back">');
                    this.hooks.hideElement(container + ' img.loader-back');

                    var that  = this;
                    $(container + ' '+this.options.contentClass+' img.loader-back').load(function(){
                        $(container + ' '+that.options.contentClass+' img.current').remove();
                        $(container + ' '+that.options.contentClass+' img.loader-back').addClass('current').removeClass('loader-back');
                        that.hooks.showElement(container + ' '+that.options.contentClass+' img.current');
                        that.hooks.getNext.apply(that);
                    });
                    $(container + ' .current-no').html(--this.state.slide.current);
                }
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
        var that = this;

        if(this.options.serialSource === true){
            if(typeof this.options.source === 'string'){
                this.hooks.getNext.apply(this);
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

    window.Slick = Slick;

}(jQuery, window));