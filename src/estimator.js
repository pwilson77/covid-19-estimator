/* eslint-disable max-len */
/* eslint-disable linebreak-style */

const covid19ImpactEstimator = (data) => {
  const {
    region, periodType, timeToElapse, totalHospitalBeds, reportedCases,
  } = data;

  const impact = { currentlyInfected: reportedCases * 10 };
  const severeImpact = { currentlyInfected: reportedCases * 50 };

  let powerFactor;
  let days;
  
  if (periodType === 'months') {
    days = timeToElapse * 30;
    powerFactor = Math.trunc((timeToElapse * 30) / 3);
  } else if (periodType === 'weeks') {
    days = timeToElapse * 7
    powerFactor = Math.trunc((timeToElapse * 7) / 3);
  } else {
    powerFactor = Math.trunc(timeToElapse / 3);
    days = timeToElapse
  }

  impact.infectionsByRequestedTime = Math.trunc(impact.currentlyInfected * (2 ** powerFactor));
  severeImpact.infectionsByRequestedTime = Math.trunc(severeImpact.currentlyInfected * (2 ** powerFactor));

  impact.severeCasesByRequestedTime = Math.trunc(0.15 * impact.infectionsByRequestedTime);
  severeImpact.severeCasesByRequestedTime = Math.trunc(0.15 * severeImpact.infectionsByRequestedTime);

  const dedicatedBeds = 0.35 * totalHospitalBeds;
  impact.hospitalBedsByRequestedTime = Math.trunc(dedicatedBeds - impact.severeCasesByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(dedicatedBeds - severeImpact.severeCasesByRequestedTime);

  impact.casesForICUByRequestedTime = Math.trunc(0.05 * impact.infectionsByRequestedTime);
  severeImpact.casesForICUByRequestedTime = Math.trunc(0.05 * severeImpact.infectionsByRequestedTime);

  impact.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * impact.infectionsByRequestedTime);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * severeImpact.infectionsByRequestedTime);

  impact.dollarsInFlight = Math.trunc((impact.infectionsByRequestedTime * region.avgDailyIncomeInUSD * region.avgDailyIncomePopulation) / days);
  severeImpact.dollarsInFlight = Math.trunc((severeImpact.infectionsByRequestedTime * region.avgDailyIncomeInUSD * region.avgDailyIncomePopulation) / days);

  return {
    data, impact, severeImpact,
  };
};

export default covid19ImpactEstimator;
