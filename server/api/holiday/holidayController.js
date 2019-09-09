var Holidays = require('./holidayModel');
var _ = require('lodash');
var logger = require('../../util/logger');

/*
  If ID is sent, params called first to match with date
  then date saved to req.holiday.
*/

exports.params = function(req, res, next, id) {
  Holidays.findById(id)
    .populate('users', 'username')
    .exec()
    .then(function(holiday) {
      if (!holiday) {
        next(new Error('No date with that id'));
      } else {
        req.holiday = holiday;
        next();
      }
    }, function(err) {
      next(err);
    });
};

/*
	Get holiday dates.
	- If query params set, return output based on those
	- Note: product MUST be sent or query is not read
	- Otherwise, return all holidays
*/

exports.get = function(req, res, next) {
  if (!req.query.product) {
    Holidays.find({})
    .populate('users', 'username')
    .sort({ dateid: 1})
    .exec()
    .then(function(dates){
      res.json(dates);
    }, function(err){
      next(err);
    });
  } else {
    // TODO: add default value if a param isn't included?
    const _year = req.query.year || "";
    const _product = req.query.product || "";
    Holidays.find({
      year: _year,
      product: _product
    })
    .populate('users', 'username')
    .sort({ dateid: 1})
    .exec()
    .then(function(dates) {
      res.json(dates);
    }, function(err) {
      next(err);
    });
  }
};

/*

	Get a single date (assumes id was passed). Should
	be assigned to req.holiday

*/

exports.getOne = function(req, res, next) {
  var holiday = req.holiday;
  res.json(holiday);
};


/*

	Below are PUT/POST/DELETE values for
	updating, adding, deleting dates. 
	- These are NOT used by the front-end. Dates
	are auto-generated though dateCron.js
	- Kept here for emergency date fixing.

*/
exports.put = function(req, res, next) {
  var holiday = req.holiday;
  var update = req.body;

  _.merge(holiday, update);

  holiday.save(function(err, saved) {
    if (err) {
      next(err);
    } else {
      res.json(saved);
    }
  })
};

exports.post = function(req, res, next) {
  var newdate = req.body;
  Holidays.create(newdate)
    .then(function(date) {
      res.json(date);
    }, function(err) {
      logger.error(err);
      next(err);
    });
};

exports.delete = function(req, res, next) {
  req.holiday.remove(function(err, removed) {
    if (err) {
      next(err);
    } else {
      res.json(removed);
    }
  });
};