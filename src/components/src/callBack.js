import React, { Component, useCallback, useEffect, useState } from "react";
import { CallbackComponent } from "redux-oidc";
import userManager from "./utils/userManager";
import Loading from "./components/common/Loading2";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector, connect } from "react-redux";
import axios from "axios";
import setAuthorization from "./utils/authorization";
import jwtDecode from "jwt-decode";
import { userNet } from "./utils/urls";
import {
  loadUser,
  loadUserDataSuccess,
  logoutUser,
} from "./modules/Auth/actions/auth.action";
import AuthSidebar from "./components/common/AuthSidebar";
import { useTranslation } from "react-i18next";

const checkRole = (role, history) => {
  //change all occurences role?.data?.data? => role
  console.log("role", role);
  const superVid = role?.id;
  const kpoStatus = role?.status;
  const kpoType = role?.roles !== "Admin" && JSON.parse(role?.DIST_Code);
  switch (role && role?.roles) {
    case null || undefined || "" || "[]":
      history.push("/auth/unassigned");
      break;
    case "KPO":
      if (kpoType === null) {
        return history.push("/auth/unassigned");
      } else if (kpoStatus === "Blocked") {
        return history.push("/auth/blocked");
      } else if (kpoType.length > 1 && kpoType.length !== 1) {
        return history.push(
          `/kpo-supervisor/overview/${kpoType[0]}/${superVid}`
        );
      } else {
        const kpoDistCode = JSON.parse(role?.DIST_Code);
        return history.push(`/dashboard/overview/${kpoDistCode}`);
      }
    case "Mini-Admin":
      if (kpoType === null) {
        return history.push("/auth/unassigned");
      } else if (kpoStatus === "Blocked") {
        return history.push("/auth/blocked");
      } else {
        return history.push("/min-admin-dashboard");
      }
    case "Admin":
      if (kpoStatus === "Blocked") {
        return history.push("/auth/blocked");
      } else {
        return history.push("/admin-dashboard");
      }
    default:
      history.push("/auth/unassigned");
      break;
  }
};

export const CallbackPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <CallbackComponent
      userManager={userManager}
      successCallback={async (user) => {
        dispatch(loadUser());
        try {
          const userApi = userNet()
          const newUser = await userApi.get(`fetchuser/${user.profile.emails[0]}`);
          let token = newUser?.data?.result;
          const currentUser = jwtDecode(token);         
          if (token && currentUser?.email) {
            setAuthorization(token);
            localStorage.setItem('userData', token);            

            dispatch(loadUserDataSuccess(currentUser))
            return checkRole(currentUser, history);
          }
        } catch (error) {
          if(error) {
            const userApi = userNet()
            return await userApi
              .post("register", { token: user.id_token })
              .then((response) => {
                
                let token = response?.data?.result;
                localStorage.setItem('userData', token);            
                const currentUser = jwtDecode(token); 
                dispatch(loadUserDataSuccess(currentUser))
                checkRole(currentUser, history);
              });
          }
          
          localStorage.removeItem("userData")
        }
      }}
      errorCallback={(error) => {
        console.error(error, 'Eror');
      }}
    >
      <div className="h-screen w-screen flex overflow-hidden">
        <div className="hidden md:block h-full" style={{ width: "30rem" }}>
          <AuthSidebar />
        </div>
        <div className="h-100" style={{ width: "78rem" }}>
          {/* {label !== 'Email Address' && <div onClick={() => goBack()} className='mt-10 ml-6 flex flex-row text-lg font-medium cursor-pointer ' >
						<Back />
						<span className='ml-2 ' style={{ color: '#74767E', marginTop: '-1px' }}>Back</span>
					</div>} */}
          <div className="mt-4 md:mt-32 mx-6 md:mx-44 px-0 flex flex-col text-center justify-center items-center">
            <p
              className="text-black-400 font-normal text-center font-customGilroy mt-20 pt-8 pb-2"
              style={{ fontSize: "30px", color: "#2D2F39" }}
            >
              {t("please_hole_while_we_take_you")}!
            </p>
            <div>
              <Loading />
              <Loading />
              <Loading />
            </div>
          </div>
        </div>
      </div>
    </CallbackComponent>
  );
};

export default connect()(CallbackPage);
