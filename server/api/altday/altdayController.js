var Altdays = require('./altdayModel');
var _ = require('lodash');

/*
  If ID is sent, params called first to match with altday
  then altday saved to req.altday.
*/

exports.params = function(req, res, next, id) {
  Altdays.findById(id)
    .populate('userId', 'username')
    .populate('dateId', 'date')
    .exec()
    .then(function(date) {
      if (!date) {
        next(new Error('No date with that id'));
      } else {
        req.altday = date;
        next();
      }
    }, function(err) {
      next(err);
    });
};


/*
  Get altdays.
  - If both userId and dateId are passed, search on that
  - If user_id param passed, search on that
  - Otherwise, return all dates
*/

exports.get = function(req, res, next) {
  if (!req.query.userId || !req.query.dateId) {
  	console.log('none triggered', req.query);
    Altdays.find({})
    .populate('userId', 'username')
    .populate('dateId', 'date')
    .exec()
    .then(function(dates) {
      res.json(dates);
    }, function(err) {
      next(err);
    });
  } else if(!req.query.dateId) {
  	console.log('user triggered');
    const _user_id = req.query.userId || "";
    Altdays.find({
      userId: user_id
    })
    .populate('userId', 'username')
    .populate('dateId', 'date')
    .sort({ dateId: 1 })
    .exec()
    .then(function(dates) {
      res.json(dates);
    }, function(err) {
      next(err);
    });
  } else {
  	console.log('both triggered');
  	let _userId = req.query.userId || '';
	let _dateId = req.query.dateId || '';
	Altdays.find({
		userId: _userId,
		dateId: _dateId
	})
	.populate('userId', 'username')
	.populate('dateId', 'date')
	.exec()
	.then(function(date) {
		res.json(date);
	}, function() {
		next(err);
	});
  }
};


// Get single altday based on id (unused in app)
exports.getOne = function(req, res, next) {
  var altday = req.altday;
  res.json(altday);
};



/*
	Update an altday (most likely to insert an altday)

*/

exports.put = function(req, res, next) {
	let altday = req.altday;
	let update = req.body;

	_.merge(altday, update);

	altday.save(function(err, saved) {
		if(err) {
			next(err);
		} else {
			res.json(saved);
		}
	})
};

/*
	Add a new alt day (once a date is selected)

*/

exports.post = function(req, res, next) {
	let newalt = req.body;
	Altdays.create(newalt)
		.then(function(altday) {
			res.json(altday);
		}, function(err) {
			next(err);
		});
};

exports.delete = function(req, res, next) {
	req.altday.remove(function(err, removed) {
		if(err) {
			next(err);
		} else {
			res.json(removed);
		}
	});
};