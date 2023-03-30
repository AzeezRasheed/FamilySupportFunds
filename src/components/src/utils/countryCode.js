export const countryCode = (country) => {
  let countryCode = "";

  switch (country) {
    case "Nigeria":
      countryCode = "NG";
      break;
    case "Uganda":
      countryCode = "UG";
      break;
    case "Tanzania":
      countryCode = "TZ";
      break;
    case "Ghana":
      countryCode = "GH";
      break;
    case "Mozambique":
      countryCode = "MZ";
      break;
    case "Zambia":
      countryCode = "ZM";
      break;
    case "South Africa":
      countryCode = "ZA";
      break;

    default:
      break;
  }
  return countryCode;
};
