import { useRef } from "react";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";

const TabOption = ({ selected, setSelected, select, tabName, compId }) => {
  useEffect(() => {
    if (select) setSelected(compId);
  }, [select, setSelected]);
  return (
    <div
      className="delivery__tracker__body__section__header__item"
      onClick={() => setSelected(compId)}
    >
      <div
        style={{ fontWeight: selected === compId ? 'bold': ''}}
        className="delivery__tracker__body__section__header__item__content"
      >
        {tabName}
      </div>
      <div
        style={{ background: selected === compId ? "#E5B611" : "" }}
        className="delivery__tracker__body__section__header__item__selected"
      ></div>
    </div>
  );
};

export default TabOption