import React from 'react'
import arrowRight from '../../assets/svg/arrowRight.svg'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { openEmptiesButton, openReturnTotalEmptiesButton } from '../../modules/Inventory/actions/inventoryProductAction'

const QuickActions = ({ data, code}) => {
  const selected = localStorage.getItem("i18nextLng");
  const forMatLang = selected.split('-')[0] || "en"
  const translation = {
    Stock: {
      en: 'Receive Stock',
      pg: 'estoque'
    },
    Orders: {
      en: 'Orders',
      pg: 'Encomendas'
    },
    Empties: {
      en: 'Empties',
      pg: 'De vasilhame'
    },
    Reports: {
      en: 'Reports',
      pg: 'Relatórios'
    }
  }
  const dispatch = useDispatch()
  const codee = !code ? "" : code
  return (
    <div className="w-full block md:flex md:justify-between">
      {data.map((val, index) => (
        <div
          key={index}
          className=" bg-white quick-cards h-24 cursor-pointer text-center rounded-md shadow-lg"
          style={{
            border: `1px solid ${val.borderColor}`,
            width: "33%",
            marginRight: index === data.length - 1 ? 0 : 24,
          }}
        >
          {val.onclick ? (
            <div
              onClick={() =>
                {// dispatch(openReturnTotalEmptiesButton(val.onclick))
                dispatch(openEmptiesButton(val.onclick))}
              }
            >
              <img className="pt-3 m-auto h-12" src={val.icon} alt="icon" />
              <div className="flex items-center py-2 mb-1">
                <p
                  className="text-base text-center font-normal w-full"
                  style={{ color: "#2D2F39" }}
                >
                 {val?.label}
                </p>
                <div className="w-6">
                  <img
                    src={arrowRight}
                    alt="arrow-right"
                  />
                </div>
              </div>
            </div>
          ) : (
            <Link to={val.link + codee}>
              <img className="pt-3 m-auto h-12" src={val.icon} alt="icon" />
              <div className="flex columns-2 items-center py-2 mb-1">
                <p
                  className="text-base text-center font-normal w-full"
                  style={{ color: "#2D2F39" }}
                >
                  {val?.label}
                </p>
                <div className="w-6">
                  <img
                    src={arrowRight}
                    alt="arrow-right"
                  />
                </div>
              </div>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

export default QuickActions