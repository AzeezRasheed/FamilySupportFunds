export const customerTypeBasedOnCountry = (country, customerData, setCustomerData,tab, setTab, borderActive) => {
	let customerType;
	switch (country) {
		case "Nigeria":
			customerType = (
				<>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex pt-6 w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Bulkbreaker")
								setCustomerData("Bulkbreaker");
							}}
							data-toggle="tab"
							href="#link1"
							role="tablist"
						>
							<p
								className={
									"flex font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Bulkbreaker"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Bulkbreaker" ? borderActive : "" }}

							>
								Bulkbreaker
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Poc")
								setCustomerData("Poc");
							}}
							data-toggle="tab"
							href="#link1"
							role="tablist"
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Poc"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Poc" ? borderActive : "" }}

							>
								Pocs
							</p>
						</a>
					</li>
				</>
			);
			break;
		case "Uganda":
			customerType = (
				<>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Reseller")
								setCustomerData("Reseller");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Reseller"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Reseller" ? borderActive : "" }}

							>
								Reseller
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex pt-6 w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Mainstream")
								setCustomerData("Mainstream");
							}}
						>
							<p
								className={
									"flex font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Mainstream"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Mainstream" ? borderActive : "" }}

							>
								Mainstream
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("High End")
								setCustomerData("High End");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "High End"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "High End" ? borderActive : "" }}

							>
								High End
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Low End")
								setCustomerData("Low End");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Low End"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Low End" ? borderActive : "" }}

							>
								Low End
							</p>
						</a>
					</li>
				</>
			);
			break;
		case "Tanzania":
			customerType = (
				<>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Stockist")
								setCustomerData("Stockist");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Stockist"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Stockist" ? borderActive : "" }}

							>
								Stockist
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex pt-6 w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Mainstream")
								setCustomerData("Mainstream");
							}}
						>
							<p
								className={
									"flex font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Mainstream"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Mainstream" ? borderActive : "" }}

							>
								Mainstream
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("High End")
								setCustomerData("High End");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "High End"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "High End" ? borderActive : "" }}

							>
								High End
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Low End")
								setCustomerData("Low End");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Low End"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Low End" ? borderActive : "" }}

							>
								Low End
							</p>
						</a>
					</li>
				</>
			);
			break;
		case "Ghana":
			customerType = (
				<>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Reseller")
								setCustomerData("Reseller");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Reseller"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Reseller" ? borderActive : "" }}

							>
								Reseller
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex pt-6 w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Mainstream")
								setCustomerData("Mainstream");
							}}
						>
							<p
								className={
									"flex font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Mainstream"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Mainstream" ? borderActive : "" }}

							>
								Mainstream
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("High End")
								setCustomerData("High End");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "High End"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "High End" ? borderActive : "" }}

							>
								High End
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Low End")
								setCustomerData("Low End");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Low End"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Low End" ? borderActive : "" }}

							>
								Low End
							</p>
						</a>
					</li>
				</>
			);
			break;
		case "Mozambique":
			customerType = (
				<>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Stockist")
								setCustomerData("Stockist");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Stockist"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Stockist" ? borderActive : "" }}

							>
								Stockist
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex pt-6 w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Mainstream")
								setCustomerData("Mainstream");
							}}
						>
							<p
								className={
									"flex font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Mainstream"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Mainstream" ? borderActive : "" }}

							>
								Mainstream
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("High End")
								setCustomerData("High End");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "High End"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "High End" ? borderActive : "" }}

							>
								High End
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Low End")
								setCustomerData("Low End");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Low End"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Low End" ? borderActive : "" }}

							>
								Low End
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Reseller")
								setCustomerData("Reseller");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Reseller"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Reseller" ? borderActive : "" }}

							>
								Reseller
							</p>
						</a>
					</li>
				</>
			);
			break;
			case "Zambia":
			customerType = (
				<>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex pt-6 w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Mainstream")
								setCustomerData("Mainstream");
							}}
						>
							<p
								className={
									"flex font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Mainstream"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Mainstream" ? borderActive : "" }}

							>
								Mainstream
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("High End")
								setCustomerData("High End");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "High End"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "High End" ? borderActive : "" }}

							>
								High End
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Low End")
								setCustomerData("Low End");
							}}
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Low End"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Low End" ? borderActive : "" }}

							>
								Low End
							</p>
						</a>
					</li>
				</>
			);
			break;
		case "South Africa":
			customerType = (
				<>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex pt-6 w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Bulkbreaker")
								setCustomerData("Bulkbreaker");
							}}
							data-toggle="tab"
							href="#link1"
							role="tablist"
						>
							<p
								className={
									"flex font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Bulkbreaker"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Bulkbreaker" ? borderActive : "" }}

							>
								Bulkbreaker
							</p>
						</a>
					</li>
					<li className="flex cursor-pointer px-3">
						<a
							className="flex w-full"
							onClick={(e) => {
								e.preventDefault();
								setTab("Poc")
								setCustomerData("Poc");
							}}
							data-toggle="tab"
							href="#link1"
							role="tablist"
						>
							<p
								className={
									"flex pt-6 font-customGilroy text-base font-normal cursor-pointer" +
									(tab === "Poc"
										? "text-active border-b-4 rounded"
										: "text-default")
								}
								style={{ borderColor: tab === "Poc" ? borderActive : "" }}

							>
								Pocs
							</p>
						</a>
					</li>
				</>
			);
			break;
		default:
			break;
	}
	return customerType;
};

