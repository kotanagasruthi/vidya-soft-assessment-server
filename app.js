const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

const Institute = require('./models/institute.js'); // Import the model
const User = require('./models/users.js');
const shortid = require('shortid');

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

app.get('/collections', async (req, res) => {
  try {
    const collectionNames = await mongoose.connection.db.listCollections().toArray();
    res.json(collectionNames.map(collection => collection.name));
  } catch (err) {
    console.error('Error fetching collections:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to handle POST requests and store institute data in the database
app.post('/institute', async (req, res) => {
  try {
    var instituteData = req.body;
    const uniqueInstituteID = shortid.generate();
    instituteData = {
      ...instituteData,
      institute_id: uniqueInstituteID
    }
    const institute = new Institute(instituteData);
    institute.save().then(result => {
      const uniqueUserID = shortid.generate();
      console.log('institute ID', uniqueInstituteID)
      console.log('name', req.body.name)
      console.log('user_id', uniqueUserID)
      console.log('password', req.body.password)

        const newUser = new User({
          user_id: uniqueUserID,
          name: req.body.name,
          password: req.body.password, // Remember: Hash and salt this in a real-world scenario
          role: 'admin',
          institute_id: uniqueInstituteID // Example ObjectId; you would typically get this from somewhere
        });

        newUser.save()
        .then(result => {
          res.status(201).json({
            success: true,
            message: 'User record inserted successfully!',
          });
        })
        .catch(err => {
          console.error('Error saving user:', err);
        });
    });

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

app.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all records

    // Send the records as JSON
    res.json(users);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});

app.post("/login", async (req, res) => {
  try {
    const { institute_id, password } = req.body;

    if (!institute_id || !password) {
      return res.status(400).send({ message: 'Both institute_id and password are required.' });
    }

    const user = await User.findOne({ institute_id });
    if (!user) {
      return res.status(401).send({ message: 'Wrong credentials.' });
    }
    console.log('password', password)
    console.log('user password', user.password)

    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Wrong credentials.' });
    }

    // If login is successful, send a success response. You can also generate a token or set a session here.
    res.status(200).send({ message: 'Login successful.' });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ message: 'Server error' });
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

app.delete('/institutes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the Institute by id and delete it
    const result = await Institute.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send({ message: 'Institute not found' });
    }

    res.send({ message: 'Institute deleted successfully!' });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
