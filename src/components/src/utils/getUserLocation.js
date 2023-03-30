import axios from "axios";
import jwtDecode from 'jwt-decode';

const getLocationBrowser = async () => {
  const countries = ['Ghana', 'Nigeria', 'South Africa', 'Uganda', 'Tanzania', 'Mozambique', 'Zambia']
  const response = await axios.get('https://ipapi.co/json/');
  return countries.includes(response.data.country_name) ? response.data.country_name : 'Nigeria';
}
export const getLocation = async () => {
  const token = localStorage.getItem("userData");
  let location = null;
  if(token) {
    const AuthData = jwtDecode(token);
    location = AuthData?.country
    
  } else {
    location = await getLocationBrowser() 
  }
  localStorage.setItem("countryCode", location)
  return location;
}