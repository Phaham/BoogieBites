const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const Dish = require("../../models/dishModel");
const Review = require("../../models/reviewModel");

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

// READ JSON FILE
const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const dishes = JSON.parse(fs.readFileSync(`${__dirname}/dishes.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Category.create(categories);
    await Dish.create(dishes);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Category.deleteMany();
    await User.deleteMany();
    await Dish.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
