import { useState } from "react";
import arrowDown from "../../assets/svg/arrowDown.svg";
import CheckSelectOverlay from "./CheckSelectOverlay";
import RadioSelectOverlay from "./RadioSelectOverlay";
import useComponentVisible from "../../utils/useComponentVisible";

const MultiSelect = ({
  value,
  itemsList,
  type,
  setRadioValue,
  setCheckboxValues,
  checkboxValues,
}) => {
  const [visible, setVisible] = useState(false);
   const handleVisibility = () => {
     if (visible === true) {
       setVisible(false);
     } else {
       setVisible(true);
     }
   };

  const handleCheckboxChange = (e) => {
    if (e) {
      let newChecked = [...checkboxValues];
      if (e.target.checked) {
        newChecked.push(e.target.value);
      } else {
        const index = checkboxValues.indexOf(e.target.value);
        newChecked.splice(index, 1);
      }
      setCheckboxValues(newChecked);
    }
  };

  return (
    <div className="relative">
      <div
        className="flex text-center font-normal mr-4 px-2 py-3 rounded-md block bg-white border-default-b border-2 cursor-pointer"
        onClick={handleVisibility}
      >
        {value}
        <img className="ml-auto" alt="d-icon" src={arrowDown} />
      </div>
        <div className="absolute z-10">
          {visible && type === "checkbox" ? (
            <CheckSelectOverlay
              itemsList={itemsList}
              name="all-products"
              handleChange={handleCheckboxChange}
              setIsVisible={setVisible}
            />
          ) : visible && type === "radio" ? (
            <RadioSelectOverlay
              itemsList={itemsList}
              name="all-products"
              handleChange={setRadioValue}
              setIsVisible={setVisible}
            />
          ) : null}
        </div>
    </div>
  );
};

export default MultiSelect;
