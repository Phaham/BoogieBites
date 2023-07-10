const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: {
    type: Array,
    required: [true, 'An Order must have items!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An Order must belong to a user!'],
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
