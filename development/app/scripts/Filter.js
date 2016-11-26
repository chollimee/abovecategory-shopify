var Filter = {

  filters: [],

  url: "/collections",

  obj: null,

  collection_handle: '',

  current_tags: [],

  collection_tags: [],

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
    window.location.href = this.filter_uri(this.filters);
  },

  remove_filter_and_redirect : function(filter){
    this.remove_filter(filter);
    window.location.href = this.filter_uri(this.filters);
  },

  filter_uri: function(filters)
  {
    var collection_uri = URI(this.url);
    return collection_uri.toString() + "/" + this.collection_handle + "/" + filters.join("+");
  },

  other_tags: function()
  {
    return _.without(Filter.current_tags, Filter.collection_tags);
  },

  initialize : function(obj, options){

    this.obj = obj;
    this.current_tags = options["current_tags"];
    this.collection_handle = options["collection_handle"];

    $('a', obj).each(function(index, element){
      Filter.collection_tags.push($(element).attr("data-tag"));
    });

    $('a', obj).each(function(index, element){
      var tag = $(element).attr("data-tag");

      tags = _.uniq(Filter.other_tags().push(tag));
      var url = Filter.filter_uri(tags);
      $(element).attr("href", url);
      if(Filter.current_tags!=null && Filter.current_tags.indexOf(tag) >=0 )
      {
        $(element).parent("li").addClass("selected");
      }
    });
  }
}

module.exports = Filter;