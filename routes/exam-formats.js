const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router();
const ExamFormat = require('../models/exam-formats');
const CommonExamFormat = require('../models/common-exam-formats');
const shortid = require('shortid');
const cors = require('cors');
router.use(cors());

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/copyExamFormats', async (req,res) => {
  ExamFormat.find().then(docs => {
      return CommonExamFormat.insertMany(docs.map(doc => doc.toObject()));
  }).then(() => {
      console.log('Data copied successfully');
  }).catch(err => {
      console.error('Error copying data:', err);
  });
})

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


async function getCommonExamFormats() {
  try {
    return await CommonExamFormat.find(); // Adjust the query if needed
  } catch (error) {
    console.error('Error fetching common exam formats:', error);
    throw error; // Propagate the error
  }
}

// Route to get all common exam formats
router.get('/getAllCommonExamFormats', async (req, res) => {
  try {
    const examFormats = await getCommonExamFormats();
    res.json(examFormats);
  } catch (error) {
    res.status(500).send('Error fetching common exam formats');
  }
});

router.get('/getAllExamFormats', async (req, res) => {
  try {
    const instituteId = req.query.instituteId;

    // Fetch common exam formats
    const commonExamFormats = await getCommonExamFormats();
    console.log('common exam formats', commonExamFormats)

    // Fetch institute-specific exam formats
    const examFormats = await ExamFormat.find({ instituteId });

    console.log('exam formats', examFormats)

    // Extract examIds from common exam formats
    const commonExamIds = commonExamFormats.map(format => format.examId);

    // Filter institute-specific exam formats to exclude those present in common exam formats
    const filteredCommonExamFormats = commonExamFormats.filter(format => !examFormats.includes(format.examId));

    // Combine common and filtered institute-specific exam formats
    const combinedExamFormats = [...filteredCommonExamFormats, ...examFormats];

    // Send the combined records as JSON
    res.json(combinedExamFormats);
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
