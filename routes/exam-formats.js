const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router();
const ExamFormat = require('../models/exam-formats');
const shortid = require('shortid');
const cors = require('cors');
router.use(cors());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.post('/addExamFormat', async (req,res) => {
      try {
            var examFormatData = req.body;
            const uniqueExamFormatID = shortid.generate();
            console.log('exam format data', examFormatData)
            examFormatData = {
              ...examFormatData,
              examFormatId: uniqueExamFormatID
            }
            const examFormat = new ExamFormat(examFormatData);
            await examFormat.save()
            res.status(201).json({
                  success: true,
                  message: 'Exam Format is added successfully',
            });

          } catch (error) {
            res.status(400).send({ error: error.message });
          }
})

router.get('/getAllExamFormats', async(req,res) => {
  try {
        const examFormats = await ExamFormat.find();

        // Send the records as JSON
        res.json(examFormats);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).send('Error fetching records');
      }
});

router.get('/getExamFormat', async(req,res) => {
      try {
            console.log('exam format id', req.query.examFormatId)
            const examFormatId = req.query.examFormatId
            const examFormat = await ExamFormat.find({ examFormatId }); // Fetch all records

            // Send the records as JSON
            res.json(examFormat);
          } catch (error) {
            console.error('Error fetching records:', error);
            res.status(500).send('Error fetching records');
          }
});

router.delete('/deleteAllFormats', async (req, res) => {
      try {
        await ExamFormat.deleteMany({});
        res.status(200).send('All exam formats deleted successfully.');
      } catch (error) {
        res.status(500).send('Server error.');
      }
    });


module.exports = router;
