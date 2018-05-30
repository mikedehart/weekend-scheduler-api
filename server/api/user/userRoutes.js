const _ = require('lodash');
const User = require('./userModel');

exports.params = function(req, res, next, id) {
	User.findById(id).then((user) => {
		if(!user) {
			// user doesn't exist. display login page.

		} else {
			req.user = user;
			next();
		}
	}, (err) => {
		next(err);
	});
};

