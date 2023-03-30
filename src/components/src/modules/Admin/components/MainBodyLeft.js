import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { formatPriceByCountrySymbol } from "../../../utils/formatPrice";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LocationMarkerIcon,
  GlobeAltIcon,
  PencilAltIcon,
} from "@heroicons/react/solid";
import { useTranslation } from "react-i18next";
const MainBodyLeft = ({ distributor, totalOrders, orderLength, orders }) => {
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const ccountry = AuthData?.country;
  const { t } = useTranslation();

  const formatRegion = (value) => {
    let result;
    switch (value) {
      case "Lagos And West 1":
        result = "Lagos & West 1";
        break;
      case "North And West 2":
        result = "North & West 2";
        break;
      default:
        result = "";
        break;
    }
    return result;
  };

  // const sum = (orders) => {
  //   return orders.reduce((a, b) => parseFloat(a) + parseFloat(b.totalPrice), 0);
  // };
  return (
    <>
      <div className="main-body-left">
        <div className="main-body-left-header mt-2">
          <p style={{ fontWeight: "bold" }}>{t("distributor_overview")}</p>
          {/* <div className="main-body-left-header-icon">
            <a href="">
              <PencilAltIcon className="h-5" color="#0033ff" />
            </a>
            Edit
          </div> */}
        </div>

        <div className="header-desc flex">
          <div className="header-desc-text mr-56">
            <p className="fist-pa">{distributor?.company_name}</p>
            <p>
              {distributor?.SYS_Code ? distributor?.SYS_Code : "Not Available"}
            </p>
            <p>{distributor?.registeredOn}</p>
          </div>
          <div className="footer-leftside">
            <p
              className="mb-3 pt-1"
              style={{ color: "#74767E", fontWeight: "500" }}
            >
              {ccountry === "Tanzania"
                ? "DISTRIBUTOR SPECIALIST"
                : t("distributor_developer")}
            </p>
            <div className="info space-x-2 ">
              <UserIcon className="h-5" color="#F49C00" />
              <span style={{ fontWeight: "bold" }}>{distributor?.DD_Name}</span>
            </div>
            <div className="info space-x-2 ">
              <MailIcon className="h-5" color="#F49C00" />
              <p>{distributor?.email}</p>
            </div>
          </div>
        </div>

        <div className="sales-reviews">
          <div className="total-sales">
            <p className="total-sales-title">{t("total_sales")}</p>
            <p className="total-sales-price">
              {formatPriceByCountrySymbol(ccountry, totalOrders["TotalSales"])}
            </p>
          </div>

          <div className="total-sales">
            <p className="total-sales-title">{t("total_orders")}</p>
            <p className="total-sales-price">{totalOrders["TotalOrders"]}</p>
          </div>

          <div className="total-sales">
            <p className="total-sales-title">{t("average_order_value")}</p>
            <p className="total-sales-price">
              {formatPriceByCountrySymbol(
                ccountry,
                totalOrders["AverageOrderValue"]
              )}
            </p>
          </div>
        </div>
        <hr />
        <footer className="main-body-left-footer">
          <h1 className="footer-title">{t("contact_details")}</h1>

          <div className="footer-row">
            <div className="footer-leftside">
              <div className="info space-x-2 ">
                <UserIcon className="h-5" color="#F49C00" />

                <p>
                  {t("Account_Owner")}: <span>{distributor?.Owner_Name}</span>
                </p>
              </div>
              {/* <div className="info space-x-2 ">
                <MailIcon className='h-5' color='#F49C00' />
                <p>{distributor.email}</p>
              </div> */}
              <div className="info space-x-2 ">
                <PhoneIcon className="h-5" color="#F49C00" />
                <p>{distributor?.Owner_Phone}</p>
              </div>
            </div>
            <div className="footer-rightside">
              <div className="info space-x-2 ">
                <div className="info-icon f">
                  <LocationMarkerIcon className="h-5" color="#F49C00" />
                </div>
                <div>
                  <p>{distributor?.address},</p>
                  <div>
                    <p>{distributor?.district},</p>
                  <p>{`${formatRegion(distributor?.region)}${
                    distributor?.country
                  }`}</p>
                  </div>
                  
                </div>
              </div>
              <div className="info space-x-2 ">
                <GlobeAltIcon className="h-5" color="#F49C00" />
                <p>{`${distributor?.lat}* N, ${distributor?.long}* E`}</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MainBodyLeft;
