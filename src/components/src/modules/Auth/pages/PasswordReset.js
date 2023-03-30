import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ResetLayout from "../Layout/ResetPassword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { usePasswordValidation } from "../../../utils/validatorHook";
import { ErrorMark, RedErrorMark, Mark } from "../../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { clearCheckEmailState, signup } from "../actions/auth.action";
import Loader from "react-loader-spinner";

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

const PasswordReset = () => {

	const [formData, setFormData] = useState({
		password: '',
		cpassword: ''
	});

	const { token } = useParams();

	const histroy = useHistory()

	const dispatch = useDispatch()

	const { signingUp, isAuthenticated, signingUpSucc } = useSelector(state => state.Auth);

	const [error, setError] = useState(false)
	const [user, setUser] = useState('')
	const [showBtn, setShowBtn] = useState(false);

	const { password, cpassword } = formData
	const [
		validLength,
		hasNumber,
		upperCase,
		lowerCase,
		specialChar,
		confirmPassword
	] = usePasswordValidation({
		userPassword: password,
		userConfirmPassword: cpassword
	});



	React.useEffect(() => {
		try {

      console.log(token, 'Token....')
      if (token) {
        const decoded = jwt_decode(token);
        setUser(decoded)
      } else {
        setError(true)
      }
		} catch (err) {
			console.log('====================================');
			console.log(err);
			console.log('====================================');
			setError(true)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	React.useEffect(() => {

		if (validLength && hasNumber && upperCase && lowerCase && specialChar && password !== '' && !confirmPassword) {
			setShowBtn(true)
		} else {
			setShowBtn(false)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validLength, hasNumber, upperCase, lowerCase, specialChar, password, !confirmPassword]);


	React.useEffect(() => {
		if (signingUpSucc) {
			histroy.push('/admin/overview')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [signingUpSucc]);

	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });


	const userEmail = localStorage.getItem('userEmail');

	React.useEffect(() => {
		if (error || (user && user?.email.toLowerCase() !== userEmail && userEmail?.toLowerCase())) {
			dispatch(clearCheckEmailState())
			histroy.push('/')
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error, user, userEmail, user?.email]);

	if (!userEmail) {
		histroy.push('/')
	}


	const handleResetPassword = (e) => {
		e.preventDefault()
		console.log('====================================');
		
		console.log('====================================');
		dispatch(signup(user && user?.email, password))
	}
	return (
		<div>
			<ResetLayout
				title='Create a new password'
			>
				{(_, passwordShown, { togglePasswordVisiblity }) => {
					return (
						<form>
							<div className="pt-6 pb-8 mb-4 flex flex-col">
								<div className="mb-14 field" style={{ width: '36.625rem' }}>
									<label
										className="block text-dmsGray text-base font-medium font-customRoboto mb-2"
										for="password"
									>
										Enter new password
									</label>
									<input
										className="py-4 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange border-2 rounded w-full py-2 px-3 text-black-400"
										id="password"
										type={passwordShown ? "text" : "password"}
										name='password'
										onChange={(e) => onChange(e)}
										placeholder="Type here"
									/>
									<i id='password' onClick={togglePasswordVisiblity}>{passwordShown ? eyeSlash : eye}</i>
									{password !== '' &&
										<ul>

											<li className='flex justify-start flex-row mt-3'>
												{upperCase && lowerCase ? <span className='flex'><Mark /> <span className='text-dmsGray text-base font-medium leading-4 ml-1 mb-1 mb-1'>Upper and lowercase letters</span> </span> :
													<span style={{ color: '#D82C0D', display: 'flex' }}><ErrorMark /><span style={{ color: '#D82C0D' }} className='text-base font-medium leading-4 ml-1 mb-1'>Upper and lowercase letters</span> </span>}
											</li>

											<li className='flex justify-start flex-row'>
												{hasNumber ? <span className='flex'><Mark /> <span className='text-dmsGray text-base font-medium leading-4 ml-1 mb-1'>Contains a number</span> </span> :
													<span style={{ color: '#D82C0D', display: 'flex' }}><ErrorMark /><span style={{ color: '#D82C0D' }} className='text-base font-medium leading-4 ml-1 mb-1'>Contains a number</span> </span>}
											</li>
											<li className='flex justify-start flex-row'>
												{specialChar ? <span className='flex'><Mark /> <span className='text-dmsGray text-base font-medium leading-4 ml-1 mb-1'>Contains a symbol</span> </span> :
													<span style={{ color: '#D82C0D', display: 'flex' }}><ErrorMark /><span style={{ color: '#D82C0D' }} className='text-base font-medium leading-4 ml-1 mb-1'>Contains a symbol</span> </span>}
											</li>
											<li className='flex justify-start flex-row'>
												{validLength ? <span className='flex'><Mark /> <span className='text-dmsGray text-base font-medium leading-4 ml-1 mb-1'>12 or more characters</span> </span> :
													<span style={{ color: '#D82C0D', display: 'flex' }}><ErrorMark /><span style={{ color: '#D82C0D' }} className='text-base font-medium leading-4 ml-1 mb-1'>12 or more characters</span> </span>}
											</li>
										</ul>

									}
								</div>
								<div className="mb-4 field" style={{ width: '36.625rem' }}>
									<label
										className="block text-dmsGray text-base font-medium font-customRoboto mb-2"
										for="cpassword"
									>
										Confirm new password
									</label>
									<input
										className="py-4 DEFAULT:border-default appearance-none focus:outline-none focus:border-orange border-2 w-full rounded py-2 px-3 text-black-400"
										id="cpassword"
										name="cpassword"
										type={passwordShown ? "text" : "password"}
										onChange={(e) => onChange(e)}
										placeholder="Type here"
									/>
									<i id="cpassword" onClick={togglePasswordVisiblity}>{passwordShown ? eyeSlash : eye}</i>
									{cpassword !== '' &&
										<ul>
											<li className='flex justify-start flex-row mt-3'>
												{confirmPassword && <span style={{ color: '#D82C0D', display: 'flex' }}><RedErrorMark /><span style={{ color: '#D82C0D' }} className='text-base font-medium leading-4 ml-1 mb-1'>Passwords don't match</span> </span>}
											</li>
										</ul>
									}
								</div>
							</div>
							<div className='flex justify-between text-right' style={{ width: '36.625rem' }}>
								<div />
								<button className={!showBtn ? "w-full md:w-56 lg:w-56 my-3 py-3 outline-none rounded text-white opacity-50 pointer-events-none" : "w-full md:w-56 lg:w-56 my-3 py-3 outline-none rounded text-white text-center text-base font-bold font-customRoboto"} style={{ backgroundColor: '#B11F24' }} onClick={(e) => handleResetPassword(e)} >
									{signingUp ? <div className=' flex justify-center'><Loader type="Bars" color="#FFF" height={16} width={16} /></div> : 'Create Password'}

								</button>
							</div>
						</form>
					)
				}}
			</ResetLayout>
		</div>
	)
}

export default PasswordReset;
