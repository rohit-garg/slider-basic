/* Description: Basic Light weight slider 
 * Author: Rohit Garg   */

(function ($, window) {
    var mySlider = function (ele, opt) {

        this.settings = $.extend({
            cyclic: false,
            auto: false,
            default: 4000,
            slideInterval: 300,
            css: {sWrapper: 'slider-wrapper', active: 'active', main: 'mySlider', pagination: 'pagination', navigation: 'navigation', 'prev': 'prev', next: 'next'},
            jQMSwipeEnabled: false
        }, opt);

        var $this = this;
        var element = $(ele);
        var children = element.children();
        var len = children.length;
        var current = 0;
        var parent;
        var paginationEle;
        var viewPortWidth = $(window).width();
        var timer;
        var callbackArr = {afterInit: [], slideChange: []};
        var init = function () {
            element.wrap('<div class="' + $this.settings.css.sWrapper + '" />');
            parent = element.parent();
            $this.setCSS();
            $this.createNavigation();
            $this.createPagination();
            $this.show(current);
            if ($this.settings.jQMSwipeEnabled) {
                element.on("swipeleft", function () {
                    $this.next();
                });
                element.on("swiperight", function () {
                    $this.prev();
                });
            }
            fireCallback('afterInit');
        };

        this.next = function () {
            if ($this.settings.cyclic) {
                current = (current + 1) % len;
            }
            else {
                current = (current + 1) > (len - 1) ? current : (current + 1);
            }
            this.show(current);
        };

        this.prev = function () {
            if ($this.settings.cyclic) {
                current = (current + len - 1) % len;
            }
            else {
                current = current > 0 ? (current - 1) : 0;
            }
            this.show(current);
        };

        this.show = function (num) {
            $this.startTimer();
            this.current = num;
            current = parseInt(num);
            element.stop('', true, true).animate({'margin-left': '-' + current * viewPortWidth}, $this.settings.slideInterval);
            paginationEle.children().removeClass($this.settings.css.active).eq(current).addClass($this.settings.css.active);
            fireCallback('slideChange');
        };

        this.startTimer = function () {
            clearInterval(timer);
            if ($this.settings.auto == true) {
                var interval = $this.settings.default + $this.settings.slideInterval;
                timer = setInterval(function () {
                    $this.next();
                }, interval);
            }
        };

        this.setCSS = function () {
            viewPortWidth = $(window).width();
            parent.css({'width': viewPortWidth, 'overflow': 'hidden'});
            element.addClass($this.settings.css.main).css({'width': function () {
                    return  viewPortWidth * len;
                }, overflow: 'hidden'});
            element.children().css({'width': viewPortWidth, 'float': 'left'});
        };

        this.createPagination = function () {
            var $ul = $('<ul class="' + $this.settings.css.pagination + '"/>');
            $.each(children, function (i) {
                var $a = $('<a data-slide="' + i + '" href="#">' + (i + 1) + '</a>').click(function (e) {
                    e.preventDefault();
                    $this.show($(this).data('slide'));
                });
                var $li = $('<li/>').append($a);
                $ul.append($li);
            });
            parent.append($ul);
            paginationEle = $ul;
        };

        this.createNavigation = function () {
            var $cont = $('<div class="' + $this.settings.css.navigation + '"/>');
            var $prev = $('<a class="' + $this.settings.css.prev + '" href="#">Prev</a>').click(function (e) {
                e.preventDefault();
                $this.prev();
            });
            var $next = $('<a class="' + $this.settings.css.next + '" href="#">Next</a>').click(function (e) {
                e.preventDefault();
                $this.next();
            });
            $cont.append($prev, $next);
            parent.append($cont);
        };

        this.on = function (type, cb) {
            if (callbackArr[type]) {
                callbackArr[type].push(cb);
            }
        };

        var fireCallback = function (key, arg) {
            if ((typeof callbackArr[key]) != "undefined") {
                for (var i = 0; i < callbackArr[key].length; i++) {
                    callbackArr[key][i].apply($this, arg);
                }
            }
        };

        $(window).resize(function ()
        {
            $this.setCSS();
            $this.show(current);
        });

        init();

    };

    $.fn.extend({
        mySlider: function (options)
        {
            return this.each(function ()
            {
                if (!$(this).data('mySlider'))
                {
                    var obj = new mySlider(this, options);
                    $(this).data('mySlider', obj);
                }
            });
        }
    });
})(jQuery, window);


