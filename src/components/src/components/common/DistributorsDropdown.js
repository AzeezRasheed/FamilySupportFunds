import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { find, indexOf } from "lodash";
import { setSelectedDistributors } from "../../modules/Admin/KPO/actions/UsersAction";

const DistributorsDropdown = () => {
  //const [selectedDist, setSelectedDist] = useState([]);
  const dispatch = useDispatch();

  const data = useSelector(
    (state) => state.AllUsersReducer.filteredDistributors
  );

    const selectedDist = useSelector(
      (state) => state.AllUsersReducer.selectedDistributors
    );

  const onClick = (item) => {
    const founded = indexOf(selectedDist, item);
    // eslint-disable-next-line no-unused-expressions
    if (founded === -1) {
      selectedDist.push(item);
      dispatch(setSelectedDistributors(selectedDist))
      
      //setSelectedDist(selectedDist);
    }
  };

  return (
    <div style={styles.container}>
      {data?.map((item, index) => (
        <p
          className="font-customGilroy"
          key={index}
          style={styles.item}
          onClick={() => onClick(item)}
        >
          {item.company_name}
          <br />
          <span style={styles.code}>{item.SYS_Code}</span>
        </p>
      ))}
    </div>
  );
};

export default DistributorsDropdown;

const styles = {
  container: {
    flex: 1,
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
