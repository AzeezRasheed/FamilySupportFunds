import React, { useState, useEffect } from "react";
import AuthSidebar from "../../../components/common/AuthSidebar";
import {  useSelector, connect } from "react-redux";
import userManager from "../../../utils/userManager";
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'

import {  Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UnAssigned = () => {
  const {t} = useTranslation()
  const [click, setClick] = useState(false);
const AuthData = useSelector(state => state.Auth.sessionUserData);
const [userCountry, setUserCountry] = useState('Ghana');
  
  useEffect(async () => {
		const loc = await getLocation();		
    setUserCountry(loc);
  })
  
  const checkRole = () => {
    userManager.signinRedirect()
    setClick(true)
    const superVid = AuthData?.id;
    const kpoType = JSON.parse(AuthData?.DIST_Code);
    const kpoStatus = AuthData?.status;

    switch (AuthData?.roles) {
      case null || undefined || "":
        <Redirect to = "/auth/unassigned" />;
        break;
      case "KPO":
        if (kpoType === null) {
          return <Redirect to ="/auth/unassigned" />;
        } else if (kpoType.length > 1 && kpoType.length !== 1) {
          return <Redirect to = {`/kpo-supervisor/overview/${superVid}`} />;
        } else {
          const kpoDistCode = JSON.parse(AuthData?.DIST_Code);
          return <Redirect to = {`/dashboard/overview/${kpoDistCode}`} />;
        }
        case "Mini-Admin":
			// history.push(`/kpo-supervisor/overview/${kpoType[0]}/${superVid}`);
        if (kpoType === null) {
          return <Redirect to = {"/auth/unassigned"} />;
        } else if (kpoStatus === "Blocked") {
          return <Redirect to = {"/auth/blocked"} />;
        }
        else{
          return <Redirect to = {"/min-admin-dashboard"} />;
        }
      case "Supervisor":
        <Redirect to = {`/kpo-supervisor/overview/${superVid}`} />;
        break;
      case "Admin":
        <Redirect to ="/admin-dashboard" />;
        break;
      default:
        <Redirect to ="/auth/unassigned" />;
        break;
    }
  }
  return (
    <>
      <div className="h-screen w-screen flex overflow-hidden">
        <div className="hidden md:block h-full" style={{ width: "30rem" }}>
          <AuthSidebar />
        </div>
        <div className="h-100" style={{ width: "78rem" }}>
          <div
            className="mt-80 ml-72 px-0 flex flex-col"
            style={{ height: "100%" }}
          >
            <p
              className="text-black-400 font-normal font-customGilroy pt-3 pb-2"
              style={{ fontSize: "25px", color: "#2D2F39" }}
            >
              {AuthData?.roles === null && click
                ? t("still_no_role")
                : t("please_wait_while_admin_assigns")}
            </p>
            <button
              className="w-full md:w-56 lg:w-56 my-5 py-3 focus:outline-none rounded text-center text-base font-bold font-customRoboto"
              style={{ 
                backgroundColor: click ? "#D3D3D3" : countryConfig[userCountry].buttonColor,
                color: click ? "#808080" : countryConfig[userCountry].textColor
               }}
              type="button"
              onClick={checkRole}
            >
              {click ? "Loading" : t("continue")}
            </button>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect()(UnAssigned);
