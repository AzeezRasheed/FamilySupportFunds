import React, { useState, useEffect } from "react";
import arrowDown from '../../../assets/svg/arrowDown.svg'
import SortImg from '../../../assets/svg/sort.svg'
import { Redirect, Progination } from '../../../assets/svg/adminIcons'
import { Link } from 'react-router-dom';
import CustomerTab from '../../../components/common/Tabs';
import { useTranslation } from "react-i18next";
import { NotificationData as data } from '../../../utils/data'
import { notificationTableContent as content } from '../../../utils/data'
import { adminNotificationSubTabHeaderData as subHeader } from '../../../utils/data'
import { getLocation } from '../../../utils/getUserLocation'
import countryConfig from '../../../utils/changesConfig.json'

const CustomerTable = ({ top, DistributorList }) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation();
  const [country, setCountry] = useState('Ghana');


  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country])
  const searchCustomer = (filterInput, filterTbody) => {
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
  return (
    <>
      <div
        className={`relative flex flex-col min-w-0 break-words bg-white w-full mb-6 ${top} shadow-lg rounded`}
      >
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className="block">
                  <div className="flex justify-between">
                    <div>
                      <CustomerTab
                        dataHeader={subHeader}
                        dataContent={content}
                        notificationData={data}
                        setOpen={setOpen}
                      />
                    </div>
                    <div className="mt-5 border-0 flex   px-6 ">
                      <button className="rounded font-customGilroy text-base px-6 py-3"
                      style={{ backgroundColor: countryConfig[country].buttonColor, color: countryConfig[country].textColor}}>
                          {t("create_new_customer")}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 px-4 flex pt-10">
                    <input
                      className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
                      id="searchCustomer"
                      type="text"
                      name="search"
                      style={{ width: "26.063rem", backgroundColor: "#E5E5E5" }}
                      onKeyUp={() =>
                        searchCustomer("searchCustomer", "customers")
                      }
                      placeholder={t("search_for_customer")}
                    />
                    <div className="flex pt-1">
                      {/* <div
                        className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <p className="text-sm text-default font-normal">
                          All locations(s)
                        </p>{" "}
                        <img className="pl-3 pr-2" src={arrowDown} alt="" />
                      </div> */}
                      {/* <div
                        className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block  bg-white border-default-b border-2"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <p className="text-sm text-default font-normal">
                          Any Status
                        </p>{" "}
                        <img className="pl-3 pr-2" src={arrowDown} alt="" />
                      </div> */}
                      {/* <div className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2">
                        <img className="pr-2" src={SortImg} alt="" />
                        <p className="text-sm text-default font-normal">
                          Sort By
                        </p>
                      </div> */}
                    </div>
                  </div>
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
                          {t("customer_name")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("location")}
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("status")}
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("last_order_date")}
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("total_orders")}
                        </th>
                        <th className="px-2 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          {t("total_amount_spent")}
                        </th>
                        <th className="px-10 py-3 ">{"          "}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white px-6 divide-y divide-gray-200">
                      {DistributorList.map((sku, index) => (
                        <tr key={sku.id}>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {index + 1 + "."}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {sku.distributionCode}
                          </td>
                          {/* <Link to='/admin-distributor'> */}
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {sku.distributorName}
                          </td>
                          {/* </Link> */}
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {sku.location}
                          </td>
                          {sku.status === "Active" ? (
                            <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                              <button className="rounded-full bg-green-500 py-1 px-3">
                                {sku.status}
                              </button>
                            </td>
                          ) : (
                            <td className="font-customGilroy text-sm font-medium text-center align-middle text-white p-6">
                              <button className="rounded-full bg-red-500 py-1 px-3">
                                {sku.status}
                              </button>
                            </td>
                          )}
                          <td className="flex gap-1 font-customGilroy text-sm font-medium text-red-900 text-center align-middle p-6">
                            21-02-2021
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {sku.totalOrder}
                          </td>
                          <td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
                            {sku.totalSales}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <hr />
                  <div className="flex justify-end items-center gap-4 mr-20 mt-6">
                    1 - 50 of 100 <Progination />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerTable;