const mongoose = require('mongoose');

// Create a Mongoose schema
const instituteSchema = new mongoose.Schema({
    institute_id: String,
    name: String,
    website_url: String,
    logo: String,
    address: {
        street: String,
        house_number: String, // Corrected from house_nnumber to house_number
        landmark: String,
        pincode: Number,
        state: String,
        city: String,
        country: String,
    },
    active: Boolean, // Changed to Boolean
    phone_number: Number, // Changed to Number
    primary_user_email: String,
});

// Create a Mongoose model based on the schema
const Institute = mongoose.model('Institute', instituteSchema); // Changed 'institutes' to 'Institute'

module.exports = Institute;
