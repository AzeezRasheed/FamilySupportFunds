import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../assets/svg/Logo.svg";
import warehouse from "../assets/svg/warehouse.svg";
import arrowDown from "../assets/svg/arrowDown.svg";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import profileThumbnail from "../assets/svg/profileThumbnail.svg";
import bell from "../assets/svg/bell.svg";
import { ProfileDropdown } from "../components/common/dropdown";
import arrowRight from "../assets/images/arrowRight.png";
import disThumb from "../assets/svg/disThumb.svg";
import Loading from "../components/common/Loading";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  loadUser,
  loadUserDataSuccess,
} from "../modules/Auth/actions/auth.action";
import { getAllUsers } from "../modules/Admin/KPO/actions/UsersAction";
import {
  getSingleDistributor,
  getAllDistributor,
} from "../modules/Admin/pages/actions/adminDistributorAction";
import UnsavedChanges from "../components/common/UnsavedChanges";
import UnsavedDistChanges from "../components/common/UnsavedDistChanges";
import UnsavedTransferChanges from "../components/common/UnsavedTransferChanges";
import UnsavedEmptiesChanges from "../components/common/UnsavedEmptiesChanges";
import UnsavedExpiryChanges from "../components/common/UnsavedExpiryChange";
import UnsavedDailyStock from "../components/common/UnsavedDailyStock";
import UnsavedVanTransferChanges from "../components/common/UnsavedVanReplenishChange";
import UnsavedProductCatalogueChanges from "../components/common/UnsavedProductCatalogueChanges";

import UnsavedOtherProducts from "../components/common/UnsavedOtherProducts";
import countryConfig from "../utils/changesConfig.json";
import { getLocation } from "../utils/getUserLocation";
import LanguageSelect from "../languageSelect";
import useComponentVisible from "../utils/useComponentVisible";

