//controllers/orderController.js


import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import sendEmail from '../utils/sendEmail.js';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatCurrency = (value = 0) => `INR ${Number(value || 0).toLocaleString('en-IN')}`;
const COD_ADVANCE_PERCENTAGE = 20;

const calculatePaymentBreakup = (paymentMethod, totalPrice) => {
  const total = Number(totalPrice || 0);

  if (paymentMethod === 'cod') {
    const amountPaid = Math.round(total * (COD_ADVANCE_PERCENTAGE / 100));
    return {
      amountPaid,
      amountDue: Math.max(total - amountPaid, 0),
      paymentStatus: amountPaid > 0 ? 'partial' : 'pending',
      codAdvancePercentage: COD_ADVANCE_PERCENTAGE
    };
  }

  return {
    amountPaid: total,
    amountDue: 0,
    paymentStatus: 'paid',
    codAdvancePercentage: 0
  };
};

const buildItemsRows = (items) => items.map((item) => `
  <tr>
    <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(item.name)}</td>
    <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
    <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(item.price * item.quantity)}</td>
  </tr>
`).join('');

const buildAddressHtml = (address = {}) => `
  <p style="line-height:1.6;margin:0;">
    ${escapeHtml(address.fullName)}<br />
    ${escapeHtml(address.addressLine1)}${address.addressLine2 ? `, ${escapeHtml(address.addressLine2)}` : ''}<br />
    ${escapeHtml(address.city)}, ${escapeHtml(address.state)} - ${escapeHtml(address.pincode)}<br />
    Phone: ${escapeHtml(address.phone)}
  </p>
`;

const buildCustomerOrderEmail = (order, customerName) => `
  <div style="font-family:Arial,sans-serif;color:#111827;max-width:640px;margin:0 auto;">
    <h2 style="color:#e11d48;">Thank you for your order, ${escapeHtml(customerName || order.shippingAddress.fullName)}!</h2>
    <p>Your MotoGear Pitstop order has been placed successfully.</p>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'} (${order.paymentStatus})</p>
    <p><strong>Amount Paid:</strong> ${formatCurrency(order.amountPaid)}</p>
    <p><strong>Leftover Amount:</strong> ${formatCurrency(order.amountDue)}</p>
    <h3>Order Items</h3>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="padding:8px;text-align:left;border-bottom:2px solid #eee;">Item</th>
          <th style="padding:8px;text-align:center;border-bottom:2px solid #eee;">Qty</th>
          <th style="padding:8px;text-align:right;border-bottom:2px solid #eee;">Amount</th>
        </tr>
      </thead>
      <tbody>${buildItemsRows(order.items)}</tbody>
    </table>
    <p style="font-size:18px;"><strong>Total:</strong> ${formatCurrency(order.totalPrice)}</p>
    <h3>Shipping Address</h3>
    ${buildAddressHtml(order.shippingAddress)}
    <p style="margin-top:24px;">We will notify you when your order is shipped.</p>
  </div>
`;

const buildAdminOrderEmail = (order, customer) => `
  <div style="font-family:Arial,sans-serif;color:#111827;max-width:720px;margin:0 auto;">
    <h2 style="color:#e11d48;">New Order Received</h2>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Customer:</strong> ${escapeHtml(customer.name)} (${escapeHtml(customer.email)})</p>
    <p><strong>Phone:</strong> ${escapeHtml(order.shippingAddress.phone || customer.phone || '')}</p>
    <p><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'} (${order.paymentStatus})</p>
    <p><strong>Amount Paid:</strong> ${formatCurrency(order.amountPaid)}</p>
    <p><strong>Leftover Amount:</strong> ${formatCurrency(order.amountDue)}</p>
    <h3>Order Items</h3>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="padding:8px;text-align:left;border-bottom:2px solid #eee;">Item</th>
          <th style="padding:8px;text-align:center;border-bottom:2px solid #eee;">Qty</th>
          <th style="padding:8px;text-align:right;border-bottom:2px solid #eee;">Amount</th>
        </tr>
      </thead>
      <tbody>${buildItemsRows(order.items)}</tbody>
    </table>
    <p style="font-size:18px;"><strong>Total:</strong> ${formatCurrency(order.totalPrice)}</p>
    <h3>Shipping Address</h3>
    ${buildAddressHtml(order.shippingAddress)}
  </div>
`;

const sendOrderEmails = async (order, user) => {
  const shopEmail = process.env.ORDER_NOTIFICATION_EMAIL || process.env.EMAIL_USER;
  const emails = [];

  if (user?.email) {
    emails.push(sendEmail({
      to: user.email,
      subject: `MotoGear Pitstop - Order ${order._id} placed`,
      html: buildCustomerOrderEmail(order, user.name)
    }));
  }

  if (shopEmail) {
    emails.push(sendEmail({
      to: shopEmail,
      subject: `New MotoGear Pitstop order - ${order._id}`,
      html: buildAdminOrderEmail(order, user)
    }));
  }

  const results = await Promise.allSettled(emails);
  results
    .filter((result) => result.status === 'rejected')
    .forEach((result) => console.error('Order email failed:', result.reason?.message || result.reason));
};

// @POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentInfo = {}, paymentMethod = 'cod', items: clientItems = [] } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  let items = [];

  if (cart?.items?.length) {
    items = cart.items
      .filter(i => i.product)
      .map(i => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.images[0]?.url || '',
        price: i.price,
        quantity: i.quantity
      }));
  }

  if (items.length === 0 && Array.isArray(clientItems)) {
    items = clientItems
      .map(i => ({
        product: i.productId && /^[0-9a-fA-F]{24}$/.test(String(i.productId)) ? i.productId : undefined,
        externalProductId: i.productId ? String(i.productId) : undefined,
        name: String(i.name || 'Product'),
        image: String(i.image || ''),
        price: Number(i.price || 0),
        quantity: Number(i.quantity || 0)
      }))
      .filter(i => i.name && i.price >= 0 && i.quantity > 0);
  }

  if (items.length === 0) {
    res.status(400); throw new Error('Cart is empty');
  }

  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = 0;
  const totalPrice = itemsPrice + shippingPrice;
  const paymentBreakup = calculatePaymentBreakup(paymentMethod, totalPrice);

  if (paymentBreakup.amountPaid > 0 && !paymentInfo?.razorpay_payment_id) {
    res.status(400);
    throw new Error('Advance payment is required before placing this order');
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentInfo,
    paymentMethod,
    paymentStatus: paymentBreakup.paymentStatus,
    itemsPrice,
    shippingPrice,
    totalPrice,
    amountPaid: paymentBreakup.amountPaid,
    amountDue: paymentBreakup.amountDue,
    codAdvancePercentage: paymentBreakup.codAdvancePercentage,
    paidAt: paymentBreakup.amountPaid > 0 ? Date.now() : undefined
  });

  // Update stock for Mongo-backed cart items. Static frontend items do not have Product documents.
  if (cart?.items?.length) {
    for (const item of cart.items) {
      if (!item.product?._id) continue;
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    await Cart.findOneAndDelete({ user: req.user._id });
  }

  await sendOrderEmails(order, req.user);

  res.status(201).json({ success: true, order });
});

// @GET /api/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, orders });
});

// @GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, order });
});
