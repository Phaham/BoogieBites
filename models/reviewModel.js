const mongoose = require("mongoose");
const Category = require("./categoryModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Review must belong to a category."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ category: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  //   this.populate({
  //     path: "category",
  //     select: "name",
  //   }).populate({
  //     path: "user",
  //     select: "name photo",
  //   });
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(categoryId) {
  const stats = await this.aggregate([
    {
      $match: { category: categoryId },
    },
    {
      $group: {
        _id: "$category",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Category.findByIdAndUpdate(categoryId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // reset if there is no longer any review in stats
    await Category.findByIdAndUpdate(categoryId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function() {
  // this points to current review
  // this.constructor points to Review (not defined yet)
  this.constructor.calcAverageRatings(this.category);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.currentReview = await this.findOne();
  // console.log(this.currentReview);
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed (see pre-hook above for a solution)
  await this.currentReview.constructor.calcAverageRatings(
    this.currentReview.category
  );
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
