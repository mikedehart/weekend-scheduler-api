var Quarters = require('./quarterModel');
var _ = require('lodash');
var logger = require('../../util/logger');

exports.params = function(req, res, next, id) {
	Quarters.findById(id)
		.exec()
		.then(function(qtr) {
			if(!qtr) {
				next(new Error('No quarter with that id!'));
			} else {
				req.qtr = qtr;
				next();
			}
		}, function(err) {
			next(err);
		});
};

exports.get = function(req, res, next) {
	if(!req.query.year) {
		Quarters.find({})
			.sort({ year: 1, quarter: 1})
			.exec()
			.then(function(qtrs) {
				res.json(qtrs);
			}, function(err) {
				next(err);
			});
	} else {
		const _yr = req.query.year;
		const _qtr = req.query.quarter || "";
		const _locked = req.query.locked || "";
		Dates.find({
			year: _yr,
			quarter: _qtr,
			locked: _locked
		})
		.sort({ year: 1, quarter: 1})
		.exec()
		.then(function(qtrs) {
			res.json(qtrs);
		}, function(err) {
			next(err);
		});
	}
};

exports.put = function(req, res, next) {
	let qtr = req.qtr;

	let update = req.body;
	_.merge(qtr, update);

	qtr.save(function(err, saved) {
		if(err) {
			next(err);
		} else {
			res.json(saved);
		}
	})
};

exports.getOne = function(req, res, next) {
	let qtr = req.qtr;
	res.json(qtr);
};


