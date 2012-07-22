$(function() {

  var Comment = Backbone.Model.extend();

  var CommentSet = Backbone.Collection.extend({
    model: Comment
  });

  var comments = new CommentSet([
    new Comment({
      authorName: 'Vincent Siao',
      isInstructor: true,
      lineRange: {from: 9, to: 9},
      comment: 'over 80 columns again? you suck.'
    }),
    new Comment({
      authorName: 'Sri Raghavan',
      isInstructor: false,
      lineRange: {from: 1, to: 3},
      comment: 'herp derp'
    })
  ]);

  var CommentView = Backbone.View.extend({
    tagName: 'dd',
    className: 'comment',
    template: _.template($('#comment-template').html()),
    events: {
      'click .commentCollapse': 'commentCollapse',
      'mouseenter': 'highlightRange',
      'mouseleave': 'unhighlightRange',
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    commentCollapse: function(event) {
      // TODO(vsiao) collapse all comments at this line
      var comment = $(event.target).closest('dd.comment');
      comment.slideUp(200, function() {
        $(this).prev().addClass('hasCollapsedComment');
      });
      return false;
    },
    highlightRange: function() {
      var num_lines = this.model.attributes.lineRange.to -
                      this.model.attributes.lineRange.from;
      var lines = this.$el.prevAll('dd.code').slice(0, num_lines + 1);
      // FIXME(vsiao) maybe use another color
      lines.addClass('selected');
    },
    unhighlightRange: function() {
      var num_lines = this.model.attributes.lineRange.to -
                      this.model.attributes.lineRange.from;
      var lines = this.$el.prevAll('dd.code').slice(0, num_lines + 1);
      lines.removeClass('selected');
    }
  });

  function getLineNumber(line) {
    return parseInt(line.previousElementSibling.innerText);
  }

  var Review = Backbone.View.extend({
    el: $('#code'),
    codeLines: $('dd.code').get(),
    selectedLines: [],
    startLine: null,
    commenting: false,
    events: {
      'mousedown dd.code' : 'onMouseDown',
      'mouseover dd.code' : 'onMouseOver',
      'click .commentExpand'  : 'commentExpand',
      'click .addComment .cancel' : 'cancelComment',
      'click .addComment .submit' : 'submitComment'
    },
    initialize: function() {
      $(document).mouseup(_.bind(this.onMouseUp, this));
      this.render();
    },
    render: function() {
      this.addAll();
    },
    addComment: function(comment) {

    },
    addAll: function() {
      comments.each(_.bind(function(comment) {
        var view = new CommentView({model: comment});
        var idx = comment.attributes.lineRange.to - 1;
        var line = this.codeLines[idx];
        var button = _.template($('#expand-comment-button').html())();
        line.innerHTML += button;
        $(view.render().el).insertAfter(line);
      }, this));
    },
    commentExpand: function(event) {
      var line = $(event.target).closest('dd.code');
      line.removeClass('hasCollapsedComment');
      line.next().slideDown(200);
      return false;
    },
    setSelection: function(startLine, endLine) {
      $(this.selectedLines).removeClass('selected');
      if (startLine === endLine) {
        this.selectedLines = [startLine];
      } else {
        if (getLineNumber(endLine) < getLineNumber(startLine)) {
          var temp = startLine;
          startLine = endLine;
          endLine = temp;
        }
        var in_between =
          $(startLine).nextUntil(endLine, 'dd.code').get();
        this.selectedLines = [startLine].concat(in_between);
        this.selectedLines.push(endLine);
      }
      $(this.selectedLines).addClass('selected');
    },
    onMouseDown: function(event) {
      if (this.commenting || $(event.target).hasClass('commentExpand')) {
        return;
      }
      this.startLine = event.target;
      this.setSelection(this.startLine, this.startLine);
      // Disables text highlighting
      return false;
    },
    onMouseOver: function(event) {
      if (this.commenting) return;
      var end_line = $(event.target).closest('dd.code').get(0);
      if (this.startLine && end_line) {
        this.setSelection(this.startLine, end_line);
      }
    },
    onMouseUp: function(event) {
      if (this.commenting) return;
      // on_target defines the valid click release target to trigger
      // a comment (either on a line of code, or on a previous comment)
      var on_target =
        $(event.target).closest('dd.code, dd.comment').get(0);
      if (this.startLine && on_target) {
        //beginCommenting(selectedLines);
        console.log(this.selectedLines.map(getLineNumber));
      } else {
        //form.slideUp(200).remove();
        $(this.selectedLines).removeClass('selected');
        this.selectedLines = [];
      }
      this.startLine = null;
    },
    cancelComment: function() {

    },
    submitComment: function() {

    }
  });

  // BOOM render
  var code = new Review;
});
