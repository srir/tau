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
    errors  = require('express-errors');
  app.get('/:courseid/:assnid/:fileid', function(req, res, next) {
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
          console.log(course.staff);
          console.log(req.user._id);
          console.log(assn.user);
          if (!((req.user._id === assn.user) ||
                _.filter(course.staff, function(e) {return e.toString() === req.user._id.toString();}).length === 1)) {
            console.log("not the right student.");
            //res.send("no permissions!");
            res.render('auth/no_permissions');
        }
        var file = _.find(assn.files, function (file) {
          return (file.slug === fileid);
        });
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
          res.render('review', {
            course: { name: course.name, slug: course.slug },
            assn:   { name: assn.name, slug: assn.slug },
            file:   {
              id:       file._id,
              name:     file.name,
              slug:     file.slug,
              contents: annotated
            }
          });
        });
      });
    });
 } });
};
