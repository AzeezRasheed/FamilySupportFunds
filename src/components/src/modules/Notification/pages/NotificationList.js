import React, { useEffect, useState } from "react";
import { notificationTabHeaderData as header } from "../../../utils/data";
import { notificationTableContent as content } from "../../../utils/data";
import { notificationSubTabHeaderData as subHeader } from "../../../utils/data";
import NotificationTab from "../../../components/common/Tabs";
import Dashboard from "../../../Layout/Dashboard";
import { NotificationData as data } from "../../../utils/data";
import NotificationContent from "./components/NotificationContent";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../../../utils/getUserLocation";
import { getAllOrders } from "../../Admin/order/actions/orderAction";
import { inventoryNet, orderNet } from "../../../utils/urls";
import { filter } from "lodash";
import { useParams } from "react-router-dom";
import moment from "moment";

const Notifications = ({ location }) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const { distCode } = useParams();
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const [userCountry, setUserCountry] = useState('Ghana');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [outStockError, setOutStockError] = useState(false);
  const [openOrdersError, setOpenOrdersError] = useState(false);


  useEffect(async () => {
    const loc = await getLocation();
    setUserCountry(loc);
  }, [userCountry])


  useEffect(() => {
    setLoading(true);
    const wait = async () => {
      let allNotifications = [];
      
      //get open orders
      const orderApi = orderNet()
      orderApi
        .get(
          `GetOrder/GetOrderBySellerCompanyId/${distCode}?orderStatus=Placed`
        )
        .then((response) => {
          const { data } = response;
        
          const formattedNotifications = data.order.map((val) => {
            return {
              message: `${t("new_order")} ${val?.orderId} ${t("has_been_placed_by")}
                ${val?.buyerDetails[0]?.buyerName || val?.buyerCompanyId}.`,
              date: `${moment(val?.datePlaced).format("DD-MM-YYYY")}`,
              time: `${moment(val?.datePlaced).format("HH:mm")}`,
              type: 'openOrders'
            }
          })
          allNotifications.push(...formattedNotifications)
        })
        .catch((error) => {
          setOpenOrdersError(t('error_fetching_open_orders'));
          return;
        });
          
        //get out of stock by company by location
        const inventory = inventoryNet()
        inventory
          .get("company-out-of-stock/" + distCode)
          .then((response) => {
            const { data } = response.data;
            const formattedNotifications = data.map((val) => {
              return {
                message: `${t("you_have_run_out_of")} ${val.product?.brand} 
                  ${val.product?.sku}. ${t("you_need_to_restock")}`,
                date: `${moment(val?.date).format("DD-MM-YYYY")}`,
                time: `${val?.time || ''}`,
                type: 'outOfStock'
              }
            })
            allNotifications.push(...formattedNotifications);
            allNotifications.sort((notification1, notification2) => new Date(notification2?.date) - new Date(notification1?.date));
            setNotifications(allNotifications);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            setOutStockError(t("error_fetching_out_of_stock_orders"));
            return;
          });
    };
    wait();
  }, [
    distCode,
    country
  ]);

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <h2 className="font-customRoboto text-black font-bold text-2xl">
          {t("notifications")}
        </h2>
        <NotificationTab dataHeader={header} dataContent={content} top="mt-5">
          <NotificationContent
            dataHeader={subHeader}
            dataContent={content}
            notificationData={notifications}
            loadingData={loading}
            outStockError={outStockError}
            openOrdersError={openOrdersError}
          />
        </NotificationTab>
      </div>
    </Dashboard>
  );
};

export default Notifications;
