const router = require('express').Router();
const logger = require('../../../util/logger');
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


router.param('id', controller.params)

router.route('/')
	.get(getUserId(), controller.get)

router.route('/:id')
	.put(getUserId(), controller.put)
	.delete(getUserId(), controller.delete)

module.exports = router;