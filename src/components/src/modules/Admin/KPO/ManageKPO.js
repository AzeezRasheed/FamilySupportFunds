import React, { useEffect, useState, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'
import {
  Edit,
  Mail,
  Phone,
  Previouspage,
  Profile,
} from "../../../assets/svg/adminIcons";
import Dashboard from "../../../Layout/Admin/Dashboard";
import { ReactComponent as Remove } from "../../../assets/svg/kpoIcons/Remove.svg";
import { ManagedDistributors } from "../../../utils/data";
import { setAddAdminOverlay, setEditKPOOverlay } from "./actions/UsersAction";
import AssignDistributor from "./AssignDistributor";
import { getAllDistributors, getAllUsers } from "./actions/UsersAction";
import { userNet } from "../../../utils/urls";
import EditKPO from "./EditKPO";
import Loading from "../../../components/common/Loading";
import { CloseModal, Checked } from "../../../assets/svg/modalIcons";
import { filter } from "lodash";
import { useTranslation } from "react-i18next";

const ManageKPO = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [approvalModal, setApprovalModal] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [removeDist, setRemoveDist] = useState("");
  const cancelButtonRef = useRef(null);
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const [userCountry, setUserCountry] = useState('Ghana');


  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  })
  useEffect(() => {
    dispatch(getAllDistributors(country));
    dispatch(getAllUsers(country));
  }, [country]);

  const { id } = useParams();

  const KPO_id = parseInt(id);
  const edit_action = useSelector((state) => state.AllUsersReducer.edit_action);
  const add_admin_action = useSelector(
    (state) => state.AllUsersReducer.add_admin_action
  );
  const allUsers = useSelector((state) => state.AllUsersReducer.allUsers);
  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );

  const thisKPO = allUsers?.filter((user) => user.id === KPO_id);
  const dist_CODES = thisKPO?.length ? JSON.parse(thisKPO[0]?.DIST_Code) : [0];

  if (dist_CODES?.length > 0 && parseInt(dist_CODES) !== 0 && loadingState) {
    setLoadingState(false);
  }

  const generateData = (code) => {
    const gety = filter(allDistributors, { DIST_Code: code })[0];
    //const gety = allDistributors?.filter((dist) => dist.DIST_Code === code)[0];

    return {
      name: gety ? gety.company_name : "",
      status: gety ? gety.status : "",
      SYS_Code: gety ? gety.SYS_Code : "",
    };
  };

  const removeDistributor = (index) => {
    const userApi = userNet()
    dist_CODES?.splice(index, 1);
    const toSave = JSON.stringify(dist_CODES);
    let params = {
      company_ID: toSave,
    };
    userApi.patch("edit-profile/" + id, params).then((result) => {
      dispatch(getAllDistributors(country));
      dispatch(getAllUsers(country));
      setRemoveDist("");
      setApprovalModal(false);
      setInterval(() => {
        window.location.reload();
      }, 2000);
    });
  };

  //console.log(dist_CODES)

  return (
    <Dashboard>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex gap-4">
          <Previouspage onClick={() => history.goBack()} />
          <p className="font-customGilroy font-bold not-italic text-2xl text-grey-100">
            {thisKPO.length ? (
              thisKPO[0]?.firstname + " " + thisKPO[0]?.lastname
            ) : (
              <Loading />
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 font-customGilroy text-sm not-italic mt-4 mb-10">
          <p className="font-normal text-gray-400">Backoffice</p>/
          <p className="font-medium text-grey-100">
            {thisKPO.length ? (
              thisKPO[0]?.firstname + " " + thisKPO[0]?.lastname
            ) : (
              <Loading />
            )}
          </p>
        </div>
        <div className="grid grid-rows-2 grid-flow-col gap-4">
          <div className="row-span-2 col-span-2 bg-white shadow-xl h-mid-modal rounded-lg">
            <div className="flex justify-between items-center font-customGilroy not-italic mt-6 mb-8 px-6">
              <p className="flex gap-2 font-bold text-xl text-grey-85">
                {t("manage_distributor")}{" "}
                <span className="text-grey-70 font-medium">
                  ({dist_CODES?.length})
                </span>
              </p>
              <button
                onClick={() => dispatch(setAddAdminOverlay(true, id))}
                className="bg-red-main font-bold text-center text-white rounded px-7 py-2"
              >
                {t("add_distributor")}
              </button>
            </div>

            {!loadingState ? (
              dist_CODES?.map((code, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-3 border-t border-grey-25 font-customGilroy text-black text-sm font-medium not-italic py-3 pl-12 pr-20"
                >
                  <div className="flex gap-2" style={{ width: "40%" }}>
                    <p>{index + 1 + "."}</p>
                    <p>{generateData(code)?.name}</p>
                  </div>
                  <p>{generateData(code)?.SYS_Code}</p>
                  {generateData(code)?.status === "Active" ? (
                    <button className="rounded-full bg-green-500 py-1 px-3 text-center text-white">
                      {generateData(code)?.status}
                    </button>
                  ) : (
                    <button className="rounded-full bg-red-500 py-1 px-3 text-center text-white">
                      {t("inactive")}
                    </button>
                  )}
                  <div
                    onClick={() => {
                      setRemoveDist(index);
                      setApprovalModal(true);
                    }}
                  >
                    <Remove />
                  </div>
                </div>
              ))
            ) : (
              <center>
                <Loading />
              </center>
            )}
            {dist_CODES?.length === 0 ? (
              <div
                className="px-6"
                style={{ textAlign: "center", color: "#9799A0" }}
              >
                {t("backoffice_no_distributor")}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="row-span-1 bg-white text-white shadow-xl rounded-lg p-6">
            <div className="flex justify-between items-center text-black font-customGilroy font-bold text-xl mb-4">
              {t("details")}
              <Edit onClick={() => dispatch(setEditKPOOverlay(true, KPO_id))} />
            </div>
            <div className="font-customGilroy not-italic font-medium text-sm text-grey-70 p-4">
              <div className="flex gap-4 items-center mb-4">
                <Profile />
                {thisKPO.length ? (
                  thisKPO[0]?.firstname + " " + thisKPO[0]?.lastname
                ) : (
                  <Loading />
                )}
              </div>
              <div className="flex gap-4 items-center mb-4">
                <Mail />
                {thisKPO[0]?.email}
              </div>
              <div className="flex gap-4 items-center mb-4">
                <Phone />
                {thisKPO[0]?.phone_number}
              </div>
            </div>
          </div>
          {/* <div className="row-span-1 bg-white shadow-xl rounded-lg text-white p-6">
            <p className="text-black font-customGilroy font-bold text-xl mb-4">
              Actions
            </p>
            <div
              style={{ color: "#0033FF" }}
              className="font-customGilroy not-italic font-medium text-sm p-4"
            >
              <p className="underline mb-4 cursor-pointer">
                Email password reset instructions
              </p>
              <p className="underline mb-4 cursor-pointer">Suspend Access</p>
              <p className="underline mb-4 cursor-pointer">Remove User</p>
            </div>
          </div> */}
        </div>
        <AssignDistributor action={add_admin_action} current={dist_CODES} />
        <EditKPO action={edit_action} />

        <Transition.Root show={approvalModal} as={Fragment}>
          <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto"
            initialFocus={cancelButtonRef}
            onClose={() => setApprovalModal(false)}
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
                    onClick={() => setApprovalModal(false)}
                  />
                  <div className="h-mini-modal flex justify-center items-center">
                    <p className="font-customGilroy not-italic text-base font-medium">
                      {t(
                        "are_you_sure_you_want_to_unassign_this_distributor_from_this_backoffice"
                      )}
                    </p>
                  </div>
                  <div className=" text-right border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                    <button
                      className=" rounded font-customGilroy text-center text-sm font-bold not-italic px-14 py-2"
                      onClick={() => removeDistributor(removeDist)}
                      style={{
                        backgroundColor: countryConfig[userCountry].buttonColor, 
                        color: countryConfig[userCountry].textColor
                      }}
                    >
                      {t("yes_please")}
                    </button>

                    <button
                      ref={cancelButtonRef}
                      className="bg-white border border-solid rounded font-customGilroy text-grey-70 text-center text-sm font-bold not-italic px-7 py-2"
                      onClick={() => setApprovalModal(false)}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </Dashboard>
  );
};

export default ManageKPO;
