import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Dashboard from "../../../Layout/Dashboard";
import QuickActions from "../../../components/common/QuickActions";
import { quickActionsInventory } from "../../../utils/quickActions";
import InventoryLayout from "../components/InventoryContent";

import {
  discardChanges,
  getAllInventory,
  getAllOutOfStock,
  getTotalEmpties,
  setApprovalModal,
} from "../actions/inventoryProductAction";
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'
import SetupAlert from "../components/SetupAlert";
import ReturnTotalEmpties from "../components/ReturnTotalEmpties";
import { setDistCode } from "../../Distributors/actions/DistributorAction";
import { useTranslation } from "react-i18next";
import EmptiesModal from "../components/EmptiesModal";

const InventoryHome = (props) => {
const {t} = useTranslation()
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const dispatch = useDispatch();
  const inventoryExist = useSelector(
    (state) => state.InventoryReducer.inventoryExist
  );
  const [country, setCountry] = useState('Ghana');


  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country])

  const openReturnTotalEmpties = useSelector(
    (state) => state.InventoryReducer.return_empties_button
  );

  const emptiesModal = useSelector(
    (state) => state.InventoryReducer.empties_modal_button
  );

  const { Dist_Code } = useParams();
  const history = useHistory();

  useEffect(() => {
    dispatch(getAllInventory(Dist_Code));
    dispatch(discardChanges());
    dispatch(setApprovalModal(false));
  }, []);

  const allInventory = useSelector(
    (state) => state.InventoryReducer.all_inventory
  );
  
    if (!allInventory.length) {
      dispatch(getAllInventory(Dist_Code));
    }
    const borderActive = countryConfig[country].borderBottomColor;

  return (
    <Dashboard location={props.location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <h2 className="font-customRoboto text-black font-bold text-2xl">
          {country === "Tanzania" ? "Stock" : t("inventory")}
        </h2>
        <div className="mt-8 mb-12">
          {AuthData.roles !== "Mini-Admin" && (
            <QuickActions data={quickActionsInventory} code={Dist_Code} />
          )}
        </div>
        <InventoryLayout
          top="mt-8"
          borderActive={borderActive}
          inventoryData={allInventory}
          Dist_Code={Dist_Code}
          history={history}
        />
      </div>
      <SetupAlert show={!inventoryExist} code={Dist_Code} />
      <ReturnTotalEmpties show={openReturnTotalEmpties} code={Dist_Code} />
      <EmptiesModal showModal={emptiesModal} code={Dist_Code} />
    </Dashboard>
  );
};

export default InventoryHome;
