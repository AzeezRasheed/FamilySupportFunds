import React, { Fragment, useRef, useState } from 'react';
import CustomerDetails from '../Layout/CustomerDetails'
import { useSelector } from 'react-redux';
import Dashboard from '../../../Layout/Admin/Dashboard';
;



const Home = ({ location }) => {

  const { sessionUser } = useSelector(state => state.Auth);

  return (
    <Dashboard location={location} sessionUser={sessionUser}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">

        {/* <AdminDistributorLayout top="mt-8" DistributorList={AdminDistributorList} /> */}
        <CustomerDetails />

      </div>
    </Dashboard>
  )
}

export default Home;
