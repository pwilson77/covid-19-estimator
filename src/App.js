/* eslint-disable linebreak-style */
import covid19ImpactEstimator from './estimator';

const express = require('express');

const bodyParser = require('body-parser');

const { toXML } = require('jstoxml');

const app = express();

const fs = require('fs');

const PORT = process.env.PORT || 3000;

const logger = fs.createWriteStream('./src/log.txt', {
  flags: 'a',
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

let covidData;

app.listen(PORT, () => {});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/api/v1/on-covid-19', (req, res) => {
  const start = Date.now();
  covidData = covid19ImpactEstimator(req.body);
  res.send(covidData);
  const end = Math.floor(Date.now() - start).toString().padStart(2, 0);
  logger.write(`POST /api/v1/on-covid-19    ${res.statusCode}   ${end}ms \n`);
});

app.post('/api/v1/on-covid-19/json', (req, res) => {
  const start = Date.now();
  const durationInMilliseconds = getDurationInMilliseconds(start);
  res.set('Content-Type', 'application/json');
  res.send(covidData);
  const end = Math.floor(Date.now() - start).toString().padStart(2, 0);
  logger.write(`POST /api/v1/on-covid-19/json   ${res.statusCode}   ${end}ms \n`);
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
  const start = Date.now();
  const durationInMilliseconds = getDurationInMilliseconds(start);
  res.set('Content-Type', 'application/xml');
  res.send(toXML(covidData));
  const end = Math.floor(Date.now() - start).toString().padStart(2, 0);
  logger.write(`POST /api/v1/on-covid-19/xml   ${res.statusCode}   ${end}ms \n`);
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  const start = Date.now();
  const durationInMilliseconds = getDurationInMilliseconds(start);
  res.set('Content-Type', 'text/plain');
  fs.readFile('./src/log.txt', 'utf8', (err, data) => {
    if (err) throw err;
    res.send(data);
  });
  const end = Math.floor(Date.now() - start).toString().padStart(2, 0);
  logger.write(`GET /api/v1/on-covid-19/logs   ${res.statusCode}   ${end}ms \n`);
});
