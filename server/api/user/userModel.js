
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	inum: {
		type: String,
		required: true,
		unique: true,
		index: true,
		minlength: 7,
		maxlength: 7

	}
	product: {
		type: String,
		required: true,
		maxlength: 3
	},
	designation: {
		type: String,
		maxlength: 3
	},
	lastlogin: {
		type: Date,
		default: new Date()
	}
});

// userSchema.pre() // use for logic prior to save

userSchema.methods = {
	// define methods for schema here
}
module.exports = mongoose.model('user', userSchema);