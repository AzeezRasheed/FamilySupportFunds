import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useRef } from "react";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Contact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_p102o41",
        "template_4idm26d",
        form.current,
        "Zi06-R-MsyzuIaHca"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
      toast.success("Message Sent Successfully");
    e.target.reset();
  };

  const [algorithm, setAlgorithm] = React.useState("");

  const handleChange = (event) => {
    setAlgorithm(event.target.value);
  };
  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:p-10 md:p-10 p-2 justify-center m-auto mt-8 mb-14 max-w-[768px] ">
        <div className="flex flex-col lg:p-14 md:p-14 p-0 pb-14  gap-4  items-center  ">
          <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-[#232536]  tracking-[3px] ">
            Contact us
          </h2>
          <h1 className="font-bold text-[30px] text-center lg:text-[48px] md:text-[40px] lg:leading-[64px] md:leading-[48px] leading-[40px] tracking-[-2px] text-[#232536]  ">
            Let’s Start a Conversation
          </h1>
          <p className="text-[#6D6E76] font-normal text-[12px] lg:text-[16px] md:text-[16px] text-center leading-[28px] lg:w-[768px] ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center ">
          <div className=" lg:h-[240px] h-full w-full   bg-[#175C0C] lg:p-4 lg:pt-6 lg:text-start md:text-center  p-6  gap-6 lg:gap-2 flex flex-col lg:flex-row ">
            <div className="flex flex-col gap-4">
              <p className="text-[#FFFFFF] opacity-60 font-normal text-[12px] lg:text-[16px] md:text-[16px]  leading-[28px] lg:w-[349px] ">
                Working hours
              </p>

              <div className="lg:w-[294px] text-center lg:text-start w-full border border-solid border-white opacity-10 h-0 "></div>

              <div className="flex flex-col gap-4">
                <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-white  tracking-[3px] ">
                  Monday To Friday
                </h2>
                <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-white  tracking-[3px] ">
                  9:00 AM to 8:00 PM
                </h2>
                <h2 className=" text-[16px] leading-[28px] font-normal  capitalize text-white opacity-60 tracking-[3px] ">
                  Our Support Team is available 24/7
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[#FFFFFF] opacity-60 font-normal text-[12px] lg:text-[16px] md:text-[16px]  leading-[28px] lg:w-[349px] ">
                Working hours
              </p>

              <div className="lg:w-[294px] text-center lg:text-start w-full border border-solid border-white opacity-10 h-0 "></div>

              <div className="flex flex-col gap-4">
                <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-white  tracking-[3px] ">
                  Monday To Friday
                </h2>
                <h2 className=" text-[16px] leading-[20px] font-semibold capitalize text-white  tracking-[3px] ">
                  9:00 AM to 8:00 PM
                </h2>
                <h2 className=" text-[16px] leading-[28px] font-normal  capitalize text-white opacity-60 tracking-[3px] ">
                  Our Support Team is available 24/7
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="block p-6 pl-0 pr-0 ">
          <form ref={form} onSubmit={sendEmail}>
            <div className="form-group mb-6">
              <input
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
                name="firstName"
                required
                placeholder="Your First Name"
              />
            </div>

            <div className="form-group mb-6">
              <input
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
                name="lastName"
                required
                placeholder="Your Last Name"
              />
            </div>
            <div className="form-group mb-6">
              <input
                type="email"
                className="form-control block
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
                name="email"
                required
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <textarea
                className="
        form-control
        block
        w-full
        px-3
        py-6
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
      "
                name="message"
                rows="7"
                placeholder="Your Message"
              ></textarea>
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
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
