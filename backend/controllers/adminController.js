//controllers/adminController.js


import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Shipment from '../models/Shipment.js';

const paidAmountExpression = {
  $cond: [{ $gt: ['$amountPaid', 0] }, '$amountPaid', '$totalPrice']
};

// @GET /api/admin/dashboard
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();

  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: { $in: ['paid', 'partial'] } } },
    { $group: { _id: null, totalRevenue: { $sum: paidAmountExpression } } }
  ]);
  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  const monthlyRevenue = await Order.aggregate([
    { $match: { paymentStatus: { $in: ['paid', 'partial'] } } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: paidAmountExpression },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 }
  ]);

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(10);

  const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
    .select('name stock images')
    .limit(10);

  const orderStatusCounts = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      monthlyRevenue,
      recentOrders,
      lowStockProducts,
      orderStatusCounts
    }
  });
});

// @GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const users = await User.find()
    .select('-password')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.json({ success: true, total, page, users });
});

// @GET /api/admin/users/:id
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, user });
});

// @PUT /api/admin/users/:id
export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.role = req.body.role || user.role;
  await user.save();
  res.json({ success: true, message: 'User role updated' });
});

// @DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, message: 'User deleted' });
});

// @GET /api/admin/orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const status = req.query.status;

  const query = status ? { orderStatus: status } : {};
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email phone')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.json({ success: true, total, page, orders });
});

// @PUT /api/admin/orders/:id
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  order.orderStatus = req.body.orderStatus || order.orderStatus;
  if (req.body.orderStatus === 'delivered') order.deliveredAt = Date.now();
  await order.save();

  res.json({ success: true, order });
});

// @DELETE /api/admin/orders/:id
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json({ success: true, message: 'Order deleted' });
});

// @GET /api/admin/products
export const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await Product.countDocuments();
  const products = await Product.find()
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.json({ success: true, total, page, products });
});

// @PUT /api/admin/products/:id/stock
export const updateStock = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  product.stock = req.body.stock;
  await product.save();
  res.json({ success: true, message: 'Stock updated', stock: product.stock });
});

// @GET /api/admin/revenue
export const getRevenueStats = asyncHandler(async (req, res) => {
  const daily = await Order.aggregate([
    { $match: { paymentStatus: { $in: ['paid', 'partial'] } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: paidAmountExpression },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 30 }
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 10 }
  ]);

  res.json({ success: true, daily, topProducts });
});
