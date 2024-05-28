import useFetch from "../../hooks/useFetch";
import "./featured.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";

const Featured = () => {
  const { data, loading, error } = useFetch(
    "/hotels/countByCity?cities=Hà Nội,Đà Nẵng,Hồ Chí Minh"
  );
  
  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);

  const dates = [
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ];

  const options = {
    adult: 1,
    children: 0,
    room: 1,
  };

  const handleClick = (destination) => {
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    navigate("/hotels", { state: { destination, dates, options } });
  };

  return (
    <div className="featured">
      {loading ? (
        "Loading please wait"
      ) : (
        <>
          <div className="featuredItem" onClick={() => handleClick("Hà Nội")}>
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Hà Nội</h1>
              <h2>{data[0]} chỗ nghỉ</h2>
            </div>
          </div>
          
          <div className="featuredItem" onClick={() => handleClick("Đà Nẵng")}>
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>Đà Nẵng</h1>
              <h2>{data[1]} chỗ nghỉ</h2>
            </div>
          </div>
          
          <div className="featuredItem" onClick={() => handleClick("Hồ Chí Minh")}>
            <img
              src="https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
              alt=""
              className="featuredImg"
            />
            <div className="featuredTitles">
              <h1>TP. Hồ Chí Minh</h1>
              <h2>{data[2]} chỗ nghỉ</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;