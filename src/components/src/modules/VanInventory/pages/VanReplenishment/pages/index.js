import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Previouspage } from "../../../../../assets/svg/adminIcons";
import Transfer from "../../../../../components/common/Transfer";
import Dashboard from "../../../../../Layout/Dashboard";
import { connect } from "react-redux";
import { useParams } from "react-router";
import VanReplenishmentLayout from "../components/VanReplenishmentContent";
import { inventoryData } from "../../../../../utils/data";
import Modal from "../../../../../components/common/Modal2";
import { getAllSingleVanInventory } from "../../../actions/vanAction";
import { getAllDriversByOwnerId } from "../../../../Admin/order/actions/orderAction";
import { getSingleDistributor } from "../../../../Admin/pages/actions/adminDistributorAction";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const VanReplenishment = ({
  location,
  allDrivers,
  distributor,
  getSingleDistributor,
  getAllDriversByOwnerId,
  getAllSingleVanInventory,
}) => {
  const { t } = useTranslation();

  const history = useHistory();
  const [driver, setDriver] = useState("");
  const { distcode } = useParams();
  const [isShowing, setShow] = useState(false);
  const toggleModal = () => {
    return (setShow(!isShowing))
  };
  useEffect(() => {
    getAllDriversByOwnerId(distcode);
    getAllSingleVanInventory(parseInt(driver.split("-")[0], 10));
    getSingleDistributor(distcode);
  }, []);

  const getDriver = (driver) => {
    setDriver(driver);
  };
  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex van-replenish-cont">
          <div className="flex">
            {/* <Link to={`/dashboard/van-inventory/${distcode}`}> */}
            <Previouspage onClick={() => history.goBack()} />
            {/* </Link> */}
            <h2 className="font-customRoboto mx-2 text-black font-bold text-2xl">
              {t("van_replenishment")}
            </h2>
          </div>
        </div>
        <Transfer
          distributor={distributor}
          allDrivers={allDrivers}
          getDriver={getDriver}
          driver={driver}
        />
        <VanReplenishmentLayout
          top="mt-8"
          code={distcode}
          driver={driver}
          inventoryData={inventoryData}
        />
        {/* {isShowing && (<div> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, eius voluptas. Consequuntur possimus quo, repellat voluptatum optio voluptas. Laudantium quod tempora dolor voluptatum! Dolor quam illo omnis tempore maxime iste.</div>)} */}
        {isShowing && <Modal toggleModal={toggleModal} />}
      </div>
    </Dashboard>
  );
};

const mapStateToProps = (state) => {
  return {
    driverInventory: state.VanInventoryReducer.all_single_van_inventory,
    allDrivers: state.OrderReducer.all_drivers,
    distributor: state.AllDistributorReducer.distributor,
  };
};

export default connect(mapStateToProps, {
  getAllSingleVanInventory,
  getSingleDistributor,
  getAllDriversByOwnerId,
})(VanReplenishment);
