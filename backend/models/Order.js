//models/Order.js


import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      externalProductId: String,
      name: String,
      image: String,
      price: Number,
      quantity: Number
    }
  ],
  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentInfo: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String
  },
  paymentMethod: { type: String, enum: ['cod', 'razorpay'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'partial', 'paid', 'failed'], default: 'pending' },
  orderStatus: {
    type: String,
    enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  itemsPrice: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  amountDue: { type: Number, default: 0 },
  codAdvancePercentage: { type: Number, default: 0 },
  paidAt: Date,
  deliveredAt: Date
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
