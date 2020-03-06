const _ = require('lodash');

const config = {
	dev: 'development',
	prod: 'production',
	port: process.env.NODE_PORT || 3000,
	expireTime: 24 * 60 * 60 * 365 // 1 year
	//expireTime: 30 // 30 seconds for testing
};

// default to dev if no environment variable set
process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

let envConfig;

// If file doesn't exist, require could error out
try {
	envConfig = require('./' + config.env);
	// make sure require got something back
	envConfig = envConfig || {};
} catch(err) {
	envConfig = {};
}
// merge two config files together. envConfig will overwrite
// redundancies on config object.
module.exports = _.merge(config, envConfig);