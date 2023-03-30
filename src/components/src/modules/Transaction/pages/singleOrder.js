import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import arrowBackBox from "../../../assets/svg/arrowBack.svg";
import Dashboard from "../../../Layout/Dashboard";
import { orderData } from "../../../utils/data";
const SingleOrder = () => {
  const { t } = useTranslation();

  return (
    <Dashboard location="/dashboard/order/id">
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <div className="flex justify-between">
          <div className="">
            <div className="flex">
              <img className="van-img pr-7" src={arrowBackBox} />
              <h2 className="font-customRoboto mt-2 text-black font-bold text-2xl">
                {t("order")} 12345678
                <span
                  style={{
                    color: "#50525B",
                    fontStyle: "normal",
                    fontSize: "24px",
                    fontWeight: "normal",
                  }}
                >
                  (Olat Stores Limited)
                </span>
              </h2>
            </div>
            <p
              className="pt-2 pl-16"
              style={{ color: "#50525B", fontSize: "16px" }}
            >
              {t("placed")} February 21, 2021 at 2:03 pm by
              <span style={{ color: "#090B17" }}> Aanuoluwapo Simi</span>
            </p>
          </div>
          <button className="flex replenish-btn">
            <p className="van-text">{t("capture_sales")}</p>
          </button>
        </div>
        <div className="bg-white mt-8 w-full rounded-md">
          <div className="py-8 px-10 flex-auto">
            <p
              className="pb-5 font-bold"
              style={{ color: "#2D2F39", fontSize: "18px" }}
            >
              {t("order_summary")}
            </p>

            <div className="grid grid-cols-4 gap-4">
              {orderData.map((sku) => (
                <>
                  <div
                    className="px-5 py-2"
                    style={{
                      width: "100%",
                      height: "104px",
                      border: "1px solid #DEE0E4",
                      borderRadius: "8px",
                    }}
                  >
                    <div className="flex items-center py-2">
                      <div className="flex-shrink-0 h-20 w-10">
                        <img
                          className="h-20 w-10 rounded-full"
                          src={sku.image}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {sku.name}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {sku.type}
                        </div>
                        <div
                          className="text-sm my-1 font-bold"
                          style={{ color: "red" }}
                        >
                          {sku.cases}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default SingleOrder;
