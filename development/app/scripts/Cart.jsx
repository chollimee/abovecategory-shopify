class InlineCart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var items = [];

    for(var i = 0; i < this.props.items.length; i++)
    {
      items.push(<CartItem item={this.props.items[i]} key={i}/>);
    }

    return (
      <div>
        <div className="items">{items}</div>
        <div className="subtotal">
          <p>SUBTOTAL WITH FREE SHIPPING: <span className="total-price">${CartJS.cart.total_price / 100}</span></p>
          <a href="/cart" className="btn btn-danger">VIEW CART</a>
        </div>
      </div>
    );
  }
}

class CartItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var options = []

    /*
    if(this.props.item.variant_options){
      for(var i = 0; i < this.props.item.variant_options.length; i++)
      {
        options.push(<div className="item-option" key={i}><span>{this.props.item.product_options[i]}:</span> {this.props.item.variant_options[i]}</div>);
      }
    }
    */

    return (
      <div className="item">
        <div className="row">
          <div className="col-sm-3">
            <div className="col-expand-right"><img src={this.props.item.image}/></div>
          </div>
          <div className="col-sm-6">
            <div className="item-title">{this.props.item.product_title}</div>
            <div className="item-qty item-option"><span>QTY:</span> {this.props.item.quantity}</div>
            <div className="item-option">{this.props.item.variant_title}</div>
          </div>

          <div className="col-sm-3">
            <div className="col-expand-left">${this.props.item.line_price / 100}</div>
          </div>
        </div>
      </div>
    );
  }
}

var Cart = {
  update: function(items){
    this.update_cart_badge(items);
    ReactDOM.render(
      <InlineCart items={items} />,
      document.getElementById('inline-cart')
    );
  },

  update_cart_badge: function(items)
  {
    jQuery('#cart-links a.cart span').html(items.length);
  },

  initialize: function() { 
    jQuery('#cart-links a.cart').bind('click', function(e){
      e.preventDefault();
      Cart.update(CartJS.cart.items);
      jQuery('#inline-cart').toggle();
      return false;
    });

    jQuery(document).on('cart.requestComplete', function(event, cart){
      Cart.update(CartJS.cart.items);
    });

    jQuery(document).bind("click", function(e){
      var container = jQuery("#inline-cart");
      if(!container.is(e.target) && container.has(e.target).length === 0)
      {
        jQuery('#inline-cart').hide();
      }
    });

    Cart.update(CartJS.cart.items);
  }
}

module.exports = Cart;