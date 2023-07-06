const express = require("express");

const {
  getRecipe,
} = require("../controllers/dishController");
const router = express.Router();

router
  .route("/:id")
  .get(getRecipe);

module.exports = router;