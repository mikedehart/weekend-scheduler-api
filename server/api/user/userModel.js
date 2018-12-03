
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require('../../util/logger');


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

	},
	product: {
		type: String,
		required: true,
		maxlength: 3,
		validate: [productLimit, 'Invalid product!']
	},
	designation: {
		type: String,
		maxlength: 3,
		default: "TSE",
		validate: [designationLimit, 'Invalid designation!']
	},
	lastlogin: {
		type: Date,
		default: new Date()
	}
});

function productLimit(val) {
	return (['ASE','IQ','REP'].indexOf(val) > -1);
}

function designationLimit(val) {
	return (['TSE','TSM'].indexOf(val) > -1)
}

// userSchema.pre() // use for logic prior to save
// Make sure 'I' in i-num is uppercase
userSchema.pre('save', function(next) {
	this.inum = this.inum.toUpperCase();
	next();
})

userSchema.methods = {
	// define methods for schema here
	updateLogin: function(id) {
		return this.model('user').findByIdAndUpdate(
			{ _id: id},
			{ lastlogin: new Date()},
			{ new: true }, (err, doc) => {
			if(err) {
				logger.error(err);
			}
			logger.log('Last login time updated');
		});
	}
};
module.exports = mongoose.model('user', userSchema);