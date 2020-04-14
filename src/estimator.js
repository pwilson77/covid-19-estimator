/* eslint-disable max-len */
/* eslint-disable linebreak-style */

const covid19ImpactEstimator = (data) => {
  const {
    region, periodType, timeToElapse, totalHospitalBeds, reportedCases,
  } = data;

  const impact = { currentlyInfected: reportedCases * 10 };
  const severeImpact = { currentlyInfected: reportedCases * 50 };

  let powerFactor;
  if (periodType === 'days') {
    powerFactor = Math.trunc(timeToElapse / 3, 10);
  } else if (periodType === 'weeks') {
    powerFactor = Math.trunc((timeToElapse * 7) / 3, 10);
  } else {
    powerFactor = Math.trunc((timeToElapse * 30) / 3, 10);
  }

  impact.infectionsByRequestedTime = impact.currentlyInfected * 2 ** powerFactor;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * 2 ** powerFactor;

  impact.severeCasesByRequestedTime = Math.trunc(0.15 * impact.infectionsByRequestedTime, 10);
  severeImpact.severeCasesByRequestedTime = Math.trunc(0.15 * severeImpact.infectionsByRequestedTime, 10);

  const dedicatedBeds = Math.trunc(0.35 * totalHospitalBeds, 10);
  impact.hospitalBedsByRequestedTime = dedicatedBeds - impact.severeCasesByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime = dedicatedBeds - severeImpact.severeCasesByRequestedTime;

  impact.casesForICUByRequestedTime = Math.trunc(0.05 * impact.infectionsByRequestedTime, 10);
  severeImpact.casesForICUByRequestedTime = Math.trunc(0.05 * severeImpact.infectionsByRequestedTime, 10);

  impact.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * impact.infectionsByRequestedTime, 10);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * severeImpact.infectionsByRequestedTime, 10);

  impact.dollarsInFlight = Math.trunc((impact.infectionsByRequestedTime * region.avgDailyIncomeInUSD * region.avgDailyIncomePopulation) / 30, 10);
  severeImpact.dollarsInFlight = Math.trunc((severeImpact.infectionsByRequestedTime * region.avgDailyIncomeInUSD * region.avgDailyIncomePopulation) / 30, 10);

  return {
    data, impact, severeImpact,
  };
};

export default covid19ImpactEstimator;
