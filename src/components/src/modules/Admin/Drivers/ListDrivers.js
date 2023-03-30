import React, { useState, useEffect, useRef } from "react";
import Dashboard from "../../../Layout/Admin/Dashboard";
import SortImg from "../../../assets/svg/sort.svg";
import { Dropdown, Progination } from "../../../assets/svg/adminIcons";
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getAllDistributors } from "../KPO/actions/UsersAction";
import { cloneDeep, concat, filter, orderBy, findIndex } from "lodash";
import SelectDropdown from "../../../components/common/SelectDropdown";
// import EditKPO from "./EditKPO";
// import SuspendKPO from "./SuspendKPO";
// import UnSuspendKPO from "./UnSuspendKPO";
import Loading from "../../../components/common/Loading";
import Pagination from "../components/pagination";
import EditKPO from "../KPO/EditKPO";
import EditDriver from "./EditDriver";
import SuspendKPO from "../KPO/SuspendKPO";
import SuspendDriver from "./SuspendDriver";
import UnSuspendDriver from "./UnSuspendDriver";
import { useTranslation } from "react-i18next";

const ListDrivers = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );
  const edit_action = useSelector((state) => state.AllUsersReducer.edit_action);
  const suspend_action = useSelector(
    (state) => state.AllUsersReducer.suspend_action
  );
  const unsuspend_action = useSelector(
    (state) => state.AllUsersReducer.unsuspend_action
  );
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [copyAllUsers, setCopyAllUsers] = useState([]);
  const [DriverList, setDriverList] = useState([]);
  const [driverData, setDriverData] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const ref = useRef();
  let targetDiv = "";
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;

  const allUsers = useSelector((state) => state.AllUsersReducer.allUsers);

  useEffect(() => {
    const newArray = cloneDeep(allUsers);
    setCopyAllUsers(newArray);
  }, [allUsers]);

  useEffect(() => {
    const array = filter(copyAllUsers, ["roles", "Van Salesman"]);
    array.forEach((element) => (element.clicked = false));

    setDriverList(orderBy(array, "firstname", "asc"));
    // setDriverList(array);
  }, [copyAllUsers]);

  const getNoOfDist = (thisDriver) => {
    if (thisDriver?.DIST_Code) {
      const distCode = thisDriver ? JSON.parse(thisDriver?.DIST_Code) : "";
      const dist = filter(allDistributors, { DIST_Code: distCode[0] })[0];
      return dist?.company_name;
      // console.log(allDistributors);
    }
  };

  const performAction = (id) => {
    DriverList.forEach((element) => (element.clicked = false));
    const index = findIndex(DriverList, { id: id });
    DriverList[index].clicked = true;
    !openDropdown ? setOpenDropdown(true) : setOpenDropdown(false);
  };

  const fetchDrivers = () => {
    return DriverList.filter((data) => {
      return (
        (data?.firstname !== null &&
          data?.firstname
            .toLowerCase()
            .includes(`${driverData.toLowerCase()}`)) ||
        (data?.lastname !== null &&
          data?.lastname
            .toLowerCase()
            .includes(`${driverData.toLowerCase()}`)) ||
        (data?.status !== null &&
          data?.status.toLowerCase().includes(`${driverData.toLowerCase()}`))
      );
    });
  };

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return DriverList && fetchDrivers().slice(firstPageIndex, lastPageIndex);
  };

  useEffect(() => {
    currentTableData();
    dispatch(getAllUsers(country));
    dispatch(getAllDistributors(country));
  }, [currentPage]);

  //   const searchDriver = (filterInput, filterTbody) => {
  //     let input, filter, ul, li, a, i;
  //     input = document.getElementById(filterInput);
  //     filter = input.value.toUpperCase();
  //     ul = document.getElementById(filterTbody);
  //     li = ul.getElementsByTagName("tr");

  //     for (i = 0; i < li.length; i++) {
  //       if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
  //         li[i].style.display = "";
  //       } else {
  //         li[i].style.display = "none";
  //       }
  //     }
  //   };

  const dropdownItems = [
    { menu: "Edit", route: "self", action: "edit" },
    {
      menu: t("manage_distributors"),
      route: "link",
      action: "/distributor/manage-driver/",
    },
    // {
    //   menu: "Email password reset instructions",
    //   route: "self",
    //   action: "email",
    // },
    { menu: t("susppend_access"), route: "self", action: "suspend" },
    // { menu: "Remove user", route: "self", action: "popup" },
  ];

  const dropdownItems2 = [
    { menu: t("edit"), route: "self", action: "edit" },
    {
      menu: t("manage_distributors"),
      route: "link",
      action: "/distributor/manage-driver/",
    },
    { menu: t("unsuspend"), route: "self", action: "unsuspend" },
  ];

  return (
    <Dashboard location="">
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            {t("van_salesmen")}
            <span className="font-customGilroy text-gray-400 ml-0.5">
              &nbsp;({DriverList.length})
            </span>
          </h2>
          {/* <button
                        className="rounded font-customGilroy bg-red-700 text-white text-base px-6 py-3"
                    // onClick={() => setOpen(true)}
                    >
                        Add new KPO Supervisor
                    </button> */}
        </div>

        <div
          className={`relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-6 shadow-lg rounded`}
        >
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="py-5 flex-auto">
                <div className="tab-content tab-space">
                  <div className="block">
                    <div className="mt-3 px-4 flex">
                      <input
                        className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
                        id="searchInput"
                        type="text"
                        name="search"
                        style={{ width: "35rem", backgroundColor: "#E5E5E5" }}
                        // onChange={(e) => onChange(e)}
                        placeholder="Search for Driver..."
                        onChange={(e) => setDriverData(e.target.value)}
                      />
                      <div className="flex pt-1">
                        {/* <div
                          className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block  bg-white border-default-b border-2"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-default font-normal">
                              Any Status
                            </p>
                            <Dropdown />
                          </div>
                        </div> */}
                        {/* <div className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2">
                          <img className="pr-2" src={SortImg} alt="" />
                          <p className="text-default font-normal">
                            Sort By
                          </p>
                        </div> */}
                      </div>
                    </div>
                    {!DriverList.length ? (
                      <center style={{ marginTop: 20, marginBottom: 20 }}>
                        <Loading />
                        <Loading />
                        <Loading />
                      </center>
                    ) : (
                      ""
                    )}
                    {DriverList.length ? (
                      <div className="">
                        <table className="min-w-full mt-8 divide-y divide-gray-200">
                          <thead className="bg-transparent ">
                            <tr className="">
                              <th className="px-10 py-3 text-left text-base font-semibold text-black align-middle">
                                S/N
                              </th>
                              <th className="px-10 py-3 text-center text-base font-semibold text-black align-middle">
                                {t("name")}
                              </th>
                              <th className="px-10 py-3 text-left text-base font-semibold text-black align-middle">
                                {t("distributor")}
                              </th>
                              <th className="px-10 py-3 text-left text-base font-semibold text-black align-middle">
                                {t("status")}
                              </th>
                              {/* <th className="px-10 py-3 text-center text-base font-semibold text-black align-middle">
                              Email
                            </th> */}
                              <th className="px-10 py-3 text-left text-base font-semibold text-black align-middle">
                                {t("phone_number")}
                              </th>
                              <th className="px-10 py-3 text-left text-base font-semibold text-black align-middle">
                                {"          "}
                              </th>
                            </tr>
                          </thead>

                          <tbody
                            id="supervisorsTbody"
                            className="bg-white px-6 divide-y divide-gray-200"
                          >
                            {currentTableData()?.map((sku, index) => (
                              <tr key={index}>
                                <td
                                  className="font-customGilroy text-base font-medium text-center text-black align-middle p-6"
                                  style={{ borderBottom: 0 }}
                                >
                                  {index + 1 + "."}
                                </td>
                                <td
                                  className="font-customGilroy text-base font-medium text-center text-black align-middle p-6"
                                  style={{ borderBottom: 0 }}
                                >
                                  {sku.firstname + " " + sku.lastname}
                                </td>
                                <td
                                  className="font-customGilroy text-base font-medium text-center text-black align-middle p-6"
                                  style={{ borderBottom: 0 }}
                                >
                                  {getNoOfDist(sku)}
                                </td>
                                {sku.status.toLowerCase() === "active" ? (
                                  <td
                                    className="font-customGilroy text-base font-medium text-center text-black align-middle text-white p-6"
                                    style={{ borderBottom: 0 }}
                                  >
                                    <button className="rounded-full bg-green-500 py-1 px-3">
                                      {sku.status}
                                    </button>
                                  </td>
                                ) : (
                                  <td
                                    className="font-customGilroy text-base font-medium text-center text-black align-middle text-white p-6"
                                    style={{ borderBottom: 0 }}
                                  >
                                    <button className="rounded-full bg-red-500 py-1 px-3">
                                      {sku.status}
                                    </button>
                                  </td>
                                )}
                                {/* <td
                                className="font-customGilroy text-base font-medium text-center text-black align-middle p-6"
                                style={{ borderBottom: 0 }}
                              >
                                {sku.email}
                              </td> */}
                                <td
                                  className="font-customGilroy text-base font-medium align-middle px-10 py-6"
                                  style={{ borderBottom: 0 }}
                                >
                                  {sku.phone_number}
                                </td>
                                <td
                                  className="font-customGilroy text-base font-medium text-center text-black align-middle p-6"
                                  style={{ borderBottom: 0 }}
                                >
                                  <button
                                    onClick={() => {
                                      // targetDiv = ref.current;
                                      performAction(sku.id);
                                    }}
                                    className="flex items-center h-10 gap-2 border border-grey-25 py-1 rounded-lg px-4"
                                  >
                                    {t("actions")} <Dropdown />
                                  </button>
                                  {openDropdown && sku.clicked ? (
                                    <SelectDropdown
                                      items={
                                        sku.status === "Blocked"
                                          ? dropdownItems2
                                          : dropdownItems
                                      }
                                      KPO_id={sku.id}
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
                            totalCount={fetchDrivers().length}
                            pageSize={PageSize}
                            onPageChange={(page) => setCurrentPage(page)}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {/* <hr />
                    {DriverList.length === 0 || DriverList === null ? (
                      <div style={{ textAlign: "center", color: "#9799A0" }}>
                        There are no Van Salesmen.
                      </div>
                    ) : (
                      <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                        1 - 50 of 100 <Progination />
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <EditDriver action={edit_action} />
        <SuspendDriver action={suspend_action} />
        <UnSuspendDriver action={unsuspend_action} />
      </div>
    </Dashboard>
  );
};

export default ListDrivers;
