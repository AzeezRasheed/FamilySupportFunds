import React, { useEffect, useState } from "react";
import Background from "../../assets/images/background.png";
import countryConfig from '../../utils/changesConfig.json'
import { getLocation } from '../../utils/getUserLocation'
import { ReactComponent as KujaLogo } from "../../assets/svg/kuja-logo.svg"
import backgroundPic from "../../assets/svg/background-pic.svg"


const AuthSidebar = () => {
  const [country, setCountry] = useState('Ghana');
  const date = new Date()
  let year = date.getFullYear()


  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country])
  
  return (
    <div style={{ background: countryConfig[country].backgroundColor, height: "100vh" }}>
      <div>
      <img style={{padding: countryConfig[country].logo ? "5%" : "0%"}} src={countryConfig[country].logo} alt="" />
      </div>
      <div >
        <img src={countryConfig[country].backgroundLogo} alt="" />
      </div>
      <div style={styles.footer} className="">
        <div><center><span style={{ color: "white" }}>©{year}</span></center>
          <img src={countryConfig[country].abiLogo} alt="" />
        </div>
      </div>
    </div>
  );
};

export default AuthSidebar;

const styles = {
  container: {
    background: `url(${Background})`,

    height: "100%",
    paddingTop: 269,
    backgoundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  transparentOverlay: {
    background: "rgba(246, 248, 251, 0.8)",
    backdropFilter: "blur(8px)",
    alignSelf: "middle",
    padding: "29px 27px",


  },
  footer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10%",
    marginBottom: "0%",
  }
}
