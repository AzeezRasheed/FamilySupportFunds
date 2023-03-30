import React from 'react';
import { components } from "react-select";

export const OptionComp = ({ reason,  label}) => {
  return (
    <div>
      <components.Option >
        <input
          type="checkbox"
          checked={reason}
          // value={reason.value}
          onChange={() => null}
        />{" "}
        <label>{label}</label>
      </components.Option>
    </div>
  );
};
