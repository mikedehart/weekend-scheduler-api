const User = require('./userModel');
const _ = require('lodash');
const signToken = require('../../auth/auth').signToken;

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
	if(!req.user._id) {
		res.status(400).send('No ID!');
	} else {
		let id = req.user._id;
		User.findById(id).then((user) => {
			if(!user) {
					// user doesn't exist. display login page.
				res.status(404).send("User not found!");
			} else {
				res.json(user);
			}
		}, (err) => {
			next(err);
		});
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
		console.log(newUser);
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
		next(new Error("No user details given"));
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