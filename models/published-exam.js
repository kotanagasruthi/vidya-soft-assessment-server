const { connection2 } = require('../database');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const destinationExamSchema = new mongoose.Schema({
      institute_id: String,
      exam_id: String,
      exam_name: String,
      owner: String,
      collaborators: [String],
      exam_type: String,
      is_active: Boolean,
      negativeMarking: Boolean,
      negativeMarksValue: Number,
      duration: Number,
      activePeriod: {
          startDate: Date,
          endDate: Date
      },
      total_marks: Number
});

const DestinationExam = connection2.model('Exam', destinationExamSchema);

module.exports = DestinationExam;
