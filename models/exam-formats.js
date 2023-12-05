const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
      institute_id: String,
      topic_name: String,
      subtopic_name: String,
      question_id: String,
      question_text: String,
      question_type: String,
      options: [String],
      correct_answer: String,
      difficulty_level: String,
      marks: Number,
      question_marks: Number
});

const subTopicSchema = new mongoose.Schema({
      subtopic_name: String,
      subtopic_description: String,
      questions: [questionSchema]
});

const topicSchema = new mongoose.Schema({
      topic_name: String,
      description: String,
      marks: Number,
      no_of_questions: Number,
      question_marks: Number,
      sub_topics: [subTopicSchema]
});

const inviteeSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String
});

const examSchema = new mongoose.Schema({
      instituteId: String,
      examFormatId: String,
      examType: String,
      topics: [topicSchema],
      negativeMarking: Boolean,
      negativeMarksValue: Number,
      duration: Number,
      totalMarks: Number,
      activePeriod: {
      startDate: Date,
      endDate: Date
      },
      invitees: [inviteeSchema]
});

const ExamFormat = mongoose.model('exam_formats', examSchema);

module.exports = ExamFormat;
