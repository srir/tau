var _inComment = false;

function keywordReplace(frag) {
  return frag.replace(
    /\b(val|rec|ref|fn|fun|case|of|andalso|orelse|let|local|in|end|functor|structure|signature|sig|struct|if|else|datatype|type)\b/g,
    '<span class="kw">$1</span>'
  ).replace(
    /\b(SOME|NONE|EQUAL|LESS|GREATER|true|false)\b/g,
    '<span class="kv">$1</span>'
  );
}

function format(line) {
  var formatted = '';
  if (_inComment) {
    formatted = '<span class="cm">';
    var idx = line.indexOf('*)');
    if (idx !== -1) {
      formatted += line.slice(0, idx+2) + '</span>';
      _inComment = false;
      formatted += format(line.slice(idx+2, line.length));
    } else {
      formatted += line + '</span>'
    }
  } else {
    var idx = line.indexOf('(*');
    if (idx !== -1) {
      formatted += keywordReplace(line.slice(0, idx));
      _inComment = true;
      formatted += format(line.slice(idx, line.length));
    } else {
      formatted += keywordReplace(line);
    }
  }
  return formatted;
}

module.exports = function(app) {
  var fs = require('fs'),
    models  = require('../models'),
    auth    = require('../authUtil'),
    _       = require('lodash'),
    async   = require('async'),
    errors  = require('express-errors');
    mw      = require('../middleware');
  app.get('/:courseid/:assnid/:fileid', mw.is_staff, function(req, res, next) {
      if(!req.isAuthenticated()) { res.redirect('/auth/login'); }
      else {
          var courseid = req.params.courseid,
          assnid = req.params.assnid,
      fileid = req.params.fileid;
    models.Course.findOne({ slug: courseid }, function (err, course) {
      if (err) return next(new Error("Internal Server Error"));
      if (course === null) return next(errors.NotFound);
      models.Assignment
      .findOne({ slug: assnid })
      .populate('files')
      .exec(function (err, assn) {
        if (err) return next(new Error("Internal Server Error"));
        if (assn === null) return next(errors.NotFound);
        if (!(auth.isAuthor(req.user, assn) || auth.isStaff(req.user, course))) {
            console.log("not the right student.");
            res.render('auth/no_permissions');
        }
        var file = _.find(assn.files, function (file) {
          return (file.slug === fileid);
        });
        models.File
        .findById(file)
        .populate('comments')
        .exec(function(err, file) {
          if (err) return next(new Error("Internal Server Error"));
          fs.readFile(file.path, function (err, contents) {
            if (err) return next(new Error("Internal Server Error"));
            var idx = 1;
            var annotated = _(contents.toString().split("\n")).map(function (line) {
              var buf = "";
              var leader = "<dt>" + idx + "</dt>";
              while (line.length >= 80) {
                buf += format(line.slice(0, 80)) + "<br/>";
                line = line.slice(80, line.length);
              }
              buf += format(line);
              idx++;
              return leader + "<dd class=\"code\">" + buf + "</dd>";
            }).join("\n");
            async.map(file.comments, function(comment, cb) {
              models.Comment.findById(comment._id).populate('user')
              .exec(function(err, hydratedComment) {
                cb(null, {
                  authorName  : hydratedComment.user.name,
                  timestamp   : hydratedComment.timestamp,
                  comment     : hydratedComment.text,
                  lineRange   : {
                    from  : hydratedComment.startLine,
                    to    : hydratedComment.endLine
                  }
                });
              });
            }, function(err, hydratedComments) {
              res.render('review', {
                user:   req.user.toObject(),
                course: { name: course.name, slug: course.slug },
                assn:   { name: assn.name, slug: assn.slug },
                file:   {
                  id:       file._id,
                  name:     file.name,
                  slug:     file.slug,
                  contents: annotated,
                  comments: JSON.stringify(hydratedComments)
                }
              });
            });
          });
        });
      });
    });
} });
};
