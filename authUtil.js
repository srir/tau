var passport    = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  models        = require('./models');
  _             = require('lodash');
passport.use(new LocalStrategy(
  function(email, password, done) {
    models.User.findOne({ email: email, password: password }, function (err, user) {
      done(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function (err, user) {
    done(err, user);
  });
});

//login decorators
exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/auth/login');
};

exports.isStaff = function (user, course) {
    return  _.filter(course.staff,
                     function(e) {
                         return e.toString() === user._id.toString();
                     }).length > 0;
};

exports.isStudent = function (user, course) {
    return  _.filter(course.students,
                     function(e) {
                         return e.toString() === user._id.toString();
                     }).length > 0;
};

exports.isAuthor = function (user, assn) {
    return (user._id.toString() === assn.user.toString());
};
