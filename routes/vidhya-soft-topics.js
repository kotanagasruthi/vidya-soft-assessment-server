const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); // Import body-parser
const Topic = require('../models/vidhya-soft-topics');
const cors = require('cors');

// Enable CORS for all routes
router.use(cors());

// Use body-parser middleware
router.use(bodyParser.json());


// Create a new topic
router.post('/topics', async (req, res) => {
    try {
      const newTopic = new Topic(req.body);
      const savedTopic = await newTopic.save();
      res.json(savedTopic);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get all topics
  router.get('/topics', async (req, res) => {
    try {
      const topics = await Topic.find();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get a specific topic by ID
  router.get('/topics/:id', async (req, res) => {
    try {
      const topic = await Topic.findById(req.params.id);
      res.json(topic);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update a topic by ID
  router.put('/topics/:id', async (req, res) => {
    try {
      const updatedTopic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedTopic);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete a topic by ID
  router.delete('/topics/:id', async (req, res) => {
    try {
      await Topic.findByIdAndDelete(req.params.id);
      res.json({ message: 'Topic deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;