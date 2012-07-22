module.exports = function(app) {
  app.get('/:courseid/:assnid/:fileid', function(req, res) {
    res.render('review', {
      course: {
        id:       req.params.courseid,
        name:     '15-150'
      },
      assn:   {
        id:       req.params.assnid,
        name:     'assn11'
      },
      file:   {
        id:       req.params.fileid,
        contents: ''
      }
    });
  });
};

