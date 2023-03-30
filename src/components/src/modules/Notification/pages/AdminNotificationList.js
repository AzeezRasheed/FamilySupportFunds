import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminNotificationTabHeaderData as header } from "../../../utils/data";
import { notificationTableContent as content } from "../../../utils/data";
import { adminNotificationSubTabHeaderData as subHeader } from "../../../utils/data";
import NotificationTab from "../../../components/common/Tabs";
import Dashboard from "../../../Layout/Admin/Dashboard";
import { NotificationData as data } from "../../../utils/data";
import NotificationContent from "./components/AdminNotificationContent";
import Modal from "../../Admin/components/Modal";
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'
import { orderBy } from "lodash";
import {
  getAllDistributors,
  getAllUsers,
} from "../../Admin/KPO/actions/UsersAction";
import { useTranslation } from "react-i18next";

const Notifications = () => {
  const {t} = useTranslation()
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [data_, setData_] = useState([]);
  const dispatch = useDispatch();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const [userCountry, setUserCountry] = useState('Ghana');


    useEffect(async () => {
      const loc = await getLocation();
      setUserCountry(loc);
    })
  useEffect(() => {
    dispatch(getAllUsers(country));
  }, [country]);

  const allUsers = useSelector((state) => state.AllUsersReducer.allUsers);
  let awaitingAction = allUsers.filter((user) => user.status === "new");

  awaitingAction = orderBy(awaitingAction, "id", "desc");

  useEffect(() => {
    setData_(awaitingAction);
  }, []);

  const borderActive = countryConfig[userCountry].borderBottomColor;
  const buttonColor = countryConfig[userCountry].buttonColor;
  const color = countryConfig[userCountry].textColor;



  return (
    <Dashboard location="/dashboard/admin-notifications">
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <h2 className="font-customRoboto text-black font-bold text-2xl">
          {t("notifications")}
        </h2>
        <NotificationTab dataHeader={header} borderActive={borderActive} dataContent={content} top="mt-5">
          <NotificationContent
            buttonColor={buttonColor}
            color={color}
            dataHeader={subHeader}
            dataContent={awaitingAction}
            notificationData={data}
            setOpen={setOpen}
            setUser={setUser}
          />
        </NotificationTab>
      </div>
      {open && <Modal open={open} setOpen={setOpen} setUser={setUser} />}
    </Dashboard>
  );
};

export default Notifications;
