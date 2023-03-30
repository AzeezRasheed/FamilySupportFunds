import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../../Layout/Mini-Admin/Dasboard";
import { useHistory, useParams } from "react-router-dom";
import { getAllDistributors } from "../../Admin/KPO/actions/UsersAction";
import { distributorNet, inventoryNet } from "../../../utils/urls";
import { CSVLink } from "react-csv";
import Download from "../../../assets/svg/download-report.svg";
import { useTranslation } from "react-i18next";
import { getLocation } from "../../../utils/getUserLocation";
import countryConfig from "../../../utils/changesConfig.json";

const SingleStockReceived = ({ location }) => {
  const [t] = useTranslation();

  const [distName, SetDistName] = useState("");
  const [SysCode, SetSysCode] = useState("");
  const [orderNo, SetOrderNo] = useState("");
  const [truckNo, SetTruckNo] = useState("");
  const [date, SetDate] = useState("");
  const [remarks, SetRemarks] = useState("");
  const [totalAmount, SetTotalAmount] = useState("");
  const [inventoryData, SetInventoryData] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const [userCountry, setUserCountry] = useState("Ghana");

  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, []);

  const { docNo } = useParams();

  useEffect(() => {
    const inventory = inventoryNet();
    inventory.get("stocks/" + docNo).then((response) => {
      const { data } = response.data;
      const distributor = distributorNet();
         distributor
        .get(`company/code/${data.products[0].companycode}`)
        .then((response) => {
          const { result } = response.data;
          SetDistName(result.company_name);
          SetSysCode(result.SYS_Code);
          SetOrderNo(data.products[0].orderNo);
          SetTruckNo(data.products[0].truckNo);
          SetDate(data.products[0].date);
          SetRemarks(data.products[0].remarks);
          // SetTotalAmount(data.orderNo);
          SetInventoryData(data.products);
        });
    });
  }, [docNo]);
  // if (!dist_code) {
  //   dispatch(setDistCode(Dist_Code));
  // }

  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  if (!allDistributors) {
    dispatch(getAllDistributors(country));
  }

  let data = [];
  inventoryData.map((sku) => {
    data.push({
      SYS_CODE: SysCode,
      Product: sku.product.brand,
      Type: sku.product.productType,
      Quantity_Received: sku.quantity,
      Document_No: docNo,
      Order_No: orderNo,
      Truck_No: truckNo,
      Remarks: remarks,
      Date: date,
    });
  });

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-8 md:pb-10 lg:pb-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {/* <Previouspage onClick={backButton} style={{ cursor: "pointer" }} /> */}
            <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
              {t("Stock_Received_For")} {docNo}
            </p>
          </div>
          <div className="flex gap-16 items-center">
            <CSVLink
              data={data}
              filename={`${docNo}_stock_report.csv`}
              style={{ textDecoration: "none" }}
            >
              <div className="flex justify-end gap-4 pr-3">
                <img src={Download} />
                <p className="report-download">{t("download")}</p>
              </div>
            </CSVLink>
          </div>
        </div>
        {/* <div>
          <div style={{ maxWidth: 300, position: "absolute" }}>
            <Calendar />
          </div>
          <div
            className="flex mt-4 px-3 report-date-cont justify-between bg-white w-40 h-12"
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(showCalendar(true))}
          >
            <img
              style={{ height: "25px", margin: "auto" }}
              src={CalendarIcon}
              alt=""
            />
            <p className="report-date">{calendarText}</p>
            <div className="mx-1 my-auto">
              <img className="" src={Arrowdown} alt="" />
            </div>
          </div>
        </div> */}
      </div>
      <div
        className="flex bg-white mx-10 py-6"
        style={{
          boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2)",
          borderRadius: "8px",
          justifyContent: "space-between",
          paddingLeft: 200,
          paddingRight: 200,
        }}
      >
        <div>
          <p className="font-customGilroy" style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: "bold" }}>
              {countryConfig[userCountry].documentNumberText}:{" "}
            </span>
            {docNo}
          </p>
          <p style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: "bold" }}>
              {countryConfig[userCountry].orderNumberText}:{" "}
            </span>
            {orderNo}
          </p>
          <p style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: "bold" }}>{t("truck_no")}: </span>
            {truckNo}
          </p>
          {/* <p style={{ marginBottom: 10 }}>Total Amount: {totalAmount}</p> */}
        </div>
        <div>
          <p style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: "bold" }}>{t("company")}: </span>
            {distName}
          </p>
          <p style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: "bold" }}>{t("date")}: </span>
            {date}
          </p>
          <p style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: "bold" }}>{t("remarks")}: </span>
            {remarks}
          </p>
        </div>
      </div>
      <div
        className="flex bg-white mx-10 py-6"
        style={{
          boxShadow: "0px 16px 32px rgba(9, 11, 23, 0.2)",
          borderRadius: "8px",
          justifyContent: "space-between",
          paddingLeft: 200,
          paddingRight: 200,
          marginTop: 50,
          marginBottom: 50,
        }}
      >
        <table className="min-w-full mt-8 divide-y divide-gray-200">
          <thead className="bg-transparent ">
            <tr className="">
              <th
                scope="col"
                className="px-12 py-3 text-left text-sm font-medium text-black tracking-wider"
              >
                {t("product")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
              >
                SKU
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black  tracking-wider"
              >
                {t("quantity received")}
              </th>
            </tr>
          </thead>
          <tbody
            className="bg-white px-6 divide-y divide-gray-200"
            id="ProductsTbody"
          >
            {inventoryData?.map((sku, index) => (
              <tr key={index}>
                <td className="px-12 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-20 w-10">
                      <img
                        className="h-20 w-10 rounded-full"
                        src={sku.product?.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {sku.product?.brand + " " + sku.product?.sku}
                      </div>
                      <div
                        className="px-4 py-1 font-customGilroy inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                        style={{ backgroundColor: "#D86217" }}
                      >
                        {sku.product?.productType}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-2 ">
                  <div className="font-normal font-customGilroy text-sm text-left w-25">
                    {sku.product?.sku}
                  </div>
                </td>
                <td className="px-6 py-2 ">
                  <div className="font-customGilroy font-normal text-sm text-center w-20">
                    {sku.quantity}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Dashboard>
  );
};

export default SingleStockReceived;
