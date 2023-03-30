import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import arrowBackBox from "../../../assets/svg/arrowBack.svg";
import Transfer from "../../../components/common/Transfer";
import Dashboard from "../../../Layout/Dashboard";
import Warehouse from "../components/WarehouseTransfer";
import { inventoryData } from "../../../utils/data";
import { getDroppointsByCompanyId } from "../../Admin/drop-point/actions/droppoints";
import { Fade } from "react-reveal";
import { getAllInventory } from "../../Inventory/actions/inventoryProductAction";
import { useTranslation } from "react-i18next";

const WarehouseTransfer = ({ location }) => {
  const { t } = useTranslation();

  const [show, setShow] = useState(false);

  const { distributorCode } = useParams();
  const dispatch = useDispatch();
  const dropPoints = useSelector((state) => state.DropPointReducer.drop_points);
  const fromLocation = useSelector(
    (state) => state.DropPointReducer.from_dropPoint
  );
  const toLocation = useSelector(
    (state) => state.DropPointReducer.to_dropPoint
  );
  const allInventory = useSelector(
    (state) => state.InventoryReducer.all_inventory
  );

  if (!dropPoints.length) {
    dispatch(getDroppointsByCompanyId(distributorCode));
  }
  if (!allInventory?.length) {
    dispatch(getAllInventory(distributorCode));
  }
  useEffect(() => {
    if (
      fromLocation !== "" &&
      toLocation !== "" &&
      fromLocation !== toLocation
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [fromLocation, toLocation]);

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex van-replenish-cont">
          <div className="flex">
            <img className="van-img pr-7" src={arrowBackBox} />
            <h2 className="font-customRoboto mt-2 text-black font-bold text-2xl">
              {t("warehouse_transfer")}
            </h2>
          </div>
        </div>
        <Transfer dist={distributorCode} dropPoints={dropPoints} />
        <Fade when={show}>
          <Warehouse
            top="mt-8"
            dist={distributorCode}
            inventoryData={allInventory}
          />
        </Fade>
      </div>
    </Dashboard>
  );
};

export default WarehouseTransfer;
