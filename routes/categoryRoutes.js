const express = require("express");

const {
  getAllCategories,
  getCategory,
  aliasTopCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImages,
  resizeCategoryImages,
  aliasTopDishes,
} = require("../controllers/categoryController");
const { protect, restrictTo } = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use("/:categoryId/reviews", reviewRouter);

// router.route("/top-5-cheap").get(aliasTopDishes, getAllCategories);
router
  .route("/")
  .get(getAllCategories)
  .post(protect, restrictTo("admin", "reviewer"), createCategory);


router
  .route("/:id")
  .get(getCategory)
  .patch(
    protect,
    restrictTo("admin", "reviewer"),
    uploadCategoryImages,
    resizeCategoryImages,
    updateCategory
  )
  .delete(protect, restrictTo("admin", "reviewer"), deleteCategory);

module.exports = router;
