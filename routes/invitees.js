const express = require('express');
const router = express.Router();
const Invitee = require('../models/invitee');
const cors = require('cors');
router.use(cors({
  origin: 'http://localhost:8080', // Replace with the exact URL of your Vue.js frontend
  credentials: true
}));


// Add a new invitee
router.post('/add', async (req, res) => {
  const { firstName, lastName, email, instituteId } = req.body;

  try {
    const newInvitee = new Invitee({
      firstName,
      lastName,
      email,
      institute_id: instituteId
    });

    const invitee = await newInvitee.save();
    res.json(invitee);
  } catch (error) {
    res.status(400).json({ error: 'Unable to add invitee' });
  }
});

//fetch all users
router.get('/users/:institute_id', async (req, res) => {
    try {
      const institute_id = req.params.institute_id;
      const users = await Invitee.find({institute_id});
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch users' });
    }
  });

// Delete an invitee by email
router.delete('/delete/:email', async (req, res) => {
  const inviteeEmail = req.params.email;

  try {
    const result = await Invitee.findOneAndDelete({ email: inviteeEmail });
    if (result) {
      res.json({ message: 'Invitee deleted successfully' });
    } else {
      res.status(404).json({ error: 'Invitee not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Unable to delete invitee' });
  }
});

router.delete('/deleteInvitees', async (req, res) => {
  try {
    // Delete all institute records
    const deleteResult = await Invitee.deleteMany({});

    res.status(200).json({ message: 'All invitees deleted successfully' });
  } catch (error) {
    res.status(500).send('Error deleting all invitees');
  }
});

module.exports = router;
