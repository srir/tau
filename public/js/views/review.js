

var Comment = Backbone.Model.extend({
  defaults: {
    authorName: 'Vincent Siao',
    isInstructor: true,
    lineRange: {from: 9, to: 9},
    comment: 'over 80 columns again? you suck.'
  }
  canEditBy: function(user) {
    //
  }
});

var CommentSet = Backbone.Collection.extend({
  model: Comment
});

var CommentView = Backbone.View.extend({

  tagName: 'dd',

  template: _.template($('#comment-template').html()),

  events: {
    'click .toggleShow' : 'toggleShow'
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  toggleShow: function() {

  }
});

var CodeView = Backbone.View.extend({
  el: $('#code'),
  
  events: {},

  initialize: function() {
    
  },
});

$(function() {
  var code = new CodeView;
});
