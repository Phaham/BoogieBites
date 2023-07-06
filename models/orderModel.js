const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dish',
    required: [true, 'An Order must belong to a dish!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An Order must belong to a user!'],
  },
  price: {
    type: Number,
    require: [true, 'An Order must have a price!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'category',
    select: 'name',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
