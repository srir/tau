var Comment = Backbone.Model.extend({
  initialize: function(comment) {
    this.authorName = comment.user;
    this.lineRange  = {
      from: comment.startLine,
      to:   comment.endLine
    };
    this.timestamp  = comment.timestamp;
    this.comment    = comment.text;
  }
});

var CommentSet = Backbone.Collection.extend({
  model: Comment
});

var Comments = new CommentSet;

$(function() {
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
      var comment = $(event.target).closest('dd.comment');
      comment.nextUntil('dt', 'dd.comment').slideUp(200);
      $(comment).slideUp(200, function() {
        $(this).prev().addClass('hasCollapsedComment');
      });
      return false;
    },
    highlightRange: function() {
      var num_lines = this.model.attributes.lineRange.to -
                      this.model.attributes.lineRange.from;
      var lines = this.$el.prevAll('dd.code').slice(0, num_lines + 1);
      // FIXME(vsiao) maybe use another color
      lines.addClass('highlight');
    },
    unhighlightRange: function() {
      var num_lines = this.model.attributes.lineRange.to -
                      this.model.attributes.lineRange.from;
      var lines = this.$el.prevAll('dd.code').slice(0, num_lines + 1);
      lines.removeClass('highlight');
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
    commentFormTemplate: _.template($('#add-comment-template').html()),
    commenting: false,
    events: {
      'mousedown dd.code' : 'onMouseDown',
      'mouseover dd.code' : 'onMouseOver',
      'click .commentExpand'  : 'commentExpand',
      'click .addComment .cancel' : 'cancelComment',
      'click .addComment .submit' : 'submitComment',
    },
    initialize: function() {
      $(document).mouseup(_.bind(this.onMouseUp, this));
      Comments.on('reset', this.render, this);
      this.render();
    },
    render: function() {
      console.log("LOLOL");
      this.addAll();
    },
    addComment: function(comment) {
      var view = new CommentView({model: comment});
      var idx = comment.attributes.lineRange.to - 1;
      var line = this.codeLines[idx];
      var elem = $(view.render().el);
      if ($(line.nextElementSibling).hasClass('comment')) {
        var line = $(line).nextUntil('dt').eq(-1).get(0);
      } else {
        elem.addClass('first');
        var button = _.template($('#expand-comment-button').html())();
        line.innerHTML += button;
      }
      elem.insertAfter(line);
    },
    addAll: function() {
      Comments.each(_.bind(this.addComment, this));
    },
    commentExpand: function(event) {
      var line = $(event.target).closest('dd.code');
      line.removeClass('hasCollapsedComment');
      line.nextUntil('dt').slideDown(200);
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
        this.beginComment(this.selectedLines);
      } else {
        //form.slideUp(200).remove();
        $(this.selectedLines).removeClass('selected');
        this.selectedLines = [];
      }
      this.startLine = null;
      return false;
    },
    beginComment: function(lines) {
      this.commenting = true;
      _.each(lines, function(line) {
        var next = $(line.nextElementSibling);
        if (next.hasClass('comment')) {
          next.find('.commentCollapse').click();
        }
      });
      var last_line = lines[lines.length-1];
      var old_comments = $(last_line).nextUntil('dt').get();
      var form = $(this.commentFormTemplate());
      if (old_comments.length) {
        form.insertAfter(old_comments[old_comments.length-1]).slideDown(200);
      } else {
        form.insertAfter(last_line).slideDown(200);;
      }
    },
    cancelComment: function(event) {
      $(event.target).closest('.addComment').slideUp(200, _.bind(function() {
        $(this.selectedLines).removeClass('selected');
        this.selectedLines = [];
        this.commenting = false;
        $(this).remove();
      }, this));
      return false;
    },
    submitComment: function() {
      
    }
  });

  // BOOM. DON'T FUCKING REMOVE ME
  var review = new Review;
});
