const _ = require('lodash');

const config = {
	dev: 'development',
	prod: 'production',
	port: process.env.NODE_PORT || 5000,
	expireTime: 24 * 60 * 60 * 10 // 10 days
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