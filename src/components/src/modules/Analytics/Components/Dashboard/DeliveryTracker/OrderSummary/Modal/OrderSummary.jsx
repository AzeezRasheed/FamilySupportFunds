import budweiser from "../../../../../Assets/svgs/budweiser.svg";

const OrderSummary = () => {
  return (
    <div className="summary__modal__dialog__section__side">
      <span>Order Summary</span>
      <table className="summary__modal__dialog__section__side__table">
        <thead className="thead">
          <tr className="tr">
            <th className="th" style={{ width: "60px", }}></th>
            <th className="th" ></th>
            <th className="th" >Unit price</th>
            <th className="th" >Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img src={budweiser} alt="" />
            </td>
            <td>
              <div>
                <strong>Budweiser 600 ml × 12 (RB)</strong>
                <div>
                  <button>full</button>
                  <span>
                    <span>Qty:</span>
                    <span>50</span>
                  </span>
                </div>
              </div>
            </td>
            <td className="unit">₦2,800</td>
            <td>₦5,600,000</td>
          </tr>
          <tr>
            <td>
              <img src={budweiser} alt="" />
            </td>
            <td>
              <div>
                <strong>Budweiser 600 ml × 12 (RB)</strong>
                <div>
                  <button>full</button>
                  <span>
                    <span>Qty:</span>
                    <span>50</span>
                  </span>
                </div>
              </div>
            </td>
            <td className="unit">₦2,800</td>
            <td>₦5,600,000</td>
          </tr>
          <tr>
            <td>
              <img src={budweiser} alt="" />
            </td>
            <td>
              <div>
                <strong>Budweiser 600 ml × 12 (RB)</strong>
                <div>
                  <button className="font-bold">full</button>
                  <span>
                    <span>Qty:</span>
                    <span>50</span>
                  </span>
                </div>
              </div>
            </td>
            <td className="unit">₦2,800</td>
            <td>₦5,600,000</td>
          </tr>
          <tr>
            <td></td>
            <td>
              <h2 className="font-bold text-lg">Total</h2>
            </td>
            <td></td>
            <td>
              <h2 className="font-bold text-lg">₦9,725,000</h2>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderSummary;
