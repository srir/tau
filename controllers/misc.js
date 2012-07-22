module.exports = function(app) {
  var _      = require('lodash');
  var models = require('../models');
  var application_root = app.set('application_root');

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
          vsiao = new models.User(),
          iev = new models.User(),
          drl = new models.User(),
          rafee = new models.User(),
          assn09 = new models.Assignment(),
          c15150 = new models.Course(),
          fundict = new models.File(),
          serializable = new models.File(),
          ordered = new models.File(),
          assn07 = new models.Assignment(),
          c15210 = new models.Course(),
          boruvka = new models.File();
      sri.name = "Sri";
      sri.password = ".";
      sri.email = "srikrish@andrew.cmu.edu";
      sri.save(function(e) { if(e) {console.log(e);}});
      vsiao.name = "Vincent Siao"
      vsiao.password = "j2h3nkj";
      vsiao.email = "vsiao@andrew.cmu.edu";
      vsiao.save(function(e) { if(e) console.log(e); });
      rafee.name = "Rafee";
      rafee.password = "rafeetalks";
      rafee.email = "rafee@palantir.com";
      rafee.save(function(e) { if(e) {console.log(e);}});
      iev.name = "Ian";
      iev.password = "ianleaves";
      iev.email = "iev@cs.cmu.edu";
      iev.save(function(e) { if(e) {console.log(e);}});
      drl.name = "Dr. Dan";
      drl.password = "root";
      drl.email = "drl@cs.cmu.edu";
      drl.save(function(e) { if(e) {console.log(e);}});

      c15150.name = "15-150";
      c15150.slug = "15-150";
      c15150.assignments.push("assn09");
      c15150.staff.push(iev._id);
      c15150.staff.push(drl._id);
      c15150.students.push(sri._id);
      c15150.save(function(e) { if (e) console.log(e); });

      c15210.name = "15-210";
      c15210.slug = "15-210";
      c15210.assignments.push("assn07");
      c15210.students.push(vsiao._id);
      c15210.save(function(e) { if (e) console.log(e); });

      fundict.name = "fundict.sml";
      fundict.slug = "fundict.sml";
      fundict.path =
          application_root + "/data/handins/srikrish/15150/assn09/fundict.sml";
      fundict.timestamp = new Date();
      fundict.save(function(e) { if(e) {console.log(e);}});
      ordered.name = "ordered.sml";
      ordered.slug = "ordered.sml";
      ordered.path =
          application_root + "/data/handins/srikrish/15150/assn09/ordered.sml";
      ordered.timestamp = new Date();
      ordered.save(function(e) { if(e) {console.log(e);}});
      serializable.name = "serializable.sml";
      serializable.slug = "serializable.sml";
      serializable.path =
          application_root+"/data/handins/srikrish/15150/assn09/serializable.sml";
      serializable.timestamp = new Date();
      serializable.save(function(e) { if(e) {console.log(e);}});

      assn09.name = "Assignment 09";
      assn09.slug = "assn09";
      assn09.course = c15150._id;
      assn09.user = sri._id;
      assn09.files.push(fundict._id);
      assn09.files.push(ordered._id);
      assn09.files.push(serializable._id);
      assn09.save(function(e) { if(e) {console.log(e);}});

      boruvka.name = "BoruvkaMST.sml";
      boruvka.slug = "BoruvkaMST.sml";
      boruvka.path =
        application_root + "/data/handins/vsiao/15210/assn07/BoruvkaMST.sml";
      boruvka.timestamp = new Date();
      boruvka.save(function(e) { if (e) console.log(e); });
      assn07.name = "Assignment 07";
      assn07.slug = "assn07";
      assn07.course = c15210._id;
      assn07.user = vsiao._id;
      assn07.files.push(boruvka._id);
      assn07.save(function(e) { if (e) console.log(e); });
      vsiao.assignments.push(assn07._id);
      vsiao.save(function(e) { if (e) console.log(e); });

      sri.assignments.push(assn09._id);
      sri.save(function(e) { if(e) {console.log(e);}});

      res.send("OK");
  });

  app.get('/', function(req, res, next) {
    if (req.user) {
      var userid = req.user._id;
      models.Course
      .find({})
      .or([{staff: userid},
           {students: userid}])
      .exec(function(err, courses) {
        res.render('index', {
          courses: _(courses).map(function (course) {
            return {
              name: course.name,
              slug: course.slug,
              is_staff: _(course.staff).contains(userid)
            };
          })
        });
      });
    } else {
      res.end("Splash page");
    }
  });
};

