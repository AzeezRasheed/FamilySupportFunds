import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../../Layout/Mini-Admin/Dasboard";
import { Previouspage } from "../../../assets/svg/adminIcons";
import Download from "../../../assets/svg/download-report.svg";
import { Link, useHistory } from "react-router-dom" 
import  moment from "moment";

import LoadingList from "../../../components/common/LoadingList";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import Pagination from "../../Admin/components/pagination";
import { 
  getAssignedDistributorsStockLevel, getAssignedDistributorsStockLevelWithSku, setLoadingToDefault 
} from "../../Admin/Reports/actions/ReportAction";
import { GetDistributors } from "../GetDistributors";
import { formatNumber } from "../../../utils/formatNumber";
import { countryCode } from "../../../utils/countryCode";



const StockLevel = ({ location }) => {
  const {t} = useTranslation()
  const history = useHistory();
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const myDistributors = GetDistributors();
  const date = new Date();

  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [distributorLength, setDistributorLength] = useState(0)

  const distributorsStock = useSelector(state => state.ReportReducer.distributors_stock);
  const distributorsStockWithSku = useSelector(state => state.ReportReducer.distributors_stock_with_sku);
  const loading = useSelector((state) => state.ReportReducer.loading);

  useEffect(() => {
    setDistributorLength(myDistributors.length)
  }, [myDistributors])

  useEffect(() => {
    let distributors = [...myDistributors].map(dist => dist.DIST_Code);
    if (distributors.length > 0) {
      dispatch(setLoadingToDefault());
      dispatch(getAssignedDistributorsStockLevel(
        country === "South Africa"  || country === "Tanzania" || country === "Uganda"
        ? countryCode(country)
        : country, {
        companyCodes: distributors
      }));
      dispatch(getAssignedDistributorsStockLevelWithSku(
        country === "South Africa"  || country === "Tanzania" || country === "Uganda"
        ? countryCode(country)
        : country, {
        companyCodes: distributors
      }));
    }
  }, [distributorLength]);

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return (
      distributorsStock &&
      distributorsStock.slice(firstPageIndex, lastPageIndex)
    );
  };

  useEffect(() => {
    currentTableData();
  }, [currentPage]);

  const backButton = () => {
    history.goBack();
  };

  const handlePush = (code) => {
    history.push(`/min-admin-dashboard/reports/stock-level/${code}`);
  };

  const getData = () => {
    let dd = [];
    distributorsStockWithSku?.map((stock) => {
      dd.push({
        Distributor: stock.distributor,
        "Syspro code": stock.sysproCode,
        Country: stock.country,
        Product: stock.brand + ' ' + stock.sku,
        Quantity: formatNumber(stock.quantity),
        Date: moment(date).format("DD-MM-YYYY"),
      })
    });
    return dd;
  };

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-8 md:pb-10 lg:pb-10 mb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={backButton} style={{ cursor: "pointer" }} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("stock_level")}
            </p>
          </div>
          <div className="flex gap-16 items-center">
            <CSVLink
              data={getData()}
              filename={`${country}_stock_level_on_${moment(date).format("DD-MM-YYYY")}.csv`}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} alt="" />
                <p className="report-download">{t("download_report")}</p>
              </div>
            </CSVLink>
          </div>
        </div>
        <div
          className="bg-white my-10 py-6"
          style={{
            boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2)",
            borderRadius: "8px",
          }}
        >
          {loading ? (
            <LoadingList />
          ) : (
            <>
              <table className="min-w-full mt-3 divide-y divide-grey-500">
                <thead className="bg-transparent ">
                  <tr className="">
                    <th className="pl-10 pr-6 py-3 text-right text-xs font-medium text-black align-middle">
                      S/N
                    </th>
                    <th className="pl-6 pr-10 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("date")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("distributor")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("total_stock")}
                    </th>
                  </tr>
                </thead>

                <tbody
                  id="distributors"
                  className="bg-white px-6 divide-y divide-gray-200"
                >
                  {currentTableData().map((dist, index) => (
                    <tr key={index}>
                      <td className="font-customGilroy text-sm font-medium text-right align-middle p-6 w-24">
                        {index + 1}
                      </td>
                      <td className="font-customGilroy text-sm font-medium align-middle pl-6 pr-10 py-6 w-80">
                        {moment(date).format("DD-MM-YYYY")}
                      </td>
                      <td
                      onClick={() => handlePush(dist.companyCode)}
                        className="text-left align-middle cursor-pointer"
                      >
                        {/* <Link
                          target="_blank"
                          to={`/dashboard/inventory/${dist.companyCode}`}
                        > */}
                          <p className="font-customGilroy pl-8 text-sm text-red-900 font-medium">
                            {dist.distributor}
                          </p>
                        {/* </Link> */}
                      </td>
                      <td className="font-customGilroy text-sm font-medium align-middle px-10 py-6">
                        {formatNumber(dist.quantity)}
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
                  totalCount={distributorsStock.length}
                  pageSize={PageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default StockLevel;
