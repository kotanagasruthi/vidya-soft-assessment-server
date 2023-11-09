const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const cors = require('cors');
router.use(cors());

const User = require('../models/users');

router.get('/getUsers', async (req, res) => {
      try {
        const institute_id = req.params.institute_id;
        const users = await User.find({institute_id});

        // Send the records as JSON
        res.json(users);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).send('Error fetching records');
      }
    });

  router.post('/addUser', async (req, res) => {
    try {
      const { name, email, instituteId, instituteName, password, role } = req.body; // Make sure to adjust 'otherFields' according to your User model


      // Check if the user with the provided institute_id already exists
      const existingUser = await User.findOne({ user_id });
      if (existingUser) {
        return res.status(400).send({ message: 'User with this institute_id already exists.' });
      }

      // Create a new User instance
      const uniqueUserID = shortid.generate();
      const newUser = new User({
        name,
        user_id: uniqueUserID,
        email,
        institute_id: instituteId,
        institute_name: instituteName,
        password,
        role // Make sure to include all required fields here
      });

      // Save the new user to the database
      const savedUser = await newUser.save();

      // Send a success response with the saved user information
      res.status(201).json({ message: 'User added successfully', user: savedUser });
    } catch (error) {
      console.error('Error adding a user:', error);
      res.status(500).send({ message: 'Server error' });
    }
  });

router.post('/login', async (req, res) => {
      try {
        const { instituteID, email, password } = req.body;

        if (!instituteID || !password || !email) {
          return res.status(400).send({ message: 'Both institute_id and password are required.' });
        }

        const user = await User.findOne({ institute_id:instituteID , email, password});
        if (!user) {
          return res.status(401).send({ message: 'Please Check Your credentials.' });
        }

        const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
          return res.status(401).send({ message: 'Please Check Your credentials.' });
        }

        req.session.userId = user.user_id;
        // If login is successful, send a success response. You can also generate a token or set a session here.
        return res.status(200).send({ message: 'Login successful.', user: user });

      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ message: 'Server error' });
      }
    });

    router.post('/logout', (req, res) => {
      req.session.destroy(); // destroy the session
      res.send('Logged out');
    });

    router.get('/session', (req, res) => {
      if (req.session.userId) {
        res.send({ loggedIn: true, userId: req.session });
      } else {
        res.send({ loggedIn: false });
      }
    });
    // ... (your existing code)

// Define a route to delete a user by ID
router.delete('/deleteUser/:_id', async (req, res) => {
  try {
    const userId = req.params._id;

    // Use Mongoose to find and remove the user by their ID
    const deletedUser = await User.findByIdAndRemove(userId);

    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting a user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/deleteUsers', async (req, res) => {
  try {
    // Delete all institute records
    const deleteResult = await User.deleteMany({});

    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Error deleting all Users:', error);
    res.status(500).send('Error deleting all Users');
  }
});

// Export the router with the new route handler
module.exports = router;

