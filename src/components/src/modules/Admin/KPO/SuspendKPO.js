import React, { Fragment, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal } from "../../../assets/svg/modalIcons";
import { getAllUsers, setEditKPOOverlay, setSuspendKPOOverlay } from "./actions/UsersAction";
import Loading from "../../../components/common/Loading";
import { userNet } from "../../../utils/urls";
 import { useHistory, useParams } from "react-router-dom";
 import { useTranslation } from "react-i18next";
 import countryConfig from "../../../utils/changesConfig.json";
 import { getLocation } from "../../../utils/getUserLocation";

const SuspendKPO = ({ action, userData }) => {
  const super_admin = useSelector(state => state.Auth.sessionUserData).super_admin;
  const [save, setSave] = useState("Yes, Suspend");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const suspend_action = useSelector(
    (state) => state.AllUsersReducer.suspend_action
  );
  const kpo_id = useSelector((state) => state.AllUsersReducer.kpo_id);
  const [stateKPO, setStateKPO] = useState({});

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const cancelButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const loadingState = useSelector((state) => state.PricingReducer.loading);
  const [successModal, setSuccessModal] = useState(false);

  const history = useHistory();

  const [country, setCountry] = useState(
     useSelector(state => state.Auth.sessionUserData).country
  );

  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country]);

  const onSuspend = () => {
    const userApi = userNet()
    let toDB = {};
    toDB["status"] = "Blocked";
    setSave(t("suspending"));
    setLoading(true);
    userApi.patch("edit-profile/status/" + kpo_id, toDB).then((response) => {
      dispatch(setSuspendKPOOverlay(false));
      setSuccessModal(true);
      setSave(t("yes_suspend"));
      setLoading(false);
      dispatch(getAllUsers(country));
    });
  };

  return (
    /* Distributor Modal */
    <Transition.Root
      show={userData === "Admin" ? (super_admin > 0 ? action : false) : action}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          dispatch(setSuspendKPOOverlay(false));
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
            {/* <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:mt-8 sm:align-middle w-modal"
              // role="form"
            > */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-mini-modal">
              {/* <div className="h-modal overflow-y-scroll scrollbar-hide"> */}
              <CloseModal
                className="ml-auto m-4 mb-0"
                onClick={() => {
                  dispatch(setSuspendKPOOverlay(false));
                }}
              />
              <div className="h-mini-modal flex justify-center items-center">
                <p className="font-customGilroy not-italic text-base font-medium">
                  {t(
                    "are_sure_you_want_to_suspend_this_user_from_accessing_KUJA"
                  )}
                </p>
              </div>
              <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                <button
                  className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                  onClick={() => onSuspend()}
                  style={{backgroundColor: countryConfig[country].buttonColor,
                          color: countryConfig[country].textColor, display: "flex" }}
                >
                  {save}
                  {loading ? <Loading /> : ""}
                </button>

                <button
                  className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                  onClick={() => dispatch(setSuspendKPOOverlay(false))}
                >
                  {t("cancel")}
                </button>
              </div>
              {/* </div> */}
            </div>
            {/* </div> */}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SuspendKPO;
