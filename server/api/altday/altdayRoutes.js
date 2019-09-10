var router = require('express').Router();
var controller = require('./altdayController');
//var auth = require('../../auth/auth');

// authentication middleware for secured routes
//const authMiddleware = [auth.decodeToken(), auth.refreshUser()];

// middleware to make sure signed in user is also the user
// editing/deleting the post
const matchIds = (req, res) => {
	return (req, res) => {
		if(req.user._id !== req.post._id){
			res.status(401).send('Invalid alternative day!');
		} else {
			next();
		}
	};
};

router.param('id', controller.params);

//TODO: secure routes and test
// uncomment auth and authmiddleware

router.route('/')
  .get(controller.get) // get all dates / user-specific dates
  .post(controller.post) // add a new date

router.route('/:id')
  .get(controller.getOne) // get specific date
  .put(controller.put) // update a date details (not users)
  .delete(controller.delete) // delete a date


module.exports = router;
