import ArrowDown from "../../Assets/svgs/dropdown__arrow__down.svg";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { v4 as uuid } from "uuid";

const Dropdown = ({ options, onChange }) => {
  const [selected, setSelected] = useState("All products");
  const [toggled, setToggled] = useState(false);
  const dropdown = useRef();
  

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
    onChange(selected);
  }, [selected]);

  useEffect(() => {
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  return (
    <div className="dropdown__toggle flex " ref={dropdown}>
      <div
        className="w-100 h-100 flex items-center px-3 flex-between"
        onClick={() => setToggled(!toggled)}
      >
        <span>{selected.name || selected}</span>
        <span>
          <img src={ArrowDown} alt="" />
        </span>
      </div>
      {toggled && (
        <div className="dropdown__toggle__drop overflow-scroll" style={{height: 400}}>
          <label
              key={uuid()}
              className="analytics_container dropdown__toggle__drop__item"
              onClick={(e)=>setSelected("All products")}
            >
              <span className="dropdown__toggle__drop__radio">
                <input
                  type="radio"
                  checked= {selected === "All products" ? "checked" : ""}
                  name="radio"
                  className="input"
                  
                />
                <span className="checkmark">
                  <span className="selected"></span>
                </span>
              </span>
              <span className="ml-3">All products</span>
            </label>
          {options.map((item) => (
            <label
              key={uuid()}
              className="analytics_container dropdown__toggle__drop__item"
              onClick={(e)=>setSelected(item.brand)}
            >
              <span className="dropdown__toggle__drop__radio">
                <input
                  type="radio"
                  checked= {selected === item.brand ? "checked" : ""}
                  name="radio"
                  className="input"
                  
                />
                <span className="checkmark">
                  <span className="selected"></span>
                </span>
              </span>
              <span className="ml-3">{item.brand}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
