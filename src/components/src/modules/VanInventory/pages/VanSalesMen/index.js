import React, { Fragment, useRef, useState, useEffect } from "react";
import Dashboard from "../../../../Layout/Dashboard";
import { Return } from "../../../../assets/svg/adminIcons";
import noOrder from "../../../../assets/svg/noOrders.svg";
import SortImg from "../../../../assets/svg/sort.svg";
import { Link } from "react-router-dom";
import Loading from "../../../../components/common/Loading";
import {
  Previouspage,
  Progination,
  Redirect,
} from "../../../../assets/svg/adminIcons";
import { connect } from "react-redux";
import Pagination from "../../../Admin/components/pagination";
import { getAllDriversByOwnerId } from "../../../Admin/order/actions/orderAction";
import { useHistory, useParams } from "react-router-dom";
import { getSingleDistributor } from "../../../Admin/pages/actions/adminDistributorAction";
import { useTranslation } from "react-i18next";

const VanSalesMen = ({ location, getAllDriversByOwnerId, vsms }) => {
  const { t } = useTranslation();

  const { distCode } = useParams();
  const history = useHistory();
  let PageSize = 10;
  const [vsmData, setVsmData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [driverId, setDriverId] = useState("");

  const pushTomanageVsm = (vehicleId) => {
    window.location.href = `/distributor/vsm-summary/${distCode}/${vehicleId}`;
    // history.push(`/distributor/vsm-summary/${distCode}/${vehicleId}`);
  };

	const sortVsms = () => {
		return vsms.filter((data) => {
			return (
				data?.vehicleId !== null && String(data?.vehicleId)
					.toLowerCase()
					.includes(`${vsmData.toLowerCase()}`) ||
					data?.name !== null && data?.name.toLowerCase().includes(`${vsmData.toLowerCase()}`) ||
					data?.phoneNumber !== null && String(data?.phoneNumber).toLowerCase().includes(`${vsmData.toLowerCase()}`) ||
					data?.address !== null && data?.address.toLowerCase().includes(`${vsmData.toLowerCase()}`) && data?.status !== 0
			);
		});
	};

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return sortVsms().slice(firstPageIndex, lastPageIndex);
  };

  useEffect(() => {
    currentTableData();
    getAllDriversByOwnerId(distCode);
    getSingleDistributor(distCode);
  }, [distCode, currentPage, driverId]);

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex">
          <Link to={`/dashboard/van-inventory/${distCode}`}>
            <Return />
          </Link>
          <h2 className="font-customRoboto mx-4 text-black font-bold text-2xl">
            {t("van_sales_men")}
          </h2>
        </div>
        <div
          className={`relative flex flex-col min-w-0 break-words bg-white w-full mb-6 mt-4 shadow-lg rounded`}
        >
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="py-5 flex-auto">
                <div className="tab-content tab-space">
                  <div className="block">
                    <div className="mt-3 px-4 flex">
                      <input
                        className="h-11 py-6 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded w-full px-3 mx-4  text-black-400 "
                        id="search"
                        type="text"
                        name="search"
                        style={{
                          width: "26.063rem",
                          backgroundColor: "#E5E5E5",
                        }}
                        // onChange={(e) => onChange(e)}
                        placeholder="Search for Van sales men"
                        onChange={(e) => setVsmData(e.target.value)}
                      />
                      <div className="flex pt-1"></div>
                    </div>

                    <table className="min-w-full mt-8 divide-y divide-gray-200">
                      <thead className="bg-transparent ">
                        <tr className="">
                          <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                            S/N
                          </th>
                          <th className="px-10 py-3 text-center text-xs font-medium text-black align-middle">
                            {t("vsm_name")}
                          </th>
                          <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                            {t("driver_Id")}
                          </th>
                          <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                            {t("phone_number")}
                          </th>
                          <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                            {t("address")}
                          </th>
                          {/* <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          Total Orders
                        </th>
                        <th className="px-10 py-3 text-left text-xs font-medium text-center text-black align-middle">
                          Total Sales
                        </th> */}
                        </tr>
                      </thead>

                      <tbody
                        id="filter"
                        className="bg-white px-6 divide-y divide-gray-200"
                      >
                        {vsms.length < 1 ? (
                          <tr className="my-8 justify-center">
                            <td colSpan={9}>
                              <img className="m-auto" src={noOrder} />
                            </td>
                          </tr>
                        ) : (
                          currentTableData().map((vsm, index) => (
                            <tr
                              key={vsm.vehicleId}
                              onClick={() => pushTomanageVsm(vsm.vehicleId)}
                              className="cursor-pointer"
                            >
															<td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
																{`${index + 1}`}
															</td>
															<td className="font-customGilroy text-sm font-medium text-center align-middle p-6 cursor-pointer">
																<p className="font-customGilroy text-sm text-red-900 font-medium">
																	{vsm.name}
																</p>
															</td>
															<td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
																{vsm.vehicleId}
															</td>
															<td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
																{vsm.phoneNumber}
															</td>
															<td className="font-customGilroy text-sm font-medium text-center align-middle p-6">
																{vsm.address}
															</td>
														</tr>
													))
												)}
											</tbody>
										</table>
										<hr />
										<div className="flex justify-end items-center gap-4 mr-20 mt-6">
											<Pagination
												className="pagination-bar"
												currentPage={currentPage}
												totalCount={vsms.length}
												pageSize={PageSize}
												onPageChange={(page) => setCurrentPage(page)}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Dashboard>
	);
};

const mapStateToProps = (state) => {
  return {
    vsms: state.OrderReducer.all_drivers,
  };
};

export default connect(mapStateToProps, {
  getAllDriversByOwnerId,
  getSingleDistributor,
})(VanSalesMen);
