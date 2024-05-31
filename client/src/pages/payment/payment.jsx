import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import "./Payment.css";

const Payment = () => {
  const { user } = useContext(AuthContext);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await axios.get(`/users/${user._id}/booking-history`);
        const data = await Promise.all(
          response.data.map(async (booking) => {
            const roomResponse = await axios.get(`/rooms/roomNumber/${booking.room}`);
            const userResponse = await axios.get(`/users/${booking.user}`);
            return { ...booking, roomDetails: roomResponse.data, userDetails: userResponse.data };
          })
        );
        setBookingHistory(data);
      } catch (error) {
        console.error("Error fetching booking history:", error);
      }
      setLoading(false);
    };
    fetchBookingHistory();
  }, [user]);

  return (
    <div className="payment">
      <Navbar />
      <Header type="list" />
      <div className="paymentContainer">
        <div className="paymentList">
          <div className="paymentHeader">
            <h2>Lịch sử đặt phòng của bạn</h2>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="infomation"> 
              {bookingHistory.map((booking) => (
                <li className="infoList" key={booking._id}>
                  <div>Người đặt phòng: {booking.userDetails.username}</div>
                  <div>Email: {booking.userDetails.email}</div>
                  <div>Số điện thoại: {booking.userDetails.phone}</div>
                  <div>Thành phố: {booking.userDetails.city}</div>
                  <div>Tên phòng: {booking.roomDetails.title}</div>
                  <div>Giá phòng: {(booking.roomDetails.price).toLocaleString()} VNĐ</div>
                  <div>Mô tả: {booking.roomDetails.desc}</div>
                  <div>Ngày nhận phòng: {booking.checkInDate}</div>
                  <div>Ngày trả phòng: {booking.checkOutDate}</div>
                  <div>Số tiền đã thanh toán: {(booking.amountPaid).toLocaleString()} VNĐ</div>
                </li>
              ))}
            </ul>
          )}

          
        </div>
      </div>
    </div>
  );
};

export default Payment;
