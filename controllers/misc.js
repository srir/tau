module.exports = function(app) {
  var _      = require('lodash'),
    models = require('../models');

  app.get('/', function(req, res, next) {
    if (req.user) {
      var userid = req.user._id;
      models.Course
      .find({})
      .or([{staff: userid},
           {students: userid}])
      .exec(function(err, courses) {
        res.render('index', {
          courses: _(courses).map(function (course) {
            return {
              name: course.name,
              slug: course.slug,
              is_staff: _(course.staff).contains(userid)
            };
          })
        });
      });
    } else {
      data = {
        title: "Tau login"
      };
      res.render("auth/login", data);
    }
  });
};
