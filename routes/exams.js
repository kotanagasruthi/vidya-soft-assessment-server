const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router();
const Exam = require('../models/exams');
const shortid = require('shortid');
const cors = require('cors');
router.use(cors());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());



router.post('/setExam', async (req,res) => {
      try {
            var examData = req.body;
            const uniqueExamID = shortid.generate();
            console.log('exam data', examData)
            examData = {
              ...examData,
              exam_id: uniqueExamID
            }
            const exam = new Exam(examData);
            await exam.save()
            res.status(201).json({
                  success: true,
                  message: 'Exam is set successfully',
            });

          } catch (error) {
            res.status(400).send({ error: error.message });
          }
})

router.get('/getAllExams', async(req,res) => {
      try {
            const exams = await Exam.find(); // Fetch all records
            res.json(exams);
          } catch (error) {
            console.error('Error fetching records:', error);
            res.status(500).send('Error fetching records');
          }
});

router.get('/getExams', async(req,res) => {
  try {
        const institute_id = req.query.institute_id
        const topics = await Exam.find({ institute_id});

        const exams = await Exam.find(); // Fetch all records
        res.json(exams);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).send('Error fetching records');
      }
});

router.delete('/deleteAllExams', async (req, res) => {
      try {
        await Exam.deleteMany({});
        res.status(200).send('All exams deleted successfully.');
      } catch (error) {
        res.status(500).send('Server error.');
      }
    });

module.exports = router;
