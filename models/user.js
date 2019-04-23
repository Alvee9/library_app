var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type: String, max: 100, required: true},
  userId: {type: String},
  email: {type: String},
  password: {type: String},
  userType: {type: String, default: 'general'},
  authType: {type: String, enum: ['local', 'google', 'facebook'], default: 'local'},
  thumbnail: {type: String}
});

module.exports = mongoose.model('User', UserSchema);
