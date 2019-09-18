/**********************************************************************
	Holiday Calculator
	- Mike DeHart

	- Functions for importing and adding Holidays to the database.
	- Requires holidays.csv file in root dir
	- Used by dateCron.js
***********************************************************************/

const Holidays = require('../api/holiday/holidayModel');
const Dates = require('../api/date/dateModel');
const logger = require('./logger');
const fs = require('fs');
const config = require('../config/config');


exports.readHolidays = (csvFile) => {
	const data = fs.readFileSync((process.cwd() + '/' + csvFile), 'utf-8', function(err, data) {
		if(err) throw err;
		return data;
	});
	let dateArray = data.split('\r\n');
	let objArray = [];

	dateArray.map((holiday) => {
		let arr = holiday.split(', ');
		objArray.push(new Object({
			dateid: parseInt(arr[0], 10),
			date: arr[1],
			day: arr[2],
			qtr: parseInt(arr[3], 10),
			month: parseInt(arr[4], 10),
			year: parseInt(arr[5], 10),
			desc: arr[6]
		}));
	});

	return objArray;
};

exports.addHolidays = (holidays) => {
	return new Promise((resolve, reject) => {
		const _dates = holidays;
		// Logging file
		const holidayYear = _dates[0].year;
		const archivedFile = `${config.logger.holidays}holidays_${holidayYear}.csv`;
		const products = ['ASE', 'IQ', 'REP'];
		try {
			_dates.forEach((holiday) => {
				products.forEach((prod) => {
					holiday.product = prod;
					Holidays.create(holiday)
						.then((date) => {
							logger.log(`Holiday added: ${date.date} ${date.year} ${date.desc}`);
						})
						.catch((err) => {
							logger.error('Error adding holiday: ', err.stack);
							return reject(err);
						});
				});
			 });
		} catch (err) { 
			logger.error('Error adding holidays: ', err.stack);
			return reject(err);
		}
		return resolve(_dates);
	});
};

exports.archiveHolidays = (original_file, new_file) => {
	const _file = original_file;
	const _archive = new_file;
	fs.copyFile(_file, _archive, (err) => {
		if(err) {
			logger.error('Error copying file to archive: ', err.stack);
			throw err;
		}
		logger.log('Holiday file copied to archive.');
		fs.unlink(_file, (err) => {
			if(err) {
				logger.error('Error deleting original file!');
				throw err;
			}
			logger.log('Original file deleted');
		})
	});
};

//TODO: fix this. get all dates and compare?
// Need to get dates to compare. Worth it?
// Maybe only compare if the holiday is a sat/sun
exports.removeDupDates = (dates) => {
	return new Promise((resolve, reject) => {
		const _dates = dates.filter;
		try {

			_dates.forEach((date) => {

				Dates.remove({ dateid: date.dateid })
					.then((date) => {
						if(!date)
							logger.log(`No duplicate, skipping...`);
						else
							logger.log(`Date: ${date.date} removed.`);

					})
					.catch((err) => reject(err));
			});
		} catch (err) {
			logger.error('Error removing duplicate days');
			reject(err);
		}
		resolve(_dates);
	});
};