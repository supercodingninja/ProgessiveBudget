const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');

const PORT = 3000;

const app = express();

app.use(logger('dev'));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/budget', {
  useNewUrlParser: true,
  useFindAndModify: false,

  // These two  fixes all deprecated warnings.  Ref. https://mongoosejs.com/docs/deprecations.html
  useCreateIndex: true,

  // More Ref. https://mongodb.github.io/node-mongodb-native/3.3/reference/unified-topology/
  useUnifiedTopology: true,
});

// routes
app.use(require('./routes/api.js'));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});