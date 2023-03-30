import DoughnutSection from "./DoughnutSection";
import BarSection from "./BarSection";
import ComponentBarSection from "./ComponentBarSection";
import { useSelector } from "react-redux";
import { formatNumber } from "../../../../../utils/formatNumber";
import { useState } from "react";

const SalesPerformance = () => {
  const [salesByProduct, setSalesByProduct] = useState([])
  const {salesAnalysis, sell_in_products, total_sell_in, total_sell_out} = useSelector((state)=>state.AllAnalyticsReducer)
  const totalOrders = salesAnalysis.Orders;

  const colorPieChart = (status) => {
    let statusColor;
    switch (status) {
      case "Placed":
        statusColor = "#315a6d"
        break;
      case "Assigned":
        statusColor = "#d59e76"
        break;
      case "Accepted":
        statusColor = "#2E8B57"
        break;
      case "Completed":
        statusColor = "#959b7b"
        break;
        case "Rejected":
        statusColor = "#A52A2A"
        break;
      default:
        statusColor = "#315a6d"
        break;
    }
    return statusColor
  }
  const sales = totalOrders?.Order_Count_By_Status.map((val) => {
    return {
      tagName: val?.Status ? val?.Status : "Open",
      color: colorPieChart(val?.Status) ? colorPieChart(val?.Status) : "#315a6d",
      count: val.Value ? val.Value : 0,
      percentage: val?.Percentage ? val?.Percentage : 0
    }
  })

 
    return (
      <section className="dashboard__salesperformance">
        <header className="dashboard__salesperformance__header">
          <strong>Sales Performance</strong>
        </header>
        <section className="dashboard__salesperformance__body">
          <DoughnutSection
            headerText="Total Orders"
            bodyText="This is the total number of orders placed within the time period selected."
            header={{
              name: "Total orders",
              count: `${formatNumber(totalOrders?.Total_Orders)}` || 0,
              // percentage: -7.0,
              // duration: "since yesterday",
            }}
            data={sales}
          />
          <BarSection
            headerText="Total Cases Sold"
            bodyText="This is the total number of cases sold within the time period selected."
            header={{
              name: "Total cases sold",
              count: `${formatNumber(salesAnalysis?.Cases?.Total_Cases_Sold)} cases` || `${0} cases`,
              // percentage: 2.5,
              // duration: "since yesterday",
            }}
          />
          <DoughnutSection
            headerText="Total Unique Customers"
            bodyText="This is the total number of unique customers who placed orders within the time period selected."
            header={{
              name: "Total unique customers",
              count: salesAnalysis?.Customers?.Total_Customers || 0,
              // percentage: -7.0,
              // duration: "since yesterday",
            }}
            data={[
              {
                tagName: "Registered",
                color: "#315a6d",
                percentage: salesAnalysis?.Customers?.Perc_Registered_Customers ? salesAnalysis?.Customers?.Perc_Registered_Customers : "0",
                count: salesAnalysis?.Customers?.Registered_Customers || 0,
              },
              {
                tagName: "One-off",
                color: "#d59e76",
                percentage: salesAnalysis?.Customers?.Perc_One_Off_Customers ? salesAnalysis?.Customers?.Perc_One_Off_Customers : "0",
                count: salesAnalysis?.Customers?.One_Off_Customers || 0,
              },
            ]}
          />
          <ComponentBarSection
            header={{
              sellIn: {
                name: "Sell-in",
                count: `${formatNumber(total_sell_in)} cases`,
                // percentage: -7.0,
                // duration: "since yesterday",
              },
              sellOut: {
                name: "Sell-out",
                count: `${formatNumber(total_sell_out)} cases`,
                // percentage: +7.0,
                // duration: "since yesterday",
              },
            }}
          />
        </section>
      </section>
    );
}

export default SalesPerformance