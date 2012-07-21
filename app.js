var application_root = __dirname,
  express   = require('express'),
  passport  = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  mongoose  = require('mongoose'),
  cons      = require('consolidate'),
  path      = require('path'),
  models    = require('./models')(mongoose);

var port = 3000;

// var drl = new models.User();
// drl.username = "Dr. Dan";
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
  User.findById(id, function (err, user) {
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
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.engine('html', cons.handlebars);
  app.set('views', path.join(application_root, "views"));
  app.set('view engine', 'html');
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/login', function(req, res){
  res.send("DUDE log in");
//  res.render('login', { user: req.user, message: req.flash('error') });
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login'}),
  function (req, res) {
    res.send("authenticated");
});


app.get('/account', ensureAuthenticated, function(req, res) {
  res.send("GAMEify.");
});


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//login decorators
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.listen(port, function() {
  console.log("App listening on port %d in %s mode", 3000, app.settings.env);
});
