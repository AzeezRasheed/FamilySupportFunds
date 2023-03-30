import arrowDown from "../../../Assets/svgs/trend__down.svg";
import questionCircle from "../../../Assets/svgs/question__circle.svg";
import Doughnut from "../../common/Doughnut";
import LegendItem from "../../common/LegendItem";
import ModalTips from "../../common/ModalTips";
import Portal from "../../common/Portal"
import { useState } from "react";
import {v4 as uuid} from 'uuid'

const DoughnutSection = ({ header, data, headerText, bodyText }) => {
  const [modalTipToggled, setModalTipToggled] = useState(false)  
  return (
    <div className="dashboard__salesperformance__body__item">
      <header className="dashboard__salesperformance__body__item__header">
        <div className="flex">
          <span className="text-grey">{header.name}</span>
          <div style={{ marginTop: "-5px" }} onClick={() => setModalTipToggled(true)}>
            <img src={questionCircle} alt="" />
          </div>
          <Portal elementId="modal">
            <ModalTips
              isOpen={modalTipToggled}
              close={() => setModalTipToggled(false)}
              headerText={headerText}
              bodyText={bodyText}
            />
          </Portal>
        </div>
        <div className="my-3 flex items-center">
          <strong className="dashboard__large__text bolder">
            {header.count}
          </strong>
          <div className="flex items-center ml-20px">
            {/* <span>
              <img src={arrowDown} alt="" />
            </span> */}
            {/* <span className="text-danger dashboard__small__text">
              {header.percentage}%
            </span> */}
            <span className="dashboard__small__text text-grey ml-3px">
              {header.duration}
            </span>
          </div>
        </div>
      </header>
      <section className="dashboard__salesperformance__body__item__body">
        <div>
          {<Doughnut data={data} />}
        </div>
        <div>
          {data&&data.map((item) => (
            <LegendItem
              key={uuid()}
              color={item.color}
              name={item.tagName}
              detail={`${item.count ? item.count : 0} Order${item.count === 1 ? "" : "s"} (${
                item.percentage ?  item.percentage : "0"
              }%)`}
              style={{
                marginTop: "10px",
                marginBottom: "10px",
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DoughnutSection;
