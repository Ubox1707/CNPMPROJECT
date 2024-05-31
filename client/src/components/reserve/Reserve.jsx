import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SelectedRoomsContext } from "../../context/SelectedRoomsContext";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext
  const { setSelectedRooms: setSelectedRoomsContext, setRoomsData } = useContext(SelectedRoomsContext); 

  const startDate = dates[0].startDate; // Lấy startDate từ context

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dates = [];
    while (start <= end) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    return dates;
  };

  const alldates = getDatesInRange(startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    // Chuyển đổi startDate và endDate sang timestamp
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(dates[0].endDate).getTime();
  
    // Lọc ra các ngày không khả dụng và chuyển đổi sang timestamp
    const unavailableDates = roomNumber.unavailableDates.map(date => new Date(date).getTime());
  
    // Kiểm tra xem có bất kỳ ngày nào trong khoảng thời gian đã chọn không khả dụng hay không
    const isFound = unavailableDates.some((date) =>
      date >= startTimestamp && date <= endTimestamp
    );
  
    return !isFound;
  };

  // Hàm tính số ngày giữa hai ngày
  const dayDifference = (date1, date2) => {
    const MILLSECONDS_PER_DAY = 1000 * 60 * 60 * 24;
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLSECONDS_PER_DAY);
    return diffDays;
  };


  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      // Cập nhật thông tin sẵn có của các phòng đã chọn
      await Promise.all(
        selectedRooms.map((roomId) => {
          return axios.put(`/rooms/availability/${roomId}`, {
            dates: alldates.map(date => date.getTime()), // Chuyển đổi sang Unix timestamp
          });
        })
      );

      // Tính số ngày giữa ngày nhận và ngày trả
      const totalDays = dayDifference(new Date(startDate), new Date(dates[0].endDate));

      // Tính tổng số tiền thanh toán
      let totalAmount = 0;
      selectedRooms.forEach((roomId) => {
        const room = data.find((item) => item.roomNumbers.some((roomNumber) => roomNumber._id === roomId));
        totalAmount += totalDays * room.price;
      });

      // Tạo hóa đơn cho các phòng đã chọn
      await axios.post('/bills', {
        room: selectedRooms,
        user: user._id,
        checkInDate: startDate,
        checkOutDate: dates[0].endDate,
        amountPaid: totalAmount // Số tiền cần thanh toán
      });

      setSelectedRoomsContext(selectedRooms);
      setRoomsData(data);
      setOpen(false);
      // Chuyển hướng đến trang thanh toán
      navigate("/Payment");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="reserve">
      <div className="Container">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="Close"
          onClick={() => setOpen(false)}
        />
        <span><b>Chọn phòng:</b></span>
        {data.map((item) => (
          <div className="Item" key={item._id}>
            <div className="ItemInfo">
              <div className="Title">{item.title}</div>
              <div className="Desc">{item.desc}</div>
              <div className="Max">
                Sức chứa: <b>{item.maxPeople}</b>
              </div>
              <div className="Price">{item.price.toLocaleString()} VNĐ</div>
            </div>
            <div className="SelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room" key={roomNumber._id}>
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleClick} className="Button">
          Đặt phòng ngay!
        </button>
      </div>
    </div>
  );
};

export default Reserve;