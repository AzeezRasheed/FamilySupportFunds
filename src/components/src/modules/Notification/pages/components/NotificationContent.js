import React, { useEffect, useState } from "react";
import onlineImg from "../../../../assets/svg/online.svg";
import { useDispatch, useSelector } from "react-redux";
import NoNotificationImg from "../../../../assets/svg/noNotification.svg";
import SortImg from "../../../../assets/svg/sort.svg";
import { setDetailsForAssignRole } from "../../../Admin/KPO/actions/UsersAction";
import { useTranslation } from "react-i18next";
import moment from "moment";

const NotificationContent = ({ dataHeader, notificationData, loadingData, outStockError, openOrdersError }) => {
  const [openTab, setOpenTab] = useState(1);
  const { activeTab } = useSelector((state) => state.DashboardTabReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [filteredNotifications, setFilteredNotifications] = useState(notificationData);

  // const setUserDetails = (vall) => {
  //   dispatch(setDetailsForAssignRole(vall));
  //   setOpen(true);
  // };

  useEffect(() => {
    let filteredNotifications;
    if (activeTab === 1) {
      filteredNotifications = notificationData;
    } else if (activeTab === 2) {
      filteredNotifications = notificationData.filter((notification) => notification.type === 'openOrders')
    } else {
      filteredNotifications = notificationData.filter((notification) => notification.type === 'outOfStock')
    }
    setFilteredNotifications(filteredNotifications)
  }, [activeTab, notificationData])

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
                  className={`text-base text-center font-normal mr-8 px-6 py-2 rounded-md block bg--yellow
                    ${
                      openTab === val.tabIndex
                        ? "font-bold shadow-lg"
                        : "border-default-b border-2"
                    }`
                  }
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
                className="text-base text-center font-normal mr-8 px-4 py-2 rounded-md flex text-default bg-white border-default-b border-2"
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
            <div
              className="tab-content tab-space"
              style={{ cursor: "pointer" }}
            >
              <div className="bg-white w-full rounded-md px-2">
                <div className="new-update">
                  {
                    loadingData
                  ?
                    <div
                      style={{ paddingTop: 10, paddingBottom: 10, color: "#50525B" }}
                    >
                      {t("Loading")}...
                    </div>
                  :
                    filteredNotifications && filteredNotifications.length > 0
                  ?
                    filteredNotifications.map((val, index) => (
                      <div className="flex w-full mt-5 mb-8" key={index}>
                        <div className="flex w-3/5">
                          <img className="mr-4" src={onlineImg} alt="" />
                          <p
                            className="w-full font-normal text-base"
                            style={{ color: "#50525B" }}
                          >
                            {val?.message}
                          </p>
                        </div>
                        <p
                          className="w-1/5 text-center font-normal text-base"
                          style={{ color: "#50525B" }}
                        >
                          {val?.date}
                        </p>
                        <p
                          className="w-1/5 text-center font-normal text-base"
                          style={{ color: "#50525B" }}
                        >
                          {val?.time}
                        </p>
                      </div>
                    ))
                  :
                    openOrdersError && activeTab === 2
                  ?
                    <div
                      className="text-center"
                      style={{ paddingTop: 10, paddingBottom: 10, color: "#50525B" }}
                    >
                      {openOrdersError}
                    </div>
                  :
                    outStockError && activeTab === 3
                  ?
                    <div
                      className="text-center"
                      style={{ paddingTop: 10, paddingBottom: 10, color: "#50525B" }}
                    >
                      {outStockError}
                    </div>
                  :
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
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationContent;
