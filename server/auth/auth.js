const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../config/config');
const checkToken = expressJwt({ secret: config.secrets.jwt });
const User = require('../api/user/userModel');
const ntlm = require('express-ntlm');
const logger = require('../util/logger');
const fs = require('fs');
const globalinum = require('os').userInfo().username;

exports.decodeToken = () => {
	return (req, res, next) => {
		// Adding token to header if placed in query string
		if(req.query && req.query.hasOwnProperty('access_token')) {
			req.headers.authorization = 'Bearer ' + req.query.access_token;
		}
		// call next if token is valid, or send error if it is not.
		// decoded token attached to req.user
		checkToken(req, res, next);
	};
};


// Called after decodeToken so we still have a user
// attached to req.user. If JWT token was valid, but no
// user details available, the user was changed or deleted
// since issue of token. Get fresh user information from
// the database.
exports.refreshUser = () => {
	return (req, res, next) => {
		if(!req.user) {
			res.status(401).send("No user information available!");
			//next(new Error('No user information available'));
		} else {
			let userId = req.user._id;
			User.findById(userId)
				.then((user) => {
					if(!user) {
						// If user is not found, likely deleted and 
						// old JWT hanging around. Send to controller
						// and redirect to re-sign in.
						//res.status(401).send("No user with given id present.");
						//res.redirect('/auth/signin');
						//next(new Error('No user with decoded ID. Maybe deleted?'));
						res.status(401).send("No user with given ID present!");
					} else {
						req.user = user;
						next();
					}
				})
				.catch(err => next(err));
		}
	}
}

// Authorize against LDAP server. Might prompt for username / pass?
// Information is stored in res.locals.ntlm and req.ntlm if successful
exports.getLDAP = ntlm({
	debug: function() {
			const args = Array.prototype.slice.apply(arguments);
			logger.log(args);
		},
	forbidden: function(req, res, next) {
			console.log(req.ntlm.UserName);
			console.log(res.locals.ntlm.Authenticated);
			res.status(403);
			res.setHeader('WWW-Authenticate', 'NTLM');
			res.send('Forbidden!');
		},
	unauthorized: function(req, res, next) {
		console.log('unauth');
		const tst = Array.prototype.slice.apply(arguments);
		console.log.apply(null, tst);
		res.status(400);
		res.send('unauth');
	},
	badrequest: function(req, res, next) {
		console.log('bad');
		const tst = Array.prototype.slice.apply(res);
		console.log(res.locals.UserName);
		console.log(res.locals.ntlm.Authenticated);
		res.status(500);
		res.send('bad');
	},
	domain: config.ldap.domain,
	domaincontroller: config.ldap.domaincontroller,
	tlsOptions: {
		ca: fs.readFileSync('./server/config/ldap.pem'),
		rejectUnauthorized: false
	}
});

// Middleware that runs after getLDAP, if LDAP was successful,
// Check database the Inumber and fetch user info, or if nothing
// in the database, just send the i-number.
exports.verifyUser = () => {
	return (req, res, next) => {
		// if(!req.ntlm || !req.ntlm.Authenticated) {
		// 	//User wasn't LDAP authorized.
		// 	// Shouldn't reach this point anyway,
		// 	// but checking again to be safe.
		// 	res.status(401).send('Unauthorized! User has not beed authenticated.');
		// 	return;
		// } else {
			//let iNumber = req.ntlm.UserName;
			let iNumber = globalinum;
			User.findOne({ inum: iNumber })
				.then((user) => {
					if(!user) {
						// Valid I-num but not in database. Redirect to signup page
						//res.status(404).send("No user exists with that I-Number.");
						req.inum = iNumber;
						next();
					} else {
						user.updateLogin(user._id);
						req.user = user;
						next();
					}
				})
				.catch((err) => next(err));
	//	}
	};
};


// Method to sign JWT tokens after successful authentication
// Signs based on _id in the database.
exports.signToken = (id) => {
	logger.log('Signing token with ID: '+ id);
	return jwt.sign({ _id: id }, config.secrets.jwt,
		{ expiresIn: config.expireTime });
};