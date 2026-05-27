//models/Shipment.js



import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shiprocket_order_id: { type: String, default: '' },
  shiprocket_shipment_id: { type: String, default: '' },
  awb_code: { type: String, default: '' },
  courier_name: { type: String, default: '' },
  tracking_url: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  estimatedDelivery: { type: Date }
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;