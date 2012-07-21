module.exports = function (mongoose) {
  var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    models = {};

  var UserSchema = new Schema({
    username: String,
    password: String,
    email:    String,
    // classes:
    is_staff: Boolean
  });
  models.User = mongoose.model('User', UserSchema);

  return models;
};
