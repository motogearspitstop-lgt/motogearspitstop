//controllers/cartController.js

import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price stock');
  if (!cart) return res.json({ success: true, cart: { items: [], totalPrice: 0 } });
  res.json({ success: true, cart });
});

// @POST /api/cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (product.stock < quantity) { res.status(400); throw new Error('Insufficient stock'); }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price: product.discountPrice || product.price });
  }

  cart.calcTotal();
  await cart.save();
  res.json({ success: true, cart });
});

// @PUT /api/cart/:productId
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }

  const item = cart.items.find(i => i.product.toString() === req.params.productId);
  if (!item) { res.status(404); throw new Error('Item not in cart'); }

  if (quantity <= 0) {
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  } else {
    item.quantity = quantity;
  }

  cart.calcTotal();
  await cart.save();
  res.json({ success: true, cart });
});

// @DELETE /api/cart/:productId
export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  cart.calcTotal();
  await cart.save();
  res.json({ success: true, cart });
});

// @DELETE /api/cart
export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ success: true, message: 'Cart cleared' });
});