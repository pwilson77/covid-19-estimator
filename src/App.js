/* eslint linebreak-style: ["error", "windows"] */
const express = require('express');

import covid19ImpactEstimator from "./estimator";

const app = express();
let covidData;

app.listen(3000, () => {
 console.log('Server running on port 3000');
});

app.post('/api/v1/on-covid-19', (req, res) => {
  covidData = covid19ImpactEstimator(req);
});

app.get('/api/v1/on-covid-19/json', (req, res) => {
  res.send(covidData);
});

app.get('/api/v1/on-covid-19/xml', (req, res) => {
  res.send(covidData);
});
