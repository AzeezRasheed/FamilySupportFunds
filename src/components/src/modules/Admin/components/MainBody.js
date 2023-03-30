import React from 'react'
import MainBodyLeft from './MainBodyLeft';
import MainBodyRight from './MainBodyRight';
import MainBodyTable from './MainBodyTable';

const MainBody = ({ distributor, totalOrders,  orderData, setOrderData, setCurrentPage, currentPage, orders, orderLength, allDrivers }) => {
  return (
    <>
    <div className="main-body">
      <MainBodyLeft totalOrders={totalOrders} distributor={distributor} orderLength={orderLength} orders={orders} />
      <MainBodyRight totalOrders={totalOrders} distributor={distributor} orderLength={orderLength} orders={orders}/>
     
      </div>
      <div className='main-body-section'>
        <MainBodyTable orderData={orderData} setOrderData={setOrderData} orders={orders} setCurrentPage={setCurrentPage} currentPage={currentPage} orderLength={orderLength} allDrivers={allDrivers} /> 
      </div>
    </>
  )
}

export default MainBody;
