const express = require('express');
const router = express.Router();
const Invitee = require('../models/invitee');
const cors = require('cors');
router.use(cors());


// Add a new invitee
router.post('/add', async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    const newInvitee = new Invitee({
      firstName,
      lastName,
      email,
    });

    const invitee = await newInvitee.save();
    res.json(invitee);
  } catch (error) {
    res.status(400).json({ error: 'Unable to add invitee' });
  }
});

//fetch all users
router.get('/users', async (req, res) => {
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
    console.error('Error deleting all invitees:', error);
    res.status(500).send('Error deleting all invitees');
  }
});

module.exports = router;
