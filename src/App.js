/* eslint-disable linebreak-style */
import covid19ImpactEstimator from './estimator';

const express = require('express');

const bodyParser = require('body-parser');

const { toXML } = require('jstoxml');

const app = express();

const fs = require('fs');

const PORT = process.env.PORT || 3000;

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const logger = fs.createWriteStream('./src/log.txt', {
  flags: 'a', // 'a' means appending (old data will be preserved)
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let covidData;

app.listen(PORT, () => {
  console.log('the server has started on port 3000');
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/api/v1/on-covid-19', (req, res) => {
  const start = process.hrtime();
  const durationInMilliseconds = getDurationInMilliseconds(start);

  logger.write(`POST /api/v1/on-covid-19    ${res.statusCode}   ${durationInMilliseconds}ms \n`);
  covidData = covid19ImpactEstimator(req.body);
  res.send(covidData);
});

app.get('/api/v1/on-covid-19/json', (req, res) => {
  const start = process.hrtime();
  const durationInMilliseconds = getDurationInMilliseconds(start);

  logger.write(`GET /api/v1/on-covid-19/json   ${res.statusCode}   ${durationInMilliseconds}ms \n`);
  res.send(covidData);
});

app.get('/api/v1/on-covid-19/xml', (req, res) => {
  const start = process.hrtime();
  const durationInMilliseconds = getDurationInMilliseconds(start);

  logger.write(`GET /api/v1/on-covid-19/xml   ${res.statusCode}   ${durationInMilliseconds}ms \n`);
  res.set('Content-Type', 'application/xml');
  res.send(toXML(covidData));
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  const start = process.hrtime();
  const durationInMilliseconds = getDurationInMilliseconds(start);

  logger.write(`GET /api/v1/on-covid-19/logs   ${res.statusCode}   ${durationInMilliseconds}ms \n`);
  res.attachment('./src/log.text');
  fs.readFile('./src/log.txt', 'utf8', (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});
