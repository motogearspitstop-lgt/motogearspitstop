//models/Cart.js

import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.methods.calcTotal = function () {
  this.totalPrice = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;