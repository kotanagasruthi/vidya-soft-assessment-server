const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router();
const Topic = require('../models/topics');
const shortid = require('shortid');
const cors = require('cors');
router.use(cors());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.post('/setTopic', async (req,res) => {
      try {
            var topicData = req.body;
            const uniqueTopicID = shortid.generate();
            console.log('topic data', topicData)
            topicData = {
              ...topicData,
              topic_id: uniqueTopicID
            }
            const topic = new Topic(topicData);
            await topic.save()
            res.status(201).json({
                  success: true,
                  message: 'Topic is set successfully',
            });

          } catch (error) {
            res.status(400).send({ error: error.message });
          }
})

router.get('/getTopics', async(req,res) => {
      try {
            const topics = await Topic.find({ institute_id });

            // Send the records as JSON
            res.json(topics);
          } catch (error) {
            console.error('Error fetching records:', error);
            res.status(500).send('Error fetching records');
          }
});

router.put('/:topicId', async (req, res) => {
      try {
          const topicId = req.params.topicId;
          const updateData = req.body;

          const updatedTopic = await Topic.findByIdAndUpdate(topicId, updateData, {
              new: true,  // Returns the updated document
              runValidators: true  // Ensures new data respects schema validations
          });

          if (!updatedTopic) {
              return res.status(404).json({ message: 'No topic found with the given ID' });
          }

          res.json(updatedTopic);
      } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
      }
  });

  router.delete('/:topicId', async (req, res) => {
      try {
            const topicId = req.params.topicId;

          const deletedTopic = await Topic.findByIdAndDelete(topicId);

          if (!deletedTopic) {
              return res.status(404).json({ message: 'No Topic found with the given ID' });
          }

          res.json({ message: 'Topic deleted successfully', deletedTopic });
      } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
      }
  });
module.exports = router;
