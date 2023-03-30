import React, { useState } from "react";
import { Link } from 'react-router-dom'
import backIcon from "../../../assets/svg/back.svg"
import passwordKey from "../../../assets/svg/key.svg";

const ResetPassword = ({ title, children }) => {
	
	const [passwordShown, setPasswordShown] = useState(false);
	const togglePasswordVisiblity = () => {
		setPasswordShown(passwordShown ? false : true);
	};

	return (
		<div className="h-screen w-screen flex overflow-hidden">
			<div className="hidden md:block h-full" style={{ width: '36rem', backgroundColor: '#B11F24' }}>
				<img className='' alt=''/>
				<div className='flex my-44'>
					<img className='text-center mx-5' alt=''  src={passwordKey}/>
					<p className="mt-16 font-bold font-customGilroy pt-3 pb-2" style={{ fontSize: '50px', color: '#FFFFFF' }}>Reset your Password</p>
				</div>
			</div>
			<div className="h-100" style={{ width: '78rem' }}>
				<div className="flex m-7">
					<Link to= '/login'>
						<img alt='' src={backIcon} />
					</Link>
					<p className="text-base font-normal ml-2" style={{ color: '##74767E', fontSize: '18px'}}> Back </p>
				</div>
				<div className="mt-4 md:mt-32 mx-6 md:mx-44 px-0">
					<p className="font-bold font-customGilroy pt-3 pb-2" style={{ fontSize: '20px', color: '#2D2F39' }}>
						{title}
					</p>
					<div>
						{ children(title, passwordShown, { togglePasswordVisiblity })}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
