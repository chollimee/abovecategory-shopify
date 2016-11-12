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