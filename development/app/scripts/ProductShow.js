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