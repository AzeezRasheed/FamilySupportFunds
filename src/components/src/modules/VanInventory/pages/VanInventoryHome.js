import React, { useEffect, useState } from 'react';
import Dashboard from '../../../Layout/Dashboard';
import { useHistory, useParams } from "react-router-dom";
import QuickActions from "../../../components/common/QuickActions";
import { VanInventoryQuickActions } from "../../../utils/quickActions";
import { useDispatch, useSelector } from "react-redux";
import vanInventoryVan from '../../../assets/svg/vanInventoryVan.svg'
import { connect } from "react-redux";
import VanInventoryLayout from '../components/VanInventoryContent';
import { getAllSingleVanInventory } from "../actions/vanAction";
import {
  getAllDriversByOwnerId,
} from "../../Admin/order/actions/orderAction";
import { useTranslation } from "react-i18next";


const InventoryHome = ({ location,  getAllDriversByOwnerId }) => {
  // const code = location.pathname.split("/").at(-1);
	const { distCode } = useParams();
	const {t} = useTranslation()

	const quickActionsVan = VanInventoryQuickActions(distCode)
  const history = useHistory();
  const pushToVanReplenish = (code) => {
    history.push(`/dashboard/van-replenishment/${code}`)
  }
  useEffect(() => {
    getAllDriversByOwnerId(distCode);
    // getAllSingleVanInventory(vehicleId)
  }, [distCode])


	return (
		<Dashboard location={location}>
			<div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
				<div className="flex van-replenish-cont">
					<h2 className="font-customRoboto text-black font-bold text-2xl">
						{t("van_inventory")}
					</h2>
					{/* <div onClick={() => pushToVanReplenish(code)}>
						<button className="flex replenish-btn">
							<img className="van-img" alt="" src={vanInventoryVan} />
							<p className="van-text">Replenish Van</p>
						</button>
					</div> */}

				</div>
				<div className="mt-8 mb-12">
          	<QuickActions data={quickActionsVan} />
        </div>
				<VanInventoryLayout
					top="mt-8"
          code = {distCode}
          // allDrivers={allDrivers}
				/>
			</div>
		</Dashboard>
	)
}
const mapStateToProps = (state) => {
  return {
    driverInventory: state.VanInventoryReducer.all_single_van_inventory,
    allDrivers: state.OrderReducer.all_drivers,
  };
};

export default connect(mapStateToProps, {
  getAllSingleVanInventory,
  getAllDriversByOwnerId
})(InventoryHome);


