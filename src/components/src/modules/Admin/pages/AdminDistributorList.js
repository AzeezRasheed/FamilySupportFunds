import React, { useState } from "react";
import backgroundImage from "../../../assets/images/pattern.png";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import backIcon from "../../../assets/svg/back.svg";
import profileThumbnail from "../../../assets/svg/profileThumbnail.svg";
import arrowDown from "../../../assets/svg/arrowDown.svg";
import arrowRight from "../../../assets/images/arrowRight.png";
import disThumb from "../../../assets/svg/disThumb.svg";
import profileImg from "../../../assets/images/profileIcon.png";
import signOut from "../../../assets/images/signOut.png";
import { ProfileDropdown } from "../../../components/common/dropdown";
import { logout } from "../../Auth/actions/auth.action";
import { useTranslation } from "react-i18next";
import useComponentVisible from "../../utils/useComponentVisible";

const DistributorList = () => {
    const [isVisible, setIsVisible] = useState(false);
    const showDropdown = () => {
      setIsVisible(isVisible ? false : true);
    };
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { sessionUser } = useSelector((state) => state.Auth);
  const { ref, isComponentVisible } = useComponentVisible(true);
  // const logoutfunc = () => {
  // 	dispatch(logout())
  // 	console.log("clicked");
  // }

  return (
    <>
      <div className="h-screen w-screen flex overflow-hidden" ref={ref}>
        <div className="hidden md:block h-full" style={{ width: "29rem" }}>
          <img className="h-full w-full" src={backgroundImage} alt="" />
        </div>
        <div className="h-100" style={{ width: "78rem" }}>
          <div className="flex justify-end  mt-7 mb-4 mx-7">
            {/* <div className="flex">
							<Link to='/login'>
								<img alt='' src={backIcon} />
							</Link>
							<p className="text-base font-normal ml-2" style={{ color: '##74767E', fontSize: '18px' }}> Back </p>
						</div> */}
            <div
              onClick={showDropdown}
              className="flex cursor-pointer mr-8"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              <img className="mr-1" alt="" src={profileThumbnail} />
              <img className="" alt="" src={arrowDown} />
            </div>
          </div>
          {isVisible && (
            <ProfileDropdown
              setIsVisible={setIsVisible}
              position="right-4"
              sessionUser={sessionUser}
            />
          )}

          <div className="mt-3 md:mt-9 mx-6 md:mx-44 px-0">
            <p
              className="font-normal font-customGilroy pt-3 pb-2"
              style={{ fontSize: "48px", color: "#2D2F39" }}
            >
              {t("choose_a_distributor")}
            </p>
            <input
              className="mt-9 mb-10 bg-transparent py-4 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange border-b-2 rounded w-full py-2 px-3 text-black-400"
              id="password"
              type="text"
              name="search"
              // onChange={(e) => onChange(e)}
              placeholder={t("search_for_distributor")}
            />

            <div
              className="flex cursor-pointer p-3 w-full DEFAULT:border-default hover:bg-hover border-b-2 justify-between bg-white text-center"
              style={{ height: "4.5rem" }}
            >
              <div className="flex w-full">
                <img className="mr-6" alt="" src={disThumb} />
                <div className="text-left">
                  <p className="font-semibold text-base">KMS Nigeria Limited</p>
                  <p className="mt-1 text-sm font-normal">DB/2021/0022</p>
                </div>
              </div>
              <img
                className="mr-3 my-auto"
                style={{ width: "0.525rem", height: "0.9rem" }}
                alt=""
                src={arrowRight}
              />
            </div>
            <div
              className="flex cursor-pointer p-3 w-full DEFAULT:border-default hover:bg-hover border-b-2 justify-between bg-white text-center"
              style={{ height: "4.5rem" }}
            >
              <div className="flex w-full">
                <img className="mr-6" alt="" src={disThumb} />
                <div className="text-left">
                  <p className="font-semibold text-base">KMS Nigeria Limited</p>
                  <p className="mt-1 text-sm font-normal">DB/2021/0022</p>
                </div>
              </div>
              <img
                className="mr-3 my-auto"
                style={{ width: "0.525rem", height: "0.9rem" }}
                alt=""
                src={arrowRight}
              />
            </div>
            <div
              className="flex cursor-pointer p-3 w-full DEFAULT:border-default hover:bg-hover border-b-2 justify-between bg-white text-center"
              style={{ height: "4.5rem" }}
            >
              <div className="flex w-full">
                <img className="mr-6" alt="" src={disThumb} />
                <div className="text-left">
                  <p className="font-semibold text-base">KMS Nigeria Limited</p>
                  <p className="mt-1 text-sm font-normal">DB/2021/0022</p>
                </div>
              </div>
              <img
                className="mr-3 my-auto"
                style={{ width: "0.525rem", height: "0.9rem" }}
                alt=""
                src={arrowRight}
              />
            </div>
            <div
              className="flex cursor-pointer p-3 w-full DEFAULT:border-default hover:bg-hover border-b-2 justify-between bg-white text-center"
              style={{ height: "4.5rem" }}
            >
              <div className="flex w-full">
                <img className="mr-6" alt="" src={disThumb} />
                <div className="text-left">
                  <p className="font-semibold text-base">KMS Nigeria Limited</p>
                  <p className="mt-1 text-sm font-normal">DB/2021/0022</p>
                </div>
              </div>
              <img
                className="mr-3 my-auto"
                style={{ width: "0.525rem", height: "0.9rem" }}
                alt=""
                src={arrowRight}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DistributorList;
