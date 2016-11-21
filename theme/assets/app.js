(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("scripts/App.js", function(exports, require, module) {
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
            App.resize();
        });

        $(document).ready(function() {
            App.add_viewport_class();
            App.resize();
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

        $("a.scroll-to").click(function(){
            target = $($(this).attr("href"));
            $("#page").animate({ scrollTop: $(target).offset().top }, "slow");
            return true;
        });
    },

    resize: function(){

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

});

require.register("scripts/Cart.jsx", function(exports, require, module) {
class InlineCart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var items = [];

    for (var i = 0; i < this.props.items.length; i++) {
      items.push(React.createElement(CartItem, { item: this.props.items[i], key: i }));
    }

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "items" },
        items
      ),
      React.createElement(
        "div",
        { className: "subtotal" },
        React.createElement(
          "p",
          null,
          "SUBTOTAL WITH FREE SHIPPING: ",
          React.createElement(
            "span",
            { className: "total-price" },
            "$",
            CartJS.cart.total_price / 100
          )
        ),
        React.createElement(
          "a",
          { href: "/cart", className: "btn btn-danger" },
          "VIEW CART"
        )
      )
    );
  }
}

class CartItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var options = [];

    /*
    if(this.props.item.variant_options){
      for(var i = 0; i < this.props.item.variant_options.length; i++)
      {
        options.push(<div className="item-option" key={i}><span>{this.props.item.product_options[i]}:</span> {this.props.item.variant_options[i]}</div>);
      }
    }
    */

    return React.createElement(
      "div",
      { className: "item" },
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-sm-3" },
          React.createElement(
            "div",
            { className: "col-expand-right" },
            React.createElement("img", { src: this.props.item.image })
          )
        ),
        React.createElement(
          "div",
          { className: "col-sm-6" },
          React.createElement(
            "div",
            { className: "item-title" },
            this.props.item.product_title
          ),
          React.createElement(
            "div",
            { className: "item-qty item-option" },
            React.createElement(
              "span",
              null,
              "QTY:"
            ),
            " ",
            this.props.item.quantity
          ),
          React.createElement(
            "div",
            { className: "item-option" },
            this.props.item.variant_title
          )
        ),
        React.createElement(
          "div",
          { className: "col-sm-3" },
          React.createElement(
            "div",
            { className: "col-expand-left" },
            "$",
            this.props.item.line_price / 100
          )
        )
      )
    );
  }
}

var Cart = {
  update: function (items) {
    ReactDOM.render(React.createElement(InlineCart, { items: items }), document.getElementById('inline-cart'));
  },

  initialize: function () {

    jQuery('#cart-links a.cart').bind('click', function (e) {
      e.preventDefault();
      jQuery('#inline-cart').toggle();
      return false;
    });

    jQuery(document).on('cart.requestComplete', function (event, cart) {
      Cart.update(CartJS.cart.items);
    });

    jQuery(document).bind("click", function (e) {
      var container = jQuery("#inline-cart");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        jQuery('#inline-cart').hide();
      }
    });

    Cart.update(CartJS.cart.items);
  }
};

module.exports = Cart;
});

require.register("scripts/Contact.js", function(exports, require, module) {
var App = require("scripts/App.js");

exports.map_styles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

exports.ZoomControl = function(controlDiv, map) {
  
  // Creating divs & styles for custom zoom control
  controlDiv.style.padding = '5px';
  controlDiv.style.margin = '5vh 5vw 0 0';

  // Set CSS for the control wrapper
  var controlWrapper = document.createElement('div');
  controlWrapper.style.cursor = 'pointer';
  controlWrapper.style.textAlign = 'center';
  controlWrapper.style.width = '40px'; 
  controlWrapper.style.height = '80px';
  controlDiv.appendChild(controlWrapper);
  
  // Set CSS for the zoomIn
  var zoomInButton = document.createElement('div');
  zoomInButton.style.width = '40px'; 
  zoomInButton.style.height = '40px';
  zoomInButton.style.margin = '0 0 2rem 0';
  /* Change this to be the .png image you want to use */
  zoomInButton.style.backgroundImage = 'url("' + App.HTML_PATH + '/images/zoom-in.png")';
  controlWrapper.appendChild(zoomInButton);
    
  // Set CSS for the zoomOut
  var zoomOutButton = document.createElement('div');
  zoomOutButton.style.width = '40px'; 
  zoomOutButton.style.height = '40px';
  /* Change this to be the .png image you want to use */
  zoomOutButton.style.backgroundImage = 'url("' + App.HTML_PATH + '/images/zoom-out.png")';
  controlWrapper.appendChild(zoomOutButton);

  // Setup the click event listener - zoomIn
  google.maps.event.addDomListener(zoomInButton, 'click', function() {
    map.setZoom(map.getZoom() + 1);
  });
    
  // Setup the click event listener - zoomOut
  google.maps.event.addDomListener(zoomOutButton, 'click', function() {
    map.setZoom(map.getZoom() - 1);
  });
}
});

