const { connection2 } = require('../database');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const destinationTopicSchema = new mongoose.Schema({
      exam_id: String,
      topic_id: String,
      topic_name: String,
      description: String,
      marks: Number,
      no_of_questions: Number
});

const DestinationTopic = connection2.model('Topic', destinationTopicSchema);
module.exports = DestinationTopic;
