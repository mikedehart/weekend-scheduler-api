const User = require('../api/user/userModel');
const signToken = require('./auth').signToken;

// If only inum avaiable from req.user, then user doesn't
// exist in database.
exports.ldap = (req, res, next) => {
	const refUrl = req.headers.referer;
	if(!req.user) {
		const inum = req.inum;
		console.log('Sending inum: ', inum);
		console.log('Redirecting to', refUrl);
		res.cookie('inum', inum);
		res.redirect(302, refUrl);

	} else {
		const token = signToken(req.user._id);
		console.log('Sending token: ', token);
		console.log('Redirecting to', refUrl);
		res.cookie('token', token);
		res.redirect(302, refUrl);
	}
};