/* eslint-disable max-len */
/* eslint-disable linebreak-style */

const covid19ImpactEstimator = (data) => {
  const {
    region, periodType, timeToElapse, population, totalHospitalBeds, reportedCases,
  } = data;

  const impact = { currentlyInfected: reportedCases * 10};
  const severeImpact = { currentlyInfected: reportedCases * 50 };

  let powerFactor;
  if (periodType === 'days') {
    powerFactor = parseInt(timeToElapse / 3, 10);
  } else if (periodType === 'weeks') {
    powerFactor = parseInt((timeToElapse * 7) / 3, 10);
  } else {
    powerFactor = parseInt((timeToElapse * 30) / 3, 10);
  }

  impact.infectionsByRequestedTime = impact.currentlyInfected * 2 ** powerFactor;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * 2 ** powerFactor;

  impact.severeCasesByRequestedTime = parseInt(0.15 * impact.infectionsByRequestedTime, 10);
  severeImpact.severeCasesByRequestedTime = parseInt(0.15 * severeImpact.infectionsByRequestedTime, 10);

  const dedicatedBeds = parseInt(0.35 * totalHospitalBeds, 10);
  impact.hospitalBedsByRequestedTime = dedicatedBeds - impact.severeCasesByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime = dedicatedBeds - severeImpact.severeCasesByRequestedTime;

  impact.casesForICUByRequestedTime = parseInt(0.05 * impact.infectionsByRequestedTime, 10);
  severeImpact.casesForICUByRequestedTime = parseInt(0.05 * severeImpact.infectionsByRequestedTime, 10);

  impact.casesForVentilatorsByRequestedTime = parseInt(0.02 * impact.infectionsByRequestedTime, 10);
  severeImpact.casesForVentilatorsByRequestedTime = parseInt(0.02 * severeImpact.infectionsByRequestedTime, 10);

  impact.dollarsInFlight = parseInt((impact.infectionsByRequestedTime * region.avgDailyIncomeInUSD * region.avgDailyIncomePopulation) / 30, 10);
  severeImpact.dollarsInFlight = parseInt((severeImpact.infectionsByRequestedTime * region.avgDailyIncomeInUSD * region.avgDailyIncomePopulation) / 30, 10);

  return {
    data, impact, severeImpact,
  };
};

export default covid19ImpactEstimator;
