const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const userRoutes = require('./routes/users');
const instituteRoutes = require('./routes/institutes');
const examRoutes = require('./routes/exams');
const topicRoutes = require('./routes/topics');
const questionRoutes = require('./routes/questions');

const app = express();

app.use('/users', userRoutes);
app.use('/institutes', instituteRoutes);
app.use('/exams', examRoutes);
app.use('/topics', topicRoutes);
app.use('/questions', questionRoutes);
const port = 3000;


const shortid = require('shortid');

// Use the CORS middleware
app.use(cors());

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to your MongoDB Atlas cluster
const mongoURI = 'mongodb+srv://hitheshchm:aDpw4bk4cqJ9bzmT@cluster0.ditmjg6.mongodb.net/assesment_platform';

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
      client: mongoose.connection.getClient()
  })
}));

app.get('/collections', async (req, res) => {
  try {
    const collectionNames = await mongoose.connection.db.listCollections().toArray();
    res.json(collectionNames.map(collection => collection.name));
  } catch (err) {
    console.error('Error fetching collections:', err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
