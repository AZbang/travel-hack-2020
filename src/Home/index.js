import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import data from "../data.json";

const Header = styled.header`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-color: #00b956;
`;

const HeaderTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.93;
  letter-spacing: -0.19px;
  text-align: center;
  color: #ffffff;
`;

const Profile = styled.section`
  padding: 0 20px;
  border: solid 1px #dddddd;
  background-color: #ffffff;
  padding: 23px 25px;
`;

const UserName = styled.h1`
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.17px;
  color: #2b2b2b;
  margin: 0;
  margin-bottom: 8px;
`;

const Balance = styled.p`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.1px;
  color: #00b956;
  margin: 0;
`;

const TravelList = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 20px 13px;
`;

const TravelCard = styled.div`
  border-radius: 11px;
  box-shadow: 0 0 11px 0 rgba(0, 0, 0, 0.05);
  background-color: #fffffe;
  padding: 10px 17px;
  margin-bottom: 20px;
  a {
    text-decoration: none;
  }
`;

const TravelCardTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.17px;
  color: #00b956;
  margin: 0;
  margin-bottom: 10px;
`;

const TravelCardBonus = styled.p`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.1px;
  color: #474747;
  margin: 0;
  margin-bottom: 5px;
`;

const ChellengesList = styled.div`
  width: 100%;
  display: flex;
`;

const ChellengeIcon = styled.img`
  width: 84px;
  height: 84px;
  margin-right: 20px;
  display: block;
`;

const Home = () => {
  return (
    <section>
      <Header>
        <HeaderTitle>Кешбэк</HeaderTitle>
      </Header>
      <Profile>
        <UserName>Марина</UserName>
        <Balance>Заработано: 145345 руб</Balance>
      </Profile>
      <TravelList>
        {data.map(({ name, challenges }, id) => (
          <TravelCard key={id}>
            <ChellengesList>
              {challenges.map(({ icon }, challenge) => (
                <Link to={`/challenge/${id}/${challenge}`}>
                  <ChellengeIcon src={icon} />
                </Link>
              ))}
            </ChellengesList>
            <Link to={`/trip/${id}`}>
              <TravelCardTitle>{name}</TravelCardTitle>
            </Link>
            <TravelCardBonus>0 ₽ / 1500 ₽</TravelCardBonus>
          </TravelCard>
        ))}
      </TravelList>
    </section>
  );
};

export default Home;
