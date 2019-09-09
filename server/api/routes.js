const router = require('express').Router();

// Mount other routers and export them to server.js
router.use('/users', require('./user/userRoutes'));
router.use('/dates/user', require('./date/userDate/userDateRoutes'));
router.use('/dates', require('./date/dateRoutes'));
router.use('/quarters', require('./quarter/quarterRoutes'));
router.use('/holidays', require('./holiday/holidayRoutes'));
router.use('/holidays/user', require('./holiday/userHoliday/userHolidayRoutes'));

module.exports = router;