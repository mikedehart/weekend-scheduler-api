/*

	Cron job to import dates in mongo database.
	- Needs to account for weekend holidays (so no overlap)
	- Run at the beginning of a quarter to populate the next quarter's dates(?)


*/

const CronJob = require('cron').CronJob;

// example
// var CronJob = require('cron').CronJob;
// var job = new CronJob('00 30 11 * * 1-5', function() {
  
//    * Runs every weekday (Monday through Friday)
//    * at 11:30:00 AM. It does not run on Saturday
//    * or Sunday.
   
//   }, function () {
//     /* This function is executed when the job stops */
//   },
//   true, /* Start the job right now */
//   timeZone /* Time zone of this job. */
// );