const Navbar = ({
  location,
  // showDropdown,
  distributor,
  getSingleDistributor,
  // dropdown,
  sessionUser,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const priceChanged = useSelector((state) => state.PricingReducer.priceChange);
  // const distPriceChanged = useSelector((state) => state.DistributorPricingReducer.distPriceChange);

  const [userCountry, setUserCountry] = useState("Ghana");
  const [doneDailyStock, setDoneDailyStock] = useState();
   const [isVisible, setIsVisible] = useState(false);
  const showDropdown = () => {
    setIsVisible(isVisible ? false : true)
  };

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry]);
  const transferChange = useSelector(
    (state) => state.InventoryReducer.transferChange
  );
  const vantransferChange = useSelector(
    (state) => state.VanInventoryReducer.transferVanChange
  );
  const productCatalogueChange = useSelector(
    (state) => state.ProductCatalogueReducer.cataloguePriceChange
  );
  const emptiesChange = useSelector(
    (state) => state.InventoryReducer.emptiesChange
  );

  const code = location.pathname.split("/")[3];

  const AuthData = useSelector((state) => state.Auth.sessionUserData);

  const country = AuthData?.country;

  const [loadingState, setLoadingState] = useState(true);
  const [distList, showDistList] = useState(false);
  const [distCode, showDistCode] = useState([]);
  const [result, setResult] = useState([]);

  const KPO_id = parseInt(AuthData?.id);
  const allUsers = useSelector((state) => state.AllUsersReducer.allUsers);
  const allDistributors = useSelector(
    (state) => state.AllDistributorReducer.all_distributors
  );

  useEffect(() => {
    dispatch(loadUser());
  }, []);
  useEffect(() => {
    dispatch(getAllUsers(country));
    dispatch(getAllDistributor(country));
  }, [country]);

  const thisKPO = allUsers?.filter((user) => {
    return user.id === KPO_id;
  });
  const dist_CODES =
    thisKPO?.length > 0 && thisKPO[0]?.roles !== "Admin"
      ? JSON.parse(thisKPO[0]?.DIST_Code)
      : [0];

  const distResult = dist_CODES?.filter((val) => val);
  const generateData = (code) => {
    const gety = allDistributors?.filter((dist) => {
      return dist?.DIST_Code === code;
    })[0];
    return {
      name: gety ? gety.company_name : "",
      salesForceCode: gety ? gety.SF_Code : "",
    };
  };
  useEffect(() => {
    if (allUsers?.length > 0) {
      setResult(distResult);
      showDistCode(dist_CODES);
      getSingleDistributor(code);
      if (dist_CODES?.length > 0 && loadingState) {
        setLoadingState(false);
      }
    }
  }, [allUsers?.length, AuthData?.length]);

  const expiredChange = useSelector(
    (state) => state.InventoryReducer.expiredChange
  );

  const otherProductsChange = useSelector(
    (state) => state.InventoryReducer.otherProductsChange
  );

  const dailyStockChange = useSelector(
    (state) => state.InventoryReducer.transferChangeDailyStock
  );

  let component;

  if (priceChanged) {
    component = <UnsavedChanges />;
  } else if (transferChange) {
    component = <UnsavedTransferChanges />;
  } else if (emptiesChange) {
    component = <UnsavedEmptiesChanges />;
  } else if (dailyStockChange) {
    component = <UnsavedDailyStock />;
  } else if (expiredChange) {
    component = <UnsavedExpiryChanges />;
  } else if (vantransferChange) {
    component = <UnsavedVanTransferChanges />;
  } else if (otherProductsChange) {
    component = <UnsavedOtherProducts />;
  } else if (productCatalogueChange) {
    component = <UnsavedProductCatalogueChanges />;
  } else {
    component = (
      <>
        <div
          className={`w-full h-18 ${
            userCountry === "Ghana" ? "border-b-2" : "shadow-xl"
          }`}
          style={{ backgroundColor: countryConfig[userCountry].navBarColor }}
        >
          <div className="flex w-full p-3 justify-between">
            <div className="flex mt-1" style={{ width: "40%" }}>
              {/* <img src={Logo} alt="logo" /> */}
            </div>
            <div
              className="flex mt-1 justify-between md:w-1/2 lg:w-1/2 items-center"
              // style={{ width: "40%" }}
            >
              <div
                // style={{ width: '50%'}}
                className="flex cursor-pointer mr-3 mt-2 md:w-1/2 lg:w-1/2 16inch:w-2/5"
                id="menu2-button"
                aria-expanded="true"
                aria-haspopup="true"
              >
                {distributor?.company_name ? (
                  <>
                    <img
                      className="mr-1 mt-3"
                      alt=""
                      src={warehouse}
                      style={{ height: "65%" }}
                    />
                    <div className="mt-3 ml-2">{distributor?.company_name}</div>
                  </>
                ) : (
                  <div className="mt-3 ml-2">Loading</div>
                )}
                {result?.length > 1 && (
                  <div
                    onClick={() => showDistList(!distList)}
                    className="mt-4 ml-2"
                  >
                    <img className="" alt="d-icon" src={arrowDown} />
                  </div>
                )}
              </div>
              <div className="mt-4" style={{ height: "20%" }}>
                {!loadingState ? (
                  <div
                    className="origin-top-right absolute rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    style={{
                      right: "16%",
                      marginTop: "3%",
                      width: "auto",
                      zIndex: "10000",
                    }}
                  >
                    {result?.map((code, index) => (
                      <div className="">
                        <div
                          className={`${
                            distList ? "flex" : "hidden"
                          } px-4 py-5`}
                          style={{ height: "auto", width: "100%" }}
                          onClick={() =>
                            (window.location.href = `/dashboard/overview/${code}`)
                          }
                        >
                          <div key={index} className="flex w-full">
                            <img className="mr-6" alt="" src={disThumb} />
                            <div className="text-left">
                              <p className="font-semibold text-base">
                                {generateData(code)?.name}
                              </p>
                              <p className="mt-1 text-sm font-normal">
                                {generateData(code)?.SYS_Code}
                              </p>
                            </div>
                          </div>
                          <div className="mr-3 my-auto">
                            <img
                              style={{ width: "0.525rem", height: "0.9rem" }}
                              alt=""
                              src={arrowRight}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <center />
                )}
              </div>
              <div className="flex mt-1 justify-between relative">
                <Link to={`/dashboard/notifications/${code}`} className="flex">
                  <div
                    className="flex mt-1 mr-8 justify-between relative"
                  >
                    <img className="mr-1 mt-3" alt="" src={bell} style={{ height: "60%" }} />
                    <p className="mt-3 ml-2">{t("notifications")}</p>
                  </div>
                </Link>
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
                      position="right-4"
                      showDropdown={setIsVisible}
                      sessionUser={sessionUser}
                    />
                  )}
                  {country === "Mozambique" && (
                    <div className="language-select-dropdown">
                      <LanguageSelect />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return component;
};

const mapStateToProps = (state) => {
  return {
    distributor: state.AllDistributorReducer.distributor,
  };
};

export default connect(mapStateToProps, {
  getSingleDistributor,
})(Navbar);
