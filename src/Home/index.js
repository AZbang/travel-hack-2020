import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

import { Header, HeaderTitle } from "../ui/header";

import data from "../data.json";
import {
  profile,
  getSaved,
  getProgress,
  totalBonus,
  currentBonus
} from "../profile";

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
  margin-top: 6px;
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
  margin-top: 10px;
  margin-bottom: 5px;
`;

const ChellengesList = styled.div`
  width: calc(100% + 30px);
  margin-left: -15px;
  display: flex;
  overflow-x: auto;
`;

const ChellengeIcon = styled.div`
  width: 84px;
  height: 84px;
  margin: 0 5px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  ${({ complete }) =>
    complete &&
    css`
      &:before {
        content: "";
        position: absolute;
        left: 100%;
        width: 20px;
        height: 20px;
        margin: 4px -30px;
        background-color: #731a82;
        border-radius: 50%;
      }
    `}
`;

const ProgressLine = styled.div`
  height: 3.5px;
  border-radius: 1.8px;
  background-color: #e4e4e4;
  width: 100%;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    background-color: #00b956;
    height: 3.5px;
    transition: 0.5s all;
    width: ${({ progress }) => `calc(100% * ${progress / 100})`};
  }
`;

const Home = ({ history }) => {
  return (
    <section>
      <Header>
        <HeaderTitle>Кешбэк</HeaderTitle>
      </Header>
      <Profile>
        <UserName>{profile.name}</UserName>
        <Balance>Заработано: {profile.balance} ₽</Balance>
      </Profile>
      <TravelList>
        {data.map(({ name, challenges }, id) => (
          <TravelCard key={id}>
            <ChellengesList>
              {challenges.map(({ icon }, challenge) => (
                <ChellengeIcon
                  key={challenge}
                  complete={!!getSaved(id, challenge)}
                  onClick={() => {
                    history.push(`/trip?id=${id}`);
                    history.push(
                      `/challenge?trip=${id}&challenge=${challenge}`
                    );
                  }}
                >
                  <img src={icon} />
                </ChellengeIcon>
              ))}
            </ChellengesList>
            <Link to={`/trip?id=${id}`}>
              <TravelCardTitle>{name}</TravelCardTitle>
              <ProgressLine progress={getProgress(id)} />
              <TravelCardBonus>
                {currentBonus(id)} ₽ / {totalBonus(id)} ₽
              </TravelCardBonus>
            </Link>
          </TravelCard>
        ))}
      </TravelList>
    </section>
  );
};

export default withRouter(Home);
