import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FIcon from "../../assets/FIcon.png";
import SIcon from "../../assets/SIcon.png";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dataForCategory from "./dataForCategory";
import { State } from "country-state-city";
import emailjs from "emailjs-com";
import { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import styled from "styled-components";
import tw from "twin.macro";

const Container = styled.div`
  ${tw`

`}
`;

const HeroSectionContainer = styled.div`
  ${tw`
flex
flex-col
justify-center
m-auto
`}
`;

const HeroSection = styled.div`
  ${tw`
flex
flex-col
justify-center
m-auto
`}
`;

const HeroSectionTitle = styled.h2`
  ${tw`
font-bold
text-[30px]
text-center
font-inter
lg:text-[48px]
md:text-[40px]
lg:leading-[64px]
md:leading-[48px]
leading-[40px]
tracking-[-2px]
text-white
capitalize
`}
`;

const HeroSectionDescription = styled.p`
  ${tw`
text-gray-300
font-inter
lg:w-[515px]
text-center
font-light
text-[12px]
lg:text-[16px]
md:text-[16px]
leading-[28px]
`}
`;

const HeroSectionParagraph = styled.p`
  ${tw`
font-inter
text-orange-500
lg:w-[515px]
uppercase
text-center
font-bold
text-[12px]
lg:text-[16px]
md:text-[16px]
leading-[28px]

`}
`;

const BottomItems = styled.div`
  ${tw`
flex
flex-col-reverse
lg:p-10
md:p-10
p-2
mt-8
mb-14
lg:flex-row
items-center
lg:items-start
gap-8
m-auto
justify-center

`}
`;

const LeftItems = styled.div`
  ${tw`
flex
flex-col
gap-8

`}
`;

const RightItems = styled.div`
  ${tw`
flex
flex-col
gap-6
lg:gap-8
mt-6

`}
`;

const LeftItemTitle = styled.h2`
  ${tw`
lg:text-[36px]
font-inter
text-[24px]
pt-6
lg:w-[500px]
lg:leading-[48px]
leading-[30px]
md:text-[30px]
md:leading-[30px]
font-bold
text-[#232536]
tracking-[-2px] 

`}
`;

const LeftItemFormContainer = styled.div`
  ${tw`
mb-4
`}
`;

const LeftItemsButton = styled.button`
  ${tw`
  font-inter
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
  ease-in-out
`}
`;

const LeftItemInput = styled.input`
  ${tw`
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
  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
`}
`;

const RightItemTitle = styled.h2`
  ${tw`
  lg:text-[36px]
  text-[24px]
  font-inter
  text-center
  lg:text-start
  lg:leading-[48px]
  leading-[30px]
  md:text-[30px]
  md:leading-[30px]
  font-bold
  text-[#232536]
  tracking-[-2px]

`}
`;

const RightItemButton = styled.div`
  ${tw`
  flex
  flex-row
  w-full
  justify-between
  gap-2
`}
`;

const RightItemUl = styled.ul`
  ${tw`
  flex
  flex-col
  list-disc
  font-inter
  pl-4
  gap-2
  m-auto
  items-center
  text-start
`}
`;

const RightItemLi = styled.li`
  ${tw`
  text-[14px]
  font-normal
  leading-[28px]
`}
`;

function Category() {
  const { id } = useParams();
  const type = id.split("-").join(" ");
  const [algorithm, setAlgorithm] = React.useState("");
  const [isActive, setIsActive] = useState(false);

  const [businessActive, setBusinessActive] = useState(false);
  const [educationActive, setEducationActive] = useState(false);
  const [realEstateActive, setRealEstateActive] = useState(false);
  const [personalActive, setPersonalActive] = useState(false);

  useEffect(() => {
    if (id === "personal") {
      setPersonalActive(true);
    } else if (id === "business") {
      setBusinessActive(true);
    } else if (id === "education") {
      setEducationActive(true);
    } else if (id === "real-estate") {
      setRealEstateActive(true);
    }
  }, [id]);

  const form = useRef();
  const data = dataForCategory;
  const countryCode = "US";
  const stateArr = State.getStatesOfCountry(countryCode).map((state) => ({
    label: state.name,
    value: state.id,
    ...state,
  }));

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDisability, setSelectedDisability] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const selectedStateHandler = (value) => {
    setSelectedState(value);
  };

  let formData = {
    first_name: "",
    last_name: "",
    home_address: "",
    zip_code: "",
    phone_number: "",
    state: "",
    city: "",
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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      firstName &&
      lastName &&
      homeAddress &&
      zipCode &&
      email &&
      phone &&
      date &&
      income &&
      occupation &&
      selectedState &&
      selectedCity &&
      selectedDisability &&
      selectedStatus
    ) {
      formData = {
        ...formData,
        first_name: firstName,
        last_name: lastName,
        home_address: homeAddress,
        zip_code: zipCode,
        phone_number: phone,
        state: selectedState,
        city: selectedCity,
        monthly_income: income,
        date_of_birth: date,
        marital_status: selectedStatus,
        email: email,
        disability: selectedDisability,
        occupation: occupation,
        category: id,
      };

      emailjs
        .send(
          "service_p102o41",
          "template_63aks7n",
          formData,
          "Zi06-R-MsyzuIaHca"
        )
        .then(
          (result) => {
            console.log(result.text);
            toast.success("Form Submitted Successfully");
          },
          (error) => {
            console.log(error.text);
          }
        );

      setFirstName(" ");
      setLastName(" ");
      setZipCode(" ");
      setHomeAddress(" ");
      setSelectedState(" ");
      setSelectedCity(" ");
      setPhone(" ");
      setDate(" ");
      setEmail(" ");
      setOccupation(" ");
      setIncome(" ");
      setSelectedStatus(" ");
      setSelectedDisability(" ");

      e.target.reset();
      console.log(formData);
    } else {
      toast.error("Please Fill All Fields");
    }
  };

  return (
    <Container>
      <Navbar />
      <HeroSectionContainer>
        <HeroSection className="flex flex-col items-center justify-center w-full h-full m-auto ">
          <div
            className={` ${type === "business" && "bg-business"}  ${
              type === "personal" && "bg-personal"
            } ${type === "education" && "bg-education"}  ${
              type === "real estate" && "bg-realestate"
            }    w-full  lg:h-[450px]  bg-cover object-cover    bg-center`}
          >
            <div className="bg-gray-800 opacity-70 w-full h-full">
              <div className="flex flex-col pt-30 md:pt-30 lg:pt-30 lg:p-14 md:p-14 p-14  gap-4  items-center ">
                <HeroSectionTitle className="font-bold text-[30px] text-center font-inter lg:text-[48px] md:text-[40px] lg:leading-[64px] md:leading-[48px] leading-[40px] tracking-[-2px] text-white capitalize  ">
                  {type} Support
                </HeroSectionTitle>
                {type === "personal" && (
                  <HeroSectionDescription>
                    {data.personal}
                  </HeroSectionDescription>
                )}
                {type === "business" && (
                  <HeroSectionDescription>
                    {data.business}
                  </HeroSectionDescription>
                )}{" "}
                {type === "education" && (
                  <HeroSectionDescription>
                    {data.education}
                  </HeroSectionDescription>
                )}{" "}
                {type === "real estate" && (
                  <HeroSectionDescription>
                    {data.housing}
                  </HeroSectionDescription>
                )}
                <HeroSectionParagraph>
                  Apply {">"} {type} Support
                </HeroSectionParagraph>
              </div>
            </div>
          </div>
        </HeroSection>
      </HeroSectionContainer>

      <div>
        <BottomItems>
          <LeftItems>
            <LeftItemTitle>
              Fill the form below to enter for a{" "}
              <span className="capitalize">{type}</span> Support
            </LeftItemTitle>
            <form
              className="lg:w-[500px] pb-6 lg:pl-6 pl-0 pr-0 "
              onSubmit={handleFormSubmit}
              ref={form}
            >
              <LeftItemFormContainer>
                <LeftItemInput
                  required
                  type="text"
                  className=""
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  name="firstName"
                />
              </LeftItemFormContainer>

              <LeftItemFormContainer>
                <LeftItemInput
                  required
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  name="lastName"
                />
              </LeftItemFormContainer>

              <LeftItemFormContainer>
                <LeftItemInput
                  required
                  type="text"
                  placeholder="Street Address"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  name="homeAddress"
                />
              </LeftItemFormContainer>

              <LeftItemFormContainer>
                <LeftItemInput
                  required
                  type="number"
                  placeholder="Zip Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  name="zipCode"
                />
              </LeftItemFormContainer>

              <div className="form-group mb-4 flex flex-col lg:flex-row gap-4 w-full ">
                <LeftItemInput
                  required
                  type="text"
                  placeholder="City"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  name="city"
                />

                <FormControl sx={{ width: "100%" }}>
                  <InputLabel className="  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none   text-gray-700 ">
                    Select State
                  </InputLabel>
                  <Select
                    required
                    className=" w-full font-normal transition ease-in-out text-gray-700 bg-white bg-clip-paddingfocus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none rounded m-0"
                    value={selectedState}
                    name="state"
                    onChange={(e) => {
                      selectedStateHandler(e.target.value);
                    }}
                    label="Select State"
                  >
                    {stateArr?.length &&
                      stateArr.map(({ label, value }) => (
                        <MenuItem key={value} value={label}>
                          {label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>

              <div className="form-group mb-4 flex flex-col lg:flex-row gap-4 w-full ">
                <LeftItemInput
                  required
                  type="number"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  name="phoneNumber"
                />

                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <DatePicker
                    className=" block w-full px-3 py-4 font-normal text-gray-700 bg-white  rounded m-0 focus:text-gray-700 focus:bg-white border-none focus:outline-none"
                    label="Your Date Of Birth"
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue.$d);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    name="dateOfBirth"
                  />
                </LocalizationProvider>
              </div>

              <div className="form-group mb-4 flex flex-col lg:flex-row gap-4 w-full ">
                <LeftItemInput
                  required
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                />
                <LeftItemInput
                  type="text"
                  required
                  placeholder="Occupation"
                  value={occupation}
                  onChange={(e) => {
                    setOccupation(e.target.value);
                  }}
                  name="occupation"
                />
              </div>

              <div className="form-group mb-4 flex flex-col lg:flex-row gap-4 w-full ">
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel className="  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none   text-gray-700 ">
                    Monthly Income
                  </InputLabel>
                  <Select
                    required
                    className=" w-full font-normal transition ease-in-outtext-gray-700 bg-white bg-clip-padding focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none rounded m-0"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    name="monthlyIncome"
                    label="Monthly Income"
                  >
                    <MenuItem value={"$100 - $1,000"}>
                      <em>$100 - $1,000</em>
                    </MenuItem>
                    <MenuItem value={"$1,000 - $5,000"}>
                      <em>$1,000 - $5,000</em>
                    </MenuItem>
                    <MenuItem value={"$5,000 - $20,000"}>
                      <em>$5,000 - $20,000</em>
                    </MenuItem>
                    <MenuItem value={"$20,000 - $50,000"}>
                      <em>$20,000 - $50,000</em>
                    </MenuItem>
                    <MenuItem value={"$100,000 or More…"}>
                      <em>$100,000 or More…</em>
                    </MenuItem>
                  </Select>
                </FormControl>

                <div className="flex flex-col gap-2 w-full px-3">
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
                            name="maritalStatus"
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
                            name="maritalStatus"
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
                            name="maritalStatus"
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
                            name="maritalStatus"
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
                    className=" w-full font-normal transition  ease-in-out  text-gray-700 bg-white bg-clip-padding focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none rounded m-0 "
                    value={selectedDisability}
                    onChange={(e) => {
                      setSelectedDisability(e.target.value);
                    }}
                    label="Disability"
                    name="disability"
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
              <LeftItemsButton type="submit">Send Message</LeftItemsButton>
            </form>
          </LeftItems>

          <RightItems>
            <RightItemTitle>Categories</RightItemTitle>

            <div className="flex flex-col gap-4">
              <div className="flex flex-row lg:flex-col gap-4">
                <RightItemButton>
                  <a
                    href="/category/business"
                    className={` lg:items-start w-[130px] py-[14px] px-[6px] lg:px-[20px] md:px-[20px] md:w-[310px] lg:w-full  border border-solid ${
                      algorithm === "business" && "bg-[#50C0FF]"
                    } rounded-lg hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76]rounded-sm  `}
                  >
                    <div className="flex flex-col gap-2 mt-2 ">
                      <div className="flex">
                        <div className="text-white font-bold">
                          <div className=" flex lg:flex-row  md:flex-row flex-col gap-3 justify-between lg:gap-6 md:gap-6  ">
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
                            <h2 className="text-[#232536] font-inter font-bold lg:text-[28px]  text-[15px] leading:[20px] md:text-[22px] lg:leading-[40px] md:leading:[35px]  tracking-[-1px] ">
                              Business Support
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    {businessActive && (
                      <div className="shadow-3xl hidden lg:block  rounded-2xl shadow-cyan-500/50 p-4 mb-6">
                        <RightItemUl>
                          <div>
                            <RightItemLi className="text-[14px] font-normal leading-[28px]  ">
                              Small Business Funding / Management
                            </RightItemLi>
                            <RightItemLi>
                              Start-up / Expansion Business Capital
                            </RightItemLi>
                            <RightItemLi>Home Business Support</RightItemLi>
                            <RightItemLi>
                              Women-Owned Business Funding
                            </RightItemLi>
                            <RightItemLi>Small Business Loans</RightItemLi>
                            <RightItemLi>
                              Minority-Owned Business Funding
                            </RightItemLi>
                            <RightItemLi>
                              Private Money / Venture Capital
                            </RightItemLi>
                          </div>
                        </RightItemUl>
                      </div>
                    )}
                  </a>
                </RightItemButton>

                <RightItemButton>
                  <a
                    href="/category/education"
                    className={` lg:items-start w-[130px] py-[14px] px-[6px] lg:px-[20px] md:px-[20px] md:w-[310px] lg:w-full border border-solid ${
                      algorithm === "education" && "bg-[#50C0FF]"
                    } rounded-lg hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76]rounded-sm  `}
                  >
                    <div className="flex flex-col gap-2 mt-2 ">
                      <div className="flex">
                        <div className="text-white font-bold">
                          <div className=" flex lg:flex-row  md:flex-row flex-col gap-3 justify-between lg:gap-6 md:gap-6  ">
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
                            <h2 className="text-[#232536] font-inter font-bold lg:text-[28px]  text-[15px] leading:[20px] md:text-[22px] lg:leading-[40px] md:leading:[35px]  tracking-[-1px] ">
                              Education Support
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    {educationActive && (
                      <div className="shadow-3xl hidden lg:block  rounded-2xl shadow-cyan-500/50 p-4 mb-6">
                        <RightItemUl>
                          <div>
                            <RightItemLi>Federal Pell Support</RightItemLi>
                            <RightItemLi>Scholarships</RightItemLi>
                            <RightItemLi>Training Support</RightItemLi>
                            <RightItemLi>Tuition Support</RightItemLi>
                            <RightItemLi>Support For Research</RightItemLi>
                            <RightItemLi>Stafford Loans</RightItemLi>
                            <RightItemLi>Support for Universities</RightItemLi>
                          </div>
                        </RightItemUl>
                      </div>
                    )}
                  </a>
                </RightItemButton>
              </div>

              <div className="flex flex-row lg:flex-col gap-4">
                <RightItemButton>
                  <a
                    href="/category/real-estate"
                    className={` lg:items-start w-[130px] py-[14px] px-[6px] lg:px-[20px] md:px-[20px] md:w-[310px] lg:w-full border border-solid ${
                      algorithm === "real-estate" && "bg-[#50C0FF]"
                    } rounded-lg hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76]rounded-sm  `}
                  >
                    <div className="flex flex-col gap-2 mt-2 ">
                      <div className="flex">
                        <div className="text-white font-bold">
                          <div className=" flex lg:flex-row  md:flex-row flex-col gap-3 justify-between lg:gap-6 md:gap-6  ">
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
                            <h2 className="text-[#232536] font-inter font-bold lg:text-[28px]   text-[15px] leading:[20px] md:text-[22px] lg:leading-[40px] md:leading:[35px]  tracking-[-1px] ">
                              Real Estate Support
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    {realEstateActive && (
                      <div className="shadow-3xl hidden lg:block  rounded-2xl shadow-cyan-500/50 p-4 mb-6">
                        <RightItemUl>
                          <div>
                            <RightItemLi>1st Time Home Buyer</RightItemLi>
                            <RightItemLi>Mobile Homes / Parks</RightItemLi>
                            <RightItemLi>Rental Housing Projects</RightItemLi>
                            <RightItemLi>Commerical Property</RightItemLi>
                            <RightItemLi>Apartment Buildings</RightItemLi>
                            <RightItemLi>Land Development</RightItemLi>
                            <RightItemLi>RV Parks</RightItemLi>
                            <RightItemLi>New Construction</RightItemLi>
                          </div>
                        </RightItemUl>
                      </div>
                    )}
                  </a>
                </RightItemButton>

                <RightItemButton>
                  <a
                    href="/category/personal"
                    className={` lg:items-start w-[130px] py-[14px] px-[6px] lg:px-[20px] md:px-[20px] md:w-[310px] lg:w-full border border-solid ${
                      algorithm === "personal" && "bg-[#50C0FF]"
                    } rounded-lg hover:bg-[#50C0FF] hover:transition hover:duration-300 hover:ease-in-out hover:border-none cursor-pointer border-[#6D6E76]rounded-sm  `}
                  >
                    <div className="flex flex-col gap-2 mt-2 ">
                      <div className="flex">
                        <div className="text-white font-bold">
                          <div className=" flex lg:flex-row  md:flex-row flex-col gap-3 justify-between lg:gap-6 md:gap-6  ">
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
                            <h2 className="text-[#232536] font-inter font-bold lg:text-[28px]   text-[15px] leading:[20px] md:text-[22px] lg:leading-[40px] md:leading:[35px]  tracking-[-1px] ">
                              Personal Support
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    {personalActive && (
                      <div className=" hidden lg:block shadow-3xl rounded-2xl shadow-cyan-500/50 p-4 mb-6">
                        <RightItemUl>
                          <div>
                            <RightItemLi>Home Repair</RightItemLi>
                            <RightItemLi>Rent Support</RightItemLi>
                            <RightItemLi>Child Care</RightItemLi>
                            <RightItemLi>Food and Nutrition</RightItemLi>
                            <RightItemLi>Medical Bills Support</RightItemLi>
                            <RightItemLi>Utility Bills Support</RightItemLi>
                            <RightItemLi>Education Support</RightItemLi>
                          </div>
                        </RightItemUl>
                      </div>
                    )}
                  </a>
                </RightItemButton>
              </div>
            </div>

            <div className=" p-6 shadow-lg lg:shadow-none bg-gray-200 lg:bg-transparent font-inter text-start md:m-auto md:text-center">
              <div className="block lg:hidden">
                {businessActive && (
                  <div className="shadow-3xl   rounded-2xl shadow-cyan-500/50 p-4 mb-6">
                    <RightItemUl>
                      <div>
                        <RightItemLi>
                          Small Business Funding / Management
                        </RightItemLi>
                        <RightItemLi>
                          Start-up / Expansion Business Capital
                        </RightItemLi>
                        <RightItemLi>Home Business Support</RightItemLi>
                        <RightItemLi>Women-Owned Business Funding</RightItemLi>
                        <RightItemLi>Small Business Loans</RightItemLi>
                        <RightItemLi>
                          Minority-Owned Business Funding
                        </RightItemLi>
                        <RightItemLi>
                          Private Money / Venture Capital
                        </RightItemLi>
                      </div>
                    </RightItemUl>
                  </div>
                )}
                {educationActive && (
                  <div className="shadow-3xl rounded-2xl shadow-cyan-500/50 p-4 mb-6">
                    <RightItemUl>
                      <div>
                        <RightItemLi className="text-[14px] font-normal leading-[28px]  ">
                          Federal Pell Support
                        </RightItemLi>
                        <RightItemLi>Scholarships</RightItemLi>
                        <RightItemLi>Student Financial Aid</RightItemLi>
                        <RightItemLi>Training Support</RightItemLi>
                        <RightItemLi>Tuition Support</RightItemLi>
                        <RightItemLi>Support For Research</RightItemLi>
                        <RightItemLi>Stafford Loans</RightItemLi>
                        <RightItemLi>Support for Universities</RightItemLi>
                      </div>
                    </RightItemUl>
                  </div>
                )}
                {realEstateActive && (
                  <div className="shadow-3xl  rounded-2xl shadow-cyan-500/50 p-4 mb-6">
                    <RightItemUl>
                      <div>
                        <RightItemLi>1st Time Home Buyer</RightItemLi>
                        <RightItemLi>Mobile Homes / Parks</RightItemLi>
                        <RightItemLi>Rental Housing Projects</RightItemLi>
                        <RightItemLi>Commerical Property</RightItemLi>
                        <RightItemLi>Apartment Buildings</RightItemLi>
                        <RightItemLi>Land Development</RightItemLi>
                        <RightItemLi>RV Parks</RightItemLi>
                        <RightItemLi>New Construction</RightItemLi>
                      </div>
                    </RightItemUl>
                  </div>
                )}
                {personalActive && (
                  <div className="  shadow-3xl rounded-2xl shadow-cyan-500/50 p-4 mb-6">
                    <RightItemUl>
                      <div>
                        <RightItemLi> Home Repair</RightItemLi>
                        <RightItemLi>Rent Support</RightItemLi>
                        <RightItemLi>Child Care</RightItemLi>
                        <RightItemLi>Food and Nutrition</RightItemLi>
                        <RightItemLi>Medical Bills Support</RightItemLi>
                        <RightItemLi>Utility Bills Support</RightItemLi>
                        <RightItemLi>Education Support</RightItemLi>
                      </div>
                    </RightItemUl>
                  </div>
                )}
              </div>
            </div>
          </RightItems>
        </BottomItems>
      </div>

      <Footer />
    </Container>
  );
}

export default Category;
