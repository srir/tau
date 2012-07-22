module.exports = function(app) {
  var models = require('../models'),
    auth    = require('../authUtil'),
    _       = require('lodash'),
    errors  = require('express-errors'),
    mw      = require('../middleware');

  app.get('/:courseid/:assnid', mw.is_staff, function(req, res, next) {
      if(!req.isAuthenticated()) {res.redirect('/auth/login')}
    else {
    var courseid = req.params.courseid,
      assnid = req.params.assnid;
    models.Course.findOne({ slug: courseid }, function (err, course) {
      if (err) return next(new Error("Internal Server Error"));
      if (course === null) return next(errors.NotFound);
      models.Assignment
      .findOne({ slug: assnid })
      .populate('files')
      .exec(function (err, assn) {
      if (err) return next(new Error("Internal Server Error"));
      if (assn === null) return next(errors.NotFound);
      if(!(auth.isAuthor(req.user, assn) || auth.isStaff(req.user, course))) {
            console.log("No permissions!");
            res.redirect('/auth/no_permissions');
      }
       res.render('browse/assignment', {
          course:   { name: course.name, slug: course.slug },
          assn:     { name: assn.name, slug: assn.slug },
          files:    _(assn.files).map(function (file) {
            return { name: file.name, slug: file.slug };
          })
        });
      });
    })
}  });

  app.get('/:courseid', mw.is_staff, function(req, res, next) {
    if(!req.isAuthenticated()) {res.redirect('/auth/login')}
    else {
    var courseid = req.params.courseid;
    models.Course.findOne({ slug: courseid }, function(err, course) {
      if (err) return next(new Error("Internal Server Error"));
      if (course === null) return next(errors.NotFound);
      models.Assignment
      .where('slug').in(course.assignments)
      .exec(function (err, assns) {
        if (err) return next(new Error("Internal Server Error"));
        if (assns === null) return next(errors.NotFound);
        if(!(auth.isStudent(req.user, course) || auth.isStaff(req.user, course))) {
            console.log("No permissions!");
            res.redirect('/auth/no_permissions');
        }

        res.render('browse/course', {
          course:   { name: course.name, slug: course.slug },
          assns: _(assns).map(function (assn) {
            return { name: assn.name, slug: assn.slug };
          })
        });
      });
    });
   } });
};