;require.register("scripts/Filter.js", function(exports, require, module) {
var Filter = {

  filters: [],

  url: "",

  orderby: "",

  ordr: "",

  add_filter: function(filter)
  {
    this.filters.push(filter);
    this.filters = _.uniq(this.filters);
    this.filters = _.without(this.filters, "");
  },

  remove_filter: function(filter)
  {
    this.filters = _.without(this.filters, filter);
  },

  add_filter_and_redirect : function(filter){
    this.add_filter(filter);
    window.location.href = this.filter_uri();
  },

  remove_filter_and_redirect : function(filter){
    this.remove_filter(filter);
    window.location.href = this.filter_uri();
  },

  sort_and_redirect : function(orderby, order)
  {
    this.orderby = orderby;
    this.order = order;
    window.location.href = this.filter_uri(); 
  },

  filter_uri: function()
  {
    var gallery_uri = URI(this.url);
    gallery_uri.removeSearch("terms");

    if(this.filters.length > 0)
    {
      gallery_uri.addSearch("terms", this.filters.join(","));
    }
    
    if(this.orderby!="")
    {
      gallery_uri.addSearch("orderby", this.orderby);
    }

    if(this.order!="")
    {
      gallery_uri.addSearch("order", this.order);
    }

    return gallery_uri.toString();
  },

  initialize : function(url, options){

    this.url = url;
    filters_by_comma = options["filter"];
    this.filters = filters_by_comma.split(',');
    this.orderby = options["orderby"];
    this.order = options["order"];
  }
}

module.exports = Filter;
});

require.register("scripts/Menu.js", function(exports, require, module) {
var App = require("scripts/App.js");

var Menu = {
  init_sidebar: function(){
    this.slidebar = new slidebars();
    this.slidebar.init();

    $( '#toggle-menu-button' ).on( 'click', function ( event ) {
      event.stopPropagation();
      event.preventDefault();
      Menu.slidebar.toggle( 'left-sidebar' );
    } );

    $(window).resize(
      App.viewport.changed(function() {
          if(App.viewport.is('>md')) {
            Menu.close();
          }
      })
    );
  },

  init_collapse: function(){
    $("#main-menu").metisMenu();
    $("#main-menu .menu-item-has-children > a").append("<span class='fa'></span>")
  },

  open : function(){
    this.slidebar.open( 'left-sidebar' );
  },

  close : function(){
    this.slidebar.close( 'left-sidebar' );
  },

  toggle : function(){
    this.slidebar.toggle('left-sidebar')
  },

  initialize : function(){
    this.init_sidebar();
    this.init_collapse();
  }
}

module.exports = Menu;
});

require.register("scripts/ProductReview.jsx", function(exports, require, module) {
class Review extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var ac_items = [];
    var media_items = [];

    for (var i = 0; i < this.props.data.ac.length; i++) {
      ac_items.push(React.createElement(ReviewItem, { item: this.props.data.ac[i], key: i }));
    }

    for (var i = 0; i < this.props.data.media.length; i++) {
      media_items.push(React.createElement(ReviewItem, { item: this.props.data.media[i], key: i }));
    }

    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-md-6" },
        React.createElement(
          "div",
          { className: "items ac col-expand-right" },
          React.createElement(
            "h1",
            null,
            "OUR TAKE"
          ),
          ac_items,
          React.createElement(
            "div",
            { className: "text-sm-right view-all" },
            React.createElement(
              "a",
              { href: "#" },
              "View all articles by AC ",
              React.createElement("i", { className: "fa fa-angle-right" })
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "col-md-6" },
        React.createElement(
          "div",
          { className: "items media col-expand-left" },
          React.createElement(
            "h1",
            null,
            "MEDIA REVIEWS"
          ),
          media_items,
          React.createElement(
            "div",
            { className: "text-sm-right view-all" },
            React.createElement(
              "a",
              { href: "#" },
              "View all articles by Media ",
              React.createElement("i", { className: "fa fa-angle-right" })
            )
          )
        )
      )
    );
  }
}

class ReviewItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var options = [];

    return React.createElement(
      "div",
      { className: "item" },
      React.createElement(
        "h2",
        null,
        this.props.item.post_title
      ),
      React.createElement(
        "p",
        null,
        this.props.item.post_excerpt
      ),
      React.createElement(
        "p",
        { className: "text-sm-right" },
        React.createElement(
          "a",
          { href: "{this.props.item.post_link}", className: "btn btn-primary btn-acc" },
          "READ MORE ",
          React.createElement("i", { className: "fa fa-angle-right" })
        )
      )
    );
  }
}

var ProductReview = {
  initialize: function (product_id) {
    var url = "http://23.253.254.9/wp-json/ac/v1/products/" + product_id + "/reviews";
    url = "https://cdn.shopify.com/s/files/1/1234/3118/t/2/assets/reviews.json?" + Date.now();

    jQuery.getJSON({
      url: url
    }).done(function (data) {

      ReactDOM.render(React.createElement(Review, { data: data }), document.getElementById('product-reviews'));
    });
  }
};

module.exports = ProductReview;
});

require.register("scripts/ProductShow.js", function(exports, require, module) {
var App = require("scripts/App.js");

var ProductShow = {
  initialize : function(){

    $('.product-show').on('click', function(){
      $('.product-show .product').hide();
    });

    $('.product').on('click', function(e){
      e.stopPropagation();
    });

    $('a.product-marker').on('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      $($(this).attr('href')).toggle();
    });
  }
}

module.exports = ProductShow;
});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map