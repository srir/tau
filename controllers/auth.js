module.exports = function(app) {
  var passport  = require('passport'),
      models    = require('../models'),
    authUtil    = require('../authUtil'),
    sha1          = require('sha1');

  app.get('/login', function(req, res){
    var data = {
      title: "Tau login",
      message: req.flash('error')
    };
    res.render('login', data);
  });

  app.post('/login',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: "Invalid Credentials"
    }),
    function (req, res) {
      res.redirect('/account');
  });

  app.get('/logout', function(req, res){
    var data = { title: "Tau logout" };
    req.logout();
    res.render('logout', data);
  });

  app.get('/account', authUtil.ensureAuthenticated, function(req, res) {
    var data = {
      title: "Tau account",
      user: req.user
    };
    res.render('account', data);
  });


    app.get('/signup/:hash?', function(req, res) {
        var data = { title: "Tau student signup",
                     message: req.flash('error')
                   };
        if(req.params.hash) {
            data.hash = hash;
        }
        res.render('signup', data);
    });

    app.post('/signup', function(req, res) {
        var data = { title: "Tau student signup"
                   },
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
        res.render('signup', data)
    });

};
