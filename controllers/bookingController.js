const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get the current booked tour
  const tour = await Tour.findById(req.params.tourId);
  console.log(tour);

  // 2. Create checkout session with correct success_url
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${tour._id}&user=${req.user._id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            // images: ['<image-url>'], // Add image URL if available
          },
          unit_amount: tour.price * 100, // Price in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment', // Indicates the payment mode
  });

  // 3. Send session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

  exports.createBooking = factory.createOne(Booking);
  exports.getBooking = factory.getOne(Booking);
  exports.getAllBookings = factory.getAll(Booking);
  exports.updateBooking = factory.updateOne(Booking);
  exports.deleteBooking = factory.deleteOne(Booking);