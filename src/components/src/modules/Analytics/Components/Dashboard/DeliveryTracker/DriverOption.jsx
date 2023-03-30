import React from "react";
import {v4 as uuid} from "uuid"
import { useRef } from "react";
import { useEffect } from "react";
import actor__active from "../../../Assets/svgs/avatar__active.svg";
import actor__deactive from "../../../Assets/svgs/avatar__deactive.svg";

const DriverOption = ({selected, setSelected, select, driverName}) => {
    const compId = useRef(uuid)

    useEffect(() => {
        if(select) setSelected(compId)
    }, [select, setSelected])

    return (
      <div className="delivery__tracker__body__aside__item" onClick={() => setSelected(compId)}>
        <div>
          <img src={selected === compId ? actor__active : actor__deactive} alt="" />
        </div>
        <div className="delivery__tracker__body__aside__item__text">
          {driverName}
        </div>
      </div>
    );
}
export default DriverOption