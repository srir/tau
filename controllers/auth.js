module.exports = function(app) {
  var passport  = require('passport'),
      models    = require('../models'),
    authUtil    = require('../authUtil'),
    sha1          = require('sha1');

  app.get('/auth/login', function(req, res){
    var data = {
      title: "Tau login",
      message: req.flash('error')
    };
    res.render('auth/login', data);
  });

  app.post('/auth/login',
    passport.authenticate('local', {
      failureRedirect: '/auth/login',
      failureFlash: "Invalid Credentials"
    }),
    function (req, res) {
      res.redirect('/account');
  });

  app.get('/auth/logout', function(req, res){
      var data = { title: "Tau logout" };
      req.flash('error' "You've logouted out,  Goodbye!'")
      req.logout();
      res.redirect('/auth/login');
  });

  app.get('/auth/no_permissions', function(req, res){
      res.render('auth/no_permissions');
  });

  app.get('/account', authUtil.ensureAuthenticated, function(req, res) {
    var data = {
      title: "Tau account",
      user: req.user
    };
    res.render('account', data);
  });


    app.get('/auth/signup/:hash?', function(req, res) {
      var data = {
        title: "Tau student signup",
        message: req.flash('error')
      };
      if(req.params.hash) {
          data.hash = hash;
      }
      res.render('auth/signup', data);
    });

    app.post('/auth/signup', function(req, res) {
      var data = { title: "Tau student signup" },
          newUser;
      if((req.body.email && req.body.course && req.body.hash &&
         sha1(req.body.email+req.body.course)) === req.body.hash) {
        newUser = new models.User();
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.save(function (err) {console.log(err);});
        data.message = "You have been registered!";
      } else {
        data.message = "email does not belong to a student for this course";
      }
      res.render('auth/signup', data)
    });

};
