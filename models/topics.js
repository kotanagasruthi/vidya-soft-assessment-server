const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
    institute_id: String,
    topic_name: String,
    description: String
});

const Topic = mongoose.model('topics', TopicSchema);

module.exports = Topic;
