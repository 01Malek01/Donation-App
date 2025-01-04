import express from 'express';
import { createOrderController, captureOrderController } from '../controllers/Order.js';

const router = express.Router();

// Create order route
router.post("/", createOrderController);

// Capture order route
router.post("/:orderID/capture", captureOrderController);

export default router;