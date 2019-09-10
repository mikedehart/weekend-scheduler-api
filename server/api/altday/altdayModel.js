const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const altdaySchema = new Schema({
	date: {
		type: Schema.Types.ObjectId,
		ref: 'date',
		required: true
	},
	qtr: {
		type: Number,
		min: 1,
		max: 4
	},
	year: {
		type: Number
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	alternative: {
		type: String,
		required: false
	}
});

altdaySchema.index({ user: 1, date: 1}, { unique: true });

module.exports = mongoose.model('altday', altdaySchema);