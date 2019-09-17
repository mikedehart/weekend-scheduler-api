const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const altdaySchema = new Schema({
	dateId: {
		type: Schema.Types.ObjectId,
		ref: 'date',
		required: true
	},
	qtr: {
		type: Number,
		min: 1,
		max: 5
	},
	year: {
		type: Number
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	alternative: {
		type: String
	}
});

//altdaySchema.index({ userId: 1, dateId: 1}, { unique: false });

module.exports = mongoose.model('altday', altdaySchema);