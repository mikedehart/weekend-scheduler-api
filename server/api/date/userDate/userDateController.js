const Dates = require('../dateModel');
const User = require('../../user/userModel');
const AltDays = require('../../altday/altdayModel');
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

/*************************
 ID-specific routes below
**************************/

// Add a user to a date
exports.put = function(req, res, next) {
	// check if user already exists for this date
	let userExists = _.some(req.date.users, function(user) {
		return user._id.toString() === req.body.id;
	});
	// admin override to select multiple dates
	const _designation = req.body.designation;
	if(req.date.users.length >= 2) {
		res.status(500).send('Selected date is already full');
		return;
	} else if(userExists && _designation !== 'TSM' ) {
		res.status(500).send('User is already registered for this day');
		return;
	} else {
		let newUser = { _id: req.body.id };
		User.findById(newUser)
			.then((user) => {
				if(req.date.product !== user.product && _designation !== 'TSM') {
					res.status(500).send('User/date products do not match!');
				} else {
					let userId = user._id;
					Dates.findOneAndUpdate({ _id: req.date._id }, 
					    { $push: { users: userId }},
					    {new: true })
					    .then((updatedDate) => {
					    	let newdate = updatedDate;
					    	// Create corresponding altday
					    	AltDays.create({ 
					    		dateId: updatedDate._id, 
					    		qtr: updatedDate.qtr,
					    		year: updatedDate.year,
					    		userId: userId 
					    		})
					    	.then((altday) => {
					    		altday.populate('userId', 'username')
									.populate('dateId', 'date')
									.execPopulate()
									.then((altday) => {
										res.json({altday, newdate});
									})
									.catch((err) => {
										logger.error(err);
					    				res.status(500).send('Error populating altday');
									})
					    	})
					    	.catch((err) => {
					    		logger.error(err);
					    		res.status(500).send('Error adding altday');
					    	});
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
	if (req.date.users.length === 2 && req.date.users[0].username === req.date.users[1].username) {
		let newArray = [req.date.users[0]];
		Dates.findOneAndUpdate({ _id: req.date._id},
			{ $set: { users: newArray }},
			{new: true, safe: true})
			.exec()
			.then((updatedDate) => {
				let removeDate = updatedDate;
				AltDays.findOne({ dateId: removeDate._id, userId: deletedUser})
					.then((alt) => {
						AltDays.deleteOne(alt)
							.then((altday) => {
								res.json({altday, removeDate});
								// altday.populate('userId', 'username')
								// 	.populate('dateId', 'date')
								// 	.execPopulate()
								// 	.then((altday) => {
								// 		res.json({altday, removeDate});
								// 	})
								// 	.catch((err) => {
								// 		logger.error(err);
					   //  				res.status(500).send('Error populating altday');
								// 	});
							})
							.catch((err) => {
								logger.error(err);
								res.status(500).send('Error deleting altday!');
							})
					})
					.catch((err) => {
						logger.error(err);
						res.status(500).send('Error finding altday!');
					})
			})
			.catch((err) => next(err));
	} else {
		Dates.findOneAndUpdate({ _id: req.date._id },
		    { $pull: { users: deletedUser }},
		    {new: true, safe: true})
		    .exec()
		    .then((updatedDate) => {
		    	let removeDate = updatedDate;
				AltDays.findOne({ dateId: removeDate._id, userId: deletedUser})
					.then((alt) => {
						AltDays.deleteOne(alt)
							.then((altday) => {
								res.json({altday, removeDate});
								// altday.populate('userId', 'username')
								// 	.populate('dateId', 'date')
								// 	.execPopulate()
								// 	.then((altday) => {
								// 		res.json({altday, removeDate});
								// 	})
								// 	.catch((err) => {
								// 		logger.error(err);
					   			//  	res.status(500).send('Error populating altday');
								// 	})
							})
							.catch((err) => {
								logger.error(err);
								res.status(500).send('Error deleting altday!');
							})
					})
					.catch((err) => {
						logger.error(err);
						res.status(500).send('Error finding altday!');
					})
		    }, (err) => next(err));
	}
	
};