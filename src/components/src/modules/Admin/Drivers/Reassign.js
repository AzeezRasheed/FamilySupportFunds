import React, { Fragment, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Dialog, Transition } from "@headlessui/react";
import { cloneDeep, filter, indexOf } from "lodash";
import { CloseModal } from "../../../assets/svg/modalIcons";
import { userNet } from "../../../utils/urls";
import {
  getAllDistributors,
  getAllUsers,
  setAddAdminOverlay,
} from "../KPO/actions/UsersAction";
import { useTranslation } from "react-i18next";

const Reassign = ({ action, current }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const allDistributors = useSelector(
    (state) => state.AllUsersReducer.allDistributors
  );
  const dispatch = useDispatch();
  const [DistList, setDistList] = useState([]);
  const [selectedDist, setSelectedDist] = useState([]);
  const [inputField, setInputField] = useState("");
  const [distFiltered, setDistFiltered] = useState([]);
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;


  useEffect(() => {
    const newArray = cloneDeep(allDistributors);
    setDistList(newArray);
  }, [allDistributors]);

  // if (current?.length > 0 && selectedDist.length === 0 && DistList?.length) {
  //   current.map((distCode, index) => {
  //     const theDist = filter(allDistributors, { DIST_Code: distCode });

  //     if (theDist) {
  //       selectedDist.push(theDist[0]);
  //     }
  //   });
  // }

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

  const onClick = (item) => {
    selectedDist.pop();
    const founded = indexOf(selectedDist, item);
    // eslint-disable-next-line no-unused-expressions
    if (founded === -1) {
      selectedDist.push(item);
      //dispatch(setSelectedDistributors(selectedDist));
      onChange(inputField);
      //setSelectedDist(selectedDist);
    }
  };

  const removeDist = (index) => {
    selectedDist.splice(index, 1);
    onChange(inputField);
  };

  const saveDist = () => {
    const userApi = userNet()
    let selectedDistID = [];

    selectedDist &&
      selectedDist?.forEach((dist) => selectedDistID.push(dist?.DIST_Code));
    const toSave = JSON.stringify(selectedDistID);
    let params = {
      company_ID: toSave,
    };
    userApi.patch("edit-profile/" + id, params).then((result) => {
      //update vehicle
      dispatch(getAllUsers(country));
      dispatch(getAllDistributors(country));
    });
    //dispatch(saveDist(id, params, selectedDist))
    dispatch(setAddAdminOverlay(false));
  };

  return (
    <Transition.Root show={action} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          dispatch(setAddAdminOverlay(false));
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
                <div
                  style={{ cursor: "pointer" }}
                  className="h-modal overflow-y-scroll scrollbar-hide"
                >
                  <CloseModal
                    className="ml-auto m-4 mb-0"
                    onClick={() => {
                      setInputField("");
                      dispatch(setAddAdminOverlay(false));
                    }}
                  />
                  <div className="mt-2 px-12">
                    <div className="justify-between items-center mb-2">
                      <p
                        className="font-customGilroy not-italic font-normal grey-100"
                        style={styles.heading}
                      >
                        {t("reassign_driver")}
                      </p>
                      <div
                        style={{
                          marginBottom: 24,
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        {selectedDist?.map((Dist, index) => (
                          <div key={index} style={styles.tags}>
                            <span style={{ paddingTop: 3 }}>
                              {Dist?.company_name}
                            </span>
                            <CloseModal
                              onClick={() => removeDist(index)}
                              style={{ width: 25 }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <input
                        placeholder="Type to search..."
                        type="text"
                        style={styles.searchBox}
                        onChange={(ev) => onChange(ev.target.value)}
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
                              <span style={styles.ddcode}>{item.SYS_Code}</span>
                            </p>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                      <div onClick={() => saveDist()} style={styles.button}>
                        {t("continue")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Reassign;

const styles = {
  searchBox: {
    width: "100%",
    border: "1px solid #F49C00",
    borderRadius: 4,
    outline: "none",
    padding: 10,
  },
  button: {
    background: "#B11F24",
    borderRadius: 4,
    padding: "12px 76px",
    width: 220,
    color: "#FFFFFF",
    fontWeight: 700,
    float: "right",
    marginTop: 56,
  },
  heading: {
    fontWeight: 600,
    fontSize: 20,
    color: "#2D2F39",
    marginBottom: 44,
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
    marginRight: 10,
    marginBottom: 10,
  },
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
};
