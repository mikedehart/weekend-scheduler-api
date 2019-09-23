var router = require('express').Router();
var logger = require('../../util/logger');
var controller = require('./userController');
var auth = require('../../auth/auth');


const authMiddleware = [auth.decodeToken(), auth.refreshUser()];

router.param('id', controller.params);

router.route('/')
  .get(controller.get) // get all users
  .post(controller.post) // create new user

router.route('/details')
	.get(authMiddleware, controller.getUser) // Get current user using JWT

router.route('/write')
	.get(controller.write) // Write iCal file

router.route('/download/:file')
	.get(controller.download) // Download iCal file

router.route('/:id')
  .get(controller.getOne) // get single user by Id
  .put(authMiddleware, controller.put) // update user info by Id
  .delete(authMiddleware, controller.delete) // delete use by Id

module.exports = router;
