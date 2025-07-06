//all the dependencies
const express = require('express')
const authController = require('../controllers/authControllers')
//const reviewController =require('../controllers/reviewControllers');
const tourController = require('../controllers/tourControllers')
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();


//reading the tour routes from files


// router.param('id',tourController.checkId)

//  router
//  .route('/:tourId/reviews')
//  .post(authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview)

router.use('/:tourId/reviews',reviewRouter)

router
.route('/top-5-cheap')
.get(tourController.aliasTopTour,tourController.getAllTours)

router
.route('/tour-stats')
.get(tourController.getTourState)
router
  .route('/monthly-plan/:year')
  .get(authController.protect,
  authController.restrictTo('admin','lead-guide','guide'),
  tourController.getMonthlyPlan);

  router.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin)

  router.route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances)

// router
// .route('/')
// .get(authController.protect,authController.restrictTo('admin','lead-guide')
// ,tourController.uploadTourImages
// ,tourController.resizeTourImages
// ,tourController.getAllTours
// ,tourController.createTour)
// .post(tourController.createTour);
router
  .route('/')
  .get(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.createTour
  );


router
 .route('/:id')
 .get(tourController.getTour)
 .patch(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.uploadTourImages,
  tourController.resizeTourImages,
  tourController.updateTour
)
 .delete(authController.protect 
 ,authController.restrictTo('admin','lead-guide')
 ,tourController.deleteTour);

 module.exports = router;