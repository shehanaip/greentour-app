const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers');
const router = express.Router();
const multer = require('multer');

// Auth-related routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

// Protect the update password route explicitly
router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

// Apply the protect middleware globally for the following routes
router.use(authController.protect);

// User-related routes
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
