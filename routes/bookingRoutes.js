const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authControllers');

const router = express.Router();
router.use(authController.protect);
router.get('/checkout-session/:tourId',authController.protect,bookingController.getCheckoutSession)
router.use(authController.restrictTo('admin', 'lead-guide'));
router.route('/:id').get(bookingController.getAllBookings).post(bookingController.createBooking);
router.route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;