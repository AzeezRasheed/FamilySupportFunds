import React from 'react'
import { Link } from 'react-router-dom'
import { Redirect, Progination } from '../../../assets/svg/adminIcons'
import { Back } from '../../../assets/svg/index'
import DistributorNavbar from './navbar';
const MainHeader = ({ distributor, code }) => {
  return (

    <div className='mt-10'>

      <DistributorNavbar distributor={distributor} code={code} />
    </div>

  )
}

export default MainHeader
