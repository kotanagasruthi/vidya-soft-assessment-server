const { connection2 } = require('../database');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const destinationCandidateSchema = new mongoose.Schema({
      exam_id: String,
      firstName: String,
      lastName: String,
      email: String
  });

  const DestinationCandidate = connection2.model('Candidate', destinationCandidateSchema);
  module.exports = DestinationCandidate;
