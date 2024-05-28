import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Dialog from "../../components/dialog/Dialog";

const NewHotel = ({ hotelInputs }) => {

  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const { data, loading, error } = useFetch("/rooms");

  const location = useLocation();
  const { id, updateClicked } = location.state || {};

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    hotelInputs.forEach((input) => {
      if (!info[input.id]) {
        tempErrors[input.id] = `${input.label} là bắt buộc`;
        isValid = false;
      }
    });

    if (!files.length) {
      tempErrors.photos = "Ảnh là bắt buộc";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const res = await axios.get(`/hotels/find/${id}`);
          // const res = await axios.get(`/hotels/${id}`);
          setInfo(res.data);
          setRooms(res.data.rooms);
          setFiles(res.data.photos);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInfo((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    // setInfo((prev) => ({...prev, [e.target.id]: e.target.value }));
  }

  const handleClose = () => {
    setShowDialog(false);
    navigate("/hotels");
  };
  
  const handleSelect = (e) => {
    // const value = Array.from(e.target.selectedOptions, option => option.value);
    // setRooms(value);
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedRooms(selectedOptions);
  };

  // console.log(files)
  const handleClick = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      const list = await Promise.all(
        Object.values(files).map(async (file) => {
          if (typeof file === 'string') {
            return file;
          }
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "upload");
          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/dehf2hp4a/image/upload",
            data
          );

          const { url } = uploadRes.data;
          return url;
        })
      );
    // try {
    //   const list = await Promise.all(
    //     Object.values(files).map(async (file) => {
    //       const data = new FormData();
    //       data.append("file", file);
    //       data.append("upload_preset", "upload");
    //       const uploadRes = await axios.post(
    //         "https://api.cloudinary.com/v1_1/dehf2hp4a/image/upload",
    //         data
    //       );

    //       const { url } = uploadRes.data;
    //       return url;
    //     })
    //   );

      

      const newhotel = {
        ...info,
        rooms,
        photos: list,
      };
      if (updateClicked && id) {
        await axios.put(`/hotels/${id}`, newhotel);
      } else {
        await axios.post("/hotels", newhotel);
      }

      setShowDialog(true);
    } catch (err) {
      console.log(err);
    }

    //   await axios.post("/hotels", newhotel);
    //   setShowDialog(true);
    // } catch (err) {console.log(err)}
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{updateClicked ? "Cập nhật" : "Thêm Khách sạn mới"}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files.length > 0
                  ? typeof files[0] === 'string'
                    ?files[0]
                    : URL.createObjectURL(files[0])
                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Ảnh: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
                  {errors.photos && <span className="error">{errors.photos}</span>}
              </div>

              {hotelInputs.length > 0 && hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input id={input.id} 
                  onChange={handleChange} 
                  type={input.type} 
                  placeholder={input.placeholder} 
                  value={info[input.id] || ''}
                  />
                  {errors[input.id] && <span className="error">{errors[input.id]}</span>}
                </div>
              ))}
              <div className="formInput">
                  <label>Địa điểm nổi bật</label>
                  <select id="featured" onChange={handleChange} value={info.featured || false}>
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </div>
              <div className="selectRooms">
                  <label>Phòng</label>
                  <select id="rooms" multiple onChange={handleSelect} value={selectedRooms}>
                    {loading 
                    ? "loading"
                    : data &&
                    data.map((room) => (
                      <option key={room._id} value={room._id}>{room.title}</option>
                ))}
                  </select>
                </div>
              <button onClick={handleClick}>{updateClicked ? "Cập nhật" : "Tạo"}</button>
            </form>
          </div>
        </div>
        {showDialog && <Dialog handleClose={handleClose} isSuccess={true} position="center"/>}
      </div>
    </div>
  );
};

export default NewHotel;
