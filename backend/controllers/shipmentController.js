//controllers/shipmentController.js

import asyncHandler from 'express-async-handler';
import Shipment from '../models/Shipment.js';
import Order from '../models/Order.js';
import { createShiprocketOrder, trackShiprocket } from '../utils/shiprocket.js';

// @POST /api/shipment/:orderId  (admin)
export const createShipment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  const srData = await createShiprocketOrder(order);

  const shipment = await Shipment.create({
    order: order._id,
    user: order.user,
    shiprocket_order_id: srData.order_id?.toString() || '',
    shiprocket_shipment_id: srData.shipment_id?.toString() || '',
    awb_code: srData.awb_code || '',
    courier_name: srData.courier_name || '',
    status: 'created'
  });

  order.orderStatus = 'shipped';
  await order.save();

  res.status(201).json({ success: true, shipment });
});

// @GET /api/shipment/track/:orderId
export const trackShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findOne({ order: req.params.orderId });
  if (!shipment) { res.status(404); throw new Error('Shipment not found'); }

  const tracking = await trackShiprocket(shipment.awb_code);
  res.json({ success: true, tracking, shipment });
});