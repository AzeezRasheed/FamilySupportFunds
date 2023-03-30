import { useRef, useState } from "react";
import DriverOption from "./DriverOption";
import TabOption from "./TabOption";
import StockListing from "../../common/StockListing";
import Overview from "./Overview";
import OrderSummary from "./OrderSummary";

const DeliveryTracker = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const tabs = useRef({
    overview: 1,
    order__summary: 2,
    stock__assigned: 3,
    empties__retured: 4,
    total__cases__sold: 5,
  });

  return (
    <section className="analytic__dashboard dashboard__salesperformance">
      <header className="dashboard__salesperformance__header">
        <strong>Delivery Tracker</strong>
      </header>
      <section className="delivery__tracker__body">
        <aside className="delivery__tracker__body__aside">
          <DriverOption
            selected={selectedDriver}
            setSelected={setSelectedDriver}
            driverName="Jamiu lawal"
            select
          />
          <DriverOption
            selected={selectedDriver}
            setSelected={setSelectedDriver}
            driverName="Jamiu lawal"
          />
          <DriverOption
            selected={selectedDriver}
            setSelected={setSelectedDriver}
            driverName="Jamiu lawal"
          />
          <DriverOption
            selected={selectedDriver}
            setSelected={setSelectedDriver}
            driverName="Jamiu lawal"
          />
          <DriverOption
            selected={selectedDriver}
            setSelected={setSelectedDriver}
            driverName="Jamiu lawal"
          />
        </aside>
        <section className="delivery__tracker__body__section">
          <header className="delivery__tracker__body__section__header">
            <TabOption
              selected={selectedTab}
              setSelected={setSelectedTab}
              tabName="Overview"
              compId={tabs.current.overview}
            />
            <TabOption
              selected={selectedTab}
              setSelected={setSelectedTab}
              select
              tabName="Order summary"
              compId={tabs.current.order__summary}
            />
            <TabOption
              selected={selectedTab}
              setSelected={setSelectedTab}
              tabName="Stock assigned"
              compId={tabs.current.stock__assigned}
            />
            <TabOption
              selected={selectedTab}
              setSelected={setSelectedTab}
              tabName="Empties returned"
              compId={tabs.current.empties__retured}
            />
            <TabOption
              selected={selectedTab}
              setSelected={setSelectedTab}
              tabName="Total cases sold"
              compId={tabs.current.total__cases__sold}
            />
          </header>
          <section style={{ minHeight: "500px" }}>
            {selectedTab === tabs.current.overview ? (
              <Overview />
            ) : selectedTab === tabs.current.order__summary ? (
              <OrderSummary />
            ) : selectedTab === tabs.current.stock__assigned ? (
              <StockListing />
            ) : (
              <StockListing />
            )}
          </section>
        </section>
      </section>
    </section>
  );
};

export default DeliveryTracker;
