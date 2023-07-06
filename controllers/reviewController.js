const Review = require("./../models/reviewModel");
const factory = require("./handlerFactory");

exports.setCategoryUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.category) req.body.category = req.params.categoryId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
