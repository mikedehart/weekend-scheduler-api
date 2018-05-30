const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateSchema = new Schema({
	date: {
		type: String,
		required: true,
		unique: true
	},
	day: {
		type: String,
		maxlength: 3,
	},
	qtr: {
		type: Number,
		min: 1,
		max: 4
	},
	users: [{ type: Schema.Types.ObjectId, red: 'user' }]

})

module.exports = mongoose.model('date', dateSchema);