var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./quarterController');
var auth = require('../../auth/auth');

// authentication middleware for secured routes
const authMiddleware = [auth.decodeToken(), auth.refreshUser()];

// middleware to make sure signed in user is also the user
// editing/deleting the post
const matchIds = (req, res) => {
	return (req, res) => {
		if(req.user._id !== req.post._id){
			res.status(401).send('Invalid quarter!');
		} else {
			next();
		}
	};
};

router.param('id', controller.params);

router.route('/')
  .get(controller.get) // get all quarters

router.route('/:id')
  .get(controller.getOne) // get specific quarter
  .put(authMiddleware, controller.put) // update a quarter (unlock/lock qtr)


module.exports = router;
