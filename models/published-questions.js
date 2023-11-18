const { connection2 } = require('../database');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const destinationQuestionSchema = new mongoose.Schema({
      exam_id: String,
      topic_name: String,
      question_id: String,
      question_text: String,
      question_type: String,
      options: [String],
      correct_answer: String,
      difficulty_level: String,
      marks: Number
});

const DestinationQuestion = connection2.model('Question', destinationQuestionSchema);
module.exports = DestinationQuestion;
