const formatPrice = (price, symbol) => {
  return (`${symbol}${Number(price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`);
};

export const formatPriceByCountrySymbol = (country, price) => {
  const symbol = getCountrySymbol(country);
  return formatPrice(price, symbol)
}

export const getCountrySymbol = (country) => {
  let symbol = '₦'
  switch (country) {
    case "Nigeria":
      symbol = symbol;
      break;

    case "Uganda":
      symbol = "UGX";
      break;

    case "Ghana":
      symbol = "GH₵";
      break;

    case "Zambia":
      symbol = "ZK";
      break;

    case "Mozambique":
      symbol = "MT";
      break;

    case "South Africa":
      symbol = "R";
      break;
      
    case "Tanzania":
      symbol = "TSH";
      break;
    default:
      symbol = symbol;
      break;
  }

  return symbol;
}

export const formatPriceWithoutCurrency = (price) => {
  if (typeof price === 'string' && Number(price) > 1000) {  // '1501.'
    if (price[price.length - 1] === '.') {
      const p = price.slice(0, -1);
      const strP = Number(p).toLocaleString('en', { minimumFractionDigits: 2 }) + '.';
      return strP.replace(/\d(?=(\d{3})+\.)/g, "$&,");
    }
     return parseFloat(price).toLocaleString('en', { minimumFractionDigits: 2 }).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
  return price.toLocaleString('en', { minimumFractionDigits: 2 }).replace(/\d(?=(\d{3})+\.)/g, "$&,");
 
}
