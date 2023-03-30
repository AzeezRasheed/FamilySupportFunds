import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import Dashboard from '../../../Layout/Admin/Dashboard';
import { useRouteMatch, Link } from 'react-router-dom';
import { connect } from "react-redux";
import { useHistory } from 'react-router-dom';
import AdminDistributorLayout from '../Layout';
import { AdminDistributorList } from '../../../utils/data'
import { CloseModal, UploadFile, Checked } from '../../../assets/svg/modalIcons';
import { tupleExpression } from '@babel/types';
import DistroDetails from '../Layout/DistroDetails'
import { Previouspage, Progination, Redirect } from '../../../assets/svg/adminIcons'
import {
  getSingleDistributor,
  getAllDistributor,
  editDistributor
} from "./actions/adminDistributorAction";
import { getAllOrdersByDistributor, fetchDataComputation,  getAllDriversByOwnerId } from "../order/actions/orderAction"
import {findIndex} from "lodash"


const Home = ({ location, totalOrders, orderLength, getAllDistributor,fetchDataComputation, getSingleDistributor, getAllDriversByOwnerId, getAllOrdersByDistributor, orders, distributor, allDistributors, allDrivers }) => {
  const [open, setOpen] = useState(false)
  const [approvalModal, setApprovalModal] = useState(false)
  const [warningModal, setWarningModal] = useState(false)
  const formCompleted = false
  const [calendar, setShowCalendar] = useState(false)
  const history = useHistory()
  const showCalender = () => {
    setShowCalendar(calendar ? false : true);
  };

  const cancelButtonRef = useRef(null)
  const { sessionUser } = useSelector(state => state.Auth);

  const handleReset = () => {
    setWarningModal(false)
    setOpen(true)
  }

  const {
    params: { code },
  } = useRouteMatch('/admin-distributor/:code');
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
	const [orderData, setOrderData] = useState("");
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  useEffect(() => {
    getSingleDistributor(code);
    getAllOrdersByDistributor(distributor?.SYS_Code, currentPage, orderData, PageSize, "");
    fetchDataComputation(distributor?.SYS_Code)
    getAllDistributor(country);
    getAllDriversByOwnerId(code)
  }, [distributor?.SYS_Code, country, currentPage, orderData, code]);

  const handleApproval = () => {
    setOpen(false)
    setWarningModal(false)
    setApprovalModal(true)
  }  

  return (
    <Dashboard location={location} sessionUser={sessionUser}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link to="/admin-dashboard">
              <Previouspage/>
            </Link>
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {distributor?.company_name}
            </p>
          </div>
          <div className="flex gap-16 items-center">
            <div className="flex justify-end gap-4 pr-3">
              <Progination /> {`${distributor?.id}/${allDistributors.length}`}
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center font-customGilroy text-sm not-italic mt-4 mb-10">
          <p className="font-normal text-gray-400">
            {distributor?.company_type}
          </p>
          /
          <p className="font-medium text-grey-100">
            {distributor?.company_name}
          </p>
        </div>
        <DistroDetails totalOrders={totalOrders} orderData={orderData} setOrderData={setOrderData} currentPage={currentPage} setCurrentPage={setCurrentPage} distributor={distributor} orders={orders} orderLength={orderLength} code={code} allDrivers={allDrivers} />
      </div>
    </Dashboard>
  );
}
const mapStateToProps = (state) => {  
  return {
    distributor: state.AllDistributorReducer.distributor,
    allDistributors: state.AllDistributorReducer.all_distributors,
    orders: state.OrderReducer.all_orders,
    allDrivers: state.OrderReducer.all_drivers,
    orderLength: state.OrderReducer.totalOrdersCount,
    totalOrders: state.OrderReducer.total_orders
  };
};

export default connect(mapStateToProps, {
  getAllDistributor,
  getAllOrdersByDistributor,
  getSingleDistributor,
  getAllDriversByOwnerId,
  fetchDataComputation,
  editDistributor,
})(Home);