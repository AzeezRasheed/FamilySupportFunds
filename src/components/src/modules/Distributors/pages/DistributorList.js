import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import profileThumbnail from "../../../assets/svg/profileThumbnail.svg";
import arrowDown from "../../../assets/svg/arrowDown.svg";
import arrowRight from "../../../assets/images/arrowRight.png";
import disThumb from "../../../assets/svg/disThumb.svg";
import Loading from "../../../components/common/Loading";
import {
  getAllDistributors,
  getAllUsers,
} from "../../Admin/KPO/actions/UsersAction";
import { ProfileDropdown } from "../../../components/common/dropdown";
import AuthSidebar from "../../../components/common/AuthSidebar";
import { useTranslation } from "react-i18next";
// import { logout } from "../../../modules/Auth/actions/auth.action"

const DistributorList = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [loadingState, setLoadingState] = useState(true);
  const dispatch = useDispatch();
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const { sessionUser } = useSelector((state) => state.Auth);
  const country = AuthData?.country;
  useEffect(() => {
    dispatch(getAllDistributors(country));
    dispatch(getAllUsers(country));
  }, [country]);
    const [isVisible, setIsVisible] = useState(false);
    const showDropdown = () => {
      setIsVisible(isVisible ? false : true);
    };

  const { id } = useParams();
  const KPO_id = parseInt(id);
  const allUsers = useSelector((state) => state.AllUsersReducer.allUsers);
  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  const thisKPO = allUsers?.filter((user) => user.id === KPO_id);
  const dist_CODES = thisKPO?.length ? JSON.parse(thisKPO[0]?.DIST_Code) : [0];

  if (allDistributors?.length > 0 && loadingState) {
    setLoadingState(false);
  }

  const searchResult = () => {
    let result = [];
    dist_CODES &&
      dist_CODES.filter((val) => {
        return (
          allDistributors &&
          allDistributors.filter((distCode) => {
            if (distCode?.DIST_Code.includes(val)) {
              if (
                distCode?.company_name
                  .toLowerCase()
                  .startsWith(searchValue.toLowerCase())
              ) {
                result.push(distCode);
              }
            }
          })
        );
      });
    return result;
  };

  const generateData = (code) => {
    const gety = allDistributors?.filter((dist) => dist.DIST_Code === code)[0];

    return {
      name: gety ? gety.company_name : "",
      salesForceCode: gety ? gety.SF_Code : "",
    };
  };

  return (
    <>
      <div className="h-screen w-screen flex overflow-hidden">
        <div className="hidden md:block h-full" style={{ width: "29rem" }}>
          <AuthSidebar />
        </div>
        <div className="h-100" style={{ width: "78rem" }}>
          <div className="flex justify-end  mt-7 mb-4 mx-7">
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("search_for_distributor")}
            />

            {!loadingState ? (
              <div
                className="overflow-y-scroll scrollbar-hide"
                style={{ height: "30rem" }}
              >
                {searchResult().map((code, index) => (
                  <Link to={`/dashboard/overview/${code.DIST_Code}`}>
                    <div
                      key={index}
                      className="flex cursor-pointer p-3 w-full DEFAULT:border-default hover:bg-hover border-b-2 justify-between bg-white text-center"
                      style={{ height: "4.5rem" }}
                    >
                      <div className="flex w-full">
                        <img className="mr-6" alt="" src={disThumb} />
                        <div className="text-left">
                          <p className="font-semibold text-base">
                            {generateData(code.DIST_Code)?.name}
                          </p>
                          <p className="mt-1 text-sm font-normal">
                            {generateData(code.DIST_Code)?.salesForceCode}
                          </p>
                        </div>
                      </div>
                      <Link
                        className="mr-3 my-auto"
                        to={`/dashboard/overview/${code.DIST_Code}`}
                      >
                        <img
                          style={{ width: "0.525rem", height: "0.9rem" }}
                          alt=""
                          src={arrowRight}
                        />
                      </Link>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <center>
                <Loading />
              </center>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DistributorList;
