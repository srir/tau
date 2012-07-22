module.exports = function(app) {
  var passport  = require('passport'),
    authUtil    = require('../authUtil');


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
};
