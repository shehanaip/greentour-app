const Review =require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory')

// to create review
exports.setTourUserIds = (req, res, next) =>{
        //allow nested routes
        if(!req.body.tour){
            req.body.tour =req.params.tourId;
        }
        if(!req.body.user){
            if (!req.body.user) req.body.user = req.user.id;
        }
        next();
}

// to get all review
exports.getAllReviews = factory.getAll(Review);
// to get review
exports.getReview = factory.getOne(Review);
// for create
exports.createReview = factory.createOne(Review);
// for delete
exports.deleteReview = factory.deleteOne(Review);
// for Update
exports.updateReview = factory.updateOne(Review);