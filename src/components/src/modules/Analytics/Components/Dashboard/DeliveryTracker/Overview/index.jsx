import questionCircle from "../../../../Assets/svgs/question__circle.svg";
import trendUp from "../../../../Assets/svgs/trend__up.svg";
import trendDown from "../../../../Assets/svgs/trend__down.svg";
import Portal from "../../../common/Portal";
import ModalTips from "../../../common/ModalTips";
import StackedChart from "../../../common/StackedChart";

import { useState } from "react";
const Overview = () => {
  const [modalTipToggled, setModalTipToggled] = useState(false);
  return (
    <div className="grid overview">
      <div className="w-100">
        <div>
          <div>
            <div className="flex">
              <span className="text-grey">Average delivery compliance</span>
              <div style={{ marginTop: "-5px" }}>
                <img src={questionCircle} alt="" />
              </div>
            </div>
            <div className="mx-3 flex items-center">
              <strong className="dashboard__large__text bolder">83%</strong>
              <div className="flex items-center ml-20px">
                <span onClick={() => setModalTipToggled(true)}>
                  <img
                    src={Math.sign(-83) === -1 ? trendDown : trendUp}
                    alt=""
                  />
                </span>
                <Portal elementId="modal">
                  <ModalTips
                    isOpen={modalTipToggled}
                    close={() => setModalTipToggled(false)}
                    headerText="Total cases sold"
                    bodyText="This is the total number of products cases sold within the time period selected."
                  />
                </Portal>
                <span
                  className={`${
                    Math.sign(-5) === -1 ? "text-danger" : "text-success"
                  } dashboard__small__text`}
                >
                  {-5}%
                </span>
                <span className="dashboard__small__text text-grey ml-3px">
                  since yesterday
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <StackedChart
            data={[
              {
                name: "Jamiu Lawal",
                percentage: 90,
                color: "#D69E77",
              },
              {
                name: "Oloruntobi Earnest",
                percentage: 80,
                color: "#A677D6",
              },
              {
                name: "Tunde Lasisi",
                percentage: 100,
                color: "#E88475",
              },
              {
                name: "Joeseph Priceton",
                percentage: 60,
                color: "#325A6D",
              },
              {
                name: "Joeseph Priceton",
                percentage: 90,
                color: "#959B7B",
              },
            ]}
          />
        </div>
      </div>
      <div className="w-100">
        <div>
          <div>
            <div className="flex">
              <span className="text-grey">Average delivery compliance</span>
              <div style={{ marginTop: "-5px" }}>
                <img src={questionCircle} alt="" />
              </div>
            </div>
            <div className="mx-3 flex items-center">
              <strong className="dashboard__large__text bolder">83%</strong>
              <div className="flex items-center ml-20px">
                <span onClick={() => setModalTipToggled(true)}>
                  <img
                    src={Math.sign(-83) === -1 ? trendDown : trendUp}
                    alt=""
                  />
                </span>
                <Portal elementId="modal">
                  <ModalTips
                    isOpen={modalTipToggled}
                    close={() => setModalTipToggled(false)}
                    headerText="Total cases sold"
                    bodyText="This is the total number of products cases sold within the time period selected."
                  />
                </Portal>
                <span
                  className={`${
                    Math.sign(-5) === -1 ? "text-danger" : "text-success"
                  } dashboard__small__text`}
                >
                  {-5}%
                </span>
                <span className="dashboard__small__text text-grey ml-3px">
                  since yesterday
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <StackedChart
            data={[
              {
                name: "Jamiu Lawal",
                percentage: 90,
                color: "#D69E77",
              },
              {
                name: "Oloruntobi Earnest",
                percentage: 80,
                color: "#A677D6",
              },
              {
                name: "Tunde Lasisi",
                percentage: 100,
                color: "#E88475",
              },
              {
                name: "Joeseph Priceton",
                percentage: 60,
                color: "#325A6D",
              },
              {
                name: "Joeseph Priceton",
                percentage: 90,
                color: "#959B7B",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
