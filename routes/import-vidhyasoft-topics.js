  const mongoose = require('mongoose');
  const express = require('express');
  const router = express.Router();
  const bodyParser = require('body-parser');
  const Topic = require('../models/vidhya-soft-topics');
  const Question = require('../models/vidhya-soft-questions');
  const cors = require('cors');

  router.use(cors({
    origin: 'http://localhost:8080', // Replace with the exact URL of your Vue.js frontend
    credentials: true
  }));

  // Use body-parser middleware
  router.use(bodyParser.json());

  // Route to fetch topics with subtopics and questions
  router.get('/importopics/:topicname', async (req, res) => {
    try {
        console.log(req.params)
        const topic = req.params.topicname;

        // Find the specified topic
        const onetopic = await Topic.findOne({ topic_name: topic });

        // Prepare the result array
        const result = [];

        // Iterate through each subtopic
        for (const subtopic of onetopic.sub_topics) {
            // Count the number of questions in the current subtopic
            const numQuestions = await Question.countDocuments({
                subtopic_name: subtopic.subtopic_name,
            });

            // Create an object with subtopic details
            const subtopicDetails = {
                subtopic_name: subtopic.subtopic_name,
                numQuestions: numQuestions,
            };

            // Add the object to the result array
            result.push(subtopicDetails);
        }

        // Send the result as JSON response
        res.json(result);
    } catch (error) {
        console.error('Error fetching topics:', error);
        // Send an error response if there's an issue
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
