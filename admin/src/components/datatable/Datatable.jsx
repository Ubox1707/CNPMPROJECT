import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { React, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import New from "../../pages/new/New";

const Datatable = ({columns}) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([]);
  const [info, setInfo] = useState([]);
  const {data, loading, error} = useFetch(`/${path}`);
  const [updateClicked, setUpdateClicked] = useState(false);
  const navigate = useNavigate();

  

  const handleUpdate = async (id) => {
    navigate(`/${path}/new`, { state: { id, updateClicked: true, showDialog: true } });
    // setUpdateClicked(true);
  };
  useEffect(()=>{
    setList(data);
  }, [data]);
  
  const handleDelete = async (id) => {
    
    try{
      await axios.delete(`/${path}/${id}`);
      setList(list.filter((item) => item._id !== id));
     
    }catch(err){}
  };
  // const handleUpdate = async (id) => {
    
  //   try{
  //     const response = await axios.get(`/${path}/${id}`);
  //     setList(response.list);
  //     setList({
  //       ...list,
  //       [path]: data,
  //     });
     
  //   }catch(err){}
  // };
  

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
                <div className="viewButton" onClick={() => handleUpdate(params.row._id)}>Xem</div>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Xóa
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
      {path}
        <Link to={`/${path}/new`} className="link">
          Thêm mới
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={row=>row._id}
      />
    </div>
  );
};

export default Datatable;
