class InlineCart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var items = [];
    for(var i = 0; i < this.props.items.length; i++)
    {
      items.push(<CartItem item={this.props.items[i]}/>);
    }
    return <div>{items}</div>;
  }
}

class CartItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>{this.props.item.title}</div>
      );
  }
}

var Cart = {
  initialize: function() {

    ReactDOM.render(
      <InlineCart items={CartJS.cart.items} />,
      document.getElementById('inline-cart')
    );
  }
}

module.exports = Cart;