const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

const Institute = require('./models/institute.js'); // Import the model

// Use the CORS middleware
app.use(cors());

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to your MongoDB Atlas cluster
const mongoURI = 'mongodb+srv://hitheshchm:aDpw4bk4cqJ9bzmT@cluster0.ditmjg6.mongodb.net/assesment_platform';

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Call the connectToDatabase function to establish the connection
connectToDatabase();

// Define a route to handle POST requests and store institute data in the database
app.post('/institute', async (req, res) => {
  try {
    const instituteData = req.body;
    const institute = new Institute(instituteData);
    await institute.save();
    res.status(201).send(institute);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get('/getinstitutes', async (req, res) => {
  try {
    const institutes = await Institute.find(); // Fetch all records

    // Send the records as JSON
    res.json(institutes);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});

app.get('/institutes/:id', async (req, res) => {
  try {
    const institute = await Institute.findOne({ _id: req.params.id });

    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }

    // Send the found record as JSON
    res.json(institute);
  } catch (error) {
    console.error('Error fetching the record:', error);
    res.status(500).send('Error fetching the record');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
