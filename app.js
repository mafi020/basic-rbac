require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const mongodb = require('./server/helpers/mongodb');

const app = express();
app.use(express.json());

const userSession = session({
  secret: '5e26e02f4b52b808d8e510fe',
  name: 'sessions',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 10080 * 60000,
  },
  store: new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
  }),
});
app.use('/users', userSession, require('./server/routes/UserRoute'));
app.use('/', (req, res, next) => {
  res.send('Home Page');
});

mongodb.connect(process.env.MONGO_URI);
app.listen(process.env.PORT);
