import React, { useState, useEffect } from "react";
import Dashboard from "../../../Layout/Admin/Dashboard";
import PricingComp from "./components/PricingComp";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const Pricing = () => {
  const dispatch = useDispatch();
  const [editAccess, setEditAccess] = useState(false);
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const { t } = useTranslation();
  // const country = "Nigeria";
  // const country = "Zambia";

  useEffect(() => {
    AuthData.roles === "Admin" && AuthData.super_admin === 1
      ? setEditAccess(true)
      : setEditAccess(false);
    // dispatch(getAllProducts(country === "South Africa" ? "SA" : country));
  }, []);

  const allProducts = useSelector((state) => state.PricingReducer.allProducts);

  // console.log(allProducts);

  const showProducts = () => {
    switch (country) {
      case "Uganda":
        return (
          <PricingComp
            columns={[
              { name: "Stockiest Price", columnName: "price" },
              { name: "Outlet Price", columnName: "high_end_price" },
            ]}
          />
        );
      case "Nigeria":
        return (
          <PricingComp
            columns={[
              { name: "Bulkbreakers", columnName: "price" },
              { name: "Retailers", columnName: "poc_price" },
            ]}
          />
        );
      case "Ghana":
        return (
          <PricingComp
            columns={[
              { name: "PTW", columnName: "price" },
              { name: "PTR", columnName: "ptr_price" },
            ]}
          />
        );
      case "South Africa":
        return (
          <PricingComp
            columns={[
              { name: "PFW", columnName: "price" },
              { name: "PTR", columnName: "poc_price" },
            ]}
          />
        );
      case "Tanzania":
        return (
          <PricingComp columns={[
              { name: "Price", columnName: "price" },
            ]} />
        );
      case "Mozambique":
        return (
          <PricingComp
            columns={[
              { name: "South Price", columnName: "south" },
              { name: "North Price", columnName: "north" },
              { name: "Centre Price", columnName: "centre" },
            ]}
          />
        );
      case "Zambia":
        return (
          <PricingComp
            columns={[
              { name: "Price", columnName: "price" },
            ]}
          />
        );
      // return <SinglePricing />;
      default:
        return (
          <PricingComp editAccess={editAccess} allProducts={allProducts} />
        );
    }
  };

  return (
    <Dashboard location="">
      <div className="px-10 pt-10 pb-15 md:pb-36 lg:pb-36">
        <p className="font-customGilroy text-xl font-bold not-italic text-grey-100">
          {t("pricing")}
        </p>
        {showProducts()}
        {/* <PricingComp editAccess={editAccess} /> */}
      </div>
    </Dashboard>
  );
};

export default Pricing;