export const showCustomerBasedOnCountry = (country) => {
	let myOptions = "";
	switch (country) {
		case "Nigeria":
			myOptions = (
				<>
					<option value="Bulkbreaker">Bulkbreaker</option>
					<option value="Poc">Poc</option>
				</>
			);
			break;
		case "South Africa":
			myOptions = (
				<>
					<option value="Bulkbreaker">Bulkbreaker</option>
					<option value="Poc">Poc</option>
				</>
			);
			break;
		case "Uganda":
			myOptions = (
				<>
					<option value="Reseller">Reseller</option>
					<option value="Mainstream">Mainstream</option>
					<option value="High End">High End</option>
					<option value="Low End">Low End</option>
				</>
			);
			break;
		case "Tanzania":
			myOptions = (
				<>
					<option value="Stockist">Stockist</option>
					<option value="Mainstream">Mainstream</option>
					<option value="High End">High End</option>
					<option value="Low End">Low End</option>
				</>
			);
			break;
		case "Mozambique":
			myOptions = (
				<>
					<option value="Stockist">Stockist</option>
					<option value="Mainstream">Mainstream</option>
					<option value="High End">High End</option>
					<option value="Low End">Low End</option>
					<option value="Reseller">Reseller</option>
				</>
			);
			break;
		case "Ghana":
			myOptions = (
				<>
					<option value="Reseller">Reseller</option>
					<option value="Mainstream">Mainstream</option>
					<option value="High End">High End</option>
					<option value="Low End">Low End</option>
				</>
			);
			break;
		case "Zambia":
			myOptions = (
				<>
					<option value="Mainstream">Mainstream</option>
					<option value="High End">High End</option>
					<option value="Low End">Low End</option>
				</>
			);
				break;
		default:
			myOptions = (
				<>
					<option value="Bulkbreaker">Bulkbreaker</option>
					<option value="Poc">Poc</option>
				</>
			);
			break;
	}
	return myOptions;
};

const regionBasedOnCountry = (country) => {
	switch (country) {
		case "Nigeria":
			<>
			<option value="Lagos And West 1">
			Lagos &amp; West 1
			</option>
			<option value="North And West 2">
				North &amp; West 2
			</option>
			<option value="South East">South East</option>
		</>
			break;
		case "Ghana":
		
			break;
		case "Mozambique":
		
			break;
		case "Tanzania":
			
			break;
		case "Uganda":
		
			break;
		case "South Africa":
	
			break;
		default:
			break;
	}
}