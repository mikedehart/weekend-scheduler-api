const Dates = require('../dateModel');
const User = require('../../user/userModel');
const _ = require('lodash');
const logger = require('../../../util/logger');

exports.params = function(req, res, next, id) {
  Dates.findById(id)
    .populate('users', 'username')
    .exec()
    .then(function(date) {
      if (!date) {
        next(new Error('No date with that id'));
      } else {
        req.date = date;
        next();
      }
    }, function(err) {
      next(err);
    });
};


// Get all dates that user is assigned to
exports.get = function(req, res, next) {
	Dates.find({ 'users': req.body.id })
      .then((dates) => {
        res.json(dates);
      }, (err) => next(err));
};

/*******
 ID-specific routes below
********/

// Add a user to a date
exports.put = function(req, res, next) {
	// check if user already exists for this date
	let userExists = _.some(req.date.users, function(user) {
		return user._id.toString() === req.body.id;
	});
	console.log(userExists);
	if(req.date.users.length >= 2) {
		res.status(500).send('Selected date is already full');
		return;
	} else if(userExists) {
		res.status(500).send('User is alredy registered for this day');
		return;
	} else {
		let newUser = { _id: req.body.id };
		User.findById(newUser)
			.then((user) => {
				if(req.date.product !== user.product) {
					res.status(500).send('User/date products do not match!');
				} else {
					Dates.findOneAndUpdate({ _id: req.date._id }, 
					    { $push: { users: user._id }},
					    {new: true })
					    .then((updatedDate) => {
					      res.json(updatedDate);
					    })
					    .catch((err) => {
					    	logger.error(err);
					    	res.status(500).send('Error adding user to date');
					    });
				}
			})
			.catch(err => {
				logger.error(err);
				res.status(500).send('User does not exist in database!');
			});
	}
};


// Delete a user from a date
exports.delete = function(req, res, next) {
	let deletedUser = req.body.id;
	Dates.findOneAndUpdate({ _id: req.date._id },
    { $pull: { users: deletedUser }},
    {new: true, safe: true})
    .exec()
    .then((updatedDate) => {
      res.json(updatedDate);
    }, (err) => next(err))
};