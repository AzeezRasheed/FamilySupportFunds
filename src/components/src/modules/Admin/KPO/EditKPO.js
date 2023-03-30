import React, {
  Fragment,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { cloneDeep, findIndex, result } from "lodash";
import { distributorNet, userNet, vehicleNet } from "../../../utils/urls";
import {
  CloseModal,
  UploadFile,
  Checked,
} from "../../../assets/svg/modalIcons";
import {
  setEditKPOOverlay,
  updateUser,
  getAllUsers,
  updateVehicle,
} from "./actions/UsersAction";
import { useTranslation } from "react-i18next";
import countryConfig from "../../../utils/changesConfig.json";
import { getLocation } from "../../../utils/getUserLocation";

const EditKPO = ({ action, userData }) => {
  const dispatch = useDispatch();
  const edit_action = useSelector((state) => state.AllUsersReducer.edit_action);
  const kpo_id = useSelector((state) => state.AllUsersReducer.kpo_id);
  const prevUsers = useSelector((state) => state.AllUsersReducer.allUsers);
  const [stateKPO, setStateKPO] = useState({});
  const { t } = useTranslation();

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [Dist, setDist] = useState();
  const [vehicle, setVehicle] = useState();
  const [DistCode, setDistCode] = useState("");

  const country = useSelector(state => state.Auth.sessionUserData).country;

  const getUsersFromState = useSelector(
    (state) => state.AllUsersReducer.allUsers
  );
  const loading = useSelector(
    (state) => state.AllUsersReducer.loading
  );
  const kpo = getUsersFromState.filter((user) => user.id === kpo_id)[0];

  useLayoutEffect(() => {
    setStateKPO(kpo);
    if (userData === "Van Salesman") {
      const dist_code = kpo && JSON.parse(kpo?.DIST_Code)[0];
      setDistCode(dist_code);
      //  console.log(dist_code);
      //get sysprocode
      async function getDist() {
        const distributor = await distributorNet();
         distributor
          .get("company/code/" + dist_code)
          .then((response) => {
            const { result } = response.data;
            // console.log(result);
            setDist(result);
          });
      }
      getDist();
      //get vehicle id
      async function getVehicleId() {
        const vehicle = await vehicleNet();
        
        await vehicle
          .get("getVehicle/GetByPhoneNumber/" + kpo?.phone_number)
          .then((response) => {
            const { data } = response.data;
            setVehicle(data);
          });
      }
      getVehicleId();
    }
    // console.log(kpo);
  }, [kpo]);

  useLayoutEffect(() => {
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
  }, []);

  const setEditedKPOIntoState = (key, value) => {
    const CopyStateKPO = cloneDeep(stateKPO);
    CopyStateKPO[key] = value;
    setStateKPO(CopyStateKPO);
  };

  const onSubmit = async () => {
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
    const params3 = userData === "Van Salesman" && {
      ownerCompanyId: DistCode,
      name: stateKPO.firstname + " " + stateKPO.lastname,
      address: Dist.address + " " + Dist.district,
      phoneNumber: stateKPO.phone_number,
      syspro_code: Dist.SYS_Code,
    };

    const newUsersCopy = cloneDeep(prevUsers);
    const userIndex = findIndex(newUsersCopy, { id: stateKPO.id });
    newUsersCopy[userIndex] = params;

    userData!=="Van Salesman" && dispatch(updateUser(stateKPO.id, params2, newUsersCopy, country));
    userData === "Van Salesman" &&
      dispatch(
        updateVehicle(
          stateKPO.id,
          params2,
          params3,
          vehicle.vehicleId,
          newUsersCopy,
          country
        )
      ); // get vehicle id
    setStateKPO("");
    setLoader(false);
    userData === "Van Salesman" && dispatch(setEditKPOOverlay(false));
    // setTimeout(() => {
    //   window.location.reload()
    // }, 2000);
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
                        {t("edit_user")}
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
                      {userData !== "Van Salesman" && (
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
                      )}
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
                          name="email"
                          type="text"
                          disabled
                          required
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
                    style={{backgroundColor: countryConfig[country].buttonColor,
                          color: countryConfig[country].textColor, opacity: formCompleted ? "1" : "0.3" }}
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

export default EditKPO;
