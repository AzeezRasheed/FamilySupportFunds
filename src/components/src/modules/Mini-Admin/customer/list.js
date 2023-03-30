import React, { useRef, useState, useEffect, } from "react";
import { useParams } from "react-router";
import Dashboard from "../../../Layout/Mini-Admin/Dasboard";
import noOrder from "../../../assets/svg/noOrders.svg";
import { Previouspage, } from "../../../assets/svg/adminIcons";
import { useHistory } from "react-router-dom" 
import  { connect, useDispatch, useSelector } from "react-redux";
import {
  getAllDistributor,
} from "../../Admin/pages/actions/adminDistributorAction";
import { useTranslation } from "react-i18next";
import {
  customerTypeBasedOnCountry,
} from "../../../utils/custormerType";
import { getMiniAdminCustomers } from "../../Admin/customer/actions/customer";
import Pagination from "../../Admin/components/pagination";
import { filter } from "lodash"
import { GetDistributors } from "../GetDistributors";
import qs from "qs";

const Customers = ({
  location,
}) => {
  const { t } = useTranslation();
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const ccountry = AuthData?.country;
  const [loader, setLoader] = useState(false);
  const [tab,setTab] = useState("")
  const [customerData, setCustomerData] = useState("");
  const [custType, setCustType] = useState(
    ccountry === "Nigeria" ? "Bulkbreaker" : "Reseller"
  );
  const history = useHistory();
  const dispatch = useDispatch();

  const { distCode } = useParams();
  const allCustomers = useSelector(
    (state) => state.CustomerReducer.all_customers
  );

  const allDistributors = useSelector(
    (state) => state.AllDistributorReducer.all_distributors
  );

   useEffect(() => {
    const filterParams = history.location.search.substr(1);
    const filtersFromParams = qs.parse(filterParams);
    if (filtersFromParams.tab) {
      setTab(filtersFromParams.tab);
    }
  }, []);
		
useEffect(()=>{
	    history.push(`?tab=${tab}`);
	if(customerData === "" && tab !== ""){
		setCustomerData(tab)
	}
},[customerData,tab])

  let myDistributors = [];

  if (myDistributors.length === 0) {
    myDistributors = GetDistributors();
  }

  let SYS_CODES = [];

  SYS_CODES.length === 0 &&
    myDistributors.forEach((distributor) => {
      const thisDist = filter(myDistributors, {
        DIST_Code: distributor?.DIST_Code,
      })[0];
      SYS_CODES.push(thisDist?.SYS_Code);
    });

  const fetchCustomers = () => {
    return allCustomers && allCustomers.filter((data) => {
      return (
        data?.CUST_Name !== null && String(data?.CUST_Name).startsWith(`${customerData}`) ||
        data?.CUST_Type !== null && data?.CUST_Type.toLowerCase().includes(
          `${customerData.toLowerCase()}`
        ) ||
        data?.bdr !== null && data?.bdr.toLowerCase().includes(`${customerData.toLowerCase()}`) ||
        data?.status !== null && data?.status.toLowerCase().includes(`${customerData.toLowerCase()}`)
      );
    });
  };

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return (
      allCustomers && fetchCustomers().slice(firstPageIndex, lastPageIndex)
    );
  };

  const pushTomanageCustomer = (id, distCode) => {
    history.push(`/distributor/manage-customer/${distCode}/${id}`);
  };

  // const code = location.pathname.split("/").at(-1);
  // useEffect(() => {
  //   getSingleDistributor(distCode);
  // }, []);
  useEffect(() => {
    //   const data = {
    //   dist: SYS_CODES
    // };
    console.log(SYS_CODES);
    currentTableData();
    dispatch(getAllDistributor(ccountry))
    SYS_CODES.length > 0 &&
      dispatch(getMiniAdminCustomers({ dist: SYS_CODES }));
    //getSingleOrderByBuyerId()
  }, [currentPage, SYS_CODES.length]);

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {/* <Link to="/admin-dashboard"> */}
            <Previouspage onClick={() => history.goBack()} />
            {/* </Link> */}
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("customers")}
            </p>
          </div>
        </div>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-8 shadow-lg rounded">
          <div className="block tab-content tab-space pb-5 flex-auto w-full">
            <div className="flex flex-row justify-between items-center border-b h-16 px-8">
              <div className="flex justify-between font-customGilroy text-base font-medium not-italic text-grey-85 w-3/7 h-full">
                <li className="flex cursor-pointer">
                  <a
                    className={
                      "flex font-customGilroy pt-6 text-base font-normal cursor-pointer" +
                      (customerData === ""
                        ? "text-active border-b-4 rounded border-basic"
                        : "text-default")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setCustomerData("");
                      setTab("");
                    }}
                  >
                    {t("customers")}
                  </a>
                </li>
                {customerTypeBasedOnCountry(
                  ccountry,
                  customerData,
                  setCustomerData,
                  tab,
                  setTab                  
                )}
              </div>
            </div>
            <div className="flex mt-3 px-4">
              <input
                className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
                id="search"
                type="text"
                name="search"
                style={{ width: "26.063rem", backgroundColor: "#E5E5E5" }}
                onChange={(e) => setCustomerData(e.target.value)}
                placeholder={t("search_for_customer")}
              />
            </div>
            <div className="tab-content tab-space">
              <div className="">
                <table className="min-w-full mt-8 divide-y divide-gray-200">
                  <thead className="bg-transparent ">
                    <tr className="">
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        S/N
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("customer_code")}
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("customer_type")}
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("customer_name")}
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        Distributor Code
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("status")}
                      </th>
                      <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                        {t("registration_date")}
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="bg-white px-6 divide-y divide-gray-200"
                    id="filterTBody"
                  >
                    {allCustomers?.length === 0 ? (
                      <tr className="my-8 justify-center">
                        <td colSpan={9}>
                          <img className="m-auto" src={noOrder} />
                          <p className="text-center font-medium">
                            {!allCustomers ? t("no_data") : t("fetching_data")}
                          </p>
                        </td>
                      </tr>
                    ) : (
                        currentTableData()?.map((customer, index) => (
                          <tr
                            key={customer.id}
                            onClick={() =>
                              pushTomanageCustomer(customer.id, customer.DIST_Code)
                            }
                            className="cursor-pointer"
                          >
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {`${index + 1}.`}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {customer.SF_Code}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {customer.CUST_Type}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {customer.CUST_Name
                                ? customer.CUST_Name
                                : t("not_available")}
                            </td>
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {distCode}
                            </td>
                            {customer.status === "Active" ? (
                              <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                                <button className="rounded-full bg-green-500 py-1 px-3">
                                  {customer.status}
                                </button>
                              </td>
                            ) : (
                                <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                                  <button className="rounded-full bg-red-500 py-1 px-3">
                                    {t("inactive")}
                                  </button>
                                </td>
                              )}
                            <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                              {customer.registeredOn}
                            </td>
                          </tr>
                        ))
                      )}
                  </tbody>
                </table>
                <hr />
                <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                  {fetchCustomers()?.length > 0 && (
                    <Pagination
                      className="pagination-bar"
                      currentPage={currentPage}
                      totalCount={fetchCustomers().length}
                      pageSize={PageSize}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Customers;
