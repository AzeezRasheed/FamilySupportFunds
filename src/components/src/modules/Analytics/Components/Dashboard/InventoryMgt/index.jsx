import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../../../../utils/formatNumber";
import questionCircle from "../../../Assets/svgs/question__circle.svg";
import Portal from "../../common/Portal";
import ModalTips from "../../common/ModalTips";

const InventoryMgt = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [searchValue, setSearchValue] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([])
  const [modalTipOpenToggled, setModalTipOpenToggled] = useState(false);
  const [modalTipReceivedToggled, setModalTipReceivedToggled] = useState(false);
  const [modalTipAvailableToggled, setModalTipAvailableToggled] = useState(false);

  useEffect(() => {
    if (inventoryData.length > 0) {
      searchValue !== ""
        ? setFilteredInventory(
            inventoryData.filter((val) =>
              val.productName.toLowerCase().includes(searchValue.toLowerCase())
            )
          )
        : setFilteredInventory(inventoryData);
    }
  }, [searchValue, inventoryData]);


  const closeModal = () => {
    if (modalTipOpenToggled) {
     setModalTipOpenToggled(false)
    }
    if(modalTipReceivedToggled) {
      setModalTipReceivedToggled(false) 
    }
    if(modalTipAvailableToggled) {
      setModalTipAvailableToggled(false) 
    }
  }

  const displayModal = () => {
    let headerText;
    let bodyText;
    if (modalTipOpenToggled) {
      headerText="Opening Stock"
      bodyText="This is the total Opening Stock of product within the time period selected."    
    }
    if(modalTipReceivedToggled) {
      headerText="Received Stock"
      bodyText="This is the total number of products received within the time period selected."
    }
    if(modalTipAvailableToggled) {
      headerText="Available Stock"
      bodyText="This is the total number of products available within the time period selected."
    }
    return (
      <Portal elementId="modal">
        <ModalTips
          isOpen={modalTipOpenToggled || modalTipReceivedToggled || modalTipAvailableToggled}
          close={closeModal}
          headerText={headerText}
          bodyText={bodyText}
        />
      </Portal>
    )
  }
  
  const {sell_in_products} = useSelector((state)=>state.AllAnalyticsReducer)
  useEffect(() => {
sell_in_products.length > 0 && setInventoryData(sell_in_products);
  }, [sell_in_products])
  
  
  
  // useEffect(() => {
  // // setInventoryData(inventoryMgt.result)
  // inventoryMgt.length>0 && console.log(inventoryMgt.result);
  // }, [inventoryMgt.length])

  return (
    <section className="analytic__dashboard dashboard__salesperformance">
      <header className="dashboard__salesperformance__header flex justify-between">
        <strong>Inventory Management</strong>
        <input
            className="h-8 py-5 mt-1 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange rounded px-3 text-black-400 "
            id="searchProduct"
            type="text"
            name="search"
            style={{ width: "20rem", height: 32, backgroundColor: "#E5E5E5" }}
            // onChange={(e) => onChange(e)}
            placeholder="Search for a product"
            onChange={(e) => setSearchValue(e.target.value)}
          />
      </header>
      <section className="dashboard__inventory__body">
        <table className="w-100" style={{ tableLayout: "fixed" }}>
          <thead className="dashboard__inventory__header__text ">
            <tr className="sticky top-0" style={{backgroundColor: "#FFFFFF"}}>
              <th  style={{ paddingLeft: "20px" }}>Product</th>
              <th >
                <div className="flex">
                  <div>Opening stock</div>
                  <div style={{ marginTop: "-5px" }} onClick={() => setModalTipOpenToggled(true)}>
                    <img src={questionCircle} alt="" />
                  </div>
                  {displayModal()}
                </div>
              </th>
              <th >
                <div className="flex">
                  <div>Available stock</div>
                  <div style={{ marginTop: "-5px" }} onClick={() => setModalTipAvailableToggled(true)}>
                    <img src={questionCircle} alt="" />
                  </div>
                  {displayModal()}
                </div>
              </th>
              <th >
                <div className="flex">
                  <div>Received stock</div>
                  <div style={{ marginTop: "-5px" }} onClick={() => setModalTipReceivedToggled(true)}>
                    <img src={questionCircle} alt="" />
                  </div>
                  {displayModal()}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {inventoryData?.length > 0 && filteredInventory?.map((data, index) => <tr>
              <td style={{ paddingLeft: "20px" }}>
                <div className="flex items-centre">
                  <div>
                    <img className="h-20 w-10 rounded-full" src={data?.imageUrl} alt="" />
                  </div>
                  <div className="flex items-center">
                    {`${data?.productName}`}
                  </div>
                </div>
              </td>
              <td>{formatNumber(data?.openingStock)}</td>
              <td>{formatNumber(data?.availableStock)}</td>
              <td>{formatNumber(data?.receivedStock)}</td>
            </tr>)}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default InventoryMgt;
