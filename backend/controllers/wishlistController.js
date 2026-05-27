//controllers/wishlistController.js

import asyncHandler from 'express-async-handler';
import Wishlist from '../models/Wishlist.js';

// @GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name images price discountPrice stock');
  if (!wishlist) return res.json({ success: true, products: [] });
  res.json({ success: true, products: wishlist.products });
});

// @POST /api/wishlist/:productId
export const addToWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

  if (wishlist.products.includes(req.params.productId)) {
    return res.json({ success: true, message: 'Already in wishlist' });
  }

  wishlist.products.push(req.params.productId);
  await wishlist.save();
  res.json({ success: true, message: 'Added to wishlist' });
});

// @DELETE /api/wishlist/:productId
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) { res.status(404); throw new Error('Wishlist not found'); }
  wishlist.products = wishlist.products.filter(p => p.toString() !== req.params.productId);
  await wishlist.save();
  res.json({ success: true, message: 'Removed from wishlist' });
});