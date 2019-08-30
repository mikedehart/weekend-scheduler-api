
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require('../../util/logger');


const quarterSchema = new Schema({
	quarter: {
		type: Number,
		min: 1,
		max: 4,
		required: true
	},
	year: {
		type: Number,
		required: true
	},
	locked: {
		type: Boolean,
		required: true,
		default: true
	}
});

quarterSchema.index({ quarter: 1, year: 1}, { unique: true });


quarterSchema.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
	const self = this;
	const newDoc = doc;
	return new Promise((resolve, reject) => {
		return self.findOne(condition)
			.then((result) => {
				if(result) {
					return resolve(result);
				} else {
					return self.create(newDoc)
							.then((result) => {
								return resolve(result);
							})
							.catch((err) => {
								return reject(err);
							});
				}
			})
			.catch((err) => {
				return reject(err);
			});
	});

};

// quarterSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
//     const self = this
//     self.findOne(condition, (err, result) => {
//         return result ? callback(err, result) : self.create(condition, (err, result) => { return callback(err, result) });
//     })
// }

quarterSchema.methods = {
};

module.exports = mongoose.model('quarter', quarterSchema);