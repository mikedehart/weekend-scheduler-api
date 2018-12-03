/*
	General middleware for the API
*/
const morgan = require('morgan');
const bodyParser = require('body-parser');
const override = require('method-override');
const cors = require('cors');

const config = require('../config/config');


var morganEnv;
if(config.env === 'production') {
	morganEnv = morgan('tiny', {
		skip: (req, res) => { return res.statusCode < 400 }
	});
} else {
	morganEnv = morgan('dev');
}

module.exports = (app) => {
	app.use(morganEnv);
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(cors());
	app.use(override());
};
