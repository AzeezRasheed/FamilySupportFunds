import React, { useState, useEffect, useRef } from "react";
import Dashboard from "../../../Layout/Admin/Dashboard";
import SortImg from "../../../assets/svg/sort.svg";
import { Dropdown, Progination } from "../../../assets/svg/adminIcons";
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getAllDistributors } from "./actions/UsersAction";
import { cloneDeep, concat, filter } from "lodash";
import SelectDropdown from "../../../components/common/SelectDropdown";
import EditKPO from "./EditKPO";
import SuspendKPO from "./SuspendKPO";
import UnSuspendKPO from "./UnSuspendKPO";
import Loading from "../../../components/common/Loading";
import { useTranslation } from "react-i18next";

const ListKPO = () => {
  const {t} = useTranslation()
  const edit_action = useSelector((state) => state.AllUsersReducer.edit_action);
  const suspend_action = useSelector((state) => state.AllUsersReducer.suspend_action);
  const unsuspend_action = useSelector(
    (state) => state.AllUsersReducer.unsuspend_action
  );
  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );
  const dispatch = useDispatch();
  const [copyAllUsers, setCopyAllUsers] = useState([]);
  const [KPOList, setKPOList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const ref = useRef();
  let targetDiv = "";
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;

  useEffect(() => {
    dispatch(getAllUsers(country));
    dispatch(getAllDistributors(country));
  }, [country]);
  const allUsers = useSelector((state) => state.AllUsersReducer.allUsers);

  useEffect(() => {
    const newArray = cloneDeep(allUsers);
    setCopyAllUsers(newArray);
  }, [allUsers]);

  useEffect(() => {
    const array = filter(copyAllUsers, ["roles", "KPO"]);
    array.forEach((element) => (element.clicked = false));
    
    setKPOList(array);
  }, [copyAllUsers]);

  const getNoOfDist = (thisKPO) => {
    if (thisKPO?.DIST_Code) {
      
      const dist_CODES = thisKPO
        ? JSON.parse((thisKPO?.DIST_Code)) : "";
        
      const totalDist =
        thisKPO.DIST_Code !== "" &&
        thisKPO.DIST_Code !== "null" &&
        thisKPO.DIST_Code !== null
          ? dist_CODES.length
          : 0;
      return totalDist
    }
  };

  const performAction = (index) => {
    KPOList.forEach((element) => (element.clicked = false));
    KPOList[index].clicked = true;
    !openDropdown ? setOpenDropdown(true) : setOpenDropdown(false);
  };

  const searchSupervisor = (filterInput, filterTbody) => {
    let input, filter, ul, li, a, i;
    input = document.getElementById(filterInput);
    filter = input.value.toUpperCase();
    ul = document.getElementById(filterTbody);
    li = ul.getElementsByTagName("tr");
    
    for (i = 0; i < li.length; i++) {
      if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
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
    { menu: "Suspend access", route: "self", action: "suspend" },
    // { menu: "Remove user", route: "self", action: "popup" },
  ];

  const dropdownItems2 = [
    { menu: "Edit", route: "self", action: "edit" },
    {
      menu: "Manage Distributors",
      route: "link",
      action: "/distributor/manage-backoffice/",
    },
    { menu: "Unsuspend", route: "self", action: "unsuspend" }
  ];

  return (
    <Dashboard location="">
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            {t("backoffice")}
            <span className="font-customGilroy text-gray-400 ml-0.5">
              &nbsp;({KPOList.length})
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
                        placeholder="Search for KPO..."
                        onKeyUp={() =>
                          searchSupervisor("searchInput", "supervisorsTbody")
                        }
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
                    {!KPOList.length ? (
                      <center style={{ marginTop: 20, marginBottom: 20 }}>
                        <Loading />
                        <Loading />
                        <Loading />
                      </center>
                    ) : (
                      ""
                    )}
                    {KPOList.length ? (
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
                              {t("distributors")}
                            </th>
                            <th className="px-10 py-3 text-left text-base font-semibold text-black align-middle">
                              {t("status")}
                            </th>
                            <th className="px-10 py-3 text-center text-base font-semibold text-black align-middle">
                              {t("email")}
                            </th>
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
                          {KPOList?.map((sku, index) => (
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
                              <td
                                className="font-customGilroy text-base font-medium text-center text-black align-middle p-6"
                                style={{ borderBottom: 0 }}
                              >
                                {sku.email}
                              </td>
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
                                    performAction(index);
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
                    ) : (
                      ""
                    )}
                    <hr />
                    {KPOList.length === 0 || KPOList === null ? (
                      <div style={{ textAlign: "center", color: "#9799A0" }}>
                        {t("there_are_no_backoffice")}
                      </div>
                    ) : (
                      <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                        1 - 50 {t("of")} 100 <Progination />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <EditKPO action={edit_action} />
        <SuspendKPO action={suspend_action} />
        <UnSuspendKPO action={unsuspend_action} />
      </div>
    </Dashboard>
  );
};

export default ListKPO;
