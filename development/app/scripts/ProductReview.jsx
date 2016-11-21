class Review extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var ac_items = [];
    var media_items = [];


    for(var i = 0; i < this.props.data.ac.length; i++)
    {
      ac_items.push(<ReviewItem item={this.props.data.ac[i]} key={i}/>);
    }

    for(var i = 0; i < this.props.data.media.length; i++)
    {
      media_items.push(<ReviewItem item={this.props.data.media[i]} key={i}/>);
    }

    return (
      <div className="row">
        <div className="col-md-6">
          <div className="items ac col-expand-right">
            <h1>OUR TAKE</h1>
            {ac_items}
            <div className="text-sm-right view-all"><a href="#">View all articles by AC <i className="fa fa-angle-right"></i></a></div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="items media col-expand-left">
            <h1>MEDIA REVIEWS</h1>
            {media_items}
            <div className="text-sm-right view-all"><a href="#">View all articles by Media <i className="fa fa-angle-right"></i></a></div>
          </div>
        </div>
      </div>
    );
  }
}

class ReviewItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var options = []

    return (
      <div className="item">
        <h2>{this.props.item.post_title}</h2>
        <p>{this.props.item.post_excerpt}</p>
        <p className="text-sm-right">
          <a href="{this.props.item.post_link}" className="btn btn-primary btn-acc">READ MORE <i className="fa fa-angle-right"></i></a>
        </p>
      </div>
    );
  }
}

var ProductReview = {
  initialize: function(product_id) {
    var url = "http://23.253.254.9/wp-json/ac/v1/products/" + product_id + "/reviews";
    url = "https://cdn.shopify.com/s/files/1/1234/3118/t/2/assets/reviews.json?" + Date.now();

    jQuery.getJSON({
      url: url,
    }).done(function(data){

      ReactDOM.render(
        <Review data={data} />,
        document.getElementById('product-reviews')
      );
    });
  }
}

module.exports = ProductReview;