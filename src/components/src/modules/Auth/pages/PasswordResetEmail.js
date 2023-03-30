import React from "react";
import ResetLayout from '../Layout/ResetPassword'
import { Link } from 'react-router-dom'

const PasswordResetEmail = () => {
	return (
		<div>
			<ResetLayout
				title='Check your Mailbox'
			>
				{() => {
					return (
						<div className='mt-3'>
							<p className="font-normal text-base" style={{ color: '#50525B' }}>
								We just sent you an email with a link to reset your password. Please click on the <br /> link to reset your password.
							</p>
							<p className="font-normal text-base my-10" style={{ color: '#50525B' }}>
								Remember your password? <Link to='/login' className="ml-1 font-bold" style={{ color: '#B11F24' }}> Login </Link>
							</p>
						</div>
					)
				}}
			</ResetLayout>
		</div>
	)
}

export default PasswordResetEmail;
