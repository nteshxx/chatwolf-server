const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const httpStatus = require('http-status');
const { errorConverter, errorHandler } = require('./middlewares/error');
const routes = require('./routes');

dotenv.config();
const app = express();

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());
app.use(mongoSanitize());
// gzip compression
app.use(compression());
// enable cors
app.use(cors());
app.options('*', cors());
// morgan for logging reqs
app.use(morgan('dev'));

app.use(routes);

// 404 error for unknown API requests
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json('Not found. It is under supervision!');
  next();
});

// convert error to APIError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);

module.exports = app;
