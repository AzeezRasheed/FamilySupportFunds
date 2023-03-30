import React from 'react'
import Header from '../components/Header';
import MainBodyTable from '../components/MainBodyTable';
import MainHeader from '../components/MainHeader';
import '../../../assets/admin.scss'
import Table from '../components/CustomerTable'
import { AdminDistributorList } from '../../../utils/data'

const Main = () => {
  return (
    <>

      <div className="main">
        <MainHeader />
        <div style={{ marginTop: 48 }}>
          <Table DistributorList={AdminDistributorList} />
        </div>
      </div>

    </>
  )
}

export default Main