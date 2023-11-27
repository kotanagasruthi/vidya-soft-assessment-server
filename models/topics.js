const mongoose = require('mongoose');

const subTopicSchema = new mongoose.Schema({
    subtopic_name:String,
    subtopic_description:String
});

const TopicSchema = new mongoose.Schema({
    institute_id: String,
    topic_name: String,
    description: String,
    sub_topics: [subTopicSchema]
});

const Topic = mongoose.model('topics', TopicSchema);

module.exports = Topic;
