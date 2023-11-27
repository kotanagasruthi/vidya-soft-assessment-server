const mongoose = require('mongoose');
const { connection3 } = require('../database')
const Schema = mongoose.Schema;


const vidyaSubTopicsSchema = new Schema({
    subtopic_name:String,
    subtopic_description:String
})
const vidyaSoftTopicSchema = new Schema({
    topic_name: String,
    sub_topics: [vidyaSubTopicsSchema],
    description: String
});

const Topic = connection3.model('common-topics', vidyaSoftTopicSchema);

module.exports = Topic;
