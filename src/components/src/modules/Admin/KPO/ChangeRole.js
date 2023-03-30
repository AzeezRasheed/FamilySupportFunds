import React, { Fragment, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal } from "../../../assets/svg/modalIcons";
import { setChangeRoleOverlay, setEditKPOOverlay, setSuspendKPOOverlay } from "./actions/UsersAction";
import Loading from "../../../components/common/Loading";
import { userNet } from "../../../utils/urls";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ChangeRole = ({ action, userData }) => {
  const super_admin = useSelector(state => state.Auth.sessionUserData).super_admin;
  const [save, setSave] = useState("Yes, Change role");
  const {t} = useTranslation()
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
  const [role, setRole] = useState("")

  const history = useHistory();

  const onChange = () => {
    const userApi = userNet()
    let params = {
      role: role,
    };
    setSave(t("updating"));
    setLoading(true);
    userApi.patch("assign-role/" + kpo_id, params).then((response) => {
      dispatch(setChangeRoleOverlay(false));
      setSuccessModal(true);
      setSave(t("yes_change_role"));
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
        // history.push("/distributor/backoffice/");
        // history.push("/admin-dashboard/reports/");
      }, 2000);
    });
  };

  return (
    /* Distributor Modal */
    <Transition.Root show={action} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          dispatch(setChangeRoleOverlay(false));
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
                  dispatch(setChangeRoleOverlay(false));
                }}
              />
              <div
                className="h-mini-modal flex justify-center items-center"
                style={{ flexDirection: "column" }}
              >
                <p
                  className="font-customGilroy font-bold not-italic text-grey-100"
                  style={{ marginBottom: 20 }}
                >
                  {t("change_user_role")}
                </p>
                <div>
                  <input
                    type="radio"
                    name="role"
                    value="Mini-Admin"
                    onChange={() => {
                      setRole("Mini-Admin");
                    }}
                  />{" "}
                  {t("mini_admin")}
                  <input
                    type="radio"
                    name="role"
                    value="KPO"
                    style={{ marginLeft: 20 }}
                    onChange={() => {
                      setRole("KPO");
                    }}
                  />{" "}
                  Backoffice
                </div>
              </div>
              <div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                <button
                  className="bg-red-main rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
                  onClick={() => onChange()}
                  style={{ display: "flex", opacity: role==="" ? 0.5 : 1 }}
                  disabled={role === "" ? true : false}
                >
                  {save}
                  {loading ? <Loading /> : ""}
                </button>

                <button
                  className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                  onClick={() => dispatch(setChangeRoleOverlay(false))}
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

export default ChangeRole;
