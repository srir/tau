var application_root  = __dirname,
express       = require('express'),
passport      = require('passport'),
LocalStrategy = require('passport-local').Strategy,
flash         = require('connect-flash'),
mongoose      = require('mongoose'),
cons          = require('consolidate'),
path          = require('path'),
errors        = require('express-errors');

var models      = require('./models'),
authUtil      = require('./authUtil'),
viewUtil      = require('./viewUtil'),
app = express.createServer();
mongoose.connect("mongodb://localhost/tau");

var models      = require('./models'),
  authUtil      = require('./authUtil'),
  viewUtil      = require('./viewUtil'),
  middleware    = require('./middleware');

app.configure(function(){
  // the bodyParser middleware parses JSON request bodies
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'watman' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.logger({ format: 'dev' }));
  app.use(flash());
  app.use(express.static(path.join(application_root, "public")));
  app.use(middleware.courses);
  app.use(middleware.is_staff);
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.engine('html', cons.handlebars);
  app.set('views', path.join(application_root, "views"));
  app.set('view engine', 'html');
  app.set('application_root', application_root);
});

require('./controllers/auth')(app);
require('./controllers/browse')(app);
require('./controllers/review')(app);
require('./controllers/api')(app);
require('./controllers/misc')(app);

errors.bind(app, { layout: false, logger: null });

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("App listening on port %d in %s mode", port, app.settings.env);
});
