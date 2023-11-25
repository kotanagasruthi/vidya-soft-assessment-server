const mongoose = require('mongoose');

const commonQuestionSchema = new mongoose.Schema({
      topic_name: String,
      question_id: String,
      question_text: String,
      question_type: String,
      options: [String],
      correct_answer: String,
      difficulty_level: String,
      marks: Number,
      question_marks: Number
});

const commonTopicSchema = new mongoose.Schema({
      topic_name: String,
      description: String,
      marks: Number,
      no_of_questions: Number,
      question_marks: Number,
      questions: [commonQuestionSchema]
});

const commonInviteeSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String
});

const commonExamSchema = new mongoose.Schema({
  examFormatId: String,
  examType: String,
  topics: [commonTopicSchema],
  negativeMarking: Boolean,
  negativeMarksValue: Number,
  duration: Number,
  totalMarks: Number,
  activePeriod: {
    startDate: Date,
    endDate: Date
  },
  commonFormat: Boolean,
  invitees: [commonInviteeSchema]
});

const CommonExamFormat = mongoose.model('common_exam_formats', commonExamSchema);

module.exports = CommonExamFormat;
