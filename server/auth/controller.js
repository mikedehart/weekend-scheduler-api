const User = require('../api/user/userModel');
const signToken = require('./auth').signToken;
const config = require('../config/config');
const logger = require('../util/logger');

// If only inum avaiable from req.user, then user doesn't
// exist in database.
exports.ldap = (req, res, next) => {

	// Redirect to local hostname, otherwise cookie will not save.
	// To work, API and frontend must be running on same machine!
	// Use config value as discrepancy between running on server
	// and Windows machine (dev).
	const clientURL = config.host.url;
	if (!req.user) {
		const inum = req.inum;
		logger.log('Sending inum: ', inum);
		logger.log('Redirecting to', clientURL);
		res.cookie('inum', inum);
		res.redirect(302, clientURL);

	} else {
		const token = signToken(req.user._id);
		logger.log('Sending token: ', token);
		logger.log('Redirecting to', clientURL);
		res.cookie('token', token);
		res.redirect(302, clientURL);
	}
};

// Request/response test route:
// exports.test = (req, res, next) => {
// 	console.log("USER: ", req.user);
// 	console.log("BODY: ", req.body);
// 	res.json(req.user);
// };