/*

	Cron job to import dates in mongo database.
	- Needs to account for weekend holidays (so no overlap)
	- Run at the beginning of a quarter to populate the next quarter's dates(?)

*/

const CronJob = require('cron').CronJob;
const weekends = require('./weekendCalc');
const Quarters = require('../api/quarter/quarterModel');


// Updates on Dec 1 for the next year.
//let job = new CronJob('30 * * * * *', function() {
let job = new CronJob('00 00 09 01 11 *', function() {
	let date = new Date();
	let yr = date.getFullYear() +1;
	let products = ['ASE', 'IQ', 'REP'];
	for(let i = 0; i<12;i++) {
		let monthlyWeekends = weekends.getWeekends(i, yr);
		let qtrVal = weekends.getQtr(i);

		Quarters.findOneOrCreate({quarter: qtrVal, year: yr}, {quarter: qtrVal, year: yr})
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
	console.log('job stopped');
}, true, 'America/New_York');