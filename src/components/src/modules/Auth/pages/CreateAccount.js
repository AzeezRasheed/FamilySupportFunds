import React from "react";
import AuthLayout from '../Layout/Auth'

const CreateAccount = () => {
	return (
		<div>
			<AuthLayout 
			title= 'Create your password'
			label= 'Password'
			buttonText='Create password'/>
		</div>
	)
}

export default CreateAccount