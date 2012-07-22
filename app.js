var application_root  = __dirname,
  express       = require('express'),
  passport      = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  flash         = require('connect-flash'),
  mongoose      = require('mongoose'),
  cons          = require('consolidate'),
  path          = require('path');

var models      = require('./models'),
  authUtil      = require('./authUtil'),
  viewUtil      = require('./viewUtil');

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


app.delete('/dev/delete', function(req, res) {
    models.User.remove({}, function(err) {
        console.log(err);
    });
    models.Assignment.remove({}, function(err) {
        console.log(err);
    });
    models.File.remove({}, function(err) {
        console.log(err);
    });
    models.Course.remove({}, function(err) {
        console.log(err);
    });
    models.Comment.remove({}, function(err) {
        console.log(err);
    });
    res.send("deleted");
});

app.post('/dev/populate', function(req, res) {
    var sri = new models.User(),
        iev = new models.User(),
        drl = new models.User(),
        rafee = new models.User(),
        assn09 = new models.Assignment(),
        c15150 = new models.Course(),
        fundict = new models.File(),
        serializable = new models.File(),
        ordered = new models.File();
        comment = new models.Comment();
    sri.name = "Sri";
    sri.password = "srivacuums";
    sri.email = "srikrish@andrew.cmu.edu";
    sri.save(function(e) { if(e) {console.log(err);}});
    rafee.name = "Rafee";
    rafee.password = "rafeetalks";
    rafee.email = "rafee@palantir.com";
    rafee.save(function(e) { if(e) {console.log(err);}});
    iev.name = "Ian";
    iev.password = "ianleaves";
    iev.email = "iev@cs.cmu.edu";
    iev.save(function(e) { if(e) {console.log(err);}});
    drl.name = "Dr. Dan";
    drl.password = "root";
    drl.email = "drl@cs.cmu.edu";
    drl.save(function(e) { if(e) {console.log(err);}});

    c15150.name = "15-150";
    c15150.assignments.push("LOLZ Fundict");
    c15150.staff.push(iev._id);
    c15150.staff.push(drl._id);
    c15150.students.push(sri._id);
    c15150.save(function(err) {
        if(err) {console.log(err);}
    });

    fundict.name = "fundict.sml";
    fundict.path =
        application_root + "/data/handins/srikrish/15150/assn09/fundict.sml";
    fundict.timestamp = new Date();
    fundict.save(function(e) { if(e) {console.log(err);}});
    ordered.name = "ordered.sml";
    ordered.path =
        application_root + "/data/handins/srikrish/15150/assn09/ordered.sml";
    ordered.timestamp = new Date();
    ordered.save(function(e) { if(e) {console.log(err);}});
    serializable.name = "serializable.sml";
    serializable.path =
        application_root+"/data/handins/srikrish/15150/assn09/serializable.sml";
    serializable.timestamp = new Date();
    comment.text = "VINCEEEEEENT!"
    comment.user = sri._id;
    comment.timestamp = new Date();
    comment.startLine = 6;
    comment.endLine = 42;
    comment.startChar = 4;
    comment.endChar = 8;
    comment.save(function(e) { if(e) {console.log(err);}});
    serializable.comments.push(comment);
    serializable.save(function(e) { if(e) {console.log(err);}});

    assn09.name = "LOLZ Fundict";
    assn09.course = c15150._id;
    assn09.user = sri._id;
    assn09.files.push(fundict._id);
    assn09.files.push(ordered._id);
    assn09.files.push(serializable._id);
    assn09.save(function(e) { if(e) {console.log(err);}});

    sri.assignments.push(assn09._id);
    sri.save(function(e) { if(e) {console.log(err);}});

    res.send("OK");
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
require('./controllers/api')(app);

app.listen(3000, function() {
  console.log("App listening on port %d in %s mode", 3000, app.settings.env);
});
