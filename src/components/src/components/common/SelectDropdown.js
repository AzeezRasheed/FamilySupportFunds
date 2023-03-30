import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import {
  setChangeDistOverlay,
  setChangeRoleOverlay,
  setEditKPOOverlay,
  setSuspendKPOOverlay,
  setUnSuspendKPOOverlay,
} from "../../modules/Admin/KPO/actions/UsersAction";

const SelectDropdown = ({ items, KPO_id, }) => {
    const dispatch = useDispatch()
    const history = useHistory()


    const onClick = (item) =>{
        
        // eslint-disable-next-line default-case
        switch (item.route) {
            case "self": {
                // eslint-disable-next-line default-case
                switch (item.action) {
                  case "change_dist": {
                    dispatch(setChangeDistOverlay(true, KPO_id))
                    break;
                  }
                  case "edit": {
                    dispatch(setEditKPOOverlay(true, KPO_id));
                    break;
                  }
                  case "suspend": {
                    dispatch(setSuspendKPOOverlay(true, KPO_id));
                    break;
                  }
                  case "unsuspend": {
                    dispatch(setUnSuspendKPOOverlay(true, KPO_id));
                    break;
                  }
                  case "changerole": {
                    dispatch(setChangeRoleOverlay(true, KPO_id));
                    break;
                  }
                }
                break;
            }
            case "link": {
                //console.log(item.action+KPO_id);
                history.push(item.action+KPO_id);
            }
        }
    }

    return (
      <div style={styles.container}>
        {items.map((item, index) => (
              item &&
              <p key={index} style={styles.item} onClick={() => onClick(item)}>{item.menu}</p>
        ))}
      </div>
    );
}

export default SelectDropdown

const styles = {
  container: {
      flex: 1,
    backgroundColor: "#FFFFFF",
    padding: "16px 24px 24px ",
    boxShadow:
      "0px 0px 1px rgba(9, 11, 23, 0.15), 0px 8px 24px rgba(9, 11, 23, 0.15)",
      borderRadius: 4,
    textAlign: "left", 
    right: ".1rem",
    width: "200px",
    position: "absolute"
  },
  item: {
      color: "#50525B",
      fontWeight: 500,
      fontSize: 14,
      paddingBottom: 14,
      cursor: "pointer"
  }
};
