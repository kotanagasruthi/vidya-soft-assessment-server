const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: String,
  institute_id: String,
  name: String,
  password: String,
  role: String
});

const User = mongoose.model('users', userSchema);

module.exports = User;
