import React, { useState, useEffect } from "react";
import Dashboard from "../../../Layout/Dashboard";
import { useParams } from "react-router";
import { Arrows, Return } from "../../../assets/svg/adminIcons";
import { WalkInSales } from "../pages";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllInventory, clearInvent
} from "../../Inventory/actions/inventoryProductAction";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CaptureSales = ({ location }) => {
  const {t} = useTranslation()
  const [openTab, setOpenTab] = useState(1);
  const dispatch = useDispatch()
  const { distCode } = useParams();
  const distributorDetails = useSelector(state => state.AllDistributorReducer?.distributor)
  useEffect(() => {
    if (distributorDetails?.DIST_Code) {
      dispatch(getAllInventory(distributorDetails?.DIST_Code));
    }
  }, [distributorDetails?.DIST_Code]);
  const ProductData = useSelector(state => state.InventoryReducer.all_inventory)
  const loading = useSelector(state => state.InventoryReducer.loadingInventory)
  // const reloadingInvet = useSelector(state => state.InventoryReducer.reloadInventoryState)
  const reloading = useSelector(state => state.InventoryReducer.loadingQuantityAfterSales)

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex">
          <Link to={`/dashboard/transactions/${distCode}`}>
            <Return />
          </Link>
          <h2 className="font-customRoboto mx-4 text-black font-bold text-2xl">
            {t("walk_in_sales")}
          </h2>
        </div>
        <WalkInSales inventoryData={ProductData} distributorDetails={distributorDetails?.DIST_Code} loading={loading} reloading={reloading} clearInvent={clearInvent} />
      </div>
    </Dashboard>
  );
};

export default CaptureSales;
