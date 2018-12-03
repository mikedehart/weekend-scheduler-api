const router = require('express').Router();
const controller = require('./controller');
const verifyUser = require('./auth').verifyUser;
const getLDAP = require('./auth').getLDAP;

const decode = require('./auth').decodeToken;

const authMiddleware = [getLDAP, verifyUser()];

//TODO: Possible to change these to post? Browser needed, but
// browser can't issue POST request directly so maybe not possible.

// Use decodeToken to check for valid JWT.
// If doesn't exist, caught by error handler with 'UnauthorizedError'
// We'll redirect to /ldap to sign in with LDAP and generate new token
router.get('/signin', decode(), (req, res, next) => {
	//redirect to the client's mainpage
	if(!req.referer) {
		res.status(500).send('Missing referer from redirect.');
	} else {
		console.log(req.referer);
	}
	console.log(req.user);
	res.json(req.user);
});

// LDAP sign-in. First, check for JWT (above)
// if doesn't exist, redirect here for LDAP signin
router.get('/ldap', authMiddleware, controller.ldap);

module.exports = router;