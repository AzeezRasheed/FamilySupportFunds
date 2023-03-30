import React, { Fragment, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CloseModal } from "../../../assets/svg/modalIcons";
import csv from "../../../assets/svg/csv.svg";
import errorIcon from "../../../assets/svg/error_solid.svg";
import Loader from "../../../components/common/Loading";
import { useDispatch } from "react-redux";
import { uploadCSVCustomerList } from "../customer/actions/customer";
import { UploadFile } from "../../../assets/svg/modalIcons";
import { ToastProvider, useToasts } from "react-toast-notifications";

const UploadCSVModal = ({ showModal, setShowModal }) => {
	const cancelButtonRef = useRef(null);
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);
	const fileRef = useRef(null);
	const [file, setFile] = useState(null);
	const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
	const dispatch = useDispatch();
	const { addToast } = useToasts();

	const preventDefaults = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleHighlight = (shouldHighlight) => {
		return (e) => {
			preventDefaults(e);
			if (!dropZoneRef.current) return;
			if (shouldHighlight) {
				dropZoneRef.current.classList.add("highlight");
			} else {
				dropZoneRef.current.classList.remove("highlight");
			}
		};
	};

	const handleFile = (files) => {
		if (files.length) {
			fileRef.current = files[0];
			const { name, type } = fileRef.current;
			if (type !== "text/csv") return setError("Invalid file type");
			setError(null);
      setFile(name);
		}
	};

	const handleDrop = (e) => {
		handleHighlight(false)(e);
		preventDefaults(e);
		const dt = e.dataTransfer;
		const files = dt.files;
    handleFile(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleChange = (e) => {
		const files = e.target.files;
    handleFile(files);
    e.target.value = '';
	};

	const handleClear = () => {
		setFile(null);
    fileRef.current = null;
    if(fileInputRef.current) fileInputRef.current.value = ''
	};

	const handleUpload = () => {
		setLoading(true);
    dispatch(uploadCSVCustomerList(fileRef.current)).then((err) => {
      if (fileInputRef.current) fileInputRef.current.value = "";
			if(err.isError && err.reasons && err.reasons.length){
				err.reasons.forEach((item) => {
					addToast(item.message, {
						appearance: "error",
						autoDismiss: true,
						autoDismissTimeout: 5000,
					});
					setLoading(false);
				})
				return
			}
			if(err.isError && !err.reasons || err.isError && !err.reasons.length){
				addToast(err.message, {
					appearance: "error",
					autoDismiss: true,
					autoDismissTimeout: 5000,
				});
				setLoading(false);
			return
			}
      addToast("Uploaded successfully", {
				appearance: "success",
				autoDismiss: true,
				autoDismissTimeout: 3000,
      });
      setFile(null);
      fileRef.current = null;
      setError(null);
			setLoading(false);
		});
	};

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog
				as="div"
				className="fixed z-10 inset-0 overflow-y-auto"
				initialFocus={cancelButtonRef}
				onClose={setShowModal}
			>
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<label
						className="hidden sm:inline-block sm:align-middle sm:h-screen"
						aria-hidden="true"
					>
						&#8203;
					</label>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div
							style={{ width: "600px" }}
							className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle"
						>
							<div className="flex items-center justify-between py-3 pl-6 pr-3">
								<div className="font-customGilroy text-xl font-medium">
									Import customer by csv
								</div>
								<button
									className="close flex items-center justify-center"
									onClick={() => setShowModal(false)}
								>
									<CloseModal />
								</button>
							</div>
							<hr />
							<div className="p-6 text-sm font-customGilroy">
								<p className="font-medium">
									<a className="link" download href="/assets/docs/customers.csv">
										Download a sample csv
									</a>{" "}
									to see an example of the required format
								</p>

								<div
									ref={dropZoneRef}
									onDragOver={handleHighlight(true)}
									onDragLeave={handleHighlight(false)}
									onDrop={handleDrop}
									className="upload-area my-3 flex items-center justify-center"
								>
									<div className="flex flex-col items-center">
										<label
											for="csv-file"
											className=" flex item-center cursor-pointer bg-slate px-1 py-1 font-medium text-sm rounded-sm w-fit"
										>
											<UploadFile />
											<div className="flex items-center">Add file</div>
										</label>
										<input
											id="csv-file"
											className="hidden"
											type="file"
											accept="text/csv"
											onChange={handleChange}
											ref={fileInputRef}
										/>
										<span className=" mt-2 text-xs font-medium">
											Click or drop file here
										</span>
									</div>
								</div>
								{/* <div className="flex items-center">
									<input type="checkbox" />
									<label className="ml-2 text-sm text-slate-400 font-xs">
										Overite existing customer that have the same email of
										password
									</label>
								</div> */}
								{error && (
									<div className="mt-3">
										<div className="alert alert-danger flex items-center">
											<img src={errorIcon} />
											<div className="ml-2">{error}</div>
										</div>
									</div>
								)}
								{file && (
									<>
										<hr className="my-8" />
										<div className="my-3 flex items-center justify-between file-item px-3 py-2">
											<div className="flex items-center">
												<img src={csv} style={{ width: "20px" }} />
												<div className="ml-2">{file}</div>
											</div>
											<div className="close-item" onClick={handleClear}>
												&times;
											</div>
										</div>
									</>
								)}
							</div>
							<div className="border border-solid bg-gray-50 px-4 py-3 sm:px-6 sm:flex flex justify-end items-center gap-4">
								{loading && <Loader />}
								<button
									className="custom-button bg-opacity-30 rounded font-customGilroy text-white text-center text-sm font-bold not-italic px-14 py-2"
									onClick={handleUpload}
									disabled={!file}
								>
									Upload
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default UploadCSVModal;