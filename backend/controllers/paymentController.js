//controllers/paymentController.js
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Razorpay from 'razorpay';

// @POST /api/payment/create-order
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  console.log('KEY ID:', process.env.RAZORPAY_KEY_ID);
  console.log('SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET);
  console.log('Amount:', amount);

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid amount');
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    res.status(500);
    throw new Error('Razorpay keys not configured');
  }

  // Create fresh instance to ensure env vars are loaded
  const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  const options = {
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: `receipt_${Date.now()}`
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    console.log('Order created:', order.id);
    res.json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      order
    });
  } catch (err) {
    console.error('Razorpay error full:', JSON.stringify(err));
    res.status(500);
    throw new Error(err?.error?.description || 'Razorpay order creation failed');
  }
});

// @POST /api/payment/verify
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  res.json({ success: true, message: 'Payment verified' });
});
