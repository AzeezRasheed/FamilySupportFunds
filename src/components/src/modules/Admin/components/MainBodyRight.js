import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useParams } from "react-router";

import {
  getAllDriversByOwnerId,
} from "../order/actions/orderAction";
import { useTranslation } from "react-i18next";
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'
import { formatPriceByCountrySymbol } from '../../../utils/formatPrice'
import { getSingleDistributor, getAllUsers } from "../KPO/actions/UsersAction";
import { useDispatch, useSelector } from "react-redux";
import { EyeIcon, CogIcon } from '@heroicons/react/solid'
const MainBodyRight = ({ distributor, totalOrders, orderLength, orders }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { code } = useParams();

  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country

  const [userCountry, setCountry] = useState('Ghana');


  useEffect(async() => {    
    const loc = await getLocation();
    setCountry(loc);
    getKpos()
    dispatch(getAllUsers(country));
    dispatch(getAllDriversByOwnerId(distributor&&distributor?.DIST_Code))
  }, [country])
  const KPO_id = distributor?.DIST_Code;
  const allUsers = useSelector((state) => state.AllUsersReducer.allUsers);
  const allDrivers = useSelector((state) => state.OrderReducer.all_drivers);

 const getKpos = () => {
  let thisKpo = [];
  allUsers.filter((value) => {
    if (
      value.DIST_Code !== "" &&
      value.DIST_Code !== null &&
      value.DIST_Code.length !== 0 &&
      value.roles !== 'Van Salesman' &&
      (value.DIST_Code.includes(KPO_id) || value.DIST_Code === KPO_id)
    ) {
      thisKpo.push(value);
    }
  })
  return thisKpo;
 }

 const getVanSalesMen = () => {
  let vanSalesMen = [];
  allUsers.filter((value) => {
    if (
      value.DIST_Code !== "" &&
      value.DIST_Code !== null &&
      value.DIST_Code.length !== 0 &&
      value.roles === 'Van Salesman' &&
      (value.DIST_Code.includes(KPO_id) || value.DIST_Code === KPO_id)
    ) {
      vanSalesMen.push(value.roles === 'Van Salesman');
    }
  })
  return vanSalesMen;
 }

  return (
    <div className="main-body-right">
      <section className="section">
        <div className="section-header" style={{ padding: '22px' }}>
          <h6>{t('reports')}<span>({t("today")})</span></h6>
        </div>
        <div className="sales-reviews2 ">
          <div className='review-rows'>
            <div className="total-sales">
              <p className="total-sales-title">{t('total_sales')}</p>
              <p className="total-sales-price">{formatPriceByCountrySymbol(country,totalOrders["TotalSales"])}</p>
            </div>
            <div className="total-sales">
              <p className="total-sales-title">{t("open_orders")}</p>
              <p className="total-sales-price">{ totalOrders?.OrderStatus?.Placed || 0}</p>
            </div>
          </div>
          <div className='review-rows'>
            <div className="total-sales">
              <p className="total-sales-title">{t("total_no_sales")}</p>
              <p className="total-sales-price">{totalOrders["TotalOrders"]}</p>
            </div>
            <div className="total-sales">
              <p className="total-sales-title">{t("confirmed_invoice")}</p>
              <p className="total-sales-price">{ totalOrders?.OrderStatus?.Completed || 0}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header" style={{ paddingLeft: 22, paddingRight: 22 }}>
          <h6>{t('users')}</h6>
          <div className="section-header-right">
            <CogIcon className='h-5' color={countryConfig[userCountry].borderBottomColor} />
            <Link
                to={`/distributor/users/${code}`}
                style={{ color: countryConfig[userCountry].borderBottomColor }}
              >
               {t("manage")}
              </Link>
          </div>
        </div>

        <div className="main-right-info">
          <p>{t("backoffice")}: {getKpos().map((value) => (
            <span>
              {`${value?.firstname} ${value?.lastname}`},
            </span>
          ))}</p>
          <p>{t("van_salesmen")}: <span>{getVanSalesMen().length}</span></p>
          <p>{t("account_owner")}: <span>{distributor?.Owner_Name}</span></p>
        </div>
      </section>
    </div>
  )
}

export default MainBodyRight
