const express = require('express');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

//  Get env variables
if (process.env.NODE_ENV === 'development') {
  //  development
  require('dotenv').config({ path: './.env.development' });
} else if (process.env.NODE_ENV === 'staging') {
  //  staging
  require('dotenv').config({ path: './.env.staging' });
} else if (process.env.NODE_ENV === 'production') {
  //  production
  require('dotenv').config();
}

// Logger
if (process.env.NODE_ENV != 'production') app.use(morgan('dev'));

// HTTPS response headers
if (process.env.NODE_ENV === 'production')
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
  );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie
app.use(cookieParser());

//  Cors
if (process.env.NODE_ENV === 'production') {
  const origins = process.env.ORIGIN || '';
  app.use(
    cors({
      origin: origins.split(','),
      credentials: true,
    })
  );
} else app.use(cors());

app.use('/public', express.static('public'));

// import routes
const auth = require('./routes/authRoute');
const global = require('./routes/globalRoute');

app.use('/api/v1/auth', auth);
app.use('/api/v1/global', global);

// deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Server is Running! 🚀');
  });
}

// error middleware
app.use(errorMiddleware);

module.exports = app;
