import React from "react";
import { Route, Routes } from "react-router";
import About from "./pages/about/About";
import Category from "./pages/category/Category";
import Contact from "./pages/contact/Contact";
import Home from "./pages/home/Home";
import Policy from "./pages/policy/Policy";
import "./index.css";
import { ToastContainer } from "react-toastify";
import Donate from "./pages/donate/Donate";
// import WinnersList from "./pages/winnersList/WinnersList";
function App() {
  return (
    <>
    <ToastContainer 
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    
    />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/category" element={<Category />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/donate" element={<Donate />} />
      </Routes>
    </>
  );
}

export default App;
