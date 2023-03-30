import circleCheck from "../../../../../Assets/svgs/check.svg";

const DeliveryDetails = () => {
  return (
    <section className="delivery__details">
      <header>Delivery Details</header>
      <section>
        <small>
          <strong>DELIVERY STATUS</strong>
        </small>
        <div className="checklist">
          <div className="checklist__item">
            <div className="analytics_container checked">
              <div className="circle">
                <img src={circleCheck} alt="" />
              </div>
              <div className="holder"></div>
            </div>
            <div className="text">
              <strong>Completed</strong>
              <span>21-02-2021 at 2:03 pm</span>
            </div>
          </div>
          <div className="checklist__item">
            <div className="analytics_container">
              <div className="circle selected"></div>
              <div className="holder"></div>
            </div>
            <div className="text">
              <strong>Accepted by VSM</strong>
              <span>21-02-2021 at 2:03 pm</span>
            </div>
          </div>
          <div className="checklist__item">
            <div className="analytics_container">
              <div className="circle selected"></div>
              <div className="holder"></div>
            </div>
            <div className="text">
              <strong>Accepted by VSM</strong>
              <span>21-02-2021 at 2:03 pm</span>
            </div>
          </div>
        </div>
        <div className="delivery__method">
          <small>
            <strong>DELIVERY METHOD</strong>
          </small>
        </div>
        <strong>Van delivery by Lukmana Yusufu (KMS/2021/003)</strong>
      </section>
    </section>
  );
};

export default DeliveryDetails;
