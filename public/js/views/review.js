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
      'click .commentReply'   : 'commentReply',
      'mouseenter': 'highlightRange',
      'mouseleave': 'unhighlightRange'
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
    commentReply: function(event) {
      this.model.trigger('reply', this.model.attributes);
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
      'mousedown dd.code'   : 'onMouseDown',
      'mouseenter dd.code'  : 'onMouseEnter',
      'click .commentExpand': 'commentExpand',
      'click .addComment .cancel' : 'cancelComment',
      'click .addComment .submit' : 'submitComment'
    },
    initialize: function() {
      $(document).mouseup(_.bind(this.onMouseUp, this));
      Comments.on('reset', this.render, this);
      Comments.on('reply', this.commentReply, this);
      this.render();
    },
    render: function() {
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
    commentReply: function(commentData) {
      this.setSelection(this.codeLines[commentData.lineRange.from-1],
                        this.codeLines[commentData.lineRange.to-1]);
      this.beginComment(this.selectedLines, true);
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
      this.startLine = $(event.target).closest('dd.code').get(0);
      this.setSelection(this.startLine, this.startLine);
      // Disables text highlighting
      return false;
    },
    onMouseEnter: function(event) {
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
        this.beginComment(this.selectedLines, false);
      } else {
        //form.slideUp(200).remove();
        $(this.selectedLines).removeClass('selected');
        this.selectedLines = [];
      }
      this.startLine = null;
      return false;
    },
    beginComment: function(lines, isReply) {
      this.commenting = true;
      _.each(lines, function(line) {
        if (line === lines[lines.length-1] && isReply) {
          // Don't collapse final line on comment replies
          return;
        }
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
        $(event.target).closest('.addComment').remove();
      }, this));
      return false;
    },
    submitComment: function(event) {
      var userId = $("#code").data('user-id');
      var userName = $("#code").data('user-name');
      var fileId = $("#code").data('file-id');
      var startLine = getLineNumber(this.selectedLines[0]);
      var endLine = startLine + (this.selectedLines.length - 1);
      var text = $(event.target).closest('.addComment').find('textarea').val();
      var timestamp = new Date();
      var that = this;
      var comment = {
        authorName: userName,
        comment: text,
        timestamp: timestamp,
        lineRange: {
          from: startLine,
          to: endLine,
        }
      }

      $.ajax({
        type: 'POST',
        url:  '/api/file/' + fileId + '/comments',
        data: {
          timestamp:  timestamp,
          startLine:  startLine,
          endLine:    endLine,
          user:       userId,
          text:       text
        },
        success: function(data) {
          console.log("YAY!");
          that.addComment(new Comment(comment));
          that.cancelComment(event);
        }
      });
      event.preventDefault();
    }
  });

  // BOOM. DON'T FUCKING REMOVE ME
  var review = new Review;
});
