import React from "react";
import Dashboard from "../../Layout/Dashboard";
import Warehouse from "../../assets/svg/warehouseSettings.svg";
import DeliveryMan from "../../assets/svg/deliveryMan.svg";
import Password from "../../assets/svg/passwordSettings.svg";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { t } from "i18next";

const Settings = ({ location }) => {
  const { distCode } = useParams();
  const history = useHistory();

  let dist_code = useSelector((state) => state.DistReducer.dist_code);

  if (!dist_code) {
    dist_code = distCode;
  }

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <h2
          className="font-customRoboto mt-2 text-black font-bold text-2xl"
          style={{ marginBottom: 40 }}
        >
          {t("settings")}
        </h2>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {/* <div className="text-center" style={styles.card} onClick={() => history.push("/dashboard/drop-points/" + dist_code)}>
            <center>
              <img src={Warehouse} style={{ marginBottom: 10 }} alt="" />
            </center>
            <p style={styles.cardTitle}>Drop Points</p>
            <p style={styles.cardDescription}>
              Add new drop points or edit existing ones
            </p>
          </div> */}
          <div className="text-center" style={styles.card}>
            <center>
              <img src={DeliveryMan} style={{ marginBottom: 10 }} alt="" />
            </center>
            <p style={styles.cardTitle}>{t("van_salesmen")}</p>
            <p style={styles.cardDescription}>
              {t("add_new_VSMs_or_edit_existing_ones")}
            </p>
          </div>
          <div className="text-center" style={styles.card}>
            <center>
              <img src={Password} style={{ marginBottom: 10 }} alt="" />
              <p style={styles.cardTitle}>{t("password")}</p>
              <p style={styles.cardDescription}>
                {t("change_or_reset_your_password")}
              </p>
            </center>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Settings;

const styles = {
  card: {
    minWidth: 350,
    height: 176,
    background: "#FFFFFF",
    birder: "0.5px solid #DEE0E4",
    boxShadow: "0px 12px 30px -8px rgba(9, 11, 23, 0.25)",
    borderRadius: 4,
    paddingTop: 34,
    paddingBottom: 40,
    cursor: "pointer",
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: 16,
    color: "#2D2F39",
    marginBottom: 8,
    textAlign: "center",
  },
  cardDescription: {
    color: "#50525B",
    fontSize: 14,
  },
};
