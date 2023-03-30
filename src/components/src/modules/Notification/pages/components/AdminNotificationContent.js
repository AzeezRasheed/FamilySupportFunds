import React, { useState } from "react";
import onlineImg from "../../../../assets/svg/online.svg";
import { useDispatch, useSelector } from "react-redux";
import NoNotificationImg from "../../../../assets/svg/noNotification.svg";
import SortImg from "../../../../assets/svg/sort.svg";
import { setDetailsForAssignRole } from "../../../Admin/KPO/actions/UsersAction";
import { useTranslation } from "react-i18next";

const Tabs = ({ dataHeader, dataContent, notificationData, setOpen, setUser, buttonColor, color }) => {
  const [openTab, setOpenTab] = useState(1);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const setUserDetails = (vall) => {
    dispatch(setDetailsForAssignRole(vall));
    setOpen(true);
  };
  return (
    <>
      <div className="flex mt-2 flex-wrap">
        <div className="w-full ">
          <ul
            className="flex mb-0 mx-6 list-none flex-wrap pb-5 flex-row"
            role="tablist"
          >
            {dataHeader.map((val) => (
              <li key={val.tabIndex} className="flex">
                <a
                  className={`text-base text-center font-normal mr-8 px-6 py-2 rounded-md block
											${
                        openTab === val.tabIndex
                          ? "font-bold rounded-md shadow-lg"
                          : "font-normal border-default-b border-2"
                      }`}
                  style={{
                    backgroundColor: buttonColor, color: color
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(val.tabIndex);
                  }}
                  data-toggle="tab"
                  href={val.link}
                  role="tablist"
                >
                  <i className="fas fa-space-shuttle text-base mr-1"></i>{" "}
                  {val.tabLabel}
                </a>
              </li>
            ))}
            {/* <li className="flex">
              <a
                className="flex text-base text-center font-normal mr-8 px-4 py-2 rounded-md block text-default font-normal bg-white border-default-b border-2"
                // onClick={e => {
                // 	e.preventDefault();
                // 	setOpenTab(val.tabIndex);
                // }}
              >
                <img className="mr-1 pr-2" src={SortImg} alt="" /> Newest to
                Oldest
              </a>
            </li> */}
          </ul>
          <div className="border-default-b border-b-2 w-full" />
          <div className="mx-6 py-2 flex-auto">
            <p
              className="font-customRoboto mt-5 mb-5 font-normal text-base "
              style={{ color: "#74767E" }}
            >
              {dataContent.length} {t("unread")}
            </p>
            {dataContent.map((vall, index) => (
              <div
                key={index}
                className="tab-content tab-space"
                style={{ cursor: "pointer" }}
              >
                {/* <div
                  className={openTab === val.tabIndex ? "block" : "hidden"}
                  id={val.id}
                > */}
                {/* {notificationData.length < 1 ? (
                    <div className="m-auto py-32 text-center">
                      <img
                        className="m-auto pb-3"
                        src={NoNotificationImg}
                        alt="no-notification"
                      />
                      <p
                        className="font-normal mb-5"
                        style={{ color: "#50525B", fontSize: "14px" }}
                      >
                        You do not have any notification
                      </p>
                    </div>
                  ) : (
                    <> */}

                <div className="bg-white w-full rounded-md px-2">
                  <div className="new-update">
                    {/* {notificationData &&
                      notificationData.map((val) => ( */}
                    <div className="flex w-full mt-5 mb-8">
                      <div className="flex w-1/2">
                        <img className="mr-4" src={onlineImg} alt="" />
                        <p
                          className="w-full font-normal text-base"
                          style={{ color: "#50525B" }}
                          onClick={() => setUserDetails(vall)}
                        >
                          {t("new_sign_up_by")}
                          {" " + vall.firstname + " " + vall.lastname}
                        </p>
                      </div>
                      <p
                        className="w-1/4 text-left font-normal text-base"
                        style={{ color: "#50525B" }}
                      >
                        {vall.email === "null" ? vall.phone_number : vall.email}
                      </p>
                      <p
                        className="w-1/4 text-left font-normal text-base"
                        style={{ color: "#50525B" }}
                      >
                        {" "}
                        {t("at")}
                        {" " + vall.registeredOn}
                      </p>
                      {/* <p
                            className="w-1/4 text-right font-normal text-base"
                            style={{ color: "#50525B" }}
                          >
                            {val.time}
                          </p> */}
                    </div>
                    {/* ))} */}
                    {/* </div> */}
                  </div>
                  {/* </>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;
