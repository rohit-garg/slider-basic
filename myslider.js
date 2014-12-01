/* Description: Basic Light weight slider 
 * Author: Rohit Garg   */

(function ($, window) {
    var mySlider = function (ele, opt) {

        this.settings = $.extend({
            cyclic: false,
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
        var init = function () {
            element.wrap('<div class="slider-wrapper" />');
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
        };

        this.next = function () {
            if ($this.settings.cyclic) {
                current = (current + 1) % len;
            }
            else {
                current = (current + 1) > (len - 1) ? current : (current + 1)
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
            this.current = num;
            current = parseInt(num);
            element.stop('', true, true).animate({'margin-left': '-' + current * viewPortWidth})
            paginationEle.children().removeClass('active').eq(current).addClass('active');
        };

        this.setCSS = function () {
            viewPortWidth = $(window).width();
            parent.css({'width': viewPortWidth, 'overflow': 'hidden'});
            element.addClass('mySlider').css({'width': function () {
                    return  viewPortWidth * len
                }});
            element.children().css({'width': viewPortWidth, 'float': 'left'});
        };

        this.createPagination = function () {
            var $ul = $('<ul class="pagination"/>');
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
            var $cont = $('<div class="navigation"/>');
            var $prev = $('<a class="prev" href="#">Prev</a>').click(function (e) {
                e.preventDefault();
                $this.prev();
            });
            var $next = $('<a class="prev" href="#">Next</a>').click(function (e) {
                e.preventDefault();
                $this.next();
            });
            $cont.append($prev, $next);
            parent.append($cont);
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



