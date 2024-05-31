// controllers/billController.js
import asyncHandler from 'express-async-handler';
import Bill from '../models/Bill.js';

// @Desc Tạo một hóa đơn mới
// @Route /api/bills
// @Method POST
export const createBill = asyncHandler(async (req, res) => {
  const {user, room, checkInDate, checkOutDate, amountPaid } = req.body;

  const bill = await Bill.create({
    user,
    room,
    //user: req.user._id,
    checkInDate,
    checkOutDate,
    amountPaid,
  });

  res.status(201).json(bill);
});

// @Desc Lấy tất cả hóa đơn của người dùng hiện tại
// @Route /api/bills/me
// @Method GET
// @Desc Lấy tất cả hóa đơn của một người dùng
// @Route /api/bills/user/:userId
// @Method GET
export const getUserBills = async (req, res, next) => {
  try {
    const bills = await Bill.find({ user: req.params.id }).populate('user', 'username email').populate('room', 'title price');

    if (!bills || bills.length === 0) { // Kiểm tra nếu không có hóa đơn nào được tìm thấy
      res.status(404);
      throw new Error('Không tìm thấy hóa đơn nào');
    }

    res.status(200).json(bills);
  } catch (err) {
    next(err);
  }
};





