const User = require('./userModel');
const _ = require('lodash');
const signToken = require('../../auth/auth').signToken;

// For temp saving of iCal file
const fs = require('fs');

// Find user by ID, if available, and attach it to req.user
exports.params = (req, res, next, id) => {
	User.findById(id).then((user) => {
		if(!user) {
			// user doesn't exist. display login page.
			res.status(404).send("User not found!");
		} else {
			req.user = user;
			next();
		}
	}, (err) => {
		next(err);
	});
};

// Get single user based on ID
exports.getOne = (req, res, next) => {
	let user = req.user;
	res.json(user);
};

// Get single user based on JWT token.
// decodeToken() middleware needs to be called first.
// Then, user id should be attached to req.user
exports.getUser = (req, res, next) => {
	if(!req.user || !req.user._id) {
		res.status(401).send('No ID!');

	} else {
		let userId = req.user._id;
		User.findById(userId).then((user) => {
			if(!user) {
				// user doesn't exist. display login page.
				res.status(401).send("User not found!");
			} else {
				res.json(user);
			}
		}, (err) => {
			next(err);
		});
	}
};


exports.write = (req, res, next) => {
	if(!req.query) {
		res.status(501).send('No parameters received!');
	} else {
		const _startTime = req.query.start,
			_endTime = req.query.end,
			_user = req.query.user,
			_date = req.query.date,
			_email = req.query.email,
			_mgr_email = req.query.mgr,
			_id = req.query.id;

		let calString = 
			`BEGIN:VCALENDAR\r\n` +
			`BEGIN:VEVENT\r\n` +
			`UID:${_id}\r\n` +
			`ORGANIZER:${_email}\r\n` +
			`DTSTART:${_startTime}\r\n` +
			`DTEND:${_endTime}\r\n` +
			`ATTENDEE:${_email}\r\n` +
			`ATTENDEE:${_mgr_email}\r\n` +
			`DESCRIPTION:Alternative date:\\nDate: ${_date}\\nUser: ${_user}\r\n` +
			`SUMMARY;LANGUAGE=en-us:Alternative Date for ${_user}\r\n` +
			`BEGIN:VALARM\r\n` +
			`TRIGGER:-PT15M\r\n` +
			`ACTION:DISPLAY\r\n` +
			`END:VALARM\r\n` +
			`END:VEVENT\r\n` +
			`END:VCALENDAR\r\n`;

		const fileName = `${_user}_${_id}.ics`;

		let stream = fs.createWriteStream('/tmp/'+fileName);

		stream.on('open', function(fd) {
			stream.write(calString);
			stream.close();
		});
		stream.on('close', function(fd) {
			fs.open(`/tmp/${fileName}`, 'r', (err, fd) => {
				if(err) {
					if(err.code === 'ENOENT') {
						console.error('iCal file does not exist!');
						next(err);
					}
					next(err);
				} else {
					res.send(fileName);
				}
			});
		});
	}
};


exports.download = (req, res, next) => {
	const fileName = req.params.file;
	if(!fileName) {
		console.error('No file specified!');
	} else {
		res.setHeader('Content-Disposition', 'attachment; filename="/tmp/'+fileName+'"');
		res.setHeader('Content-Type', 'text/calendar;charset=utf-8');
		let reader = fs.createReadStream('/tmp/'+fileName);
		reader.pipe(res);
	}
};

// Get all users
exports.get = (req, res, next) => {
	User.find({})
		.then((users) => {
			res.json(users);
		}, (err) => {
			next(err);
		});
};

// Update a user
exports.put = (req, res, next) => {
	let user = req.user;
	let update = req.body;

	_.merge(user, update);

	user.save((err, saved) => {
		if(err) {
			next(err);
		} else {
			res.json(saved);
		}
	});
};

// Create a user
exports.post = (req, res, next) => {
	if(!req.body) {
		res.status(500).send("No user details given!");
	} else {
		let newUser = new User(req.body);
		newUser.save((err, user) => {
			if(err) {
				next(err);
			} else {
				res.json(user);
			}
		});
	}
};

// Delete a user
exports.delete = (req, res, next) => {
	if(!req.user) {
		res.status(500);
		next(new Error("No user id given!"));
	} else {
		req.user.remove((err, removed) => {
			if(err) {
				next(err);
			} else {
				res.json(removed);
			}
		});
	}
};