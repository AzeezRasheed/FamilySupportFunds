import React, { Fragment, useRef, useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import {
  Checked,
  CloseModal,
  Mail,
  Phone,
  Profile,
  Radio,
} from "../../../assets/svg/modalIcons";
import searchIcon from "../../../assets/svg/searchIcon.svg";
import { getAllDistributors } from "../KPO/actions/UsersAction";
import { cloneDeep, indexOf } from "lodash";
import { userNet, vehicleNet } from "../../../utils/urls";
import { useHistory } from "react-router-dom" 
import  { Fade } from "react-reveal";
import Loading from "../../../components/common/Loading";
import { countryCode } from "../../../utils/countryCode";
import { useTranslation } from "react-i18next";

export default function MyDialog({
  open,
  setOpen,
  // approval,
  // setApproval,
  // handleReset,
  // cancelButtonRef,
  // confirmation,
  // setConfirmation
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  useEffect(() => {
    dispatch(getAllDistributors(country));
  }, []);

  const userDetails = useSelector((state) => state.AllUsersReducer.userDetails);
  
  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  const [approval, setApproval] = useState(false);
  const [revokeModal, setRevokeModal] = useState(false);
  const [confirmation, setConfirmation] = useState({
    value: null,
    state: false,
  });
  const { t } = useTranslation();
  const [role, setRole] = useState("");
  const cancelButtonRef = useRef(null);
  const [inputField, setInputField] = useState("");
  const [distFiltered, setDistFiltered] = useState([]);
  const [DistList, setDistList] = useState([]);
  const [selectedDist, setSelectedDist] = useState("");
  const [approveButton, setApproveButton] = useState(t("approve"));
  const [revokeButton, setRevokeButton] = useState(t("revoke_registration"));
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRevoke, setLoadingRevoke] = useState(false);
  

  const handleReset = () => {
    return (
      setConfirmation({ ...confirmation, value: "RESET", state: false }),
      setOpen(false)
    );
  };

  if (allDistributors?.length > 0 && !DistList.length) {
    const newArray = cloneDeep(allDistributors);
    setDistList(newArray);
  }

  // OnChange event handler
  const onChange = (typedValue) => {
    const inputValue = typedValue.trim().toLowerCase();
    setInputField(inputValue);
    const filteredDist = DistList?.filter((lang) =>
      lang.company_name.toLowerCase().includes(inputValue)
    );
    //dispatch(setFilteredDistributors(filteredDist))
    setDistFiltered(filteredDist);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const modalHeight = inputField.length ? 700 : selectedDist ? 472 : 432;

  const onClick = (item) => {
    const founded = indexOf(selectedDist, item);
    // eslint-disable-next-line no-unused-expressions
    if (founded === -1) {
      setSelectedDist(item);
      //dispatch(setSelectedDistributors(selectedDist));
      onChange(inputField);
      //setSelectedDist(selectedDist);
    }
  };

  const removeDist = (index) => {
    selectedDist.splice(index, 1);
    onChange(inputField);
  };

  const approve = () => {
    const userApi = userNet()
    if (!selectedDist && role !== "KPO" && role !== "Admin" && role !== "Mini-Admin") {
      alert(
        t("you_haven't_assigned_a_distributor_to_this_user_please_do_so_below")
      );
    } else {
      setLoading(true);
      setApproveButton(t("saving"));
      setDisabled(true);
      let selectedDistID = [];

      selectedDistID.push(selectedDist.DIST_Code);
      //let selectedDistID = selectedDist.DIST_Code;
      let toSave = JSON.stringify(selectedDistID);
      if (role === "KPO" || role === "Admin" || role === "Mini-Admin") {
        toSave = null;
      }
      let params1 = {
        company_ID: toSave,
      };

      let params2 = {
        role: role,
      };

      let params3 = {
        status: "Active",
      };

      userApi
        .patch("edit-profile/" + userDetails.id, params1) //assign dist
        .then((result) => {
          
          userApi
            .patch("assign-role/" + userDetails.id, params2) //assign role
            .then((result) => {
              
              userApi
                .patch("edit-profile/status/" + userDetails.id, params3) //assign status
                .then(async (result) => {
                  if (role === "Van Salesman") {
                    const vehicleApi = await vehicleNet()
                    let data = {
                      ownerCompanyId: selectedDist.DIST_Code,
                      name: userDetails.firstname + " " + userDetails.lastname,
                      address:
                        selectedDist.address + " " + selectedDist.district,
                      phoneNumber: userDetails.phone_number,
                      email: userDetails.email,
                      country: countryCode(country),
                      syspro_code: selectedDist.SYS_Code,
                    };
                     vehicleApi.post("CreateVehicle/", data);
                  }
                })

                .finally(() => {
                  //approve or revoke user
                  setApproval(true);
                  setApproveButton("Approve");
                  setDisabled(false);

                  if (role === "KPO" || role === "Mini-Admin") {
                    
                    setTimeout(() => {
                      history.push(
                        `/admin-dashboard/manage-user/${role === "KPO" ? "Backoffice" : role}/${userDetails.id}`
                      );
                    }, 1000);
                  } else {
                    window.location.reload();
                  }
                });
            });
        });
    }
  };

  const revoke = () => {
    const userApi = userNet()
    setLoadingRevoke(true);
    let params3 = {
      status: "Blocked",
    };
    setRevokeButton(t("saving"));
    setDisabled(true);
    //revoke
    userApi
      .patch("edit-profile/status/" + userDetails.id, params3) //assign status
      .then((result) => {
        //approve or revoke user
        setConfirmation({ ...confirmation, state: false });
        setRevokeModal(true);
        setRevokeButton(t("revoke"));
        setDisabled(false);
        window.location.reload();
      });
  };

  return (
    <>
      {/* Distributor Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
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
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
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
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle"
                style={{ width: 800, height: modalHeight }}
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <CloseModal
                    className="ml-auto cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                  <div className="flex justify-between">
                    <div className="mb-0">
                      <p className="modal-title -mt-4 mb-8">
                        {t("new_sign_up")}
                      </p>
                      <p className="details-title mb-4">{t("user_details")}</p>
                      <div className="flex mb-4">
                        <Profile />
                        <p className="content-text ml-2">
                          {userDetails.firstname + " " + userDetails.lastname}
                        </p>
                      </div>
                      <div className="flex mb-4">
                        <Mail />
                        <p className="content-text ml-2">{userDetails.email}</p>
                      </div>
                      <div className="flex mb-4">
                        <Phone />
                        <p className="content-text ml-2">
                          {userDetails.phone_number}
                        </p>
                      </div>
                      {role &&
                      role !== "KPO" &&
                      role !== "Admin" &&
                      role !== "Mini-Admin" ? (
                        <Fade>
                          <p className="details-title mt-8">
                            {t("assign_distributor")}
                          </p>
                          {selectedDist ? (
                            <div
                              style={{
                                marginBottom: 10,
                              }}
                            >
                              <div style={styles.tags}>
                                <span style={{ paddingTop: 3 }}>
                                  {selectedDist?.company_name}
                                </span>
                                <CloseModal
                                  onClick={() => setSelectedDist("")}
                                  style={{ width: 20, cursor: "pointer" }}
                                />
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          <input
                            onChange={(ev) => onChange(ev.target.value)}
                            placeholder={t("type_here_to_search")}
                            style={{
                              background: `url(${searchIcon})`,
                              backgroundRepeat: "no-repeat",
                              width: "100%",
                              border: "1px solid #F49C00",
                              borderRadius: 4,
                              outline: "none",
                              paddingLeft: 20,
                              paddingTop: -30,
                              fontSize: 14,
                            }}
                          />
                          {inputField.length ? (
                            <div style={styles.ddcontainer}>
                              {distFiltered?.map((item, index) => (
                                <p
                                  className="font-customGilroy"
                                  key={index}
                                  style={styles.dditem}
                                  onClick={() => onClick(item)}
                                >
                                  {item.company_name}
                                  <br />
                                  <span style={styles.ddcode}>
                                    {item.SYS_Code}
                                  </span>
                                </p>
                              ))}
                            </div>
                          ) : (
                            ""
                          )}
                        </Fade>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex items-center">
                      <div className="role-container">
                        <div className="p-6">
                          <p className="role-title mb-6">
                            {t("assign_user_role")}
                          </p>
                          {/* <label className="radio-container ">
                          KPO Supervisor
                          <input
                            type="radio"
                            name="user_role"
                            value="Supervisor"
                            onClick={(e) => {
                              setRole(e.target.value);
                            }}
                          />
                          <span className="checkmark"></span>
                        </label> */}
                          <label className="radio-container ">
                            {t("admin")}
                            <input
                              type="radio"
                              name="user_role"
                              value="Admin"
                              onClick={(e) => {
                                setRole(e.target.value);
                              }}
                            />
                            <span className="checkmark"></span>
                          </label>
                          <label className="radio-container ">
                            {t("mini_admin")}
                            <input
                              type="radio"
                              name="user_role"
                              value="Mini-Admin"
                              onClick={(e) => {
                                setRole(e.target.value);
                              }}
                            />
                            <span className="checkmark"></span>
                          </label>
                          <label className="radio-container ">
                            Backoffice
                            <input
                              type="radio"
                              name="user_role"
                              value="KPO"
                              onClick={(e) => {
                                setRole(e.target.value);
                              }}
                            />
                            <span className="checkmark"></span>
                          </label>
                          {/* <label className="radio-container ">
                          Account Owner
                          <input
                            type="radio"
                            name="user_role"
                            value="Account Owner"
                            onClick={(e) => {
                              setRole(e.target.value);
                            }}
                          />
                          <span className="checkmark"></span>
                        </label> */}
                          <label className="radio-container ">
                            {t("van_salesman")}
                            <input
                              type="radio"
                              name="user_role"
                              value="Van Salesman"
                              onClick={(e) => {
                                setRole(e.target.value);
                              }}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                  <button
                    className="approve-button"
                    disabled={disabled}
                    style={{
                      background: "#0DD83A",
                      color: "white",
                    }}
                    onClick={() => approve()}
                  >
                    {approveButton}
                  </button>
                  <button
                    disabled={disabled}
                    className="revoke-button"
                    style={{
                      background: "#D82C0D",
                      color: "white",
                    }}
                    onClick={() => {
                      // eslint-disable-next-line no-restricted-globals
                      if (
                        // eslint-disable-next-line no-restricted-globals
                        confirm(
                          t("are_you_want_to_revoke_this_user_registration")
                        )
                      ) {
                        revoke();
                      }
                    }}
                  >
                    {revokeButton}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Approval Modal */}
      <Transition.Root show={approval} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setApproval}
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
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="modal-container inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
                <div className="flex flex-col justify-center items-center bg-white h-95">
                  <Checked />
                  <p className="approve-text">{t("new_user_approved")}</p>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="approve-button"
                    style={{
                      background: "#0DD83A",
                      color: "white",
                    }}
                    // onClick={reloadPage}
                  >
                    {t("okay")}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Revoke success Modal */}
      <Transition.Root show={revokeModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={setRevokeModal}
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
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="modal-container inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
                <div className="flex flex-col justify-center items-center bg-white h-95">
                  <Checked />
                  <p className="approve-text">{t("user_registration_revoked")}</p>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="approve-button"
                    style={{ color: "#FFFFFF" }}
                    // onClick={() => setApproval(false)}
                  >
                    {t("okay")}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

const styles = {
  ddcontainer: {
    backgroundColor: "#FFFFFF",
    boxShadow:
      "0px 0px 1px rgba(9, 11, 23, 0.15), 0px 8px 24px rgba(9, 11, 23, 0.15)",
    borderRadius: 4,
    textAlign: "left",
    left: "3rem",
    width: "300px",
    position: "absolute",
    overflow: "auto",
    height: 300,
  },
  dditem: {
    fontColor: "#2D2F39",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    padding: "16px 24px 16px 24px",
    borderBottom: "1px solid #DEE0E4",
  },
  ddcode: {
    fontSize: 12,
    color: "#DEE0E",
    paddingTop: 18,
    fontWeight: "400",
  },
  tags: {
    display: "inline-flex",
    background: "#DEE0E4",
    borderRadius: 24,
    fontWeight: "500",
    fontColor: "#2D2F39",
    alignItem: "center",
    verticalAlign: "middle",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    marginTop: 10,
    width: "auto",
  },
};
