var application_root = __dirname,
  express       = require('express'),
  passport      = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  flash         = require('connect-flash'),
  mongoose      = require('mongoose'),
  cons          = require('consolidate'),
  path          = require('path'),
  models        = require('./models'),
  sha1          = require('sha1');

require('./viewUtil');

// var drl = new models.User();
// drl.name = "Dr. Dan";
// drl.email = "drl@cs.cmu.edu";
// drl.password = "root";
// drl.save(function (err) { console.log(err); });

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

app = express.createServer();
mongoose.connect("mongodb://localhost/tau");

app.configure(function(){
  // the bodyParser middleware parses JSON request bodies
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'watman' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.engine('html', cons.handlebars);
  app.set('views', path.join(application_root, "views"));
  app.set('view engine', 'html');
});

app.get('/', function(req, res) {
  models.User.find(function(err, users) {
    res.render('index', {
      title: "TAU HERPDERP",
      users: users
    })
  });
});

app.get('/review', function(req, res) {
  res.render('review');
})

app.get('/login', function(req, res){
    var data = { title: "Tau login",
                 message: req.flash('error')
               };
  res.render('login', data);
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login',
                                                    failureFlash: "Invalid Credentials"}),
  function (req, res) {
    res.redirect('/account');
});

app.get('/logout', function(req, res){
  var data = { title: "Tau logout",
               };
  req.logout();
  res.render('logout', data);
});

app.get('/account', ensureAuthenticated, function(req, res) {
    var data = { title: "Tau account",
                 user: req.user,
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
    var data = { title: "Tau student signup",
                 message: req.flash('error')
               };
    if(req.body.email && req.body.course && req.body.hash
      sha1(req.body.email+req.body.course) === req.body.hash) {
        pass;
    }

});

//login decorators
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

app.listen(3000, function() {
  console.log("App listening on port %d in %s mode", 3000, app.settings.env);
});
