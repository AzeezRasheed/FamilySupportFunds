import { v4 as uuid } from 'uuid'

const StackedChart = ({data}) => {
    return (
      <div className="stacked__chart">
        <div className="w-100 flex flex-column justify-around h-100">
          {data.map((item) => (
            <div key={uuid()} className="stacked__chart__bar">
              <div
                className="stacked__chart__bar__back"
                style={{
                  background: `${item.color}`,
                }}
              />
              <div
                className="stacked__chart__bar__progress"
                style={{
                  width: `${item.percentage}%`,
                  background: `${item.color}`,
                }}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>
        <div className="stacked__chart__axis">
          <div className="stacked__chart__axis__line">
            <span className="stacked__chart__axis__line__text">0%</span>
          </div>
          <div className="stacked__chart__axis__line">
            <span className="stacked__chart__axis__line__text">50%</span>
          </div>
          <div className="stacked__chart__axis__line">
            <span className="stacked__chart__axis__line__text">100%</span>
          </div>
        </div>
      </div>
    );
}

export default StackedChart