class CartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
  }

  render() {
    return <div>Cart</div>;
  }
}

var Cart = {
  initialize: function() {
    ReactDOM.render(
      <CartComponent items={CartJS.items} />,
      document.getElementById('inline-cart')
    );
  }
}

module.exports = Cart;