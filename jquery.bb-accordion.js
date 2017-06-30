/* jshint -W117 */

/*!
 * BB Accordion 1.1.0 
 * https://github.com/bobbybol/accordion.js
 * @license MIT licensed
 *
 * Copyright (C) 2017 bobbybol.com - A project by Bobby Bol
 */

;( function($, window, document, undefined) {
    'use strict';

    /**
     * Setting the defaults
     */
    
    var pluginName = 'bbAccordion';
    var defaults = {
        button: '.bb-accordion--button',
        outer: '.bb-accordion--outer',
        inner: '.bb-accordion--inner',
        cssTransition: false,
        transitionSpeed: 600,
        changeButtonHtml: false,
        toggledButtonHtml: 'Close Details',
        exclusive: false
    };

    
    /**
     * Composing the Plugin constructor
     */
    
    function Plugin (element, originalSelector, options) {
        
        // Create a settings property merged from defaults and passed options 
        this.settings = $.extend( {}, defaults, options );
        
        // General purpose properties
        this._defaults = defaults;
        this._name = pluginName;
        this.element = element;
        
        // Plugin specific properties
        this.wrapper            = $(element);
        this.originalSelector   = originalSelector;
        this.button             = this.wrapper.find(this.settings.button);
        this.outer              = this.wrapper.find(this.settings.outer);
        this.inner              = this.outer.find(this.settings.inner);
        this.cssTransition      = this.settings.cssTransition;
        this.transitionSpeed    = this.settings.transitionSpeed;
        this.changeButtonHtml   = this.settings.changeButtonHtml;
        this.originalButtonHtml = this.button.html();
        this.toggledButtonHtml  = this.settings.toggledButtonHtml;
        this.exclusive          = this.settings.exclusive;
        this.isOpen             = false;
        this._innerHeight       = 0;
                
        // Initialize on construction
        this.init();
    }

    // Extend the Plugin prototype with custom methods
    $.extend(Plugin.prototype, {
        
        // Helper :: update _innerHeight
        _updateInnerHeight: function() {
            this._innerHeight = this.inner.outerHeight(true);
        },
        
        // Helper :: resize an open accordion
        _resizeToOpen: function() {
            // set/update innerHeight
            this._updateInnerHeight();

            this.outer.css({
                height: this._innerHeight
            });
        },
        
        // Helper :: resize a closed accordion
        _resizeToClosed: function () {
            // Set outer height to 0
            this.outer.css({
                height: '0px',
                'overflow-y': 'hidden'
            });
        },
        
        // Toggle accordion open/closed
        toggleMe: function () {        
            // Toggle isOpen variable and class
            this.isOpen = !this.isOpen;
            this.wrapper.toggleClass('bb-accordion--open');

            if (this.isOpen) {
                if (this.changeButtonHtml) {
                    this.button.html(this.toggledButtonHtml);
                }
                this._resizeToOpen();
            } else {
                if (this.changeButtonHtml) {
                    this.button.html(this.originalButtonHtml);
                }
                this._resizeToClosed();
            }
        },
        
        // Open accordion
        openMe: function() {
            this.isOpen = true;
            this.wrapper.addClass('bb-accordion--open');
            
            if (this.changeButtonHtml) {
                this.button.html(this.toggledButtonHtml);
            }
            this._resizeToOpen();
        },
        
        // Close accordion
        closeMe: function() {
            this.isOpen = false;
            this.wrapper.removeClass('bb-accordion--open');
            
            if (this.changeButtonHtml) {
                this.button.html(this.originalButtonHtml);
            }
            this._resizeToClosed();
        },
        
        // Initialization
        init: function() {
            var self = this;
            
            // Hide overflow
            this.outer.css({
                'overflow-y': 'hidden'
            });
            
            // Set `isOpen` based on whether class was specified
            if (this.wrapper.hasClass('bb-accordion--open')) {
                this.isOpen = true;
                this._resizeToOpen();
            } else {
                this.isOpen = false;
                this._resizeToClosed();
            }
            
            // Use built-in CSS transition if none is specified
            if (!this.cssTransition) {
                var speed = this.transitionSpeed;
                this.outer.css({
                    '-webkit-transition': 'all ' + speed + 'ms ease-out 0s',
                    '-moz-transition': 'all ' + speed + 'ms ease-out 0s',
                    'transition': 'all ' + speed + 'ms ease-out 0s'
                });
            }
            
            // Event listeners
            this.button.click(function() {
                // If exclusive is true, first close all accordions of same type
                if(self.exclusive && !self.isOpen) {
                    $(self.originalSelector).bbAccordion('closeMe');
                }
                
                self.toggleMe();
            });

            // Resize
            $(window).resize(function() {
                if (self.isOpen) {
                    self._resizeToOpen();
                }
            });
        }
    });


    /**
     * Plugin wrapper around the constructor
     * Discerns between invoking a method or the constructor
     */
    
    $.fn[pluginName] = function(methodOrOptions) {        
        var originalSelector = this.selector;
        
        // Check if plugin has initialized
        if ( $(this).data(pluginName) && typeof methodOrOptions !== 'object' && methodOrOptions !== undefined ) {
            // Check a method was passed that exists among plugin methods
            if ( $(this).data(pluginName)[methodOrOptions] ) {
                // Execute the requested method on each element
                return this.each(function() {
                     $(this).data(pluginName)[methodOrOptions]();
                });
            } else {
                console.warn('bbAccordion: you\'re trying to invoke a method that does not exist.');
            }    
        }
        // Otherwise, initialize the plugin
        else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, originalSelector, methodOrOptions));
                }
            });
        } 
    };

})(jQuery, window, document);