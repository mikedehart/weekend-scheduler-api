/**********************************************************************
	Weekend Calculator
	- Mike DeHart

	- A set of functions for calculating, formatting, and saving weekend dates to the database.
	- Used by dateCron.js
***********************************************************************/


const Dates = require('../api/date/dateModel');
const logger = require('./logger');

/* Returns all the Sat/Sun dates for a given month.

	Parameters:
	month = int representation of month to search (actual month - 1)
	year = int value of year to search

	Follows JS Date conventions: 0 = Jan, 1 = Feb, ..., 11 = Dec

	Returns:
	weekends = array of weekend date objects for the month in the form:
	{date: MM/dd/yyyy, day: 'Sat|Sun' qtr: 1-4 month: 1-12 year: YYYY}

*/


exports.getWeekends = (month, year) => {
	const _year = parseInt(year, 10);
	const _month = parseInt(month, 10);
	const currentMonth = _month;
	let qtr = getQtr(_month);
	let initialDate = new Date(_year, _month, 1);
	let weekends = [];

	while (initialDate.getMonth() === currentMonth) {
		if(initialDate.getDay() === 6) {
			let zeroMonth = ("0" + (initialDate.getMonth() +1)).slice(-2);
			let zeroDay = ("0" + (initialDate.getDate())).slice(-2);
			weekends.push({
				dateid: parseInt(zeroMonth + zeroDay + initialDate.getFullYear()),
				date: ''+(initialDate.getMonth()+1)+"/"+initialDate.getDate()+"/"+initialDate.getFullYear(),
				day: 'Sat',
				qtr: qtr,
				month: initialDate.getMonth()+1,
				year: initialDate.getFullYear()
			});
		}
		if(initialDate.getDay() === 0) {
			let zeroMonth = ("0" + (initialDate.getMonth() +1)).slice(-2);
			let zeroDay = ("0" + (initialDate.getDate())).slice(-2);
			weekends.push({
				dateid: parseInt(zeroMonth + zeroDay + initialDate.getFullYear()),
				date: ''+(initialDate.getMonth()+1)+"/"+initialDate.getDate()+"/"+initialDate.getFullYear(),
				day: 'Sun',
				qtr: qtr,
				month: initialDate.getMonth()+1,
				year: initialDate.getFullYear()
			});
		}
		initialDate.setDate(initialDate.getDate() + 1);
	}
	return weekends;
};

// Array of weekends passed here to be added to the DB.
exports.addWeekends = (weekends) => {
	const allWeekends = weekends;
	try {
		console.log('ADDING WEEKENDS: ', allWeekends);
		allWeekends.forEach((weekend) => {
			Dates.create(weekend)
				.then((date) => {
					logger.log(`Date added: ${date}`);
				})
				.catch((e) => {
					logger.error(e)
				});
	});
	} catch (err) {
		logger.error(`Error adding weekends: ${err.stack}`);
	}
};


function getQtr(month) {
	let _month = parseInt(month, 10);
	switch(_month) {
		case 0:
		case 1:
		case 2:
			return 1;
			break;
		case 3:
		case 4:
		case 5:
			return 2;
			break;
		case 6:
		case 7:
		case 8:
			return 3;
			break;
		case 9:
		case 10:
		case 11:
			return 4;
			break;
		default:
			return null;
	}
};