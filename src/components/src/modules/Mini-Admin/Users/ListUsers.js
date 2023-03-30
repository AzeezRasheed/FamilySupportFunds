import React, { useState, useEffect } from "react";
import Dashboard from "../../../Layout/Mini-Admin/Dasboard";
import {
  Dropdown,
  Previouspage,
  Redirect,
} from "../../../assets/svg/adminIcons";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllDistributors, getAllUsers } from "../../Admin/KPO/actions/UsersAction";
import { countBy, orderBy, cloneDeep, findIndex, filter } from "lodash";
import Pagination from "../../Admin/components/pagination";
import { useTranslation } from "react-i18next";


const ListUsers = () => {
  const { t } = useTranslation();
  let PageSize = 20;
  const country = useSelector(state => state.Auth.sessionUserData).country;
  const history = useHistory();
  const [userData, setUserData] = useState("KPO");
  const [currentPage, setCurrentPage] = useState(1);
  const [copyAllUsers, setCopyAllUsers] = useState([]);
  const dispatch = useDispatch();

  const allUsers = useSelector((state) => state.AllUsersReducer.allUsers);

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  useEffect(() => {
    const newArray = cloneDeep(allUsers);
    setCopyAllUsers(newArray);
  }, [allUsers]);

  const fetchUsers = () => {
    return orderBy(copyAllUsers, "firstname").filter((data) => {
      return (
        data?.roles?.startsWith(`${userData}`) ||
        (data?.firstname !== null &&
          data?.firstname
            ?.toLowerCase()
            .includes(`${userData.toLowerCase()}`)) ||
        (data?.lastname !== null &&
          data?.lastname.toLowerCase().includes(`${userData.toLowerCase()}`)) ||
        (data?.status !== null &&
          data?.status.toLowerCase().includes(`${userData.toLowerCase()}`))
      );
    });
  };

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return copyAllUsers && fetchUsers().slice(firstPageIndex, lastPageIndex);
  };

  useEffect(() => {
    currentTableData();
    dispatch(getAllUsers(country));
    dispatch(getAllDistributors(country));
  }, [currentPage]);

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
    if (thisDriver?.DIST_Code) {
      const distCode = JSON.parse(thisDriver?.DIST_Code);
      const dist = filter(allDistributors, {
        DIST_Code: distCode[0],
      })[0];
      return dist?.company_name;
    }
  };

  const handlePush = (code) => {
    history.push(`/min-admin-dashboard/manage-user/${code}`);
  };

  return (
    <Dashboard>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={() => history.goBack()} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("all_users")}{" "}
              <span className="font-customGilroy text-gray-400 ml-0.5">
                ({allUsers?.length})
              </span>
            </p>
          </div>
        </div>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
          <div className="block tab-content tab-space pb-5 flex-auto w-full">
            <div className="flex flex-row justify-between items-center border-b h-16 px-8">
              <div className="flex justify-between font-customGilroy text-base font-medium not-italic text-grey-85 w-2/7 h-full">
                <li className="flex cursor-pointer">
                  <a
                    className={
                      "flex font-customGilroy pt-6 text-base font-normal cursor-pointer" +
                      (userData === "KPO"
                        ? "text-active border-b-4 rounded border-basic"
                        : "text-default")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setUserData("KPO");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    {t('back_office')} {/*({Object.values(rolesTotal)[1]}) */}
                  </a>
                </li>
                <li className="flex cursor-pointer">
                  <a
                    className={
                      "flex font-customGilroy pt-6 text-base font-normal cursor-pointer" +
                      (userData === "Van Salesman"
                        ? "text-active border-b-4 rounded border-basic"
                        : "text-default")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setUserData("Van Salesman");
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    {t("van_salesmen")} {/* ({Object.values(rolesTotal)[2]}) */}
                  </a>
                </li>
              </div>
            </div>
            <div className="tab-content tab-space">
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
                      {t('registration_date')}
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
                          {userData === "KPO" || userData === "Mini-Admin" ? (
                            <span
                              onClick={() => handlePush(user.id)}
                              className="text-red-900"
                            >
                              {getNoOfDist(user)}
                            </span>
                          ) : (
                            getDistName(user && user)
                          )}
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
                            {user.status}
                          </button>
                        ) : (
                          <button className="rounded-full bg-red-500 py-1 px-3">
                            {user.status}
                          </button>
                        )}
                      </td>
                      <td
                        className="font-customGilroy text-sm font-medium text-center align-middle p-6"
                        style={{ borderBottom: 0 }}
                      >
                        {user?.registeredOn}
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
      </div>
    </Dashboard>
  );
};

export default ListUsers;
