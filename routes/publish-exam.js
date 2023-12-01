const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router();
const SourceExam = require('../models/exams');
const SourceTopic = require('../models/topics');
const SourceQuestion = require('../models/questions');
const SourceUsers = require('../models/users');
const DestinationSchema = require('../models/publish-exams');
const nodemailer = require('nodemailer');
const cors = require('cors');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cors({
      origin: 'http://localhost:8080', // Replace with the exact URL of your Vue.js frontend
      credentials: true
    }));

router.get('/publish', async (req, res) => {

      try {
            const exam_id = req.query.exam_id
            // Fetch data from the source database
            const exams = await SourceExam.find({ exam_id });
            let exam_name = exams[0].exam_name
            let candidates = exams[0].invitees;
            let topics = exams[0].topics;
            let questions = topics.reduce((acc, topic) => {
                  let subTopicQuestions = topic.sub_topics.reduce((subAcc, subTopic) => {
                        return subAcc.concat(subTopic.questions);
                  }, []);
                  return acc.concat(subTopicQuestions);
            }, []);


            const finalExamRecord = {
                  institute_id: exams[0].institute_id,
                  exam_id: exams[0].exam_id,
                  exam_name: exams[0].exam_name,
                  owner: exams[0].owner,
                  collaborators: exams[0].collaborators,
                  exam_type: exams[0].exam_type,
                  is_active: true,
                  negativeMarking: exams[0].negativeMarking,
                  negativeMarksValue: exams[0].negativeMarksValue,
                  duration: exams[0].duration,
                  activePeriod: exams[0].activePeriod,
                  total_marks: exams[0].totalMarks
            }

            DestinationSchema.DestinationExam.create(finalExamRecord)
            .then(res => {
                  console.log("Exams Inserted successfully:", res);
            })
            .catch(err => {
                  console.error("Error inserting:", err);
            });

            const destinationTopics = topics.map(topic => ({
                  exam_id: exam_id,
                  topic_name: topic.topic_name,
                  description: topic.description,
                  marks: topic.marks,
                  no_of_questions: topic.no_of_questions,
                  sub_topics: topic.sub_topics
            }));


            DestinationSchema.DestinationTopic.insertMany(destinationTopics)
            .then(res => {
                  console.log("Topics Inserted successfully:", res);
            })
            .catch(err => {
                  console.error("Error inserting:", err);
            });

            const destinationQuestions = questions.map(question => ({
                  topic_name: question.topic_name,
                  subtopic_name: question.subtopic_name,
                  question_id: question.question_id,
                  question_text: question.question_text,
                  question_type: question.question_type,
                  options: question.options,
                  correct_answer: question.correct_answer,
                  difficulty_level: question.difficulty_level,
                  exam_id: exam_id,
                  marks: 1,
                  tags: question.tags
            }));


            DestinationSchema.DestinationQuestion.insertMany(destinationQuestions)
            .then(res => {
                  console.log("Questions Inserted successfully:", res);
            })
            .catch(err => {
                  console.error("Error inserting:", err);
            });

            const destinationCandidates = candidates.map(candidate => ({
                  firstName: candidate.firstName,
                  lastName: candidate.lastName,
                  email: candidate.email,
                  exam_id: exam_id
            }));


            DestinationSchema.DestinationCandidate.insertMany(destinationCandidates)
            .then(res => {
                  console.log("Candidates Inserted successfully:", res);
            })
            .catch(err => {
                  console.error("Error inserting:", err);
            });

            let emails = destinationCandidates.map(candidate => candidate.email);
            let emailString = emails.join(', ');

            const examUrl = `https://your-exam-platform.com/exams/${exam_id}`;

            let transporter = nodemailer.createTransport({
                  service: 'gmail', // Example using Gmail. Use your own configurations.
                  auth: {
                    user: 'nagasruthikota@gmail.com', // Your email
                    pass: 'ozbu oocd cfpi pvye' // Your password
                  }
                });

                let mailOptions = {
                  from: 'nagasruthikota@gmail.com',
                  to: emailString,
                  subject: `${exam_name} Exam Link`,
                  text: `Here's your unique exam link: ${examUrl}`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.log('Error occurred:', error);
                  } else {
                    console.log('Email sent:', info.response);
                  }
                });

            const updatedExam = await SourceExam.findOneAndUpdate(
                  { exam_id },
                  { is_active: true },
                  { new: true } // Returns the updated document
                );

            if (updatedExam) {
                  res.json({ success: true, message: 'Exam Published Successfully!!!' });
              } else {
                  res.status(404).json({ success: false, message: 'Exam not found' });
              }

            } catch (error) {
                  console.error("Error populating data:", error);
            }
})

module.exports = router;
