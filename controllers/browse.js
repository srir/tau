module.exports = function(app) {
  var models = require('../models'),
    auth = require('../authUtil');

  app.get('/:courseid/:assnid', auth.ensureAuthenticated, function(req, res) {
    var files = [
      { name: 'memo.sml', id: 'memo.sml' },
      { name: 'derp.sml', id: 'derp.sml' },
      { name: 'LOL.sml', id: 'LOL.sml' }
    ];
    res.render('browse/assignment', {
      course:   { id: req.params.courseid, name: "15-150" },
      assn:     { id: req.params.assnid, name: 'assn11' },
      files:    files
    });
  });

  app.get('/:courseid', auth.ensureAuthenticated, function(req, res) {
    var assns = [
      { name: "assn1", id: "_id1" },
      { name: "assn2", id: "_id2" },
      { name: "assn3", id: "_id3" },
      { name: "assn4", id: "_id4" },
      { name: "assn5", id: "_id5" },
      { name: "assn6", id: "_id6" },
      { name: "assn7", id: "_id7" },
      { name: "assn8", id: "_id8" },
      { name: "assn9", id: "_id9" }
    ]
    res.render('browse/course', {
      course:   { id: req.params.courseid, name: "15-150" },
      assns:    assns
    });
  });
};

