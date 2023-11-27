const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const router = express.Router();
const Institute = require('../models/institute');
const User = require('../models/users');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const cors = require('cors');
router.use(cors({
  origin: 'http://localhost:8080', // Replace with the exact URL of your Vue.js frontend
  credentials: true
}));

router.post('/setInstitute', async (req, res) => {
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

            const newUser = new User({
              user_id: uniqueUserID,
              name: req.body.name,
              email: req.body.email,
              password: req.body.password, // Remember: Hash and salt this in a real-world scenario
              role: 'admin',
              institute_id: uniqueInstituteID, // Example ObjectId; you would typically get this from somewhere
              institute_name: req.body.name
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

    router.delete('/deleteInstitutes/:id', async (req, res) => {
      try {
        const instituteId = req.params.id;

        // First, check if the institute with the provided ID exists
        const institute = await Institute.findOne({ institute_id: instituteId });

        if (!institute) {
          return res.status(404).json({ message: 'Institute not found' });
        }

        // If the institute exists, you can delete it
        await Institute.deleteOne({ institute_id: instituteId });

        // Optionally, you can also delete associated user records if needed
        // For example, if you want to delete users associated with this institute
        await User.deleteMany({ institute_id: instituteId });

        res.status(200).json({ message: 'Institute deleted successfully' });
      } catch (error) {
        console.error('Error deleting institute:', error);
        res.status(500).send('Error deleting institute');
      }
    });

    router.get('/getInstitutes', async (req, res) => {
      try {
        const institutes = await Institute.find(); // Fetch all records

        // Send the records as JSON
        x = res.json(institutes);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).send('Error fetching records');
      }
    });
    router.get('/institutes/:id', async (req, res) => {
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

    router.delete('/deleteInstitutes', async (req, res) => {
      try {
        // Delete all institute records
        const deleteResult = await Institute.deleteMany({});

        res.status(200).json({ message: 'All institutes deleted successfully' });
      } catch (error) {
        console.error('Error deleting all institutes:', error);
        res.status(500).send('Error deleting all institutes');
      }
    });

    module.exports = router;
