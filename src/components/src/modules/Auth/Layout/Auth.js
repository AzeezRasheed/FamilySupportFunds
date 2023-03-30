import React, { useState, useEffect } from "react";
import countryConfig from "../../../utils/changesConfig.json";
import { getLocation } from "../../../utils/getUserLocation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import userManager from "../../../utils/userManager";
import AuthSidebar from "../../../components/common/AuthSidebar";
import backgroundImage from "../../../assets/svg/Background.svg";
import { useTranslation } from "react-i18next";


const { REACT_APP_BASE_URL } = process.env;
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

const Auth = ({ title, label, buttonText }) => {
  const { t } = useTranslation();
  const onLoginButtonClick = async (e) => {
    e.preventDefault();
    userManager.signinRedirect();
  };
  // const AuthData = JSON.parse(localStorage.getItem('userData'));

  const [country, setCountry] = useState("Ghana");

  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country]);

  return (
    <>
      <div className="h-screen w-screen flex overflow-hidden">
        <div className="hidden md:block h-full" style={{ width: "30rem" }}>
          <AuthSidebar />
        </div>
        <div className="h-100 w-100 relative flex flex-col items-center justify-between welcome-div">
          {/* {label !== 'Email Address' && <div onClick={() => goBack()} className='mt-10 ml-6 flex flex-row text-lg font-medium cursor-pointer ' >
						<Back />
						<span className='ml-2 ' style={{ color: '#74767E', marginTop: '-1px' }}>Back</span>
					</div>} */}
          <div className="mt-4 md:mt-32 mx-6 md:mx-44 px-0 flex flex-col justify-center items-center flex-none">
            <p
              className="text-black-400 font-normal font-customGilroy pt-3 pb-2"
              style={{ fontSize: "48px", color: "#2D2F39" }}
            >
              {title}
            </p>
            <div>
              <form>
                <div className="pt-4 pb-8 mb-4 flex flex-col items-center">
                  {/* <div className={`${buttonText === 'Login' ? 'flex justify-between' : 'text-center md:text-right lg:text-right'}`} */}
                  <p
                    className="text-lg pb-3 font-normal font-customGilroy"
                    style={{ color: "#4D4D4D" }}
                  >
                    {t("welcome_btn_text")}
                  </p>
                  <div className="text-center " style={{ width: "36.625rem" }}>
                    {/* <Link
											to='/forgot-password'
											className"inline-block align-baseline mt-5 underline text-base font-normal font-customRoboto" style={{ color: '#45130F' }}
											href=""
										>

										</Link> */}

                    <button
                      className="w-full md:w-56 lg:w-56 my-5 py-3 focus:outline-none rounded text-center text-base font-bold font-customRoboto"
                      style={{
                        backgroundColor: countryConfig[country].buttonColor,
                        color: countryConfig[country].textColor,
                      }}
                      type="button"
                      onClick={(e) => onLoginButtonClick(e)}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </form>
            </div>
           
          </div>
          {/* <div className="w-full">
            <img src={backgroundImage} alt="background" className="w-full h-full "/>
          </div> */}

        </div>
      </div>
    </>
  );
};

export default Auth;
