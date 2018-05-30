/*
	Entry point for the API server.
	
	Author: Mike DeHart
	Date: May 2018

*/
const config = require('./server/config/config');
const app = require('./server/server');
const logger = require('./server/util/logger');

app.listen(config.port);
logger.log('Server running on: http://localhost:' + config.port);