import SortImg from "../../assets/svg/sort.svg";
import RadioSelectOverlay from "./RadioSelectOverlay";
import { useState } from "react";

const Sort = ({ setSortvalue }) => {
  const [visible, setVisible] = useState(false);

  const itemsList = [
    "Product Name (A - Z)",
    "Product Name (Z - A)",
    "Quantity (High to Low)",
    "Quantity (Low to High)",
  ];

  const handleVisibility = () => {
    if (visible === true) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  };


  return (
    <div className="relative cursor-pointer">
      <div
        className="flex text-center font-normal px-2 py-3 rounded-md block bg-white border-default-b border-2"
        onClick={handleVisibility}
      >
        <img className="pr-2" src={SortImg} alt="" />
        <p className="">Sort by</p>
      </div>


      <div className="absolute z-10 overflow-y-auto bg-white quick-cards cursor-pointer rounded-md shadow-lg">
        {visible ? (
          <RadioSelectOverlay
            itemsList={itemsList}
            name="all-products"
            handleChange={setSortvalue}
            setIsVisible={setVisible}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Sort;
