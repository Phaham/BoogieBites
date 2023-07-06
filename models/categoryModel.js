const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require('./userModel');
// const validator = require('validator');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A category must have a name"],
      unique: true,
      trim: true,
      // maxlength: [40, "A category name must have less or equal then 40 characters"],
      // minlength: [10, "A category name must have more or equal then 10 characters"],
      // validate: [validator.isAlpha, 'Category name must only contain characters']
    },
    slug: String,
    summary: {
      type: String,
      trim: true,
      required: [true, "A category must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A category must have a cover image"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    testimonials: {
      author: String,
      date: String,
      author_image: String,
      rating: [String],
      message: String
    },
    dishes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.virtual("reviews", {
  ref: "Review",
  foreignField: "category",
  localField: "_id",
});

categorySchema.index({ price: 1, ratingsAverage: -1 });
categorySchema.index({ slug: 1 });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
categorySchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});


// QUERY MIDDLEWARE
categorySchema.pre(/^find/, function(next) {
  this.find({ secretRecipe: { $ne: true } });
  this.start = Date.now();
  next();
});

categorySchema.pre(/^find/, function(next) {
  this.populate({
    path: "dishes",
    select: "-__v -passwordChangedAt",
  });
  next();
});


const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
