import React from "react";

export const Checkbox = ({ dropdown, position }) => {
  return (
    <div
      className={`${
        dropdown ? "block" : "hidden"
      } origin-top-right absolute ${position} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex="-1"
      style={{ width: "20rem", height: "9rem" }}
    >
      <label className="container">
        One
        <input type="checkbox" checked="checked" />
        <span className="checkmark"></span>
      </label>

      <label className="container">
        Two
        <input type="checkbox" />
        <span className="checkmark"></span>
      </label>

      <label className="container">
        Three
        <input type="checkbox" />
        <span className="checkmark"></span>
      </label>

      <label className="container">
        Four
        <input type="checkbox" />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};

export default Checkbox;
