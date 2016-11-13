/* jshint -W117 */

/*!
 * BB Accordion 0.7.0 
 * https://github.com/bobbybol/accordion.js
 * @license MIT licensed
 *
 * Copyright (C) 2016 bobbybol.com - A project by Bobby Bol
 */

;(function ($) {
    "use strict";

    /**
     * Defining the Plugin
     */
    
    $.fn.bbAccordion = function(options) {
        
        /**
         * Setting the Defaults
         */

        var settings = {
            button: ".bb-accordion--button",
            outer: ".bb-accordion--outer",
            inner: ".bb-accordion--inner",
            cssTransition: false,
            transitionSpeed: 600,
            changeButtonHtml: false,
            toggledButtonHtml: "Close Details"
        };        
        // Settings extendable with options
        $.extend(settings, options);
        

        /**
         * Set up the accordion functionality for each DOM element
         * (No objects are needed, just a lambda with closures)
         */
        
        return this.each(function() {
            
            /**
             * Declare variables
             */  
            
            var wrapper             = $(this);
            var button              = wrapper.find(settings.button);
            var outer               = wrapper.find(settings.outer);
            var inner               = outer.find(settings.inner);
            var cssTransition       = settings.cssTransition;
            var transitionSpeed     = settings.transitionSpeed;
            var changeButtonHtml    = settings.changeButtonHtml;
            var originalButtonHtml  = button.html();
            var toggledButtonHtml   = settings.toggledButtonHtml;
            var isOpen;
            var __innerHeight;
            
            
            /**
             * Helper functions
             */ 
            
            // Set/update __innerHeight
            function updateInnerHeight() {
                __innerHeight = inner.outerHeight(true);
            }
            
            // Resize open accordions
            function resizeToOpen() {
                // set/update innerHeight
                updateInnerHeight();

                outer.css({
                    'height': __innerHeight
                });
            }
            
            // Resize closed accordions
            function resizeToClosed() {
                // Set outer height to 0
                outer.css({
                    'height': '0px',
                    'overflow-y': 'hidden'
                });
            }
            
            
            /**
             * Initialization
             */
            
            (function init() {
                // Hide overflow
                outer.css({
                    'overflow-y': 'hidden'
                });
                
                // Set `isOpen` based on whether class was specified
                if (wrapper.hasClass("bb-accordion--open")) {
                    isOpen = true;
                    resizeToOpen();
                } else {
                    isOpen = false;
                    resizeToClosed();
                }

                // Use built-in CSS transition if none is specified
                if (!cssTransition) {
                    var speed = transitionSpeed;
                    outer.css({
                        '-webkit-transition': 'all ' + speed + 'ms ease-out 0s',
                        '-moz-transition': 'all ' + speed + 'ms ease-out 0s',
                        'transition': 'all ' + speed + 'ms ease-out 0s'
                    });
                }
            })();
            
            
            /**
             * The actual toggle
             */
            
            function toggleMe() {        
                // toggle isOpen variable and class
                isOpen = !isOpen;
                wrapper.toggleClass("bb-accordion--open");

                if (isOpen) {
                    if (changeButtonHtml) {
                        button.html(toggledButtonHtml);
                    }
                    resizeToOpen();
                } else {
                    if (changeButtonHtml) {
                        button.html(originalButtonHtml);
                    }
                    resizeToClosed();
                }
            }
            
            
            /**
             * Event listeners
             */
            
            // Click
            button.click(function() {
                toggleMe();
            });

            // Resize
            $(window).resize(function() {
                if (isOpen) {
                    resizeToOpen();
                }
            });            
        });               
    };
}(jQuery));