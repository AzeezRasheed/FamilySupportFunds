import React, { useState } from "react";
import { Link } from "react-router-dom";
import step2 from './step2'
// import history from "../../../utils/history";

const Step1 = ({}) => {
  return (
    <div className="bg-white mt-4 w-full rounded-md">
      <div className="py-5 flex-auto">
        <div className="flex title-step px-7 py-3">
          {/* <p className="title">Select Warehouse</p> */}
          <p className="title">Add Stock Details</p>
          <p className="step">Step 1 of 3</p>
        </div>
        <div className="stock-cont py-4">
          <div className="stock-warehouses mx-24">
            <form action="/action_page.php">
              <div className="py-2 px-3">
                 {" "}
                <input
                  type="radio"
                  id="warehouse1"
                  name="fav_language"
                  value="HTML"
                />
                 {" "}
                <label for="warehouse1" className="warehouse">
                  Mushin Mega Warehouse
                </label>
                <br />
              </div>
              <div className="py-2 px-3">
                 {" "}
                <input
                  type="radio"
                  id="warehouse2"
                  name="fav_language"
                  value="CSS"
                />
                 {" "}
                <label for="warehouse2" className="warehouse">
                  Isolo Drop Point
                </label>
                <br />
              </div>
              <div className="py-2 px-3">
                 {" "}
                <input
                  type="radio"
                  id="warehouse3"
                  name="fav_language"
                  value="JavaScript"
                />
                 {" "}
                <label for="warehouse3" className="warehouse">
                  Oyekanmi Drop Point
                </label>
              </div>
              <div className="py-2 px-3">
                 {" "}
                <input
                  type="radio"
                  id="warehouse4"
                  name="fav_language"
                  value="JavaScript"
                />
                 {" "}
                <label for="warehouse4" className="warehouse">
                  Alh Musa Drop Point
                </label>
              </div>
              <div className="py-2 px-3">
                 {" "}
                <input
                  type="radio"
                  id="warehouse5"
                  name="fav_language"
                  value="JavaScript"
                />
                 {" "}
                <label for="warehouse5" className="warehouse">
                  Ladipo Drop Point
                </label>
              </div>
            </form>
          </div>
          <div className="btn-cont mx-24">
            <div />
            <button
              // onClick={() => history.push(``)}
              className="mt-8 px-14 py-3 next"
            >
              <Link to="">
                <p className="van-text">Next</p>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
