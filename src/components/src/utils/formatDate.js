export const formatDateMonthOrDayToTwoDigit = (digit) => {
  if (digit/10 < 1) {
    return '0' + digit;
  } 
  return digit;
}
