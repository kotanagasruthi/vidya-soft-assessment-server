const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router();
const ExamFormat = require('../models/exam-formats');
const CommonExamFormat = require('../models/common-exam-formats');
const shortid = require('shortid');
const cors = require('cors');
router.use(cors({
  origin: 'http://localhost:8080', // Replace with the exact URL of your Vue.js frontend
  credentials: true
}));

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// router.get('/copyExamFormats', async (req,res) => {
//   ExamFormat.find().then(docs => {
//       return CommonExamFormat.insertMany(docs.map(doc => doc.toObject()));
//   }).then(() => {
//       console.log('Data copied successfully');
//   }).catch(err => {
//       console.error('Error copying data:', err);
//   });
// })

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

    const commonExamFormats = await getCommonExamFormats();

    const examFormats = await ExamFormat.find({ instituteId });

    const commonExamIds = commonExamFormats.map(format => format.examFormatId);

    const filteredCommonExamFormats = commonExamFormats.filter(format => !examFormats.includes(format.examFormatId));

    // const combinedExamFormats = [...filteredCommonExamFormats, ...examFormats];

    res.json(filteredCommonExamFormats);
  } catch (error) {
    res.status(500).send('Error fetching records');
  }
});

router.post('/importExamFormats', async (req, res) => {
  try {
    const { examFormatIds, instituteId } = req.body;

    // Fetch the exam formats from common-exam-formats
    const commonExamFormats = await CommonExamFormat.find({
      examFormatId: { $in: examFormatIds.map(id => id.toString()) }
    });

    // Prepare the data for exam-formats
    const examFormatsToInsert = commonExamFormats.map(format => {
        return { ...format.toObject(), instituteId: instituteId };
    });

    // Insert the data into exam-formats
    await ExamFormat.insertMany(examFormatsToInsert);

    res.status(200).json({ message: 'Exam formats copied successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error in copying exam formats', error: error });
  }
})

router.get('/getAllInstituteExamFormats', async (req, res) => {
  try {
    const instituteId = req.query.instituteId;
    const examFormats = await ExamFormat.find({ instituteId });
    res.json(examFormats);
  } catch (error) {
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
