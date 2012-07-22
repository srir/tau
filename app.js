var application_root = __dirname,
  express       = require('express'),
  passport      = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  flash         = require('connect-flash'),
  mongoose      = require('mongoose'),
  cons          = require('consolidate'),
  path          = require('path'),
  models        = require('./models'),
  authUtil      = require('./authUtil'),
  viewUtil      = require('./viewUtil');


// var drl = new models.User();
// drl.name = "Dr. Dan";
// drl.email = "drl@cs.cmu.edu";
// drl.password = "root";
// drl.save(function (err) { console.log(err); });

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

require('./controllers/auth')(app);
require('./controllers/review')(app);

app.listen(3000, function() {
  console.log("App listening on port %d in %s mode", 3000, app.settings.env);
});
