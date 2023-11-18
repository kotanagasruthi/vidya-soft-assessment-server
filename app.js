const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();

app.use(session({
  secret: 'vidya_soft_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true
  }
  // store: MongoStore.create({
  //     client: mongoose.connection.getClient()
  // })
}));

app.use((req, res, next) => {
  // console.log('Session data:', req.session);
  next();
});


const userRoutes = require('./routes/users');
const instituteRoutes = require('./routes/institutes');
const examRoutes = require('./routes/exams');
const topicRoutes = require('./routes/topics');
const questionRoutes = require('./routes/questions');
const inviteesRoute = require('./routes/invitees')
const examFormatRoutes = require('./routes/exam-formats');
const commonExamFormatRoutes = require('./routes/common-exam-formats');
const publishExamRoutes = require('./routes/publish-exam');

app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/institutes', instituteRoutes);
app.use('/exams', examRoutes);
app.use('/topics', topicRoutes);
app.use('/questions', questionRoutes);
app.use('/invitees', inviteesRoute);
app.use('/exam-format', examFormatRoutes);
app.use('/common-exam-formats', commonExamFormatRoutes)
app.use('/publish-exam', publishExamRoutes)
const port = 3000;


const shortid = require('shortid');

// Use the CORS middleware
app.use(cors());

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ origin: 'http://localhost:8080' }));

// Connect to your MongoDB Atlas cluster
const mongoURI = 'mongodb+srv://hitheshchm:aDpw4bk4cqJ9bzmT@cluster0.ditmjg6.mongodb.net/assesment_platform';
const mongoURI2 = 'mongodb+srv://hitheshchm:aDpw4bk4cqJ9bzmT@cluster0.ditmjg6.mongodb.net/exam_platform';

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB successfully');
    // const connection2 = await mongoose.createConnection(mongoURI2, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    // console.log('Connected to second MongoDB successfully');
    // module.exports = {
    //   connection2
    // };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

const destinationExam = require('./models/published-exam');
const destinationTopic = require('./models/published-topics');
const destinationQuestions= require('./models/published-questions');
const destinationCandidates = require('./models/pusblished-candidates');

app.get('/collections', async (req, res) => {
  try {
    const collectionNames = await mongoose.connection.db.listCollections().toArray();
    res.json(collectionNames.map(collection => collection.name));
  } catch (err) {
    console.error('Error fetching collections:', err);
    res.status(500).send('Server error');
  }
});

app.get('/getDestinationExam', async (req, res) => {
  try {
    const exams = await destinationExam.find(); // Fetch all records

    // Send the records as JSON
    res.json(exams);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});


app.get('/getDestinationTopics', async (req, res) => {
  try {
    const topics = await destinationTopic.find(); // Fetch all records

    // Send the records as JSON
    res.json(topics);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});


app.get('/getDestinationQuestions', async (req, res) => {
  try {
    const questions = await destinationQuestions.find(); // Fetch all records

    // Send the records as JSON
    res.json(questions);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});


app.get('/getDestinationCandidates', async (req, res) => {
  try {
    const candidates = await destinationCandidates.find(); // Fetch all records

    // Send the records as JSON
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});


app.delete('/deleteDestinationExam', async (req, res) => {
  try {
    await destinationExam.deleteMany({});
    res.status(200).send('All exams deleted successfully.');
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});


app.delete('/deleteDestinationTopics', async (req, res) => {
  try {
    await destinationTopic.deleteMany({});
     res.status(200).send('All exams deleted successfully.');
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});


app.delete('/deleteDestinationQuestions', async (req, res) => {
  try {
    await destinationQuestions.deleteMany({});
    res.status(200).send('All exams deleted successfully.');
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});


app.delete('/deleteDestinationCandidates', async (req, res) => {
  try {
    await destinationCandidates.deleteMany({});
    res.status(200).send('All exams deleted successfully.');
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});


app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
