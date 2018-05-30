require('colors');
const _ = require('lodash');

const config = require('../config/config');

// no operation function for when logging is disabled
const noOp = function(){};

// Check if logging is enabled, then bind to console.log (for now)
const consoleLog = config.logging ? console.log.bind(console) : noOp;

// arrow functions for methods of 'logger' will retain arguments of parent (logger.js) when called
// so need to use traditional function def here
var logger = {
	log: function() {
		let tag = '[ LOG ]'.green;
		let args = _.toArray(arguments).map((arg) => {
			if(typeof arg === 'object') {
				// if an object, turn to  string so we can log properties
				let str = JSON.stringify(arg);
				return tag + ' ' + str.cyan;
			} else {
				return tag + ' ' + arg.cyan;
			}
		});
		consoleLog.apply(console, args);
	},

	error: function() {
		let tag = '[ ERROR ]';
		let args = _.toArray(arguments).map((arg) => {
			arg = arg.stack || arg;
			let name = arg.name || tag;
			let log = name.red + ' ' + arg.yellow;
			return log;
		});
		consoleLog.apply(console, args);
	}
};

module.exports = logger;