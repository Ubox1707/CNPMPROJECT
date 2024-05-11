import React from 'react'
import "./dialog.css"



const Dialog = ({handleClose, isSuccess, position}) => {

  const handleClick = () => {
    handleClose(); 
    
  };
  return (
    <div className={`dialog ${position}`}>
        <h1 className='alert'>Thông báo</h1>
        <p className='content'>{isSuccess ? "Thêm thành công" : "Thêm thất bại"}</p>
        <button className='btn-ok' onClick={handleClick}>OK</button>
    </div>
  )
}


export default Dialog
