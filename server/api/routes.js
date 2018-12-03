const router = require('express').Router();

// Mount other routers and export them to server.js
router.use('/users', require('./user/userRoutes'));
router.use('/dates/user', require('./date/userDate/userDateRoutes'));
router.use('/dates', require('./date/dateRoutes'));

module.exports = router;