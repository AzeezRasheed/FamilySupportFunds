import React, { Fragment, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { cloneDeep, findIndex } from "lodash";
import { userNet } from "../../../utils/urls";
import {
  CloseModal,
  UploadFile,
  Checked,
} from "../../../assets/svg/modalIcons";
import {
  setEditKPOOverlay,
  updateUser,
  getAllUsers,
} from "../KPO/actions/UsersAction";
import { useTranslation } from "react-i18next";

const EditDriver = ({ action }) => {
  const dispatch = useDispatch();
  const edit_action = useSelector((state) => state.AllUsersReducer.edit_action);
  const kpo_id = useSelector((state) => state.AllUsersReducer.kpo_id);
  const prevUsers = useSelector((state) => state.AllUsersReducer.allUsers);
  const [stateKPO, setStateKPO] = useState({});

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation();
  const [country, setCountry] = useState(
     useSelector(state => state.Auth.sessionUserData).country
  );

  const getUsersFromState = useSelector(
    (state) => state.AllUsersReducer.allUsers
  );
  const kpo = getUsersFromState.filter((user) => user.id === kpo_id)[0];

  useEffect(() => {
    setStateKPO(kpo);
  }, [kpo]);

  useEffect(() => {
    if (stateKPO) {
      if (
        stateKPO.firstname !== "" &&
        stateKPO.lastname !== "" &&
        stateKPO.email !== "" &&
        stateKPO.phone_number !== ""
      ) {
        setFormCompleted(true);
      } else {
        setFormCompleted(false);
      }
    }
  });

  const setEditedKPOIntoState = (key, value) => {
    const CopyStateKPO = cloneDeep(stateKPO);
    CopyStateKPO[key] = value;
    setStateKPO(CopyStateKPO);
  };

  const onSubmit = () => {
    setLoader(true);
    const params = {
      id: stateKPO.id,
      firstname: stateKPO.firstname,
      lastname: stateKPO.lastname,
      email: stateKPO.email,
      phone_number: stateKPO.phone_number,
    };
    const params2 = {
      firstName: stateKPO.firstname,
      lastName: stateKPO.lastname,
      phone: stateKPO.phone_number,
    };
    const newUsersCopy = cloneDeep(prevUsers);
    const userIndex = findIndex(newUsersCopy, { id: stateKPO.id });
    newUsersCopy[userIndex] = params;

    dispatch(updateUser(stateKPO.id, params2, newUsersCopy, country));
    setStateKPO("");
    setLoader(false);
    dispatch(setEditKPOOverlay(false));
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    /* Distributor Modal */
    <Transition.Root show={action} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          dispatch(setEditKPOOverlay(false));
        }}
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
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle w-modal"
              // role="form"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle w-modal">
                <div className="h-modal overflow-y-scroll scrollbar-hide">
                  <CloseModal
                    className="ml-auto m-4 mb-0"
                    onClick={() => {
                      dispatch(setEditKPOOverlay(false));
                    }}
                  />
                  <div className="mt-2 px-12">
                    <div className="justify-between items-center mb-2">
                      <p
                        className="font-customGilroy not-italic font-normal grey-100"
                        style={{ fontSize: "32px" }}
                      >
                        {t("edit_driver")}
                      </p>
                    </div>
                    {showError ? (
                      <div style={{ color: "red" }}>{error}</div>
                    ) : (
                      ""
                    )}
                    <div className="justify-between">
                      <div className="mb-6">
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("first_name")}
                        </label>
                        <input
                          name="name"
                          type="text"
                          placeholder={t("type_here")}
                          className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-2"
                          required
                          onChange={(e) =>
                            setEditedKPOIntoState("firstname", e.target.value)
                          }
                          value={stateKPO && stateKPO.firstname}
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("last_name")}
                        </label>
                        <input
                          name="name"
                          type="text"
                          placeholder={t("type_here")}
                          className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-2"
                          required
                          onChange={(e) =>
                            setEditedKPOIntoState("lastname", e.target.value)
                          }
                          value={stateKPO && stateKPO.lastname}
                        />
                      </div>
                    </div>
                    <div className="justify-between">
                      <div className="mb-6">
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("email_address")}{" "}
                          <span className="text-sm">
                            ({t("to_edit_please_contact_DMS_support")})
                          </span>
                        </label>
                        <input
                          onChange={(e) =>
                            setEditedKPOIntoState("email", e.target.value)
                          }
                          value={stateKPO && stateKPO.email}
                          name="email"
                          type="email"
                          disabled
                          placeholder={t("type_here")}
                          className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-2"
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block font-customGilroy text-base not-italic font-medium text-grey-70 mb-2">
                          {t("phone_number")}{" "}
                          <span className="text-sm">
                            ({t("to_edit_please_contact_DMS_support")})
                          </span>
                        </label>
                        <input
                          onChange={(e) =>
                            setEditedKPOIntoState(
                              "phone_number",
                              e.target.value
                            )
                          }
                          value={stateKPO && stateKPO.phone_number}
                          name="phone"
                          type="text"
                          disabled
                          placeholder={t("type_here")}
                          className="bg-white rounded border border-solid w-input-lg border-grey-25 font-customGilroy text-base font-medium not-italic py-3 pl-4 mb-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    type="submit"
                    className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                    style={{ opacity: formCompleted ? "1" : "0.3" }}
                    disabled={!formCompleted ? true : false}
                    onClick={() => onSubmit()}
                  >
                    <p className="text-center">
                      {" "}
                      {loader ? t("saving") : t("save")}
                    </p>
                  </button>
                  <button
                    className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                    onClick={() => {
                      dispatch(setEditKPOOverlay(false, 0));
                    }}
                  >
                    {t("cancel")}
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

export default EditDriver;
