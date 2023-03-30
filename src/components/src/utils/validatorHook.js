import { useState, useEffect } from "react";

export const usePasswordValidation = ({

  userPassword = "",
  userConfirmPassword = "",
  requiredLength = 12,

}) => {
  const [validLength, setValidLength] = useState(null);
  const [hasNumber, setHasNumber] = useState(null);
  const [upperCase, setUpperCase] = useState(null);
  const [lowerCase, setLowerCase] = useState(null);
  const [specialChar, setSpecialChar] = useState(null);
  const [confirmPassword, checkConfirmPassword] = useState(null);


  useEffect(() => {

    setValidLength(userPassword.length >= requiredLength ? true : false);
    setUpperCase(userPassword.toLowerCase() !== userPassword);
    setLowerCase(userPassword.toUpperCase() !== userPassword);
    setHasNumber(/\d/.test(userPassword));
    checkConfirmPassword((userPassword !== 'undefine' && userConfirmPassword !== 'undefined') && (userPassword !== userConfirmPassword))
    // eslint-disable-next-line
    setSpecialChar(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(userPassword));

  }, [userPassword, userConfirmPassword, requiredLength]);



  return [validLength, hasNumber, upperCase, lowerCase, specialChar, confirmPassword];
};