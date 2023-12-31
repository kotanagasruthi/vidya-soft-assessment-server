const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router();
const Exam = require('../models/exams');
const shortid = require('shortid');
const cors = require('cors');
const { route } = require('./users');
router.use(cors({
  origin: 'http://localhost:8080', // Replace with the exact URL of your Vue.js frontend
  credentials: true
}));

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());



router.post('/setExam', async (req,res) => {
      try {
            var examData = req.body;
            const uniqueExamID = shortid.generate();
            examData = {
              ...examData,
              exam_id: uniqueExamID
            }
            const exam = new Exam(examData);
            await exam.save()
            res.status(200).json({
                  success: true,
                  message: 'Exam is set successfully',
            });

          } catch (error) {
            res.status(400).send({ error: error.message });
          }
})

router.post('/setInvitees', async (req,res) => {
  try {
    const examId = req.body.exam_id
    const newInvitees = req.body.invitees
    const updatedExam = await Exam.findOneAndUpdate(
      { exam_id: examId },
      { $push: { invitees: { $each: newInvitees } } },
      { new: true }
    );
    if (updatedExam) {
      await Exam.findOneAndUpdate(
        { exam_id: examId },
        { $set: { "invitees.$[].invitation": "pending" } }
      );
    }
    if (updatedExam) {
      res.json({ success: true, exam: updatedExam });
    } else {
        res.status(404).json({ success: false, message: 'Exam not found' });
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
})

router.get('/examInvitees', async(req,res) => {
  try {
      const examId = req.query.exam_id
        const exam = await Exam.findOne({ exam_id: examId }, { invitees: 1, _id: 0 });
        if (exam) {
            res.json({ success: true, invitees: exam.invitees });
        } else {
            res.status(404).json({ success: false, message: 'Exam not found' });
        }
    } catch (error) {
      res.status(500).send('Error fetching records');
    }
});

router.get('/getAllExams', async(req,res) => {
      try {
            const exams = await Exam.find(); // Fetch all records
            res.json(exams);
          } catch (error) {
            res.status(500).send('Error fetching records');
          }
});

router.get('/getExams', async(req,res) => {
  try {
        const institute_id = req.query.institute_id
        const exams = await Exam.find({ institute_id});
        res.json(exams);
      } catch (error) {
        res.status(500).send('Error fetching records');
      }
});

router.get('/getExamDetails', async(req,res) => {
  try {
        const exam_id = req.query.exam_id
        const exam = await Exam.find({ exam_id });
        res.json(exam[0]);
      } catch (error) {
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

router.put('/updateExam/:exam_id', async (req, res) => {
      try {
        const exam_id = req.params.exam_id;
        const updatedExam = await Exam.findOneAndUpdate(
          { exam_id },
          { is_active: true },
          { new: true } // Returns the updated document
        );
        if (updatedExam) {
          res.json({ success: true, message: 'Exam Updates Successfully!!!' });
        } else {
            res.status(404).json({ success: false, message: 'Exam not found' });
        }
      } catch (error) {
        res.status(500).send('Server error.');
      }
});

module.exports = router;
