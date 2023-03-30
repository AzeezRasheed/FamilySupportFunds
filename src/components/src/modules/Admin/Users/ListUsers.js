import React, { useState, useEffect } from "react";
import Dashboard from "../../../Layout/Admin/Dashboard";
import {
  Dropdown,
  Previouspage,
  Redirect,
} from "../../../assets/svg/adminIcons";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllDistributors, getAllUsers, updateUserData } from "../KPO/actions/UsersAction";
import { countBy, orderBy, cloneDeep, findIndex, filter } from "lodash";
import Pagination from "../components/pagination";
import SelectDropdown from "../../../components/common/SelectDropdown";
import EditKPO from "../KPO/EditKPO";
import SuspendKPO from "../KPO/SuspendKPO";
import UnSuspendKPO from "../KPO/UnSuspendKPO";
import ChangeRole from "../KPO/ChangeRole";
import { useTranslation } from "react-i18next";
import countryConfig from "../../../utils/changesConfig.json";

const ListUsers = () => {
  const { t } = useTranslation();
  let PageSize = 20;
  const country = useSelector(state => state.Auth.sessionUserData).country;
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [copyAllUsers, setCopyAllUsers] = useState([]);
  //   const [UserList, SetUserList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [userType, setUserType] = useState("");
  const [canSuspend, setCanSuspend] = useState(true);
  const dispatch = useDispatch();
  const userCountry = "Ghana";

  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const userData = useSelector((state) => state.AllUsersReducer.userData);
  const allUsers = useSelector((state) => state.AllUsersReducer.allUsers);
  const assignedUsers = allUsers.filter((user) => user.roles && user.roles !== 'new');

  const edit_action = useSelector((state) => state.AllUsersReducer.edit_action);
  const suspend_action = useSelector(
    (state) => state.AllUsersReducer.suspend_action
  );
  const unsuspend_action = useSelector(
    (state) => state.AllUsersReducer.unsuspend_action
  );
  const changerole_action = useSelector(
    (state) => state.AllUsersReducer.changerole_action
  );
  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  useEffect(() => {
    const newArray = cloneDeep(assignedUsers);
    setCopyAllUsers(newArray);
  }, [allUsers]);

  useEffect(() => {
    copyAllUsers.forEach((element) => (element.clicked = false));
  }, [copyAllUsers]);

  const fetchUsers = () => {
    return orderBy(copyAllUsers, "firstname").filter((data) => {
      return (
        data?.roles && data?.roles.startsWith(`${userData}`)
      );
    });
  };

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return copyAllUsers && fetchUsers().slice(firstPageIndex, lastPageIndex);
  };

  useEffect(() => {
    dispatch(getAllUsers(country));
    dispatch(getAllDistributors(country));
  }, [])
  
  useEffect(() => {
    currentTableData();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [userData])

  const setUserData = (role) => {
    dispatch(updateUserData(role))
  }

  const getNoOfDist = (thisKPO) => {
    if (thisKPO?.DIST_Code) {
      const dist_CODES = thisKPO ? JSON.parse(thisKPO?.DIST_Code) : "";

      const totalDist =
        thisKPO.DIST_Code !== "" &&
        thisKPO.DIST_Code !== "null" &&
        thisKPO.DIST_Code !== null
          ? dist_CODES.length
          : 0;
      return totalDist;
    }
  };
  const getDistName = (thisDriver) => {
    // console.log(thisDriver);
    if (thisDriver?.DIST_Code) {
      const distCode = JSON.parse(thisDriver?.DIST_Code);
      const dist = filter(allDistributors, {
        DIST_Code: distCode[0],
      })[0];
      return dist?.company_name;
      // console.log(allDistributors);
    }
  };

  const performAction = (id, userRole, superAdmin) => {
    const index = findIndex(copyAllUsers, { id: id });
    setUserType(userRole);
    if (userRole === 'Admin' && (superAdmin !== 0 || AuthData.id === id)) {
      setCanSuspend(false);
    } else {
      setCanSuspend(true);
    }
    copyAllUsers.forEach((element) => (element.clicked = false));
    copyAllUsers[index].clicked = true;
    !openDropdown ? setOpenDropdown(true) : setOpenDropdown(false);
  };

  //   const showDropdown = (userType) => {
  const dropdownItems = [
    { menu: t("edit"), route: "self", action: "edit" },
    userType !== "Admin" && {
      menu:
        userType === "Van Salesman"
          ? t("manage_distributor")
          : t("manage_distributors"),
      route: "link",
      action: `/admin-dashboard/manage-user/${
        userData === "KPO" ? "Backoffice" : userData
      }/`,
    },
    // {
    //   menu: "Email password reset instructions",
    //   route: "self",
    //   action: "email",
    // },
    canSuspend && {
      menu: t("suspend_access"),
      route: "self",
      action: "suspend",
    },
    userType !== "Van Salesman" &&
      userType !== "Admin" && {
        menu: t("change_role"),
        route: "self",
        action: "changerole",
      },
  ];

  const dropdownItems2 = [
    { menu: t("edit"), route: "self", action: "edit" },
    userType !== "Admin" && {
      menu:
        userType === "Van Salesman"
          ? t("manage_distributor")
          : t("manage_distributors"),
      route: "link",
      action: `/admin-dashboard/manage-user/${
        userData === "KPO" ? "Backoffice" : userData
      }/`,
    },
    { menu: "Unsuspend", route: "self", action: "unsuspend" },
    userType !== "Van Salesman" &&
      userType !== "Admin" && {
        menu: t("change_role"),
        route: "self",
        action: "changerole",
      },
  ];
  //   }

  const borderActive = countryConfig[userCountry].borderBottomColor;

  return (
    <Dashboard>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={() => history.goBack()} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("all_users")}{" "}
              <span className="font-customGilroy text-gray-400 ml-0.5">
                ({assignedUsers?.length})
              </span>
            </p>
          </div>
        </div>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
          <div className="block tab-content tab-space pb-5 flex-auto w-full">
            <div className="flex flex-row justify-between items-center border-b h-16 px-8">
              <div className="flex justify-between font-customGilroy text-base font-medium not-italic text-grey-85 w-4/7 h-full">
                {/* <li className="flex cursor-pointer">
                  <a
                    className={
                      "flex font-customGilroy pt-6 text-base font-normal cursor-pointer" +
                      (userData === "Super Admin"
                        ? "text-active border-b-4 rounded"
                        : "text-default")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setUserData("Super Admin");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    Super Admin
                  </a>
                </li> */}
                <li className="flex cursor-pointer">
                  <a
                    className={
                      "flex font-customGilroy pt-6 text-base font-normal cursor-pointer" +
                      (userData === "Admin"
                        ? "text-active border-b-4 rounded"
                        : "text-default")
                    }
                    style={{
                      borderColor: userData === "Admin" ? borderActive : "",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setUserData("Admin");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    {t("admin")} {/*({Object.values(rolesTotal)[0]}) */}
                  </a>
                </li>
                <li className="flex cursor-pointer">
                  <a
                    className={
                      "flex font-customGilroy pt-6 text-base font-normal cursor-pointer" +
                      (userData === "Mini-Admin"
                        ? "text-active border-b-4 rounded"
                        : "text-default")
                    }
                    style={{
                      borderColor:
                        userData === "Mini-Admin" ? borderActive : "",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setUserData("Mini-Admin");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    {t("mini_admin")}
                    {/*({Object.values(rolesTotal)[0]}) */}
                  </a>
                </li>
                <li className="flex cursor-pointer">
                  <a
                    className={
                      "flex font-customGilroy pt-6 text-base font-normal cursor-pointer" +
                      (userData === "KPO"
                        ? "text-active border-b-4 rounded"
                        : "text-default")
                    }
                    style={{
                      borderColor: userData === "KPO" ? borderActive : "",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setUserData("KPO");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    {t("back_office")} {/*({Object.values(rolesTotal)[1]}) */}
                  </a>
                </li>
                <li className="flex cursor-pointer">
                  <a
                    className={
                      "flex font-customGilroy pt-6 text-base font-normal cursor-pointer" +
                      (userData === "Van Salesman"
                        ? "text-active border-b-4 rounded"
                        : "text-default")
                    }
                    style={{
                      borderColor:
                        userData === "Van Salesman" ? borderActive : "",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setUserData("Van Salesman");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    {t("van_salesman")} {/* ({Object.values(rolesTotal)[2]}) */}
                  </a>
                </li>
              </div>
            </div>
            {/* <div className="flex mt-3 px-4">
              <input
                className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
                id="search"
                type="text"
                name="search"
                style={{ width: "26.063rem", backgroundColor: "#E5E5E5" }}
                onChange={(e) => setUserData(e.target.value)}
                placeholder="Search for user"
              />
            </div> */}
            <div
              className="tab-content tab-space"
              style={{ overflowX: "scroll" }}
            >
              <table className="min-w-full mt-8 divide-y divide-gray-200">
                <thead className="bg-transparent ">
                  <tr>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      S/N
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {t("name")}
                    </th>
                    {userData !== "Admin" && (
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("distributor")}
                      </th>
                    )}

                    {userData !== "Van Salesman" && (
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("email")}
                      </th>
                    )}
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {t("phone_number")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {t("status")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {t("registration_date")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                      {"          "}
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="bg-white px-6 divide-y divide-gray-200"
                  id="filterTBody"
                >
                  {currentTableData()?.map((user, index) => (
                    <tr key={user.id} className="cursor-pointer">
                      <td
                        className="font-customGilroy text-sm font-medium text-center align-middle p-6"
                        style={{ borderBottom: 0 }}
                      >
                        {`${index + 1}.`}
                      </td>
                      <td
                        className="font-customGilroy text-sm font-medium text-center align-middle p-6"
                        style={{ borderBottom: 0 }}
                      >
                        {`${user?.firstname + " " + user?.lastname}`}
                      </td>
                      {userData !== "Admin" && (
                        <td
                          className="font-customGilroy text-sm font-medium text-center align-middle p-6"
                          style={{ borderBottom: 0 }}
                        >
                          {userData === "KPO" || userData === "Mini-Admin"
                            ? getNoOfDist(user)
                            : getDistName(user && user)}
                        </td>
                      )}

                      {userData !== "Van Salesman" && (
                        <td
                          className="font-customGilroy text-sm font-medium text-center align-middle p-6"
                          style={{ borderBottom: 0 }}
                        >
                          {user?.email}
                        </td>
                      )}
                      <td
                        className="font-customGilroy text-sm font-medium text-center align-middle p-6"
                        style={{ borderBottom: 0 }}
                      >
                        {user?.phone_number}
                      </td>
                      <td
                        className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6"
                        style={{ borderBottom: 0 }}
                      >
                        {user?.status === "Active" ? (
                          <button className="rounded-full bg-green-500 py-1 px-3">
                            {t("active")}
                          </button>
                        ) : (
                          <button className="rounded-full bg-red-500 py-1 px-3">
                            {t("inactive")}
                          </button>
                        )}
                      </td>
                      <td
                        className="font-customGilroy text-sm font-medium text-center align-middle p-6"
                        style={{ borderBottom: 0 }}
                      >
                        {user?.registeredOn}
                      </td>
                      <td
                        className="font-customGilroy text-sm font-medium text-center align-middle p-6"
                        style={{ borderBottom: 0 }}
                      >
                        {
                          <button
                            onClick={() => {
                              // targetDiv = ref.current;
                              performAction(user.id, user.roles, user.super_admin);
                            }}
                            className="flex items-center h-10 gap-2 border border-grey-25 py-1 rounded-lg px-4"
                          >
                            {t("actions")} <Dropdown />
                          </button>
                        }
                        {openDropdown && user.clicked ? (
                          <SelectDropdown
                            items={
                              user.status === "Blocked"
                                ? dropdownItems2
                                : dropdownItems
                            }
                            KPO_id={user?.id}
                            userData={userData}
                          />
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr />
              <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={fetchUsers().length}
                  pageSize={PageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          </div>
        </div>
        <EditKPO action={edit_action} userData={userData} />
        <SuspendKPO action={suspend_action} userData={userData} />
        <UnSuspendKPO action={unsuspend_action} />
        <ChangeRole action={changerole_action} />
      </div>
    </Dashboard>
  );
};

export default ListUsers;
