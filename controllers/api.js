module.exports = function(app) {
  var authUtils = require('../authUtil'),
      m = require('../models'),
      _ = require('lodash'),
      ok = function(d) {
          return {status: "Success", data: d};
      },
      notok = function(d) {
          return {status: "Failure", message: d};
      };

  app.get('/api/user/:userid/course/:courseid', //authUtils.ensureAuthenticated,
          function(req, res) {
            m.Course.findById(req.params.courseid)
              .exec(function (err, doc) {
                if(!err) {
                  if(doc) {
                      if(_.find(doc.staff,
                             function(u) {return (u == req.params.userid);})) {
                          res.send(ok({isStaff: true}));
                      } else {
                          res.send(ok({isStaff: false}));
                      }
                  } else {
                      res.send(notok("Document not found."));
                  }
                } else {
                    console.log(err);
                }
              });
  });

  app.get('/review', function(req, res) {
    res.render('review');
  });
};
