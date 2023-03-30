import React, { useState, useEffect } from "react";
import AuthSidebar from "../../../components/common/AuthSidebar";
import { useSelector, connect } from "react-redux";
import userManager from "../../../utils/userManager";
import { useTranslation } from "react-i18next";
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'

const Blocked = () => {
  const { t } = useTranslation();
  const [userCountry, setUserCountry] = useState('Ghana');


  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry])
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
              {t(
                "Your_account_has_been_blocked_hence_you_are_not_permitted_to_access_your_dashboard"
              )}
            </p>
            <button
              className="w-full md:w-56 lg:w-56 my-5 py-3 focus:outline-none rounded text-white text-center text-base font-bold font-customRoboto"
              style={{
                backgroundColor: countryConfig[userCountry].buttonColor,
                color: countryConfig[userCountry].textColor,
              }}
              type="button"
              onClick={() => userManager.signinRedirect()}
            >
              {t("continue")}
            </button>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blocked;
