//routes/shipmentRoutes.js

import express from 'express';
import { createShipment, trackShipment } from '../controllers/shipmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/:orderId', protect, adminOnly, createShipment);
router.get('/track/:orderId', protect, trackShipment);

export default router;