const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router();
const Question = require('../models/questions');
const shortid = require('shortid');
const cors = require('cors');
router.use(cors());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.post('/addQuestion', async (req,res) => {
      try {
            var questionData = req.body;
            const uniqueQuestionID = shortid.generate();
            console.log('question data', questionData)
            questionData = {
              ...questionData,
              question_id: uniqueQuestionID
            }
            const question = new Question(questionData);
            await question.save()
            res.status(201).json({
                  success: true,
                  message: 'Question is added successfully',
            });

          } catch (error) {
            res.status(400).send({ error: error.message });
          }
})

router.get('/getAllQuestions', async(req,res) => {
  try {
        const questions = await Question.find();

        // Send the records as JSON
        res.json(questions);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).send('Error fetching records');
      }
});

router.get('/getQuestions', async(req,res) => {
      try {
            console.log('topic id', req.query.topic_id)
            const topic_id = req.query.topic_id
            const questions = await Question.find({ topic_id }); // Fetch all records

            // Send the records as JSON
            res.json(questions);
          } catch (error) {
            console.error('Error fetching records:', error);
            res.status(500).send('Error fetching records');
          }
});

router.put('/:questionId', async (req, res) => {
      try {
          const questionId = req.params.questionId;
          const updateData = req.body;

          const updatedQuestion = await Question.findByIdAndUpdate(questionId, updateData, {
              new: true,  // Returns the updated document
              runValidators: true  // Ensures new data respects schema validations
          });

          if (!updatedQuestion) {
              return res.status(404).json({ message: 'No question found with the given ID' });
          }

          res.json(updatedQuestion);
      } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
      }
  });

  router.delete('/:questionId', async (req, res) => {
      try {
          const questionId = req.params.questionId;

          const deletedQuestion = await Question.findByIdAndDelete(questionId);

          if (!deletedQuestion) {
              return res.status(404).json({ message: 'No question found with the given ID' });
          }

          res.json({ message: 'Question deleted successfully', deletedQuestion });
      } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
      }
  });

module.exports = router;
