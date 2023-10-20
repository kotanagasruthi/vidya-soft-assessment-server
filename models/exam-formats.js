const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
      topic_id: String,
      question_id: String,
      question_text: String,
      question_type: String,
      options: [String],
      correct_answer: String,
      difficulty_level: String,
      marks: Number
});

const topicSchema = new mongoose.Schema({
      institute_id: String,
      topic_id: String,
      topic_name: String,
      description: String,
      marks: Number,
      no_of_questions: Number,
      questions: [questionSchema]
});

const inviteeSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String
});

const examSchema = new mongoose.Schema({
  examFormatId: String,
  examType: String,
  topics: [topicSchema],
  negativeMarking: Boolean,
  negativeMarksValue: Number,
  duration: Number,
  activePeriod: {
    startDate: Date,
    endDate: Date
  },
  invitees: [inviteeSchema]
});

const ExamFormat = mongoose.model('exam_formats', examSchema);

module.exports = ExamFormat;