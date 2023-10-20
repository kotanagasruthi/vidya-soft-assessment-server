const mongoose = require('mongoose');

const inviteeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
});

const Invitee = mongoose.model('Invitee', inviteeSchema);

module.exports = Invitee;
