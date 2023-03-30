import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import Dashboard from "../../../Layout/Mini-Admin/Dasboard";
import AdminDistributorLayout from "../../Admin/Layout";
import { getAllDistributor } from "../../Admin/pages/actions/adminDistributorAction";
import { filter } from "lodash";
import { getSingleUser } from "../../Admin/KPO/actions/UsersAction";
import { GetMinAdminDistributors } from "../../../utils/GetMinAdminDistributors";
import { GetDistributors } from "../GetDistributors";
import { useTranslation } from "react-i18next";

const Home = ({ location }) => {
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const {t} = useTranslation()
  const [myDistributors, setMyDistributors] = useState([]);
  const [MiniAdminDistributors, setMiniAdminDistributors] = useState([]);
  const [distCodes, setDistCodes] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const ccountry = AuthData?.country;
  const dispatch = useDispatch();
  
  const { sessionUser } = useSelector((state) => state.Auth);

  const sortItems = (value) => {
    const sorted = value.sort((a, b) => b.id - a.id);
    return sorted;
  };

  

  return (
    <Dashboard location={location} sessionUser={sessionUser}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex flex-row justify-between">
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            {t("my_distributors")}
            <span className="font-customGilroy text-gray-400 ml-0.5">{`(${
              GetDistributors()?.length
            })`}</span>
          </h2>
        </div>
        {/* {myDistributors.length === distCodes.length && ( */}
        <AdminDistributorLayout
          top="mt-8"
          DistributorList={GetDistributors()}
        />
        {/* )} */}
      </div>
    </Dashboard>
  );
};

export default Home;
