import React, { useEffect, useState, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import {
  Edit,
  Mail,
  Phone,
  Previouspage,
  Profile,
} from "../../../assets/svg/adminIcons";
import Dashboard from "../../../Layout/Mini-Admin/Dasboard";
import { ReactComponent as Remove } from "../../../assets/svg/kpoIcons/Remove.svg";
import {
  getAllDistributors,
  getAllUsers,
} from "../../Admin/KPO/actions/UsersAction";
import Loading from "../../../components/common/Loading";
import { filter } from "lodash";
import { useTranslation } from "react-i18next";

const ManageUser = () => {
  const {t} = useTranslation()
  const history = useHistory();
  const [loadingState, setLoadingState] = useState(true);
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  useEffect(() => {
    dispatch(getAllDistributors(country));
    dispatch(getAllUsers(country));
  }, [country]);

  const { id, userType } = useParams();

  const KPO_id = parseInt(id);
  const allUsers = useSelector((state) => state.AllUsersReducer.allUsers);
  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  const thisKPO = allUsers?.filter((user) => user.id === KPO_id);
  const dist_CODES = thisKPO?.length ? JSON.parse(thisKPO[0]?.DIST_Code) : [0];

  if (dist_CODES?.length > 0 && parseInt(dist_CODES) !== 0 && loadingState) {
    setLoadingState(false);
  }

  const generateData = (code) => {
    const gety = filter(allDistributors, { DIST_Code: code })[0];
    //const gety = allDistributors?.filter((dist) => dist.DIST_Code === code)[0];

    return {
      name: gety ? gety.company_name : "",
      status: gety ? gety.status : "",
      SYS_Code: gety ? gety.SYS_Code : "",
    };
  };

  return (
    <Dashboard>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex gap-4">
          <Previouspage onClick={() => history.goBack()} />
          <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
            {thisKPO.length ? (
              thisKPO[0]?.firstname + " " + thisKPO[0]?.lastname
            ) : (
              <Loading />
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 font-customGilroy text-sm not-italic mt-4 mb-10">
          <p className="font-normal text-gray-400">Backoffice</p>/
          <p className="font-medium text-grey-100">
            {thisKPO.length ? (
              thisKPO[0]?.firstname + " " + thisKPO[0]?.lastname
            ) : (
              <Loading />
            )}
          </p>
        </div>
        <div className="grid grid-rows-2 grid-flow-col gap-4">
          <div className="row-span-2 col-span-2 bg-white shadow-xl h-mid-modal rounded-lg">
            <div className="flex justify-between items-center font-customGilroy not-italic mt-6 mb-8 px-6">
              <p className="flex gap-2 font-bold text-xl text-grey-85">
                {t("distributors")}{" "}
                {userType !== "Van Salesman" && (
                  <span className="text-grey-70 font-medium">
                    ({dist_CODES?.length})
                  </span>
                )}
              </p>
            </div>

            {!loadingState ? (
              dist_CODES?.map((code, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-3 border-t border-grey-25 font-customGilroy text-black text-sm font-medium not-italic py-3 pl-12 pr-20"
                >
                  <div className="flex gap-2" style={{ width: "40%" }}>
                    {userType !== "Van Salesman" && <p>{index + 1 + "."}</p>}
                    <p>{generateData(code)?.name}</p>
                  </div>
                  <p>{generateData(code)?.SYS_Code}</p>
                  {generateData(code)?.status === "Active" ? (
                    <button className="rounded-full bg-green-500 py-1 px-3 text-center text-white">
                      {generateData(code)?.status}
                    </button>
                  ) : (
                    <button className="rounded-full bg-red-500 py-1 px-3 text-center text-white">
                      {t("inactive")}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <center>
                <Loading />
              </center>
            )}
            {dist_CODES?.length === 0 ? (
              <div
                className="px-6"
                style={{ textAlign: "center", color: "#9799A0" }}
              >
                {t("this_user_is_not_assigned_to_any_distributor")}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="row-span-1 bg-white text-white shadow-xl rounded-lg p-6">
            <div className="flex justify-between items-center text-black font-customGilroy font-bold text-xl mb-4">
              {t("details")}
            </div>
            <div className="font-customGilroy not-italic font-medium text-sm text-grey-70 p-4">
              <div className="flex gap-4 items-center mb-4">
                <Profile />
                {thisKPO.length ? (
                  thisKPO[0]?.firstname + " " + thisKPO[0]?.lastname
                ) : (
                  <Loading />
                )}
              </div>
              {userType !== "Van Salesman" && (
                <div className="flex gap-4 items-center mb-4">
                  <Mail />
                  {thisKPO[0]?.email}
                </div>
              )}
              <div className="flex gap-4 items-center mb-4">
                <Phone />
                {thisKPO[0]?.phone_number}
              </div>
            </div>
          </div>
          {/* <div className="row-span-1 bg-white shadow-xl rounded-lg text-white p-6">
            <p className="text-black font-customGilroy font-bold text-xl mb-4">
              Actions
            </p>
            <div
              style={{ color: "#0033FF" }}
              className="font-customGilroy not-italic font-medium text-sm p-4"
            >
              <p className="underline mb-4 cursor-pointer">
                Email password reset instructions
              </p>
              <p className="underline mb-4 cursor-pointer">Suspend Access</p>
              <p className="underline mb-4 cursor-pointer">Remove User</p>
            </div>
          </div> */}
        </div>
      </div>
    </Dashboard>
  );
};

export default ManageUser;
