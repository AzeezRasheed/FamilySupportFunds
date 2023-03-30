
const LegendItem = ({ color, name, detail, style, icon}) => {
  return (
    <div className="dashboard__totalorder__legend" style={style}>
      <div className="flex items-center justify-center">
        {icon ? (
          icon
        ) : (
          <div className="bullet" style={{ backgroundColor: color }} />
        )}
      </div>
      <div className="bold">{name}</div>
      <div></div>
      <div className="dashboard__grey">{detail}</div>
    </div>
  );
};

export default LegendItem;
