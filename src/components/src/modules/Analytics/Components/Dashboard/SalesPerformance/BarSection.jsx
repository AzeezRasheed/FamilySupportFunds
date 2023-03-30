import trendDown from "../../../Assets/svgs/trend__down.svg";
import trendUp from "../../../Assets/svgs/trend__up.svg";
import questionCircle from "../../../Assets/svgs/question__circle.svg";
import BarChart from "../../common/Bar";
import LegendItem from "../../common/LegendItem";
import { useSelector } from "react-redux";
import Portal from "../../common/Portal";
import ModalTips from "../../common/ModalTips";
import { useState } from "react";

const BarSection = ({ header, headerText, bodyText }) => {
  const {salesAnalysis} = useSelector((state)=>state.AllAnalyticsReducer);
  const casesSold = salesAnalysis?.Cases
  const [modalTipToggled, setModalTipToggled] = useState(false);

  const sales = casesSold?.Cases_Count_By_RouteType.map((val) => {
    return <LegendItem color="#959B7B;" name={val?.Route_Name ? val?.Route_Name : "Walk-in-sales"} detail={`${val?.Value || 0} Cases (${val?.Percentage ? val?.Percentage : "0"}%)`} />
  })

  return (
    <div className="dashboard__salesperformance__body__item">
      <header className="dashboard__salesperformance__body__item__header">
        <div className="flex">
          <span className="text-grey">{header.name}</span>
          <div style={{ marginTop: "-5px" }} onClick={() => setModalTipToggled(true)}>
            <img src={questionCircle} alt="" />
          </div>
        </div>
        <div className="my-3 flex items-center">
          <strong className="dashboard__large__text bolder">
            {header.count}
          </strong>
          <div className="flex items-center ml-20px">
            <span>
              {/* <img
                src={Math.sign(header.percentage) === -1 ? trendDown : trendUp}
                alt=""
              /> */}
            </span>
            <Portal elementId="modal">
              <ModalTips
                isOpen={modalTipToggled}
                close={() => setModalTipToggled(false)}
                headerText={headerText}
                bodyText={bodyText}
              />
            </Portal>
            {/* <span
              className={`${
                Math.sign(header.percentage) === -1
                  ? "text-danger"
                  : "text-success"
              } dashboard__small__text`}
            >
              {header.percentage}%
            </span> */}
            <span className="dashboard__small__text text-grey ml-3px">
              {header.duration}
            </span>
          </div>
        </div>
      </header>
      <section className="dashboard__salesperformance__body__item__body">
        <div style={{ height: "250px" }}>
          <BarChart routeData={casesSold?.Cases_Count_By_RouteType || []} />
        </div>
        <div className="dashboard__salesperformance__body__item__body__label">
          {sales}
        </div>
      </section>
    </div>
  );
};

export default BarSection;
