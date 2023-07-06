const multer = require("multer");
const sharp = require("sharp");

const Category = require("./../models/categoryModel");

const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadCategoryImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeCategoryImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  // 1) Cover image
  req.body.imageCover = `dish-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/dishes/${req.body.imageCover}`);
  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `dish-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/dishes/${filename}`);
      req.body.images.push(filename);
    })
  );
  next();
});

// exports.aliasTopDishes = (req, res, next) => {
//   req.query.limit = "5";
//   req.query.sort = "-ratingsAverage,price";
//   req.query.fields = "name,price,ratingsAverage,summary,difficulty";
//   next();
// };

exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category, { path: "reviews" });
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
