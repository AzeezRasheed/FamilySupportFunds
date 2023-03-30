import React from 'react';
import logo from '../../assets/svg/Logo.svg'

const DriverRedirect = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <div>
      <img
        src={logo}
        alt="logo"
        style={{
          objectFit: "contain",
          objectPosition: "center",
          width: "300px",
        }}
      />
      <h5 
        className="font-bold"
        style={{
          textAlign: "center",
          marginBottom: "10px",
          color: "grey",
        }}
      >
        Welcome to ABInBev Distribution Central
      </h5>
      <h5 className="text-md" style={{ textAlign: "center", color: "red" }}>
        Please wait while we prepare your data...
      </h5>
    </div>
  </div>
);

export default DriverRedirect