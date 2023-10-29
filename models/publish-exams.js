const mongoose = require('mongoose');
const destinationConnection = mongoose.createConnection('mongodb+srv://hitheshchm:aDpw4bk4cqJ9bzmT@cluster0.ditmjg6.mongodb.net/exam_platform');

// Candidate Model
const destinationCandidateSchema = new mongoose.Schema({
    exam_id: String,
    firstName: String,
    lastName: String,
    email: String
});

const DestinationCandidate = destinationConnection.model('Candidate', destinationCandidateSchema);

// Exam Model
const destinationExamSchema = new mongoose.Schema({
      institute_id: String,
      exam_id: String,
      exam_name: String,
      owner: String,
      collaborators: [String],
      exam_type: String,
      is_active: Boolean,
      negativeMarking: Boolean,
      negativeMarksValue: Number,
      duration: Number,
      activePeriod: {
          startDate: Date,
          endDate: Date
      },
      total_marks: Number
});

const DestinationExam = destinationConnection.model('Exam', destinationExamSchema);

// Topics Model
const destinationTopicSchema = new mongoose.Schema({
      exam_id: String,
      topic_id: String,
      topic_name: String,
      description: String,
      marks: Number,
      no_of_questions: Number
});

const DestinationTopic = destinationConnection.model('Topic', destinationTopicSchema);

// Question Model
const destinationQuestionSchema = new mongoose.Schema({
      exam_id: String,
      topic_id: String,
      question_id: String,
      question_text: String,
      question_type: String,
      options: [String],
      correct_answer: String,
      difficulty_level: String,
      marks: Number
});

const DestinationQuestion = destinationConnection.model('Question', destinationQuestionSchema);


module.exports = {
      DestinationCandidate,
      DestinationTopic,
      DestinationQuestion,
      DestinationExam,
};
