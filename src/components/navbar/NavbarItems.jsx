import React, { useState } from "react";
import tw from "twin.macro";
import { slide as Menu } from "react-burger-menu";
import { useMediaQuery } from "react-responsive";
import menuStyles from "./menuStyles";
import { SCREENS } from "../responsive/Screens";
import styled, { css } from "styled-components";

const Container = styled.div`
  ${tw`
flex
flex-wrap
items-center
list-none
gap-6

`}
`;

const ListContainer = styled.ul`
  ${tw`
flex
flex-col
md:flex-row
mt-0
items-center


md:space-x-8
md:text-sm
md:font-medium

`}
`;

const NavItems = styled.a`
  ${tw`
block
py-2
pl-3
pr-4
text-white
text-[16px]
leading-[28px]
md:hover:bg-transparent
md:hover:text-blue-700
md:p-0
md:dark:hover:text-blue-500
dark:hover:text-blue-50
`}

  ${({ menu }) => {
    menu &&
      css`
  text-white
  text-xl
  mb-3
  focus:text-white
  `;
  }}
`;

const ButtonMd = styled.a`
  ${tw`
flex
flex-row
items-start
py-[16px]
px-[48px]
gap-[12px]
bg-white
rounded-full


`}
`;

const ButtonSm = styled.a`
  ${tw`
flex
flex-row
items-start
py-[16px]
px-[16px]
gap-[12px]
bg-white
rounded-full


`}
`;
function NavbarItems() {
  const [navbar, setNavbar] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: SCREENS.sm });

  if (isMobile) {
    return (
      <Menu right styles={menuStyles}>
        <Container>
    
          <ListContainer>
            <li>
              <NavItems menu href="/">
                Home
              </NavItems>
            </li>

            <li>
              <NavItems menu href="/about">
                About Us
              </NavItems>
            </li>
            <li>
              <NavItems menu href="/donate">
                Donate
              </NavItems>
            </li>
          </ListContainer>
          <ButtonSm href="/category/business">
            <span className="text-[18px] font-bold flex items-center text-[#232536] leading-[24px]   ">
              Apply Now
            </span>
          </ButtonSm>
        </Container>
      </Menu>
    );
  }

  return (
    <Container>
      <ListContainer>
        <li>
          <NavItems href="/">Home</NavItems>
        </li>

        <li>
          <NavItems href="/about">About Us</NavItems>
        </li>
        <li>
          <NavItems href="/contact-us">Contact Us</NavItems>
        </li>
        <li className="block">
          <NavItems href="/donate">Donate</NavItems>
        </li>
      </ListContainer>
      <ButtonMd href="/category/business">
        <span className="text-[18px] font-bold flex items-center text-[#232536] leading-[24px]   ">
          Apply Now
        </span>
      </ButtonMd>
    </Container>
  );
}

export default NavbarItems;
