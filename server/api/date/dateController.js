var Dates = require('./dateModel');
var _ = require('lodash');
var logger = require('../../util/logger');

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

exports.get = function(req, res, next) {
  // If query params are set, return output based on those
  // otherwise, return all dates (big list!)
  if (!req.query.product) {
    Dates.find({})
    .populate('users', 'username')
    .sort({ dateid: 1})
    .exec()
    .then(function(dates){
      res.json(dates);
    }, function(err){
      next(err);
    });
  } else {
    //const _qtr = parseInt(req.query.qtr, 10);
    //const _year = parseInt(req.query.year, 10);
    const _qtr = req.query.qtr;
    const _year = req.query.year;
    const _product = req.query.product;
    Dates.find({
      qtr: _qtr,
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

exports.getSpecific = function(req, res, next) {

};

exports.getOne = function(req, res, next) {
  var date = req.date;
  res.json(date);
};

exports.put = function(req, res, next) {
  var date = req.date;

  var update = req.body;
  console.log(req.body);

  _.merge(date, update);

  console.log(date);

  date.save(function(err, saved) {
    if (err) {
      next(err);
    } else {
      res.json(saved);
    }
  })
};

exports.post = function(req, res, next) {
  var newdate = req.body;
  console.log(newdate);
  Dates.create(newdate)
    .then(function(date) {
      res.json(date);
    }, function(err) {
      logger.error(err);
      next(err);
    });
};

exports.delete = function(req, res, next) {
  req.date.remove(function(err, removed) {
    if (err) {
      next(err);
    } else {
      res.json(removed);
    }
  });
};
