import ArrowDown from "../../Assets/svgs/dropdown__arrow__down.svg";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { v4 as uuid } from "uuid";
import { setDateFilter } from "../../pages/actions/analyticsAction";
import { useDispatch, useSelector } from "react-redux";
import { resetAnalyticsCalendar, setAnalyticsSelectedDateRange } from "../../../Distributors/actions/DistributorAction";

const DateTypeDropdown = ({ options, filter, onChange }) => {
  const [selected, setSelected] = useState(options[1]);
  const [toggled, setToggled] = useState(false);
  const dropdown = useRef();
  const dispatch = useDispatch()
  const { dateFilter } = useSelector((state) => state.AllAnalyticsReducer);

  const handleWindowClick = (e) => {
    if (dropdown.current && dropdown.current.contains(e.target)) return;
    setToggled(false);
  };

  useEffect(() => {
    if (toggled) {
      window.addEventListener("click", handleWindowClick);
    } else {
      window.removeEventListener("click", handleWindowClick);
    }
  }, [toggled]);

  useEffect(() => {
    console.log(selected.value);
    // onChange(selected);
    dispatch(setDateFilter(selected.value))
    dispatch(resetAnalyticsCalendar());
  }, [selected]);

  useEffect(() => {
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  return (
    <div className="dropdown__toggle flex" ref={dropdown}>
      <div
        className="w-100 h-100 flex items-center px-3 flex-between"
        onClick={() => setToggled(!toggled)}
      >
        <span>{dateFilter==="Date_Range" ? "Period..." : (selected.name || selected)}</span>
        <span>
          <img src={ArrowDown} alt="" />
        </span>
      </div>
      {toggled && (
        <div className="dropdown__toggle__drop">
          {options.map((item) => (
            <label
              key={uuid()}
              className="analytics_container dropdown__toggle__drop__item"
            >
              <span className="dropdown__toggle__drop__radio">
                <input
                  type="radio"
                  checked={dateFilter === "Date_Range" ? false :  (selected.name === item.name || selected === item)}
                  value={item.value || item}
                  name="radio"
                  className="input"
                  onChange={() => setSelected(item)}
                />
                <span className="checkmark">
                  <span className="selected"></span>
                </span>
              </span>
              <span className="ml-3">{item.name || item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateTypeDropdown;