import React from 'react'

const Header = () => {
  return (
    <div className='header'>
      <div className='left-row'>
        <div className="logo">
          <img src="../assets/images/Logo.svg" alt="Logo" />
        </div>
        <div className="search-bar">
          <div className='search-bar-icon'>
          <i className="fas fa-search"></i>
          </div>
          {/* <input  className="search-bar-input" type="text" placeholder="Search for anything" /> */}
        </div>
      </div>
      <div className='right-row'>
        <div className="avatar">
          <i className="fas fa-user-alt"></i>
        </div>
        <div className="right-row-down-arrow">
          <i className="fas fa-sort-down"></i>
        </div>
      </div>
    </div>
  )
}

export default Header
