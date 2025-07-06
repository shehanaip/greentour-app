const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const cors = require('cors');
// for server only

const app = express();

// for the fix in the server

app.use(cors());                // ✅ Allow CORS for all origins
const corsOptions = {
  origin: 'https://your-frontend-url.com',
  credentials: true
};
app.use(cors(corsOptions));      // ✅ Handle preflight requests
app.use(express.json());        // ✅ Then parse JSON body
// for the fix ends

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://api.mapbox.com",
          "https://js.stripe.com",
          "https://cdnjs.cloudflare.com",
          "'unsafe-inline'"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://api.mapbox.com",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://api.mapbox.com",
          "https://*.tiles.mapbox.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"
        ],
        connectSrc: [
          "'self'",
          "https://api.mapbox.com",
          "https://js.stripe.com",
          "https://events.mapbox.com",
          "https://*.tiles.mapbox.com",
          "ws://localhost:*",
          "http://localhost:*",
          "ws://127.0.0.1:*",
          "http://127.0.0.1:*"
        ],
        workerSrc: ["blob:"],
        frameSrc: [
          "'self'",
          "https://js.stripe.com"
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      }
    }
  })
);





  // stripe connection
  app.use((req, res, next) => {
  res.locals.STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
  next();
});




// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
//5a2cac6e209024db3bda1fcca530ff75  ev for rander
