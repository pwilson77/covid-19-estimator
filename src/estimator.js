/* eslint linebreak-style: ["error", "windows"] */

const covid19ImpactEstimator = data => {
  const {region, periodType, timeToElapse, population, totalHospitalBeds, reportedCases } = data;
  
  let currentlyInfected = reportedCases * 10;
  let severeImpact = { currentlyInfected: reportedCases * 50 };
  
  let powerFactor;
  if (periodType === "days") {
    powerFactor = parseInt(timeToElapse / 3, 10);
  } else if (periodType === "weeks") {
      powerFactor = parseInt((timeToElapse * 7) / 3, 10 );
  } else {
    powerFactor = parseInt((timeToElapse * 30) / 3, 10 );
  }

  let infectionsByRequestedTime = {
    impact: currentlyInfected * 2 ** powerFactor,
    severeImpact: severeImpact.currentlyInfected * 2 ** powerFactor,
  };

   let severeCasesByRequestedTime = parseInt((15 / 100) * infectionsByRequestedTime.severeImpact, 10);
   let hospitalBedsByRequestedTime = 
};

export default covid19ImpactEstimator;
