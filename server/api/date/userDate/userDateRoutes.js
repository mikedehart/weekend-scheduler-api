const router = require('express').Router();
const controller = require('./userDateController');
const auth = require('../../../auth/auth');

const getUserId = (req, res, next) => {
	return (req, res, next) => {
		if(!req.body.id) {
			res.status(400).send('No Id parameter sent with request!');
			return;
		}
		next();
	}
};

const authMiddleware = [auth.decodeToken(), auth.refreshUser(), getUserId()];

/*
	Routes for user functions relating to dates:
	add user, delete user, etc.
	Syntax for calling (2 IDs required!):
	.../api/dates/user/<date_id> id=<user_id>

*/

router.param('id', controller.params)

router.route('/')
	.get(authMiddleware, controller.get) // get all dates for specific user

router.route('/:id')
	.put(authMiddleware, controller.put) // add user to date
	.delete(authMiddleware, controller.delete) // delete user from date

module.exports = router;