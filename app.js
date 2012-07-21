var application_root = __dirname,
  express   = require('express'),
  passport  = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  mongoose  = require('mongoose'),
  mustache  = require('mustache'),
  path      = require('path'),
  models    = require('./models')(mongoose);

var port = 3000;



passport.use(new LocalStrategy(
  function(email, password, done) {
    User.findOne({ email: email, password: password }, function (err, user) {
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
  app.use(app.router);
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'watman' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('views', path.join(application_root, "views"));
  // app.set('view engine', 'jade')
});

app.get('/', function(req, res) {
  models.User.find(function(err, users) {
    return res.send(users);
  });
});

console.log("Listening on port " + port);
app.listen(port);
