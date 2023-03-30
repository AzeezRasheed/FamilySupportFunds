import React, { useState } from "react";
import ResetLayout from "../Layout/ResetPassword";
import Loader from "react-loader-spinner";
import { forgetPassword } from "../actions/auth.action";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const ForgotPassword = () => {
  const histroy = useHistory();

  const [email, setEmail] = useState("");

  const onChange = (e) => setEmail(e.target.value);

  const dispatch = useDispatch();
  const { fetchingForgotPass, forgotPassMsg } = useSelector(
    (state) => state.Auth
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgetPassword(email));
  };

  React.useEffect(() => {
    if (forgotPassMsg !== null && forgotPassMsg !== "Email not found!") {
      histroy.push("/reset-success-email");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgotPassMsg]);

  return (
    <div>
      <ResetLayout title="Enter your staff email address to continue">
        {() => {
          return (
            <form>
              <div className="pt-6 pb-8 mt-5 mb-4 flex flex-col">
                <div className="mb-14 field" style={{ width: "36.625rem" }}>
                  <label
                    className="block text-dmsGray text-base font-medium font-customRoboto mb-2"
                    for="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="py-5 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange border-2 rounded w-full py-2 px-3 text-black-400"
                    id="email"
                    type="text"
                    placeholder={t("type_here")}
                    value={email}
                    name="email"
                    onChange={(e) => onChange(e)}
                  />
                </div>
              </div>
              <div
                className="flex justify-between text-right"
                style={{ width: "36.625rem" }}
              >
                <div />
                {/* <Link to='/reset-success-email' > */}
                <button
                  className={
                    email === ""
                      ? "w - full md:w-56 lg:w-56 my-3 py-3 outline-none rounded text-white text-center text-base font-bold font-customRoboto opacity-50 pointer-events-none"
                      : "w-full md:w-56 lg:w-56 my-3 py-3 outline-none rounded text-white text-center text-base font-bold font-customRoboto"
                  }
                  style={{ backgroundColor: "#B11F24" }}
                  onClick={(e) => handleForgotPassword(e)}
                >
                  {fetchingForgotPass ? (
                    <div className=" flex justify-center">
                      <Loader type="Bars" color="#FFF" height={16} width={16} />
                    </div>
                  ) : (
                    "Continue"
                  )}
                </button>
                {/* </Link> */}
              </div>
            </form>
          );
        }}
      </ResetLayout>
    </div>
  );
};

export default ForgotPassword;
