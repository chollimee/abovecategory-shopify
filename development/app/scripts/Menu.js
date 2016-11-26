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