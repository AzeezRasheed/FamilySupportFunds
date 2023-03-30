import React, { useState } from "react";
import SortImg from "../../../assets/svg/sort.svg";
import { Link } from 'react-router-dom'
import straightDivider from "../../../assets/svg/straightDivider.svg";
import CalendarIcon from "../../../assets/svg/calendarIcon.svg";
const CicAgents = () => {
  return (
    <div className="bg-white mt-4 w-full rounded-md">
      <div className="py-5 flex-auto">
        <div className="stock-cont py-4">
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="py-2 flex-auto">
                <div className="tab-content tab-space">
                  <div className="block">
                    <div
                      className="mt-3 px-4 flex justify-between"
                      style={{ width: "100%" }}
                    >
                      <input
                        className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400"
                        id="search"
                        type="text"
                        name="search"
                        style={{
                          width: "40%",
                          backgroundColor: "#E5E5E5",
                        }}
                        // onChange={(e) => onChange(e)}
                        placeholder="Search for anything"
                      />
                      <div className="flex pt-1" style={{ width: "50%" }}>
                        <div
                          className="flex text-center font-normal mr-4 py-3 rounded-md block bg-white border-default-b border-2"
                          style={{ width: "20%", justifyContent: "center" }}
                        >
                          <img className="pr-2" src={SortImg} alt="" />
                          <p className="text-default font-normal">
                            Sort By
                          </p>
                        </div>
                        <img className="mx-3" src={straightDivider} />
                        <div className="flex text-center font-normal ml-4 px-2 py-3 rounded-md block bg-white border-default-b border-2">
                          <img className="pr-2" src={CalendarIcon} alt="" />
                          <p className="text-default font-normal">
                            Select date range
                          </p>
                        </div>
                      </div>
                    </div>
                    <table className="min-w-full mt-8 divide-y divide-gray-200">
                      <thead className="bg-transparent ">
                        <tr className="">
                          <th
                            scope="col"
                            className="px-12 py-3 text-left text-sm font-medium tracking-wider"
                            style={{ color: "#9799A0" }}
                          >
                            S/N
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                          >
                            Order Number
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                          >
                            BDR Name
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                          >
                            SKUs Ordered
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white px-6 divide-y divide-gray-200">
                        <tr>
                            <td
                              scope="col"
                              className="px-12 py-3 text-left text-sm"
                            >
                              <p style={{ color: "#50525B" }}>1.</p>
                            </td>
                            <td
                              scope="col"
                              className="px-12 py-3 text-left text-sm"
                            >
                              <Link to="/dashboard/order/id">
                                <p style={{ color: "#50525B" }}>12345678</p>
                              </Link>
                            </td>
                            <td
                              scope="col"
                              className="px-12 py-3 text-left text-sm"
                            >
                              <p
                                className="text-sm font-normal"
                                style={{ color: "#50525B" }}
                              >
                                21-02-2021
                              </p>
                            </td>
                            <td
                              scope="col"
                              className="px-12 py-3 text-left text-sm"
                            >
                              <p
                                className="text-sm font-normal"
                                style={{ color: "#50525B" }}
                              >
                                Aanuoluwapo Simi
                              </p>
                            </td>
                            <td
                              scope="col"
                              className="px-12 py-3 text-left text-sm"
                            >
                              <p
                                className="text-sm text-default font-normal"
                                style={{ color: "#50525B" }}
                              >
                                6
                              </p>
                            </td>
                            <td
                              scope="col"
                              className="px-12 py-3 text-left text-sm"
                            >
                              <div className="flex">
                                <div
                                  className="fler w-28 h-8 px-2 text-center font-normal text-sm"
                                  style={{
                                    background: "#D82C0D",
                                    borderRadius: "24px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <p className="py-1" style={{ color: "#fff" }}>
                                    Uncaptured
                                  </p>
                                </div>
                              </div>
                            </td>
                        </tr>
                        <tr>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <p style={{ color: "#50525B" }}>1.</p>
                          </td>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <p style={{ color: "#50525B" }}>12345678</p>
                          </td>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <p
                              className="text-sm font-normal"
                              style={{ color: "#50525B" }}
                            >
                              21-02-2021
                            </p>
                          </td>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <p
                              className="text-sm font-normal"
                              style={{ color: "#50525B" }}
                            >
                              Aanuoluwapo Simi
                            </p>
                          </td>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <p
                              className="text-sm text-default font-normal"
                              style={{ color: "#50525B" }}
                            >
                              6
                            </p>
                          </td>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <div className="flex">
                              <div
                                className="fler w-28 h-8 px-2 text-center font-normal text-sm"
                                style={{
                                  background: "#D82C0D",
                                  borderRadius: "24px",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <p className="py-1" style={{ color: "#fff" }}>
                                  Uncaptured
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <p style={{ color: "#50525B" }}>1.</p>
                          </td>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <p style={{ color: "#50525B" }}>12345678</p>
                          </td>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <p
                              className="text-sm font-normal"
                              style={{ color: "#50525B" }}
                            >
                              21-02-2021
                            </p>
                          </td>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <p
                              className="text-sm font-normal"
                              style={{ color: "#50525B" }}
                            >
                              Aanuoluwapo Simi
                            </p>
                          </td>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <p
                              className="text-sm text-default font-normal"
                              style={{ color: "#50525B" }}
                            >
                              6
                            </p>
                          </td>
                          <td
                            scope="col"
                            className="px-12 py-3 text-left text-sm"
                          >
                            <div className="flex">
                              <div
                                className="fler w-28 h-8 px-2 text-center font-normal text-sm"
                                style={{
                                  background: "#D82C0D",
                                  borderRadius: "24px",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <p className="py-1" style={{ color: "#fff" }}>
                                  Uncaptured
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CicAgents;
