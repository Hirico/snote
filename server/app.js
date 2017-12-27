/**
 * Initialize an express object 'app' and return(export) it
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const apis = require('./apis');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));

// Serve api stuff
app.use('/apis', apis);

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Return the main index.html, unless api so react-router render the route in the client
// app.get('/', (req, res) => {
//   const userid = req.universalCookies.get('userid');
//   console.log(userid);
//   if (userid === undefined) {
//     res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
//     res.redirect('/apis/signin');
//   } else {
//     res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
//   }
// });

module.exports = app;
