import React from 'react'

const ComfirmationModal = () => {
  return (
    <div className="modal full-height">
      <div className="modal-comfirmation-body modal-form">
        <div className="modal-comfirmation-body-header">
       <i className="fas fa-times"></i>
        <p>Are you sure you want to exit this customer creation?</p>
        </div>
        <div className="buttons">
          <button className="btn">Cancel</button>
          <button className="btn btn-red">Yes, exit</button>
        </div>
      </div>
    </div>
  )
}

export default ComfirmationModal
