/*

	Cron job to import dates in mongo database.
	- Needs to account for weekend holidays (so no overlap)
	- Run at the beginning of a quarter to populate the next quarter's dates(?)

*/

const CronJob = require('cron').CronJob;
const weekends = require('./weekendCalc');
const holidays = require('./holidayCalc');
const Quarters = require('../api/quarter/quarterModel');
const config = require('../config/config');
const fs = require('fs');

/*********************
 Weekend CronJob
 *********************/

// Updates at 9pm on 1st of Oct for the next year.
// 30-second job for testing
//let job = new CronJob('30 * * * * *', function() {
let dateJob = new CronJob('00 00 21 01 09 *', function() {
	let date = new Date();
	//let yr = date.getFullYear() +1;
	// testing for same year
	let yr = date.getFullYear();
	let products = ['ASE', 'IQ', 'REP', 'BRAZIL'];
	for(let i = 0; i<12;i++) {
		let monthlyWeekends = weekends.getWeekends(i, yr);
		let qtrVal = weekends.getQtr(i);

		// Doesn't work great...
		// Qtrs all created, but still throw error for duplicate qtrs (see quarterModel)
		Quarters.findOneOrCreate({quarter: qtrVal, year: yr}, {quarter: qtrVal, year: yr, locked: true})
			.then((res) => {
				console.log("Qtr added/confirmed: ", res.quarter, res.year);
			})
			.catch((err) => {
				console.error("Error creating qtr: ", err);
			});

		for(let y = 0; y<products.length; y++) {
			monthlyWeekends.map((wknd) => {
				wknd.product = products[y];
			});
			weekends.addWeekends(monthlyWeekends);
		}
	}

}, function() {
	console.log('dateJob stopped');
}, true, 'America/New_York');

/*********************
 Holiday CronJob
 *********************/

// 30-second job for testing
//let job2 = new CronJob('10 * * * * *', function() {
// Runs every Friday at 9pm
let holidayJob = new CronJob('00 00 21 * * 05', function() {
	if(fs.existsSync('holidays.csv')) {
		const holidayArray = holidays.readHolidays('holidays.csv');
		if(holidayArray) {
			holidays.addHolidays(holidayArray)
				.then((dates) => {
					if(!dates) {
						console.error('No dates returned!');
					}
					const holidayYear = dates[0].year;
					const archivedFile = `${config.logger.holidays}holidays_${holidayYear}.csv`;
					//TODO: need to fix this. 
					// holidays.removeDupDates(dates)
					// 	.then((dates) => {
					// 		holidays.archiveHolidays('holidays.csv', archivedFile);
					// 	})
					// 	.catch((err) => {
					// 		console.error(err);
					// 		throw new Error(err);
					// 	});
				})
				.catch((err) => {
					console.error(err);
					throw new Error(err);
				});
		}
	} else {
		console.log('No holiday file exists! Skipping...');
	}

}, function() {
	console.log('holidayJob stopped');
}, true, 'America/New_York');