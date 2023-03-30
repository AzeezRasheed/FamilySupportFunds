import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../../Layout/Admin/Dashboard";
import { useParams } from "react-router";
import Switch from "react-switch";
import SelectDropdown from "../../../components/common/SelectDropdown";
import {
  Arrowdown,
  Dropdown,
  Mail,
  Phone,
  Previouspage,
  Profile,
  Progination,
  Redirect,
} from "../../../assets/svg/adminIcons";
import { VMS } from "../../../utils/data";
import DistributorNavbar from "../components/navbar";
import { connect } from "react-redux";
import {
  getSingleDistributor,
  getAllDistributor,
} from "../pages/actions/adminDistributorAction";
import { Link } from "react-router-dom";
import { getAllUsers } from "../KPO/actions/UsersAction";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const User = ({ location }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const code = location.pathname.split("/").at(-1);
  const { distCode } = useParams();
  const history = useHistory();

  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  useEffect(() => {
    dispatch(getAllDistributor(country));
    dispatch(getSingleDistributor(distCode));
    dispatch(getAllUsers(country));
  }, []);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [checked, setChecked] = useState(true);
  const distributor = useSelector(
    (state) => state.AllDistributorReducer.distributor
  );

  const allUsers = useSelector((state) => state.AllUsersReducer.allUsers);

  const changeStatus = (type) => {
    if (checked && type) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };
  const roles = (allUsers, title, role) => {
    let thisKpo = [];
    allUsers.filter((value) => {
      if (
        value.DIST_Code !== "" &&
        value.DIST_Code !== null &&
        value.DIST_Code.length !== 0 &&
        (value.DIST_Code.includes(distCode) || value.DIST_Code === distCode) &&
        value.roles === role
      ) {
        thisKpo.push(value);
      }
    });
    return (
      <>
        {thisKpo.length === 0 ? (
          <div className="flex text-center justify-center">
            <p className="m-auto py-20">{`${t("no")} ${title} ${t(
              "available"
            )}`}</p>
          </div>
        ) : (
          <>
            {role === "Van Salesman" ? (
              <div>
                <p className="text-xl font-bold not-italic text-grey-85 mb-5 px-8">
                  {title}
                </p>
                {thisKpo?.map((salesmen, index) => (
                  <div
                    className="flex justify-between items-center font-customGilroy text-sm text-medium text-grey-70 px-8 py-4 border-t"
                    id={salesmen.id}
                  >
                    <div className="flex">
                      <Profile />
                      <p className="mx-4">{`${salesmen.firstname} ${salesmen.lastname}`}</p>
                    </div>
                    {/* <label className="mt-5"> */}
                    {/* <span>{salesmen.status}</span> */}
                    {/* <Switch
                        offColor="#D82C0D"
                        onChange={() => changeStatus("Van Salesman")}
                        checked={checked}
                      />
                    </label> */}
                    {/* <button
                      onClick={() => {
                        // targetDiv = ref.current;
                        performAction(index, thisKpo);
                      }}
                      className="flex items-center gap-2 border border-grey-25 rounded py-1 px-4"
                    >
                      Actions <Dropdown />
                    </button> */}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {thisKpo?.map((kpo, index) => (
                  <>
                    <div className="flex justify-between items-center mb-8">
                      <p className="text-xl font-bold not-italic text-grey-85">
                        {title}
                      </p>

                      {/* <button className="rounded-full bg-green-500 text-sm font-medium text-center align-middle text-white py-1 px-3"> */}
                      {/* <label className="ml-4"> */}
                      {/* <span>{kpo.status}</span> */}
                      {/* <Switch
                            className="mt-5"
                            offColor="#D82C0D"
                            onChange={() => changeStatus(role === "KPO" ? "KPO" : "Supervisor")}
                            checked={checked}
                          />
                        </label> */}
                      {/* </button> */}
                    </div>
                    <div className="flex justify-between font-customGilroy text-sm text-medium text-grey-70">
                      <div className="pl-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Profile />
                          <p>{`${kpo.firstname}  ${kpo.lastname}`}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <Mail />
                          <p>{kpo.email}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <Phone />
                          <p>{kpo.phone_number}</p>
                        </div>
                      </div>
                      {/* <button
                        onClick={() => {
                          // targetDiv = ref.current;
                          performAction(index, thisKpo);
                        }}
                        className="flex items-center h-10 gap-2 border border-grey-25 py-1 rounded-lg px-4 mt-2"
                      >
                        Actions <Dropdown />
                      </button> */}
                    </div>
                  </>
                ))}
              </>
            )}
          </>
        )}
      </>
    );
  };

  const dropdownItems = [
    { menu: "Edit", route: "self", action: "edit" },
    {
      menu: "Manage Distributors",
      route: "link",
      action: "/distributor/manage-backoffice/",
    },
    // {
    //   menu: "Email password reset instructions",
    //   route: "self",
    //   action: "email",
    // },
    // { menu: "Suspend access", route: "self", action: "popup" },
    // { menu: "Remove user", route: "self", action: "popup" },
  ];

  const performAction = (index, value) => {
    value.forEach((element) => (element.clicked = false));
    value[index].clicked = true;
    !openDropdown ? setOpenDropdown(true) : setOpenDropdown(false);
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link to="/admin-dashboard">
            <Previouspage/>
            </Link>
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {distributor?.company_name}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center font-customGilroy text-sm not-italic mt-4 mb-10">
          <p className="font-normal text-gray-400">
            {distributor?.company_type}{" "}
          </p>
          /
          <p className="font-medium text-grey-100">
            {distributor?.company_name}
          </p>
        </div>
        <DistributorNavbar distributor={distributor} code={distCode} />
        <div className="grid grid-rows-3 grid-flow-col gap-4 mt-12">
          <div className="font-customGilroy h-grid-sm bg-white px-8 py-6">
            {roles(allUsers, "Back Office", "KPO")}
          </div>
          <div className="row-span-2 font-customGilroy bg-white py-6">
            {roles(allUsers, t("van_salesmen"), "Van Salesman")}
          </div>
          {/* <div className="font-customGilroy h-grid-sm bg-white px-8 py-6">
            {roles(allUsers, "KPO Supervisor", "Supervisor")}
          </div> */}
          <div className="font-customGilroy h-grid-sm bg-white px-8 py-6">
            <div className="flex justify-between items-center mb-8">
              <p className="text-xl font-bold not-italic text-grey-85">
                {t("account_owner")}
              </p>
              <button
                className={`rounded-full ${
                  distributor?.status === "Active"
                    ? "bg-green-500"
                    : "bg-red-500"
                } text-sm font-medium text-center align-middle text-white py-1 px-3`}
              >
                {distributor?.status}
              </button>
            </div>
            <div className="flex justify-between font-customGilroy text-sm text-medium text-grey-70">
              <div className="pl-6">
                <div className="flex items-center gap-2 mb-4">
                  <Profile />
                  <p>{distributor?.Owner_Name}</p>
                </div>
                {/* <div className="flex items-center gap-2 mb-4">
                  <Mail />
                  <p>olu.tayo@gmail.com</p>
                </div> */}
                <div className="flex items-center gap-2 mb-4">
                  <Phone />
                  <p>{distributor?.Owner_Phone}</p>
                </div>
              </div>
              {/* <button className="flex items-center h-10 gap-2 border border-grey-25 rounded-lg py-1 px-4 mt-2">
                Actions <Dropdown />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default User;
