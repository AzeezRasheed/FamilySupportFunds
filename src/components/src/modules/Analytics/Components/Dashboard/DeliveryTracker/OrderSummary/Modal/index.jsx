import React, { useEffect, useRef } from "react";
import OrderSummary from "./OrderSummary";
import DeliveryDetails from "./DeliveryDetails";
import CustomerContact from "./CustomerContact";

const SummaryModal = ({ isOpen, close }) => {
  const modal = useRef();

  const handleWindowClick = (e) => {
    if (e.target === modal.current) close();
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  if(!isOpen) return <div></div>
  return (
    <div ref={modal} className="summary__modal" onClick={close}>
      <div className="summary__modal__dialog">
        <header className="summary__modal__dialog__header">
          <div>
            <div>
              <strong className="black">Order 12345678</strong>{" "}
              <span>(Martin Septimus Bar)</span>
            </div>
            <div>
              <small className="black">
                Placed February 21, 2021 at 2:03 pm from <strong>CIC</strong>
              </small>
            </div>
          </div>
          <div className="times" onClick={close}>
            &times;
          </div>
        </header>
        <section className="summary__modal__dialog__section">
          <OrderSummary />
          <aside className="summary__modal__dialog__section__double">
            <DeliveryDetails />
            <CustomerContact />
          </aside>
        </section>
      </div>
    </div>
  );
};

export default SummaryModal;
