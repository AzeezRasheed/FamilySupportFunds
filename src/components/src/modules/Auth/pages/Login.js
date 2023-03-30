import React from "react";
import AuthLayout from '../Layout/Auth'

const Login = () => {
	return (
		<div>
			<AuthLayout 
			title= 'Enter your password'
			label= 'Password'
			buttonText='Login'/>
		</div>
	)
}

export default Login