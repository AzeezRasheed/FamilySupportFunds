import React, { useEffect, useState } from "react";
import moment from "moment";
import { Previouspage } from "../../../../assets/svg/adminIcons";
import Download from "../../../../assets/svg/download-report.svg";
import { useHistory } from "react-router-dom" 
import  { connect, useDispatch, useSelector } from "react-redux";
import { getSingleDistributor } from "../../../Admin/pages/actions/adminDistributorAction";
import { getAllInventory, setLoadingToDefault } from "../../../Inventory/actions/inventoryProductAction";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";
import Pagination from "../../../Admin/components/pagination";
import LoadingList from "../../../../components/common/LoadingList";
import Dashboard from "../../../../Layout/Mini-Admin/Dasboard";
import { formatEmptiesQuantity } from "../../../../utils/helperFunction";
import Tag from "../../../Inventory/components/Tag";

const StockLevel = ({ location, distributor, getSingleDistributor }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {t} = useTranslation()

  const code = location.pathname.split("/").at(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 10;

  const allInventory = useSelector(
    (state) => state.InventoryReducer.all_inventory
  );
  const loading = useSelector((state) => state.InventoryReducer.loadingInventory);

  useEffect(() => {
    dispatch(setLoadingToDefault())
    getSingleDistributor(code);
    dispatch(getAllInventory(code));
  }, []);

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return (
      allInventory &&
      allInventory.slice(firstPageIndex, lastPageIndex)
    );
  };

  useEffect(() => {
    currentTableData();
  }, [currentPage]);

  const backButton = () => {
    history.goBack();
  };

  let tableData = [];
  allInventory.map((data, index) => {
    data.tableId = index + 1;
    tableData.push({
      Syspro_Code: distributor?.SYS_Code,
      Date: moment(new Date()).format("YYYY-MM-DD"),
      Product: data.product?.brand + " " + data.product?.sku,
      "Quantity Available": data.quantity,
      Empties: formatEmptiesQuantity(data.product?.productType, data.empties)
    });
  });

  const data = tableData;

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-10 lg:pb-10 mb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Previouspage onClick={() => backButton()} />
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {distributor?.company_name}
            </p>
          </div>
          <div className="flex gap-16 items-center">
            <CSVLink
              data={data}
              filename={`${
                distributor?.company_name
              }_stock_level_on_${moment(new Date()).format("DD-MM-YYYY")}.csv`}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} alt="" />
                <p className="report-download">
                  {t("download_report")}
                </p>
              </div>
            </CSVLink>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center font-customGilroy text-sm not-italic mt-4 mb-10">
            <p className="font-normal text-gray-400">{t("distributor")}</p>/
            <p className="font-medium text-grey-100">
              {distributor?.company_name}
            </p>
            /
            <p className="font-medium text-grey-100">
              {t("stock_level")}
            </p>
          </div>
        </div>
        <div
          className="bg-white mb-10 py-6"
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
                      {t("product")}
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("quantity")}
                      <Tag className="bg--blue mt-1" tagName={t("fulls")} />
                    </th>
                    <th className="px-10 py-3 text-left text-xs font-semibold text-black align-middle">
                      {t("quantity")}
                      <Tag className="bg--accent mt-1" tagName={t("empties")} />
                    </th>
                  </tr>
                </thead>

                <tbody
                  id="distributors"
                  className="bg-white px-6 divide-y divide-gray-200"
                >
                  {currentTableData()?.map((product, index) => (
                    <tr key={index}>
                      <td className="font-customGilroy text-sm font-medium text-right align-middle p-6 w-24">
                        {product.tableId}.
                      </td>
                      <td className="font-customGilroy text-sm font-medium align-middle pl-6 pr-10 py-6">
                        {product.product.brand + " " + product.product.sku}
                      </td>
                      <td className="align-middle cursor-pointer w-3/12">
                        <p className="font-customGilroy pl-8 text-sm w-24 font-medium mr-auto">
                          {product.quantity}
                        </p>
                      </td>
                      <td className="align-middle cursor-pointer w-3/12">
                        <p className={`font-customGilroy pl-8 text-sm w-24 font-medium mr-auto 
                          ${formatEmptiesQuantity(product.product?.productType, product.empties) === 'Nil' && 'text--accent'}`}
                        >
                          {formatEmptiesQuantity(product.product?.productType, product.empties)}
                        </p>
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
                  totalCount={allInventory.length}
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

const mapStateToProps = (state) => {
  return {
    distributor: state.AllDistributorReducer.distributor,
  };
};

export default connect(mapStateToProps, {
  getSingleDistributor,
})(StockLevel);
