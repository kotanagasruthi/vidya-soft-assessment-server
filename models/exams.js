const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examSchema = new Schema({
    institute_id: String,
    exam_id: String,
    exam_name: String,
    owner: String,
    collaborators: [String],
    exam_type: String,
    is_active: Boolean
});

const Exam = mongoose.model('exams', examSchema);

module.exports = Exam;
