import React from "react";
import { useTranslation } from "react-i18next";

const NewCustomer = () => {
  const {t} = useTranslation()
  return (
    <div className="modal">
      <form action="" className="modal-form">
        <i className="fas fa-times"></i>
        <div className="new-customer-heading">
          <p className="modal-form-title">New Customer</p>
          <div className="new-customer-heading-icon">
            <i className="fas fa-file-upload"></i> <span>Upload Csv</span>
          </div>
        </div>
        <p>Account Owner</p>
        <div className="input-row">
          <div className="small-imput">
            <label htmlFor="firtName">First Name</label>
            <input
              type="text"
              id="firtName"
              className="form-control"
              placeholder={t("type_here")}
            />
          </div>
          <div className="small-imput">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              className="form-control"
              placeholder={t("type_here")}
            />
          </div>
        </div>
        <p>Business Details</p>

        <div className="long-imput">
          <label htmlFor="business">Business Name</label>
          <input
            className="form-control form-long"
            id="business"
            type="text"
            placeholder={t("type_here")}
          />
        </div>

        <div className="input-row">
          <div className="small-imput">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder={t("type_here")}
            />
          </div>
          <div className="small-imput">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              className="form-control"
              placeholder={t("type_here")}
            />
          </div>
        </div>

        <div className="long-imput">
          <label htmlFor="address">Address</label>
          <input
            className="form-control form-long"
            name="address"
            type="text"
            placeholder={t("type_here")}
          />
        </div>

        <div className="input-row">
          <div className="small-imput">
            <label htmlFor="email">City</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder={t("type_here")}
            />
          </div>
          <div className="small-imput">
            <label htmlFor="phone">District</label>
            <input
              type="text"
              id="phone"
              className="form-control"
              placeholder={t("type_here")}
            />
          </div>
        </div>

        <div className="input-row">
          <div className="small-imput">
            <label htmlFor="email">Longitude</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder={t("type_here")}
            />
          </div>
          <div className="small-imput">
            <label htmlFor="phone">Lartitude</label>
            <input
              type="text"
              id="phone"
              className="form-control"
              placeholder={t("type_here")}
            />
          </div>
        </div>

        <div className="buttons">
          <button className="btn">Cancel</button>
          <button className="btn btn-red">Save</button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomer;
