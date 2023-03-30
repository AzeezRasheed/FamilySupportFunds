import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/svg/Logo.svg";
import KujaLogo from "../../assets/svg/kuja-logo.svg";
import countryConfig from "../../utils/changesConfig.json";
import { getLocation } from "../../utils/getUserLocation";
import arrowDown from "../../assets/svg/arrowDown.svg";
import profileThumbnail from "../../assets/svg/profileThumbnail.svg";
import { ProfileDropdown } from "../../components/common/dropdown";
import UnsavedChanges from "../../components/common/UnsavedChanges";
import LanguageSelect from "../../languageSelect";

const Navbar = ({ logOut, sessionUser }) => {
  const [country, setCountry] = useState("Ghana");
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const userCountry = AuthData?.country;
  const [isVisible, setIsVisible] = useState(false);
  const showDropdown = () => {
    setIsVisible(isVisible ? false : true)
  };

  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country]);

  const priceChanged = useSelector((state) => state.PricingReducer.priceChange);
  return (
    <>
      {priceChanged ? (
        <UnsavedChanges />
      ) : (
        <div
          className={`w-full h-18 ${
            country === "Ghana" ? "border-b-2" : "shadow-xl"
          }`}
          style={{ backgroundColor: countryConfig[country].navBarColor }}
        >
          <div className="flex w-full p-3 justify-between">
            <div className="flex mt-1" style={{ width: "40%" }}>
              {/* <input
                className="h-10 py-4 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full py-2 px-3 ml-4 text-black-400"
                id="search"
                type="text"
                name='search'
                style={{ width: '29.75rem', backgroundColor: '#E5E5E5' }}
                placeholder="Search for anything"
              /> */}
            </div>
            <div className="flex mt-1 justify-between relative">
              <div
                onClick={showDropdown}
                className="  flex cursor-pointer mr-5"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
              >
                <img className="mr-1" alt="" src={profileThumbnail} />
                <img className="" alt="p-icon" src={arrowDown} />
              </div>
              {isVisible && (
                <ProfileDropdown
                  setIsVisible={setIsVisible}
                  position="right-4"
                  sessionUser={sessionUser}
                />
              )}
              {userCountry === "Mozambique" && (
                <div className="language-select-dropdown">
                  <LanguageSelect />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
