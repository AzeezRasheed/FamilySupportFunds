import React from "react";
import Countdown from "react-countdown";

// Random component

const CountdownComp = ({ datePlaced }) => {
  const Completionist = <span>Times Up!</span>;
  return (
    <Countdown date={Date.parse(datePlaced) + 10*60*1000}>
      <Completionist />
  </Countdown>
  )
}

export default CountdownComp