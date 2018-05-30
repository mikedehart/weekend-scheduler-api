const express = require('express');

// local requires
const logger = require('./util/logger');
const config = require('./config/config');

const app = express();

require('mongoose').connect(config.db.url, config.db.options);

if(config.seed) {
	require('./util/seed');
}

// setup app middleware
require('./middleware/middleware')(app);

// setup the API
// TODO: set up API


// set up global error handling
app.use((err, req, res, next) => {
	// error thrown from jwt validation check
	if (err.name === 'UnauthorizedError') {
		res.status(401).send('Invalid token!');
		return;
	}

	logger.error(err.stack);
	res.status(500).send('ERROR');
});

module.exports = app;