
const express = require('express');
const reviewController = require('../controllers/reviewControllers');
const { model } = require('mongoose');
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/authControllers');


// to get all review
router
.route('/')
.get(reviewController.getAllReviews)
.post(authController.protect,authController.restrictTo('user'),
reviewController.setTourUserIds,
reviewController.createReview);

// to delete review
router
.route('/:id')
.get(reviewController.getReview)
.patch(reviewController.updateReview)
.delete(reviewController.deleteReview)
module.exports = router;