const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateSchema = new Schema({
	dateid: {
		type: Number,
		required: true,
		index: true
	},
	date: {
		type: String,
		required: true,
	},
	day: {
		type: String,
		maxlength: 3
	},
	qtr: {
		type: Number,
		min: 1,
		max: 4
	},
	month: {
		type: Number,
		min: 1,
		max: 12
	},
	year: {
		type: Number
	},
	holiday: {
		type: Boolean,
		default: false
	},
	product: {
		type: String,
		maxlength: 3,
		required: true,
		index: true,
		validate: [productLimit, 'Invalid product!']
	},
	users: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'user'
		}],
		validate: [peopleLimit, 'Date is already full']
	}
});

dateSchema.index({ date: 1, product: 1}, {unique: true});

function peopleLimit(val) {
	return val.length < 2;
}

function productLimit(val) {
	return (['ASE','IQ','REP'].indexOf(val) > -1);
}

module.exports = mongoose.model('date', dateSchema);