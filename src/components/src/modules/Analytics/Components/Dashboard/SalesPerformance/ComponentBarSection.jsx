import arrowDown from "../../../Assets/svgs/trend__down.svg";
import questionCircle from "../../../Assets/svgs/question__circle.svg";
import DashedSeperator from "../DashedSeperator";
import ComponentBar from "../../common/ComponentBar";
import Dropdown from "../../common/Dropdown";
import { useSelector } from "react-redux";
import { sortedUniqBy, uniqBy } from "lodash";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Portal from "../../common/Portal";
import ModalTips from "../../common/ModalTips";
import { setTotalSellIn, setTotalSellOut } from "../../../pages/actions/analyticsAction";

const ComponentBarSection = ({ header, data }) => {
  const dispatch = useDispatch()

  const [brandProducts, setBrandProducts] = useState([])
  const [sellOutBrandProducts, setSellOutBrandProducts] = useState([])
  const [selected, setSelected] = useState("All products")
  const [dropdownItems, setDropdownItems] = useState([])
  const [modalTipSellInToggled, setModalTipSellInToggled] = useState(false);
  const [modalTipSellOutToggled, setModalTipSellOutToggled] = useState(false);

  const closeModal = () => {
    if (modalTipSellInToggled) {
     setModalTipSellInToggled(false)
    }
    if(modalTipSellOutToggled) {
      setModalTipSellOutToggled(false) 
    }
  }

  const displayModal = () => {
    let headerText;
    let bodyText;
    if (modalTipSellInToggled) {
      headerText="Total Sell-In"
      bodyText="This is the total number of product received per case within the time period selected."
            
    }
    if(modalTipSellOutToggled) {
      headerText="Total Sell-Out"
      bodyText="This is the total number of products sold per case within the time period selected."
      
    }
    return (
      <Portal elementId="modal">
        <ModalTips
          isOpen={modalTipSellInToggled || modalTipSellOutToggled}
          close={closeModal}
          headerText={headerText}
          bodyText={bodyText}
        />
      </Portal>
    )
  }


  const {sell_out_products, sell_in_products, total_sell_in, total_sell_out} = useSelector((state)=>state.AllAnalyticsReducer)

  const onChange = (value) => {
  setSelected(value)
  }
const performGrouping = (key, array, groupBy) => {
let keys = [key]
  let grouped = groupBy === "brand" ? Object.values(array.reduce((result, object) => {
      result[object.brand] = result[object.brand] || { brand: object.brand };
      keys.forEach(key => result[object.brand][key] = (result[object.brand][key] || 0) + object[key]);
      return result;
      
  }, Object.create(null))) : 
  Object.values(array.reduce((result, object) => {
      result[object.productName] = result[object.productName] || { brand: object.productName };
      keys.forEach(key => result[object.productName][key] = (result[object.productName][key] || 0) + object[key]);
      return result;
      
  }, Object.create(null)));
    return grouped
}
  useEffect(()=>  {
    if(sell_in_products.length > 0){
      setDropdownItems(performGrouping('receivedStock', sell_in_products, 'brand'))
      const newArr = []
      sell_out_products.length > 0 && sell_in_products?.map((prd, index)=>{
        let y = sell_out_products.filter((order)=>{
        return order?.Product_Id === prd?.productCode
       })[0]
       newArr.push({
        brand: prd?.brand,
        productName: prd?.productName,
        sell_out: y?.Value ?? 0
       })
      })
      // sell_out_products.length > 0 && sell_out_products?.map((order, index)=>{
      //  let y = sell_in_products.filter((prd)=>{
      //   return prd.productCode === order.Product_Id
      //  })[0]
      //  newArr.push({
      //   brand: y.brand,
      //   productName: y.productName,
      //   sell_out: order.Value
      //  })
      // })
      if (selected === "All products"){
        setSellOutBrandProducts(performGrouping('sell_out', newArr, 'brand'))
        setBrandProducts(performGrouping('receivedStock', sell_in_products, 'brand'))
      }
      else {
       setSellOutBrandProducts(performGrouping('sell_out', newArr, selected).filter((item)=> item?.brand.toLowerCase().includes(selected.toLowerCase())))
        setBrandProducts(performGrouping('receivedStock', sell_in_products, selected).filter((item)=> item?.brand.toLowerCase().includes(selected.toLowerCase())))
        
      }
    
}
}, [sell_in_products, sell_out_products, selected])

  useEffect(() => {
    dispatch(setTotalSellOut(sellOutBrandProducts.reduce((a, b) => parseFloat(a) + parseFloat(b.sell_out), 0)))
    dispatch(setTotalSellIn(brandProducts.reduce((a, b) => parseFloat(a) + parseFloat(b.receivedStock), 0))) 
  }, [brandProducts, sellOutBrandProducts, sell_in_products, sell_out_products, selected])

// let uniqueChars = [...new Set(chars)];
  return (
    <div className="dashboard__salesperformance__body__item span-all">
      <div className="flex dashboard__salesperformance__body__item__header">
        <div className="flex" style={{ width: "80%" }}>
          <header className="w-50">
            <div className="flex">
              <span className="text-grey">{header.sellIn.name}</span>
              <div style={{ marginTop: "-5px" }} onClick={() => setModalTipSellInToggled(true)}>
                <img src={questionCircle} alt="" />
              </div>
            </div>
            <div className="my-3 flex items-center">
              <strong className="font-bold dashboard__large__text bolder">
                {header.sellIn.count}
              </strong>
              <div className="flex items-center ml-20px">
                {/* <span>
                  <img src={arrowDown} alt="" />
                </span>
                
                <span className="text-danger dashboard__small__text">
                  {header.sellIn.percentage}%
                </span>
                <span className="dashboard__small__text text-grey ml-3px">
                  {header.sellIn.duration}
                </span> */}
                {displayModal()}
              </div>
            </div>
          </header>
          <DashedSeperator />
          <header className="w-50">
            <div className="flex">
              <span className="text-grey">{header.sellOut.name}</span>
              <div style={{ marginTop: "-5px" }} onClick={() => setModalTipSellOutToggled(true)}>
                <img src={questionCircle} alt="" />
              </div>
            </div>
            <div className="my-3 flex items-center">
              <strong className="font-bold dashboard__large__text bolder">
                {header.sellOut.count}
              </strong>
              <div className="flex items-center ml-20px">
                {/* <span>
                  <img src={arrowDown} alt="" />
                </span>
                <span className="text-danger dashboard__small__text">
                  {header.sellOut.percentage}%
                </span>
                <span className="dashboard__small__text text-grey ml-3px">
                  {header.sellOut.duration}
                </span> */}
                {displayModal()}
              </div>
            </div>
          </header>
        </div>
        <div className="flex items-center justify-end " style={{ width: "20%" }}>
          <Dropdown
            options={dropdownItems}
            onChange={onChange}
          />
        </div>
      </div>
      <section className="dashboard__salesperformance__body__item__body" style={{minHeight: "400px"}}>
        <ComponentBar xAxis_sellIn={brandProducts} xAxis_sellOut={sellOutBrandProducts} />
      </section>
    </div>
  );
};

export default ComponentBarSection;
