import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FIcon from "../../assets/FIcon.png";
import SIcon from "../../assets/SIcon.png";
import TIcon from "../../assets/TIcon.png";
import FthIcon from "../../assets/FthIcon.png";
import { useParams } from "react-router-dom";
import countries from "i18n-iso-countries";
import enLocate from "i18n-iso-countries/langs/en.json";
import itLocate from "i18n-iso-countries/langs/it.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
countries.registerLocale(enLocate);
countries.registerLocale(itLocate);

function Category() {
  const countryObj = countries.getNames("en", { select: "official" });
  const countryArr = Object.entries(countryObj).map(([key, value]) => {
    return {
      label: value,
      value: key,
    };
  });

  const [name, setName] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDisability, setSelectedDisability] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const selectedCountryHandler = (value) => {
    setSelectedCountry(value);
  };

  const { id } = useParams();
  const type = id.split("-").join(" ");
  const [algorithm, setAlgorithm] = React.useState("");
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState("");

  let formData = {
    full_name: "",
    home_address: "",
    zip_code: "",
    phone_number: "",
    country: "",
    monthly_income: "",
    date_of_birth: "",
    marital_status: "",
    email: "",
    disability: "",
    occupation: "",
    category: "",
  };

  useEffect(() => {
    setAlgorithm(id);
  }, [id]);

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      name &&
      homeAddress &&
      zipCode &&
      email &&
      phone &&
      date &&
      income &&
      occupation &&
      selectedCountry &&
      selectedDisability &&
      selectedStatus
    ) {
      formData = {
        ...formData,
        full_name: name,
        home_address: homeAddress,
        zip_code: zipCode,
        phone_number: phone,
        country: selectedCountry,
        monthly_income: income,
        date_of_birth: date,
        marital_status: selectedStatus,
        email: email,
        disability: selectedDisability,
        occupation: occupation,
        category: id,
      };
      toast.success("Form Submitted Successfully");
      console.log(formData);
    } else {
      toast.error("Please Fill All Fields");
    }

    setName(" ");
    setZipCode(" ");
    setHomeAddress(" ");
    setSelectedCountry(" ");
    setPhone(" ");
    setDate(" ");
    setEmail(" ");
    setOccupation(" ");
    setIncome(" ");
    setSelectedStatus(" ");
    setSelectedDisability(" ");
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center m-auto  ">
        <div className="flex flex-col items-center justify-center w-full m-auto  ">
          <div className=" bg-[#F4F0F8] h-[348px] w-full ">
            <div className="flex flex-col lg:p-14 md:p-14 p-14  gap-4  items-center ">
              <h1 className="font-bold text-[30px] text-center lg:text-[48px] md:text-[40px] lg:leading-[64px] md:leading-[48px] leading-[40px] tracking-[-2px] text-[#232536] capitalize  ">
                {type} Lottery
              </h1>
              <p className="text-[#6D6E76] lg:w-[515px] text-center font-normal text-[12px] lg:text-[16px] md:text-[16px]  leading-[28px]  ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore.
              </p>
              <p className="text-[#232536] lg:w-[515px] uppercase text-center font-normal text-[12px] lg:text-[16px] md:text-[16px]  leading-[28px]  ">
                Apply {">"} {type} Lottery
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex  flex-col lg:p-10 md:p-10 p-2  mt-8 mb-14 lg:flex-row items-center md:flex-col lg:items-start gap-8 m-auto justify-center">
          <div className=" flex flex-col gap-8 ">
            <h2 className=" lg:text-[36px] text-[24px] pt-6 lg:w-[500px] lg:leading-[48px]  leading-[30px] md:text-[30px] md:leading-[30px] font-bold  text-[#232536]  tracking-[-2px] ">
              Fill the form below to enter for a{" "}
              <span className="capitalize">{type}</span> Lottery
            </h2>
            <form
              className="lg:w-[500px] pb-6 lg:pl-6 pl-0 pr-0 "
              onSubmit={handleFormSubmit}
            >
              <div className="form-group mb-4">
                <input
                  required
                  type="text"
                  className="form-control
        block
        w-full
        px-3
        py-4
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group mb-4">
                <input
                  required
                  type="text"
                  className="form-control
        block
        w-full
        px-3
        py-4
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Home Address"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                />
              </div>

              <div className="form-group mb-4 flex flex-col lg:flex-row gap-4 w-full ">
                <input
                  required
                  type="number"
                  className="form-control
        block
        w-full
        px-3
        py-4
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="exampleInputEmail2"
                  placeholder="Zip Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />

                <FormControl sx={{ width: "100%" }}>
                  <InputLabel className="  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none   text-gray-700 ">
                    Select Country
                  </InputLabel>
                  <Select
                    required
                    className=" 
                       w-full
                       font-normal
                       transition
                       ease-in-out
                       text-gray-700
                       bg-white bg-clip-padding
                       focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                       rounded
                    
                       m-0
                     "
                    value={selectedCountry}
                    onChange={(e) => {
                      selectedCountryHandler(e.target.value);
                    }}
                    label="Query Related"
                  >
                    {!!countryArr?.length &&
                      countryArr.map(({ label, value }) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>

              <div className="form-group mb-4 flex flex-col lg:flex-row gap-4 w-full ">
                <input
                  required
                  type="number"
                  className="form-control
                  block
                  w-full
                  px-3
                  py-4
                  text-base
                  font-normal
                  text-gray-700
                  bg-white bg-clip-padding
                  border border-solid border-gray-300
                  rounded
                  transition
                  ease-in-out
                  m-0
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="exampleInputEmail2"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  type="date"
                  required
                  className="form-control
        block
        w-full
        px-3
        py-4
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Select a date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="form-group mb-4 flex flex-col lg:flex-row gap-4 w-full ">
                <input
                  required
                  type="email"
                  className="form-control
                  block
                  w-full
                  px-3
                  py-4
                  text-base
                  font-normal
                  text-gray-700
                  bg-white bg-clip-padding
                  border border-solid border-gray-300
                  rounded
                  transition
                  ease-in-out
                  m-0
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="text"
                  required
                  className="form-control
        block
        w-full
        px-3
        py-4
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Occupation"
                  value={occupation}
                  onChange={(e) => {
                    setOccupation(e.target.value);
                  }}
                />
              </div>

              <div className="form-group mb-4 flex flex-col lg:flex-row gap-4 w-full ">
                <input
                  type="number"
                  required
                  className="form-control
                  block
                  w-full
                  h-[60px]
                  px-3
                  py-4
                  text-base
                  font-normal
                  text-gray-700
                  bg-white bg-clip-padding
                  border border-solid border-gray-300
                  rounded
                  transition
                  ease-in-out
                  m-0
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="exampleInputEmail2"
                  placeholder="Monthly Income"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
                <div
                  className="flex flex-col gap-2 
                 w-full
                  px-3
                  "
                >
                  <label htmlFor="occupation">Marital Status</label>
                  <div className="flex flex-col">
                    {" "}
                    <div className="flex flex-row justify-between w-[200px] ">
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="w-6 h-6 rounded-full"
                            value={selectedStatus}
                            checked={selectedStatus === "single"}
                            onChange={() => {
                              setSelectedStatus("single");
                            }}
                          />
                          <span className="ml-2">Single</span>
                        </label>
                      </div>

                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="w-6 h-6 rounded-full"
                            value={selectedStatus}
                            checked={selectedStatus === "married"}
                            onChange={() => {
                              setSelectedStatus("married");
                            }}
                          />
                          <span className="ml-2">Married</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between w-[212px]">
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="w-6 h-6 rounded-full"
                            value={selectedStatus}
                            checked={selectedStatus === "divorced"}
                            onChange={() => {
                              setSelectedStatus("divorced");
                            }}
                          />
                          <span class="ml-2">Divorced</span>
                        </label>
                      </div>

                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="w-6 h-6 rounded-full"
                            value={selectedStatus}
                            checked={selectedStatus === "widowed"}
                            onChange={() => {
                              setSelectedStatus("widowed");
                            }}
                          />
                          <span className="ml-2">Widowed</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group mb-4">
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel className="  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none   text-gray-700 ">
                    Disability
                  </InputLabel>
                  <Select
                    required
                    className=" 
                       w-full
                       font-normal
                       transition
                       ease-in-out
                       text-gray-700
                       bg-white bg-clip-padding
                       focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                       rounded
                    
                       m-0
                     "
                    value={selectedDisability}
                    onChange={(e) => {
                      setSelectedDisability(e.target.value);
                    }}
                    label="Disability"
                  >
                    <MenuItem value={"none"}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"deaf"}>
                      <em>Deaf</em>
                    </MenuItem>
                    <MenuItem value={"others"}>
                      <em>Others</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <button
                type="submit"
                className="
      w-full
      px-6
      py-4
      bg-[#50C0FF]
      text-[#232536]
      lg:text-[24px]
      text-[18px]
      leading-[32px]
      capitalize
      font-normal
      rounded
      shadow-md
      hover:bg-blue-400 hover:shadow-lg
      focus:bg-blue-400 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-300 active:shadow-lg
      transition
      duration-150
      ease-in-out"
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="flex flex-col gap-6 lg:gap-8  mt-6 ">
            <h2 className=" lg:text-[36px] text-[24px] text-center lg:text-start lg:leading-[48px]  leading-[30px] md:text-[30px] md:leading-[30px] font-bold  text-[#232536] tracking-[-2px] ">
              Categories
            </h2>

            <div className="flex flex-col gap-4">
              <a
                href="/category/business"
                className={`flex flex-row lg:items-start py-[14px] px-[20px] lg:gap-4 gap-2 md:gap-4 border border-solid ${
                  algorithm === "business" && "bg-[#50C0FF]"
                } hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76]rounded-sm  `}
              >
                <div
                  className={`w-[48px] h-[48px] ${
                    isActive ? "bg-transparent" : "bg-[#FBF6EA]"
                  }  flex rounded `}
                >
                  <img
                    src={FIcon}
                    alt="FIcon"
                    className="w-[48px] h-[48px] align-middle m-auto flex  "
                  />
                </div>
                <h2 className="text-[#232536] font-bold lg:text-[28px] text-[20px] md:text-[24px] leading-[40px] tracking-[-1px] ">
                  Business Lottery
                </h2>
              </a>

              <a
                href="/category/education"
                className={`flex flex-row lg:items-start py-[14px] px-[20px] lg:gap-4 gap-2 md:gap-4 border border-solid ${
                  algorithm === "education" && "bg-[#50C0FF]"
                } hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76]rounded-sm  `}
              >
                <div
                  className={`w-[48px] h-[48px] ${
                    isActive ? "bg-transparent" : "bg-[#FBF6EA]"
                  }  flex rounded `}
                >
                  <img
                    src={SIcon}
                    alt="SIcon"
                    className="w-[23px] h-[23px] align-middle m-auto flex  "
                  />
                </div>
                <h2 className="text-[#232536] font-bold lg:text-[28px] text-[20px] md:text-[24px] leading-[40px] tracking-[-1px] ">
                  Education Lottery
                </h2>
              </a>

              <a
                href="/category/real-estate"
                className={`flex flex-row lg:items-start py-[14px] px-[20px] lg:gap-4 gap-2 md:gap-4 border border-solid ${
                  algorithm === "real-estate" && "bg-[#50C0FF]"
                } hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76]rounded-sm  `}
              >
                <div
                  className={`w-[48px] h-[48px] ${
                    isActive ? "bg-transparent" : "bg-[#FBF6EA]"
                  }  flex rounded `}
                >
                  <img
                    src={TIcon}
                    alt="FthIcon"
                    className="w-[48px] h-[48px] align-middle m-auto flex  "
                  />
                </div>
                <h2 className="text-[#232536] font-bold lg:text-[28px] text-[20px] md:text-[24px] leading-[40px] tracking-[-1px] ">
                  Real Estate Lottery
                </h2>
              </a>

              <a
                href="/category/technology"
                className={`flex flex-row lg:items-start py-[14px] px-[20px] lg:gap-4 gap-2 md:gap-4 border border-solid ${
                  algorithm === "technology" && "bg-[#50C0FF]"
                } hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76]rounded-sm  `}
              >
                <div
                  className={`w-[48px] h-[48px] ${
                    isActive ? "bg-transparent" : "bg-[#FBF6EA]"
                  }  flex rounded `}
                >
                  <img
                    src={FthIcon}
                    alt="FthIcon"
                    className="w-[48px] h-[48px] align-middle m-auto flex  "
                  />
                </div>
                <h2 className="text-[#232536] font-bold lg:text-[28px] text-[20px] md:text-[24px] leading-[40px] tracking-[-1px] ">
                  Technology Lottery
                </h2>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Category;
