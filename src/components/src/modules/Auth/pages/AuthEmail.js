import React, { useEffect, useState} from "react";
import AuthLayout from '../Layout/Auth';
import countryConfig from '../../../utils/changesConfig.json'
import { getLocation } from '../../../utils/getUserLocation'

const Login = () => {

  const [country, setCountry] = useState('Ghana');

	const getLanguage = (country) => {
		let text = `Welcome to ${countryConfig[country].erpName}`
		switch (country) {
			case "Mozambique":
				text = `Bem-vindo ao ${countryConfig[country].erpName}`
				break;
			default:
				text = text
				break;
		}
		return text
	}

  useEffect(async () => {
    const loc = await getLocation();
    setCountry(loc);
  }, [country])

	return (
		<div>
			<AuthLayout
				title={getLanguage(country)}
				// label='Email Address'
				buttonText='Continue'
			/>
		</div>
	)
}

export default Login;