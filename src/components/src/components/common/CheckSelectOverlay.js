import useComponentVisible from "../../utils/useComponentVisible";

const CheckSelectOverlay = ({
  itemsList,
  name,
  handleChange,
  setIsVisible,
}) => {
  const { ref } = useComponentVisible(setIsVisible);
  return (
    <div
      className=" bg-white quick-cards rounded-md shadow-lg p-6 w-72 overflow-y-auto"
      ref={ref}
    >
      {itemsList.map((item, index) => (
        <div key={index} className="mb-2 ">
          <input
            type="checkbox"
            id={index}
            value={item}
            name={name}
            onChange={(e) => handleChange(e)}
            className="cursor-pointer mr-4 w-20"
            style={style}
          />
          <label htmlFor={index} className="">
            {item}
          </label>
        </div>
      ))}
    </div>
  );
};

const style = {
  width: "20px",
  height: "20px",
  ":checked": {
    width: "20px",
    height: "20px",
  },
};

export default CheckSelectOverlay;
