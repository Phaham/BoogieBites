const Category = require("../models/categoryModel");
// const Order = require("../models/orderModel");
const User = require("../models/userModel");

const Cart = require('../models/cartModel');
const Dish = require('../models/dishModel');

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === "order")
    res.locals.alert =
      "Your Order was successful! Please check your email for a confirmation"
  next();
};

exports.getLandingPage = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).render("landing", { title: "All Categories", categories });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  if (!category) {
    return next(new AppError("There is no category with that name.", 404));
  }
  res.status(200).render("category", { title: `${category.name} Dishes`, category });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", { title: "Log into your account" });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create Your Account!',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});

exports.welcomeEmail = (req, res) => {
  res.status(200).render('welcomeEmail', {
    title: 'Welcome',
  });
};


exports.getRecipe = catchAsync(async (req, res, next) => {
  // const recipe = await Dish.findById(req.params.id);
  const recipe = await Dish.findOne({ slug: req.params.slug });
  if (!recipe) {
    return next(new AppError("There is no recipe with that name.", 404));
  }
  res.status(200).render("recipe", { title: `${recipe.name} Recipe`, recipe });
});

exports.getContact = (req, res) => {
  res.status(200).render('contact', {
    title: 'Contact Us',
  });
};

exports.getpaymentSuccess= async (req, res) => {
  // const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  // const customer = await stripe.customers.retrieve(session.customer);
  // res.send(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);

  res.status(200).render('paymentSuccess', {
    title: 'payment_success',
  });
};

exports.getpaymentFailed= (req, res) => {
  res.status(200).render('paymentFailed', {
    title: 'payment_failed',
  });
};
exports.getTestCard= (req, res) => {
  res.status(200).render('test_card', {
    title: 'Your Test Card',
  });
};

exports.getMyOrders= (req, res) => {
  const order = await Order.findOne({ user: req.user.id });
  // console.log(items)
  if(order){
    var items = order.items;
  }
  else{
    items = []
  }
  
  res.render('my_orders', {items});
};

// exports.getMyCart = catchAsync(async (req, res, next) => {
//   // 1) Find all orders
//   const carts = await Cart.find({ user: req.user.id });
//   // 2) Find categories with the returned IDs
//   const dishIDs = carts.map((el) => el.dish);
//   const dishes = await Dish.find({ _id: { $in: dishIDs } });
//   res.status(200).render("shop/cart", {
//     title: "My Cart",
//     dishes,
//   });
// });


// Cart  
// exports.cart = async (req,res) => {
//   const carts = await Cart.find().populate({
//     path: "items.productId",
//     select: "name price total"
//   });;
//   res.status(200).render("cart", { title: "Your Cart", carts });
//   // return carts[0];
// };

// exports.cart = async (req, res, next) => {
//   const carts = await Cart.find().populate({
//     path: "items.productId",
//     select: "name price total"
//   });
//   if (!carts) {
//     return next(new AppError("There is no cart with that name.", 404));
//   }
//   // res.status(200).render("cart", { title: `Cart`, carts });
//   return carts[0];

// };

// exports.addItem = async payload => {
//   const newItem = await Cart.create(payload);
//   return newItem
// }
