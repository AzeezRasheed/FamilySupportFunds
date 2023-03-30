import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Dashboard from "../../../Layout/Dashboard";
import { inventoryData, warehouses } from "../../../utils/data";

const ReceiveStock = ({ location }) => {
  const { t } = useTranslation();

  return (
    <Dashboard location={location}>
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex van-replenish-cont">
          <h2 className="font-customRoboto text-black font-bold text-2xl">
            {t("receive_new_stock")}
          </h2>
        </div>
        <div className="bg-white mt-4 w-full rounded-md">
          <div className="py-5 flex-auto">
            <div className="flex title-step px-7 py-3">
              {/* <p className="title">Select Warehouse</p> */}
              <p className="title">{t("add_stock_details")}</p>
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
                  <Link to="/dashboard/add-details">
                    <p className="van-text">{t("next")}</p>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default ReceiveStock;
