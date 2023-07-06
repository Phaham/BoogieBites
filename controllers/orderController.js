const Stripe = require('stripe');
const Category = require('../models/categoryModel');
const Dish = require('../models/dishModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// exports.getCheckoutSession = catchAsync(async (req, res, next) => {

//   const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: [
//         {
//           price_data: {
//               currency: "usd",
//               product_data: {
//                 name: `Categories`,
//                 description: 'Cuisines across the world',
//                 images: [`https://tinyurl.com/3ak96rzj`],
//               },
//               unit_amount: 1000 * 100,
//           },
//           quantity: 1,
//         },
//     ],
//     mode: "payment",
//     success_url: `https://paymentsuccess.netlify.app/`,
//     cancel_url: `https://google.com/`,
//   });

//   res.json({ id: session.id });
// });

exports.createOrderCheckout = catchAsync(async (req, res, next) => {
  const { dish, user, price } = req.query;

  if (!dish && !user && !price) return next();
  await Order.create({ dish, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createOrder = factory.createOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
