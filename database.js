const mongoose = require('mongoose');

const mongoURI2 = 'mongodb+srv://hitheshchm:aDpw4bk4cqJ9bzmT@cluster0.ditmjg6.mongodb.net/exam_platform';

const connection2 = mongoose.createConnection(mongoURI2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongoURI3 = 'mongodb+srv://hitheshchm:aDpw4bk4cqJ9bzmT@cluster0.ditmjg6.mongodb.net/vidhya_soft_db';

const connection3 = mongoose.createConnection(mongoURI3, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  connection2,
  connection3
};
