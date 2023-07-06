const multer = require("multer");
const sharp = require("sharp");

const Dish = require("./../models/dishModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();

exports.aliasTopDishes = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getRecipe = factory.getOne(Dish, { path: "reviews" });