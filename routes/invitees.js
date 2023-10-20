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
      const users = await Invitee.find({});
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

module.exports = router;
