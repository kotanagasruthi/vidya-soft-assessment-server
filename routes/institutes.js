const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Institute = require('../models/institute');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

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

    router.get('/getInstitutes', async (req, res) => {
      try {
        const institutes = await Institute.find(); // Fetch all records

        // Send the records as JSON
        res.json(institutes);
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
    module.exports = router;