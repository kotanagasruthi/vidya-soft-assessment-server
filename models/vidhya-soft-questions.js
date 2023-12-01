const mongoose = require('mongoose');
const { connection3 } = require('../database')
const Schema = mongoose.Schema;

const vidyaSoftTopicSchema = new Schema({
    question_id: String,
    question_text: String,
    question_type: String, //enum: ['multipleChoice', 'trueFalse', 'shortAnswer', 'essay', 'matching', 'fillInTheBlanks'],
    options: [String],
    correct_answer: String,
    difficulty_level: String,
    tags: [String],
    topic_name: String,
    subtopic_name: String
});

const Question = connection3.model('common-questions', vidyaSoftTopicSchema);

module.exports = Question;
