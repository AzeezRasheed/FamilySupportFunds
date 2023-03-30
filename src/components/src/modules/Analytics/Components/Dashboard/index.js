import InventoryMgt from "./InventoryMgt";
import SalesPerformance from "./SalesPerformance";
import DeliveryTracker from "./DeliveryTracker";

const Dashboard = () => {
  
  return (
    <>
      <SalesPerformance />
      <InventoryMgt />
      {/* <DeliveryTracker /> */}
    </>
  );
};

export default Dashboard;
