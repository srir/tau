var _ = require('lodash'),
  mongoose = require('mongoose'),
  models = require('../models');


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

console.log("Fixtures deleted.");
