const express = require('express');

// local requires
const logger = require('./util/logger');
const config = require('./config/config');
const auth = require('./auth/routes');
const api = require('./api/routes');

const cronjob = require('./util/dateCron');

const app = express();


require('mongoose').connect(config.db.url, config.db.options);

// setup app middleware
require('./middleware/middleware')(app);

// Setup API and Auth routes
app.use('/api', api);
app.use('/auth', auth);

// Global error handling
app.use((err, req, res, next) => {
	// Error thrown from jwt validation check
	// If token invalid or doesn't exist, redirect to LDAP signin
	if (err.name === 'UnauthorizedError') {
		logger.log('UnauthorizedError hit, redirecting to /ldap')
		res.redirect('/auth/ldap');
		return;
	}

	logger.error(err.stack);
	res.status(500).send(err.stack);
});

// export the app for testing
module.exports = app;