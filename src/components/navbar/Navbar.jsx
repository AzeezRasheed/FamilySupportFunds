import React, { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import NavbarItems from "./NavbarItems";

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
        <div className="flex items-center justify-between py-0 pt-2 md:py-5 md:block">
          <a href="/">
            <div className="flex flex-col gap-1 ">
              <h1 className="text-[20px] leading-[20px] font-bold flex  font-inter  text-white text-left ">
                Family Support
              </h1>
              <h1 className="text-[20px] leading-[20px] font-bold flex  font-inter  text-white text-left ">
                Funds
              </h1>
            </div>
          </a>
        </div>
      </LogoContainer>

      <NavbarItems />
    </NavbarContainer>
  );
}

export default Navbar;
