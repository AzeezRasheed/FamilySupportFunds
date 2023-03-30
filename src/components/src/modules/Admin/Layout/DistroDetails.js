import React from 'react'
import Header from '../components/Header';
import MainBody from '../components/MainBody';
import MainHeader from '../components/MainHeader';
import '../../../assets/admin.scss'

const Main = ({ distributor, totalOrders, orderData, setOrderData, currentPage, setCurrentPage, code, orders, orderLength, allDrivers }) => {
  return (
    <>
      <div className="main">
        <MainHeader distributor={distributor} code={code} />
        <MainBody totalOrders={totalOrders} orderData={orderData} setOrderData={setOrderData} distributor={distributor} currentPage={currentPage} setCurrentPage={setCurrentPage} code={code} orderLength={orderLength} orders={orders} allDrivers={allDrivers}/>
      </div>

    </>
  )
}

export default Main
