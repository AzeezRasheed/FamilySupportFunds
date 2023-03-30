import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'
import { DistributorRoutes } from '../../../utils/routes';

const active = "h-full flex items-center border-b-4 rounded-sm"

 const DistributorNavbar = ({ distributor, code }) => {
    const location = useLocation()
    const distributorLinks = DistributorRoutes(code);

    const [country, setCountry] = useState('Ghana');


  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country])

    const selected = localStorage.getItem("i18nextLng");
  const forMatLang = selected.split('-')[0] || "en"

  const translation = {
    Overview: {
      en: 'Overview',
      pg: 'Visãogeral'
    },
    Orders: {
      en: 'Orders',
      pg: 'Encomendas'
    },
    Users: {
      en: 'Users',
      pg: 'Usuarios'
    }, 
    Reports: {
      en: 'Reports',
      pg: 'Relatórios'
    },
    Customers: {
      en: 'Customers',
      pg: 'Clientes'
    }
  }
    return (
        <div className="flex justify-between items-center font-customGilroy border-b text-base font-medium not-italic text-grey-85 h-full">
            {distributorLinks.map((route) => {
                if (location.pathname === route.link) {
                    return (
                        <Link to={route.link}>
                            <div className="flex justify-between gap-24 items-center border-b h-10 cursor-pointer w-1/2">
                                <p style={{ borderColor: countryConfig[country].borderBottomColor}} className={active}>{route.label}</p>
                            </div>
                        </Link>
                    )
                } else {
                    return (
                        <Link to={route.link}>
                            <p>{translation[route?.label][forMatLang]}</p>
                        </Link>
                    )
                }
            })}
            <div className='w-1/2' />
        </div>
    )
}

export default DistributorNavbar;