import questionCircle from "../../Assets/svgs/question__circle.svg";
import trendUp from "../../Assets/svgs/trend__up.svg";
import trendDown from "../../Assets/svgs/trend__down.svg";
import { useState } from "react";
import Portal from "./Portal";
import ModalTips from "./ModalTips";
import budweiser from "../../Assets/svgs/budweiser.svg";

const StockListing = () => {
  const [modalTipToggled, setModalTipToggled] = useState(false);
  return (
    <div className="stock__listing">
      <div>
        <div className="flex">
          <span className="text-grey">Average order fullfillment rate</span>
          <div style={{ marginTop: "-5px" }}>
            <img src={questionCircle} alt="" />
          </div>
        </div>
        <div className="mx-3 flex items-center">
          <strong className="dashboard__large__text bolder">83%</strong>
          <div className="flex items-center ml-20px">
            <span onClick={() => setModalTipToggled(true)}>
              <img src={Math.sign(-83) === -1 ? trendDown : trendUp} alt="" />
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
      <div className="stock__listing__section">
        <div className="stock__listing__section__item">
          <div>
            <img src={budweiser} alt="" />
          </div>
          <div
            className="stock__listing__section__item__name"
            style={{ marginLeft: "10px" }}
          >
            <div>Budweiser 600 ml × 12 (RB)</div>
            <div className="flex">
              <div className="stock__listing__section__item__qty">Qty: </div>
              <div className="stock__listing__section__item__val ml-3px">
                50
              </div>
            </div>
          </div>
        </div>
        <div className="stock__listing__section__item">
          <div>
            <img src={budweiser} alt="" />
          </div>
          <div
            className="stock__listing__section__item__name"
            style={{ marginLeft: "10px" }}
          >
            <div>Budweiser 600 ml × 12 (RB)</div>
            <div className="flex">
              <div className="stock__listing__section__item__qty">Qty: </div>
              <div className="stock__listing__section__item__val ml-3px">
                50
              </div>
            </div>
          </div>
        </div>
        <div className="stock__listing__section__item">
          <div>
            <img src={budweiser} alt="" />
          </div>
          <div
            className="stock__listing__section__item__name"
            style={{ marginLeft: "10px" }}
          >
            <div>Budweiser 600 ml × 12 (RB)</div>
            <div className="flex">
              <div className="stock__listing__section__item__qty">Qty: </div>
              <div className="stock__listing__section__item__val ml-3px">
                50
              </div>
            </div>
          </div>
        </div>
        <div className="stock__listing__section__item">
          <div>
            <img src={budweiser} alt="" />
          </div>
          <div
            className="stock__listing__section__item__name"
            style={{ marginLeft: "10px" }}
          >
            <div>Budweiser 600 ml × 12 (RB)</div>
            <div className="flex">
              <div className="stock__listing__section__item__qty">Qty: </div>
              <div className="stock__listing__section__item__val ml-3px">
                50
              </div>
            </div>
          </div>
        </div>
        <div className="stock__listing__section__item">
          <div>
            <img src={budweiser} alt="" />
          </div>
          <div
            className="stock__listing__section__item__name"
            style={{ marginLeft: "10px" }}
          >
            <div>Budweiser 600 ml × 12 (RB)</div>
            <div className="flex">
              <div className="stock__listing__section__item__qty">Qty: </div>
              <div className="stock__listing__section__item__val ml-3px">
                50
              </div>
            </div>
          </div>
        </div>
        <div className="stock__listing__section__item">
          <div>
            <img src={budweiser} alt="" />
          </div>
          <div
            className="stock__listing__section__item__name"
            style={{ marginLeft: "10px" }}
          >
            <div>Budweiser 600 ml × 12 (RB)</div>
            <div className="flex">
              <div className="stock__listing__section__item__qty">Qty: </div>
              <div className="stock__listing__section__item__val ml-3px">
                50
              </div>
            </div>
          </div>
        </div>
        <div className="stock__listing__section__item">
          <div>
            <img src={budweiser} alt="" />
          </div>
          <div
            className="stock__listing__section__item__name"
            style={{ marginLeft: "10px" }}
          >
            <div>Budweiser 600 ml × 12 (RB)</div>
            <div className="flex">
              <div className="stock__listing__section__item__qty">Qty: </div>
              <div className="stock__listing__section__item__val ml-3px">
                50
              </div>
            </div>
          </div>
        </div>
        <div className="stock__listing__section__item">
          <div>
            <img src={budweiser} alt="" />
          </div>
          <div
            className="stock__listing__section__item__name"
            style={{ marginLeft: "10px" }}
          >
            <div>Budweiser 600 ml × 12 (RB)</div>
            <div className="flex">
              <div className="stock__listing__section__item__qty">Qty: </div>
              <div className="stock__listing__section__item__val ml-3px">
                50
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockListing;
