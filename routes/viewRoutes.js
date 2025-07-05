const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authControllers');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// 👇 IMPORTANT: Add bookingController.createBookingCheckout here
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);

// Tour detail page
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

// Login/signup/account pages
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/me', authController.protect, viewsController.getAccount);

// My bookings page (no need for createBookingCheckout here)
router.get('/my-tours', authController.protect, viewsController.getMyTours);

// Form submission to update name/email
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
