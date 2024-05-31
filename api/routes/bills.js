import express from 'express';
import { createBill, getUserBills } from '../controllers/bill.js';

const router = express.Router();

// Route để tạo một hóa đơn mới
router.post('/', createBill);

// Route để lấy tất cả hóa đơn của người dùng hiện tại
router.get('/me', getUserBills);

export default router;
