import React, { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import NavbarItems from "./NavbarItems";
import Logo from "../../assets/{FSF.svg";

// top-0 z-30 w-full py-0 px-4 lg:py-4 md:py-2
// justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8 pb-4 md:pb-0 lg:pb-0
const NavbarContainer = styled.div`
  min-height: 68px;
  ${tw`
w-full
flex
flex-row
items-center
lg:pl-8
lg:pr-8
justify-between
bg-[#232536] 
shadow-xl
pl-4
pr-4
pt-1
pb-1
`}
`;
const LogoContainer = styled.div``;
function Navbar() {
  return (
    <NavbarContainer>
      <LogoContainer>
        <a href="/" className="flex items-center justify-between   ">
         <img src={Logo} alt="Family Support Funds" className=" w-[4rem] h-[4rem] " />
        </a>
      </LogoContainer>

      <NavbarItems />
    </NavbarContainer>
  );
}

export default Navbar;
