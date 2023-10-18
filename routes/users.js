const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const User = require('../models/users');

router.get('/getUsers', async (req, res) => {
      try {
        const users = await User.find(); // Fetch all records

        // Send the records as JSON
        res.json(users);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).send('Error fetching records');
      }
    });

router.post('/login', async (req, res) => {
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
        res.status(200).send({ message: 'Login successful.', user: user });

      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ message: 'Server error' });
      }
    });
    module.exports = router;
