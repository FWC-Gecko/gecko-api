const moment = require('moment');

exports.getUnixTimestamp = (date) => moment(date).unix();

exports.getCurrentTime = () => moment().unix();

exports.getBeforeDaysFromNow = (days) => moment().subtract(days, 'days').unix();

exports.getBeforeMonthsFromNow = (months) =>
  moment().subtract(months, 'months').unix();

exports.getBeforeYearsFromNow = (years) =>
  moment().subtract(years, 'years').unix();

exports.getFirstDayOfThisYear = () => moment().startOf('year').unix();

exports.getFormattedDate = (date) =>
  moment(date).subtract(1, 'days').format('YYYY-MM-DD');
