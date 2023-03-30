import { t } from "i18next";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatNumber } from "../../../utils/formatNumber";
import { getTotalEmpties } from "../actions/inventoryProductAction";

const TotalEmpties = ({ code }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTotalEmpties(code));
  }, []);

  const totalEmpties = useSelector(
    (state) => state.InventoryReducer.totalEmpties
  );
  if (!totalEmpties) {
    dispatch(getTotalEmpties(code));
  }
  return (
    <div style={{ marginLeft: 32, marginTop: 16 }}>
      <span
        style={{
          backgroundColor: "#50525B",
          padding: "4px 8px",
          borderRadius: 4,
          color: "#FFFFFF",
          fontSize: 16,
        }}
      >
        {t("total_empties")}: {formatNumber(totalEmpties)}
      </span>
    </div>
  );
};

export default TotalEmpties;
