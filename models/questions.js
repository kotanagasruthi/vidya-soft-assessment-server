const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  topic_name: String,
  subtopic_name: String,
  question_id: String,
  question_text: String,
  question_type: String, //enum: ['multipleChoice', 'trueFalse', 'shortAnswer', 'essay', 'matching', 'fillInTheBlanks'],
  options: [String],
  correct_answer: String,
  difficulty_level: String,
  tags: [String]
});

const Question = mongoose.model('questions', questionSchema);
module.exports = Question;
