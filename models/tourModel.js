const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal to 40 characters'],
      minLength: [10, 'A tour name must have more or equal to 10 characters'],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z\s\-\'\`]+$/.test(value);
        },
        message: 'Tour name must only contain letters, spaces, hyphens, and apostrophes'
      }
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult']
      }
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'Rating must be below 5.0'],
      min: [1, 'Rating must be above 1.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    startDates: [Date],
    secretTour: Boolean,
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            validate: {
              validator: function (val) {
                return Array.isArray(val) && val.length === 2 && val.every(coord => typeof coord === 'number');
              },
              message: 'Coordinates should be an array of two numbers (longitude, latitude).'
            }
          },
          address: String,
          description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });


// Virtual for duration in weeks
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate for reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// Document middleware for slug creation
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Populate guides before saving
// Remove this part from your middleware
// tourSchema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise); // Remove this to keep only ObjectIds
//   next();
// });


// Query middleware to filter secret tours
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// Populate guides on find queries
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt' 
  });
  next();
});


// Logging query time after find
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);
  next();
});

// Aggregation middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
