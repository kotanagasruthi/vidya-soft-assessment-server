const mongoose = require('mongoose');

// Create a Mongoose schema
const userSchema = new mongoose.Schema({
    institute_id: String,
    phone_number: Number, // Changed to Number
    primary_user_email: String,
    password:String,
});

// Create a Mongoose model based on the schema
const User = mongoose.model('users', userSchema); // Changed 'institutes' to 'Institute'

module.exports = User;
