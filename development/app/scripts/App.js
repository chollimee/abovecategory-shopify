var App = {
    HTML_PATH: "/wp-content/themes/abovecategorycycling/html",
    GALLERY_URI: "/gallery",
    viewport: ResponsiveBootstrapToolkit,
    initialize_viewport: function() {
        var visibilityDivs = {
            'xs': $('<div class="hidden-sm-up"></div>'),
            'sm': $('<div class="hidden-md-up hidden-xs-down"></div>'),
            'md': $('<div class="hidden-lg-up hidden-sm-down"></div>'),
            'lg': $('<div class="hidden-xl-up hidden-md-down"></div>'),
            'xl': $('<div class="hidden-lg-down"></div>')
        };

        this.viewport.use('bootstrap4', visibilityDivs);

        $(window).resize(function() {
            App.add_viewport_class();
        });

        $(document).ready(function() {
            App.add_viewport_class();
        });
    },

    initialize_elements: function() {
        $("a[href='#top']").click(function() {
            $("#page").animate({ scrollTop: 0 }, "slow");
            return false;
        });

        $("a[href='#bottom']").click(function() {
            target = $($(this).attr("href"));
            $("#page").animate({ scrollTop: $('#bottom').offset().top }, "slow");
            return true;
        });

    },

    add_viewport_class: function() {
        $('body').removeClass(function(index, css) {
            return (css.match(/(^|\s)viewport-\S+/g) || []).join(' ');
        });
        $('body').addClass("viewport-" + App.viewport.current());
    },

    initialize: function() {
        var Menu = require("scripts/Menu.js");
        var Cart = require("scripts/Cart.jsx");

        this.initialize_viewport();
        this.initialize_elements();
        Menu.initialize();

        Cart.initialize();
    }
}

module.exports = App;
