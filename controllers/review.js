module.exports = function(app) {
  app.get('/review', function(req, res) {
    res.render('review');
  });
};

