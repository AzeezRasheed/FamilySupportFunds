import useComponentVisible from "../../utils/useComponentVisible";

const RadioSelectOverlay = ({ itemsList, name, handleChange, setIsVisible }) => {
  const { ref } = useComponentVisible(setIsVisible);
  return (
    <div
      className=" bg-white quick-cards rounded-md shadow-lg p-6 w-60 overflow-y-auto"
      ref={ref}
    >
      {itemsList.map((item, index) => (
        <div key={index} className="mb-2">
          <input
            type="radio"
            id={index}
            value={item}
            className="cursor-pointer mr-4"
            name={name}
            onChange={(e) => handleChange(e.target.value)}
          />
          <label htmlFor={index} className="">
            {item}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioSelectOverlay;
