import React, { useRef } from "react";
import { useEffect } from "react";

const ModalTips = ({ isOpen, close, headerText, bodyText }) => {
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

  if (!isOpen) return <div />;

  return (
    <div
      ref={modal}
      className={`modal__background appear`}
      onKeyDown={() => {}}
      tabIndex={-1}
      role="button"
    >
      <div className={`modal__dialog slide-up`}>
        <div
          className={`modal__dialog__header w-full h-full border-1 flex items-center`}
        >
          <div className="text-2xl ml-1">{headerText}</div>
          <button
            className="modal__close__button"
            type="button"
            data-modal-toggle="defaultModal"
            onClick={close}
          >
            &times;
          </button>
        </div>
        <div className="modal__dialog__body">{bodyText}</div>
      </div>
    </div>
  );
};

export default ModalTips;
