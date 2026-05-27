//controllers/productController.js


import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import ApiFeatures from '../utils/apiFeatures.js';

// @GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const resPerPage = 12;
  const totalProducts = await Product.countDocuments();
  const features = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .paginate(resPerPage);
  const products = await features.query;
  res.json({ success: true, totalProducts, resPerPage, products });
});

// @GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @POST /api/products  (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const images = req.files?.map(f => ({ public_id: f.filename, url: f.path })) || [];
  const product = await Product.create({ ...req.body, images });
  res.status(201).json({ success: true, product });
});

// @PUT /api/products/:id  (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @DELETE /api/products/:id  (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, message: 'Product deleted' });
});

// @POST /api/products/:id/review
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const alreadyReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) { res.status(400); throw new Error('Product already reviewed'); }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

// @GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8);
  res.json({ success: true, products });
});

// @GET /api/products/new-arrivals
export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true }).sort('-createdAt').limit(8);
  res.json({ success: true, products });
});