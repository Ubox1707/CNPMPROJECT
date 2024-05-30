import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Dialog from "../../components/dialog/Dialog";

const New = ({ inputs }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const { id, updateClicked } = location.state || {};
  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    inputs.forEach(input => {
      if (!info[input.id]) {
        tempErrors[input.id] = `${input.label} là bắt buộc`;
        isValid = false;
      }
    });

    setErrors(tempErrors);
    return isValid;
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const res = await axios.get(`/users/${id}`);
          setInfo(res.data);
          if (res.data.img) {
            setFile(null); // Đảm bảo không có file nào từ input bị set
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, [id]);


  
  

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClose = () => {
    setShowDialog(false);
    navigate("/users");
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    let imgURL = info.img 
    if (file) {
      try {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
  
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dehf2hp4a/image/upload",
          data
        );
  
        imgURL = uploadRes.data.url;
      } catch (err) {
        console.log(err);
      }
    }
  
    try {
      const newUser = {
        ...info,
        img: imgURL,
      };
  
      if (updateClicked && id) {
        await axios.put(`/users/${id}`, newUser);
      } else {
        await axios.post("/users", newUser);
      }

      setShowDialog(true);
    } catch (err) {
      console.log(err);
    }    
  };

  
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
         <div className="top">
          <h1>{updateClicked ? "Cập nhật" : "Thêm tài khoản mới"}</h1>
        </div> 
        
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : (info.img ||"https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg")
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
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
                {errors.file && <span className="error">{errors.file}</span>}
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                    value={info[input.id] || ""}
                  />
                  {errors[input.id] && <span className="error">{errors[input.id]}</span>}
                </div>
              ))}
              <button onClick={handleClick}>{updateClicked ? "Cập nhật" : "Tạo"}</button>
            </form>
          </div>
        </div>
        {showDialog && <Dialog handleClose={handleClose} isSuccess={true} position="center"/>}
      </div>
    </div>
  );
};

export default New;