import React from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import blackLogo from "../../assets/svg/blackLogo.svg";
import countryConfig from "../../utils/changesConfig.json";

const UnsavedReceiveNewStock = ({ actionText, backText, forwardText, onClickForward }) => {
  const AuthData = useSelector(state => state.Auth.sessionUserData);
  const roles = AuthData?.roles;
  const country = AuthData?.country;
  const history = useHistory();

  return (
    <div
      style={{
        justifyContent: "space-between",
        boxShadow: "0px 4px 16px rgba(89, 85, 84, 0.15)",
        position: "absolute",
        top: '0',
        left: '0',
        backgroundColor: countryConfig[country].primaryColor,
      }}
      className="flex align-items-center shadow-xl h-24 py-3 pl-4 pr-8 w-full"
    >
      <img src={blackLogo} alt="logo" />
      <div className="self-center flex justify-between w-8/12">
        <div
          className="font-customGilroy"
          style={{
            fontStyle: "italic",
            fontWeight: "bold",
            color: countryConfig[country].textColor,
            fontSize: 20,
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          {actionText}
        </div>
        <div
          style={{ display: "inline-flex", justifyContent: "space-between" }}
        >
          <div
            className="border border-white bg-white text-center font-semibold mr-4 rounded p-3 w-40"
            style={{
              fontSize: 16,
              cursor: "pointer",
            }}
            onClick={() => {
              history.goBack();
            }}
          >
            {backText}
          </div>
          {roles === "Mini-Admin" ? (
            <button
              className="rounded p-3 w-40 text-center font-semibold"
              style={{
                backgroundColor: "#BEBEBE",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Continue
            </button>
          ) : <div
            className="rounded p-3 w-40 text-center font-semibold"
            style={{
              backgroundColor: countryConfig[country].unsavedButtonColor,
              color: countryConfig[country].unsavedButtonTextColor,
              fontSize: 16,
              cursor: "pointer",
            }}
            onClick={onClickForward}
          >
            {forwardText}
          </div>}
        </div>
      </div>
    </div>
  )
}

export default UnsavedReceiveNewStock