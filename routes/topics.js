const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router();
const Topic = require('../models/topics');
const shortid = require('shortid');
const cors = require('cors');
router.use(cors({
  origin: 'http://localhost:8080', // Replace with the exact URL of your Vue.js frontend
  credentials: true
}));

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.post('/setTopic', async (req,res) => {
  try {
        var topicData = req.body;
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

router.get('/getTopics/:institute_id', async (req, res) => {
  try {
    const institute_id = req.params.institute_id;
    const topics = await Topic.find({ institute_id });

    // Send the records as JSON
    res.json(topics);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});

router.get('/getSubTopics', async (req, res) => {
  try {
    const institute_id = req.query.institute_id;
    const topic_name = req.query.topic_name;
    const topic = await Topic.findOne({
      institute_id: institute_id,
      topic_name: topic_name
    });

    const subTopics = topic ? topic.sub_topics : [];
    res.json(subTopics);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});


router.get('/getAllTopics', async(req,res) => {
  try {
        const topics = await Topic.find();
        res.json(topics);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).send('Error fetching records');
      }
});

router.get('/getTopics', async(req,res) => {
  try {
    const institute_id = req.query.institute_id
    const topics = await Topic.find({ institute_id});
    res.json(topics);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});

router.post('/setSubTopic', async (req,res) => {
  const { topic_name, subtopic_name, subtopic_description, institute_id } = req.body;
  console.log('subtopic name', subtopic_name)
  console.log('subtopic desc', subtopic_description)

  try {
    // Find the topic and update it
    const updatedTopic = await Topic.findOneAndUpdate(
      { topic_name: topic_name, institute_id: institute_id },
      {
        $push: {
          sub_topics: {
            subtopic_name: subtopic_name,
            subtopic_description: subtopic_description
          }
        }
      },
      { new: true } // Return the updated document
    );

    if (updatedTopic) {
      res.json(updatedTopic);
    } else {
      res.status(404).send('Topic not found');
    }
  } catch (error) {
    console.error('Error adding subtopic:', error);
    res.status(500).send('Error adding subtopic');
  }
})


router.put('/:topicName', async (req, res) => {
      try {
          const topic_name = req.params.topicName;
          const updateData = req.body;

          const updatedTopic = await Topic.findByIdAndUpdate(topic_name, updateData, {
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

  router.delete('/:topicName', async (req, res) => {
      try {
            const topic_name = req.params.topicName;

          const deletedTopic = await Topic.findByIdAndDelete(topic_name);

          if (!deletedTopic) {
              return res.status(404).json({ message: 'No Topic found with the given ID' });
          }

          res.json({ message: 'Topic deleted successfully', deletedTopic });
      } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
      }
  });

  router.delete('/deleteAllTopics', async (req, res) => {
    try {
      await Topic.deleteMany({});
      res.status(200).send('All Topics deleted successfully.');
    } catch (error) {
      res.status(500).send('Server error.');
    }
  });
module.exports = router;
