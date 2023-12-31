const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router();
const CommonExamFormat = require('../models/common-exam-formats');
const shortid = require('shortid');
const cors = require('cors');
router.use(cors({
  origin: 'http://localhost:8080', // Replace with the exact URL of your Vue.js frontend
  credentials: true
}));

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.post('/addExamFormat', async (req,res) => {
      try {
            var examFormatData = req.body;
            const uniqueExamFormatID = shortid.generate();

            let totalMarks = 0;

            examFormatData.topics.forEach(function(topic, index) {
              totalMarks += topic.marks
            });

            examFormatData = {
              ...examFormatData,
              totalMarks: totalMarks,
              examFormatId: uniqueExamFormatID
            }
            const examFormat = new CommonExamFormat(examFormatData);
            await examFormat.save()
            res.status(201).json({
                  success: true,
                  message: 'Exam Format is added successfully',
            });

          } catch (error) {
            res.status(400).send({ error: error.message });
          }
})

router.get('/getAllCommonExamFormats', async(req,res) => {
  try {
        const examFormats = await CommonExamFormat.find();

        // Send the records as JSON
        res.json(examFormats);
      } catch (error) {
        res.status(500).send('Error fetching records');
      }
});

router.put('/updateManyExamFormats', async(req,res) => {
  try {
    // Update all documents in the collection
    const result = await CommonExamFormat.updateMany({}, { $set: { commonFormat: true } });

    console.log(`${result.nModified} documents updated`);
  } catch (error) {
    console.error(error);
  }
});

router.get('/getExamFormat', async(req,res) => {
      try {
            const examFormatId = req.query.examFormatId
            const examFormat = await CommonExamFormat.find({ examFormatId }); // Fetch all records

            // Send the records as JSON
            res.json(examFormat);
          } catch (error) {
            res.status(500).send('Error fetching records');
          }
});

router.delete('/deleteAllFormats', async (req, res) => {
      try {
        await CommonExamFormat.deleteMany({});
        res.status(200).send('All exam formats deleted successfully.');
      } catch (error) {
        res.status(500).send('Server error.');
      }
    });


module.exports = router;
