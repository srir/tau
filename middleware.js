var models = require('./models'),
  _ = require('lodash');

exports.courses = function(req, res, next) {
  if (req.user) {
    models.Course
    .find({})
    .or([{staff: req.user._id},
        {students: req.user._id}])
    .exec(function (err, courses) {
      if (!err && courses != undefined) {
        res.locals.classes = courses;
      }
      next();
    });
  } else {
    next();
  }
}

exports.is_staff = function(req, res, next) {
  if (req.params && req.params.courseid && req.user) {
    var user = req.user;
    var courseid = req.params.courseid;
    models.Course.count({ slug: courseid, staff: user._id },
    function (err, count) {
      if (!err && count !== undefined) {
        if (count !== 0) {
          res.locals.is_staff = true;
        } else {
          res.locals.is_staff = false;
        }
      }
    })
  }
  next();
}
