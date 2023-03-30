import React, { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal } from "../../../assets/svg/modalIcons";
import { openEmptiesButton, openReceiveEmptiesButton, openReturnTotalEmptiesButton } from "../actions/inventoryProductAction";
import { useDispatch, useSelector } from "react-redux";
import {useHistory} from "react-router-dom";

const EmptiesModal = ({ showModal }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("")
  	const history = useHistory();
	  const dist_code = useSelector(state => state.AllDistributorReducer?.distributor).DIST_Code

  const emptiesModal = useSelector(
    (state) => state.InventoryReducer.empties_modal_button
  );

  const doAction = () =>{
    switch (action) {
      case "receive":
        dispatch(openEmptiesButton(false));
        // dispatch(openEmptiesButton(false));
        // dispatch(openReceiveEmptiesButton(true));
        history.push(`/dashboard/receive-empties/${dist_code}`)
        setAction("")
        break;
      case "return":
        dispatch(openEmptiesButton(false));
        // dispatch(openReturnTotalEmptiesButton(true));
        history.push(`/dashboard/return-empties/${dist_code}`)
        setAction("");
        setAction("");
        break;
      default:
        break;
    }
  }
  return (
    <Transition.Root show={emptiesModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => setOpen()}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <label
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </label>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-mini-modal">
              <CloseModal
                className="ml-auto m-4 mb-0"
                onClick={() => {
                  dispatch(openEmptiesButton(false));
                  setAction("");
                }}
              />
              <div
                className="h-mini-modal"
                style={{ paddingLeft: 32, paddingRight: 32 }}
              >
                <p
                  className="font-customGilroy not-italic text-base font-bold"
                  style={{ fontSize: 18, marginBottom: 24, color: "#090B17" }}
                >
                  What would you like to do ?
                </p>
                <div className="justify-center ">
                  <div
                    className="flex"
                    style={{ alignItems: "center", marginBottom: 16 }}
                  >
                    <input
                      type="radio"
                      className="input"
                      name="radio"
                      value="receive"
                      onChange={(e) => {
                        setAction(e.target.value)
                      }}
                    />

                    <p
                      style={{ fontSize: 16, marginLeft: 16, color: "#50525B" }}
                    >
                      Receive Empties
                    </p>
                  </div>
                  <div className="flex" style={{ alignItems: "center" }}>
                    <input
                      type="radio"
                      className="radio"
                      name="radio"
                      value="return"
                      onChange={(e) => setAction(e.target.value)}
                    />
                    <p
                      style={{ fontSize: 16, marginLeft: 16, color: "#50525B" }}
                    >
                      Return Empties
                    </p>
                  </div>
                </div>
                <div
                  className="px-4 py-3  sm:flex sm:flex-row-reverse "
                  style={{
                    marginRight: -32,
                    marginLeft: -32,
                    marginBottom: -20,
                  }}
                >
                  <button
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic"
                    style={{
                      outline: "none",
                      padding: "8px 29px",
                      fontSize: 14,
                      opacity: action === "" ? 0.5 : 1,
                    }}
                    disabled={action === "" ? true : false}
                    onClick={() => doAction()}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EmptiesModal;
