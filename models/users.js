const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  user_id:String,
  institute_id: String,
  password: String,
  role:String
});

const User = mongoose.model('users', userSchema);

module.exports = User;
