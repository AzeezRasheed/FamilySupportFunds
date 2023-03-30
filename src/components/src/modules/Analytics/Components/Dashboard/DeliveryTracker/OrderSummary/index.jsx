import { useState } from "react";
import SummaryModal from "./Modal";
import Portal from "../../../common/Portal";

const OrderSummary = () => {
  const [modalToggled, setModalToggled] = useState(false);

  const handleClick = () => {
    setModalToggled(true);
  };
  return (
    <div className="order__summary">
      <table>
        <thead>
          <tr>
            <th>
              <span className="">S/N</span>
            </th>
            <th>Order number</th>
            <th>Date</th>
            <th>Order source</th>
            <th>Status</th>
            <th>Products</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr onClick={handleClick}>
            <td>
              <span>1.</span>
            </td>
            <td>123456</td>
            <td>21-09-2022</td>
            <td>BEES</td>
            <td>
              <button>Completed</button>
            </td>
            <td>6</td>
            <td>₦38,888.03</td>
          </tr>
          <tr>
            <td>
              <span>1.</span>
            </td>
            <td>123456</td>
            <td>21-09-2022</td>
            <td>BEES</td>
            <td>
              <button className="inactive">Assigned</button>
            </td>
            <td>6</td>
            <td>₦38,888.03</td>
          </tr>
          <tr>
            <td>
              <span>1.</span>
            </td>
            <td>123456</td>
            <td>21-09-2022</td>
            <td>BEES</td>
            <td>
              <button>Completed</button>
            </td>
            <td>6</td>
            <td>₦38,888.03</td>
          </tr>
          <tr>
            <td>
              <span>1.</span>
            </td>
            <td>123456</td>
            <td>21-09-2022</td>
            <td>BEES</td>
            <td>
              <button className="inactive">Assigned</button>
            </td>
            <td>6</td>
            <td>₦38,888.03</td>
          </tr>
          <tr>
            <td>
              <span>1.</span>
            </td>
            <td>123456</td>
            <td>21-09-2022</td>
            <td>BEES</td>
            <td>
              <button>Completed</button>
            </td>
            <td>6</td>
            <td>₦38,888.03</td>
          </tr>
          <tr>
            <td>
              <span>1.</span>
            </td>
            <td>123456</td>
            <td>21-09-2022</td>
            <td>BEES</td>
            <td>
              <button className="inactive">Assigned</button>
            </td>
            <td>6</td>
            <td>₦38,888.03</td>
          </tr>
          <tr>
            <td>
              <span>1.</span>
            </td>
            <td>123456</td>
            <td>21-09-2022</td>
            <td>BEES</td>
            <td>
              <button>Completed</button>
            </td>
            <td>6</td>
            <td>₦38,888.03</td>
          </tr>
          <tr>
            <td>
              <span>1.</span>
            </td>
            <td>123456</td>
            <td>21-09-2022</td>
            <td>BEES</td>
            <td>
              <button>Completed</button>
            </td>
            <td>6</td>
            <td>₦38,888.03</td>
          </tr>
        </tbody>
      </table>
      <Portal elementId="modal">
        <SummaryModal
          isOpen={modalToggled}
          close={() => setModalToggled(false)}
        />
      </Portal>
    </div>
  );
};

export default OrderSummary;
