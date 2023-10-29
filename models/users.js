const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  user_id:String,
  instituteId: String,
  password: String,
  role:String
});

const User = mongoose.model('users', userSchema);

module.exports = User;
