import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { silentRenewError } from "redux-oidc";
import transferArrow from "../../assets/svg/transferArrow.svg";
import countryConfig from "../../utils/changesConfig.json";
import { getLocation } from "../../utils/getUserLocation";
import { Fade } from "react-reveal";
import { useTranslation } from "react-i18next";

const Transfer = ({ distributor, allDrivers, getDriver, driver }) => {
  const [userCountry, setUserCountry] = useState("Ghana");
  const { t } = useTranslation();

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry]);
  return (
    <>
      <div className="flex mt-10 justify-between">
        <div
          className="selectCont"
          style={{ backgroundColor: countryConfig[userCountry].vanBoxLeft }}
        >
          <label
            for="select-transfer"
            style={{ color: countryConfig[userCountry].textColor }}
            className="selectLabel"
          >
            {t("transfer_from")}:
          </label>
          <div
            className="selectTransfer"
            id="select-transfer"
            placeholder={t("select")}
          >
            <p className="transferOption font-bold text-black">
              {distributor?.company_name}
            </p>
          </div>
        </div>
        <img className="mx-8" src={transferArrow} alt="transfer Arrow" />
        <div
          className="selectCont"
          style={{ backgroundColor: countryConfig[userCountry].vanBoxRight }}
        >
          <label
            for="selectTransfer"
            style={{ color: "#fff" }}
            className="selectLabel"
          >
            {t("transfer_to")}:
          </label>
          {allDrivers.length > 0 ? (
            <select
              className="selectTransfer outline-none"
              id="select-transfer"
              value={driver}
              // onClick={setProductsData(driverId)}
              onChange={(e) => {
                e.preventDefault();
                getDriver(e.target.value);
              }}
            >
              <option
                className="transferOption font-bold text-black"
                value={null}
              >
                {t("select_driver")}
              </option>
              {allDrivers.map((driver, index) => (
                <option
                  className="font-bold text-black transferOption font-bold text-black"
                  key={driver.vehicleId}
                  value={`${driver.vehicleId}-${driver.name}`}
                  name="driver"
                >
                  {driver.status !== 0 && driver.name !== t("select_driver") && driver.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="mx-4 mt-1 font-medium text-white">
              {t("no_drivers_available")}
            </div>
          )}
        </div>
      </div>
      {/* {
		  
		  <Fade when={showError}><div style={{ float: "right", paddingRight: 70, color: "#D82C0D", display: 'flex', marginTop: 8 }}>
			  
        	<img src={error} width="30" />&nbsp;<span>Originating warehouse and destination warehouse cannot be the same</span>
			
      </div></Fade> 
	  }
       */}
    </>
  );
};

export default Transfer;
