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
	console.log(err.name);
	console.log(err.stack);
	if (err.name === 'UnauthorizedError') {
		logger.log('UnauthorizedError hit!');
		console.log("AUTH: ", req.headers.authorization);
		if(req.headers.authorization && req.headers.authorization !== 'Bearer null') {
			logger.log("Auth header present, redirecting to tokenfail.");
			res.status(401).send("Invalid Token!");
			return;
		} else {
			logger.log("No auth header present, redirecting to ldap to authorize.");
			res.redirect('/auth/ldap');
			return;
		}
		return;
	} else {
		logger.error(err.stack);
		res.status(500).send(err.stack);
	}
});

// export the app for testing
module.exports = app;