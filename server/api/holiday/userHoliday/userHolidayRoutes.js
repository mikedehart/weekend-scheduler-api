const router = require('express').Router();
const logger = require('../../../util/logger');
const controller = require('./userHolidayController');
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

/*
	Routes for user functions relating to dates:
	add user, delete user, etc.
	Syntax for calling (2 IDs required!):
	.../api/dates/user/<date_id> id=<user_id>

*/

router.param('id', controller.params)

router.route('/')
	.get(getUserId(), controller.get) // get all dates for specific user

router.route('/:id')
	.put(getUserId(), controller.put) // add user to date
	.delete(getUserId(), controller.delete) // delete user from date

module.exports = router;