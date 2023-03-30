import { DistrictRegionData } from "./districtRegionData";

export const getDistricts = (country) => {
  const items = DistrictRegionData[country];
  return Object.keys(items);
};

export const getRegions = (country, district) => {
  const items = DistrictRegionData[country];
  return items[district];
};

export const setDefaultDistrict = (value) => {
  let defaultValue;
  switch (value) {
    case "Nigeria":
      defaultValue = "Lagos And West 1";
      break;
    case "Uganda":
      defaultValue = "West";
      break;
    case "Tanzania":
      defaultValue = "South";
      break;
    case "South Africa":
      defaultValue = "Cen-Vaal";
      break;
    case "Mozambique":
      defaultValue = "South";
      break;
    case "Zambia":
      defaultValue = "North";
      break;
    case "Ghana":
      defaultValue = "North";
      break;
    default:
      defaultValue = "";
      break;
  }
  return defaultValue;
};
