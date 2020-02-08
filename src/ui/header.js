import styled from "styled-components";

export const Header = styled.header`
  position: ${({ fixed }) => fixed && "fixed"};
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-color: #00b956;
`;

export const HeaderTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.93;
  letter-spacing: -0.19px;
  text-align: center;
  color: #ffffff;
`;
