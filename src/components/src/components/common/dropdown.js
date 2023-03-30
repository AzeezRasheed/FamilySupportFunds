import React from "react";
import { Link } from "react-router-dom";
import profileImg from "../../assets/images/profileIcon.png";
import signOut from "../../assets/images/signOut.png";
import { useSelector } from "react-redux";
import userManager from "../../utils/userManager";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../../modules/Auth/actions/auth.action";
import useComponentVisible from "../../utils/useComponentVisible";

export const ProfileDropdown = ({ position, setIsVisible }) => {
  const { t } = useTranslation();
  const { ref } = useComponentVisible(setIsVisible);
  const handleLogout = () => {
    userManager.signoutRedirect();
    localStorage.clear()
  };
	const AuthData = useSelector(state => state.Auth.sessionUserData);

  return (
    <div
      className={`origin-top-right absolute ${position} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex="-1"
      style={{
        width: "20rem",
        height: "10rem",
        marginTop: "3%",
        zIndex: 1000000,
      }}
      ref={ref}
    >
      <div className="py-1 w-fu" role="none">
        <div className="flex flex-grow">
          <img
            className="m-4"
            style={{ width: "2.5rem", height: "2.5rem" }}
            alt=""
            src={profileImg}
          />
          <div className="relative">
            {/* <Link className="cursor-pointer" to=""> */}
            <p
              className="font-medium outline-none text-base block px-2 py-2"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-0"
              style={{ color: "#2D2F39" }}
            >
              {AuthData?.firstname} {AuthData?.lastname}
            </p>
            <p
              className="font-normal outline-none text-sm px-2 "
              role="menuitem"
              tabIndex="-1"
              id="menu-item-0"
              style={{ color: "#74767E" }}
            >
              {AuthData?.email}
            </p>
            {/* </Link> */}
          </div>
        </div>
        <div className="DEFAULT:border-default border-b-2 mx-3" />
        <form method="POST" action="#" role="none">
          <div className="flex py-4 cursor-pointer" style={{ margin: "0 32%" }}>
            <img
              className=""
              style={{ width: "1.313rem", height: "1.313rem" }}
              src={signOut}
              alt=""
            />
            <p
              onClick={handleLogout}
              className="font-medium outline-none block px-2 text-base"
              role="menuitem"
              tabIndex="-1"
              id="menu-item-3"
              style={{ color: "#2D2F39" }}
            >
              {t("sign_out")}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
