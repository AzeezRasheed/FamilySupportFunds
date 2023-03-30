import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../modules/Mini-Admin/componentsForSummary/cssFile/mainCss.module.css";
import { GetDistributors } from "../../modules/Mini-Admin/GetDistributors";
import searchIcon from "../../assets/svg/searchIcon.svg";
import { t } from "i18next";
import {
  setSelectedDist,
  showMinDistributors,
} from "../../modules/Admin/Reports/actions/ReportAction";
const MiniAdminDistributors = ({ dists }) => {
  console.log(dists);
  const { show_mini_admin_dist } = useSelector((state) => state.ReportReducer);
  const [filteredDist, setFilteredDist] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    if (dists.length > 0) {
      searchValue !== ""
        ? setFilteredDist(
            dists.filter((val) =>
              val.company_name.toLowerCase().includes(searchValue.toLowerCase())
            )
          )
        : setFilteredDist(dists);
    }
  }, [searchValue, dists]);

  return (
    <div
      className={`${show_mini_admin_dist ? "block" : "hidden"}`}
      style={styless.container}
    >
      <div className="font-customGilroy">
        {/* {
          GetDistributors().map((dist, index))
        } */}
        <span>
          <input
            type="text"
            placeholder="Search for distributor"
            id={styles.radioButtons}
            style={{ paddingLeft: 44, width: 280 }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          {/* <img src={searchIcon} alt="" /> */}
        </span>

        <div className={styles.radioContainer}>
          <span className={styles.options}>
            <input
              type="radio"
              id="all_dist"
              key="all_dist"
              name="dist"
              onChange={() => {
                dispatch(setSelectedDist({ company_name: "all" }));
                dispatch(showMinDistributors(false));
              }}
              style={{ display: "none" }}
            />
            <label
              for="all_dist"
              id={styles.label}
              style={{ display: "flex", alignItems: "center" }}
            >
              {t("all_distributors")}
            </label>
          </span>

          {/* <span className={styles.options}>
            <input
              type="radio"
              id="all_dist"
              key="all_dist"
              name="dist"
              onChange={() => {
                dispatch(setSelectedDist({ company_name: "all" }));
                dispatch(showMinDistributors(false));
              }}
            />
            <label
              for="all_dist"
              id="label"
              style={{ display: "flex", alignItems: "center" }}
            >
              {t("all_distributors")}
            </label>
          </span> */}

          {(filteredDist ?? dists)?.map((dist, index) => (
            <span className={styles.options} key={index}>
              <input
                type="radio"
                id={index}
                name="dist"
                onChange={() => {
                  dispatch(setSelectedDist(dist));
                  dispatch(showMinDistributors(false));
                }}
                style={{ display: "none" }}
              />
              <label
                for={index}
                id={styles.label}
                style={{ display: "flex", alignItems: "center" }}
              >
                {dist?.company_name}
              </label>
            </span>
          ))}
        </div>

        <br></br>
      </div>
    </div>
  );
};

export default MiniAdminDistributors;

const styless = {
  container: {
    // flex: 1,
    backgroundColor: "#FFFFFF",
    boxShadow:
      "0px 0px 1px rgba(9, 11, 23, 0.15), 0px 8px 24px rgba(9, 11, 23, 0.15)",
    borderRadius: 4,
    textAlign: "left",
    left: "3rem",
    // width: "300px",
    position: "absolute",
    padding: "0px 24px 24px 24px",
    minHeight: 100,
  },
  item: {
    fontColor: "#2D2F39",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    padding: "16px 24px 16px 24px",
    borderBottom: "1px solid #DEE0E4",
  },
  code: {
    fontSize: 12,
    color: "#DEE0E",
    paddingTop: 18,
    fontWeight: "400",
  },
};
