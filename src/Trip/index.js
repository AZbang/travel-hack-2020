import React, { useEffect, useState } from "react";
import * as ReactLeaflet from "react-leaflet";
import styled, { css, keyframes } from "styled-components";

import L from "leaflet";
import { withRouter } from "react-router-dom";

import data from "../data.json";
import useQuery from "../useQuery";
import { Header, HeaderTitle } from "../ui/header";
import { bounceIn, bounceOut } from "../ui/animations";
import { getSaved } from "../profile.js";

const { Map: LeafletMap, TileLayer, Marker, Popup } = ReactLeaflet;

const Card = styled.div`
  border-radius: 10px 10px 0 0;
  background: #fff;
  z-index: 10000;
  box-shadow: 0 -1px 13px 1px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  padding: 18px;
`;

const CardTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.17px;
  color: #731982;
  margin: 0;
`;

const ChallengesList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Challenge = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  border-bottom: solid 2px rgba(0, 0, 0, 0.1);
  padding-bottom: 15px;
`;

const ChallengeIcon = styled.div`
  width: 72px;
  height: 72px;
  margin-right: 20px;
  position: relative;

  img {
    width: 72px;
    height: 72px;
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

const ChallengeContent = styled.div`
  h1 {
    font-size: 21px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 0.95;
    letter-spacing: -0.34px;
    color: #731982;
    margin: 0;
    margin-bottom: 5px;
  }
  p {
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 0.9;
    letter-spacing: -0.16px;
    color: #3a3a3a;
    margin: 0;
  }
`;

const CompleteCard = styled.div`
  position: fixed;
  left: 50%;
  top: 150px;
  margin-left: -40%;
  position: fixed;
  z-index: 10000;
  width: 80%;
  border-radius: 9px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  text-align: center;
  padding: 80px 0 50px;

  h1 {
    font-size: 36px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.22px;
    color: #731982;
  }

  p {
    font-size: 21px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.13px;
    text-align: center;
    color: #3a3a3a;
  }

  span {
    color: #00b956;
  }
`;

const CustomMarker = ({ icon, position }) => {
  const Icon = new L.Icon({
    iconUrl: icon,
    iconRetinaUrl: icon,
    iconAnchor: [32, 32],
    iconSize: [64, 64]
  });

  return <Marker icon={Icon} position={position} />;
};

const Trip = ({ history }) => {
  const { id } = useQuery();
  const [showComplete, setShowComplete] = useState(window.completeChallenge);
  const trip = data[id] || {};

  useEffect(() => {
    if (!window.completeChallenge) return;
    let timer = null;
    const animateController = () => {
      window.completeChallenge = null;
      const card = document.getElementById("complete");
      card.style.display = "block";
      card.classList.add("animated", "bounceIn");
      timer = setTimeout(() => {
        document.body.style.overflow = "";
        card.classList.remove("bounceIn");
        card.classList.add("bounceOut");
        card.addEventListener("animationend", () => {
          card.style.display = "none";
        });
      }, 2000);
    };

    document.addEventListener("resume", animateController, false);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.ymaps.ready(() => {
      var myMap = new window.ymaps.Map("map", {
        center: [trip.lat || 0, trip.lng || 0],
        zoom: trip.zoom,
        controls: []
      });

      trip.challenges.forEach(({ icon, lat = 0, lng = 0 }, challange) => {
        const mark = new window.ymaps.Placemark(
          [lat, lng],
          {},
          {
            iconLayout: "default#image",
            iconImageHref: icon,
            iconImageSize: [64, 64],
            iconImageOffset: [-32, -32]
          }
        );
        mark.events.add("click", () => {
          history.push(`/challenge?trip=${id}&challenge=${challange}`);
        });

        myMap.geoObjects.add(mark);
      });
    });
  }, []);

  return (
    <>
      <Header fixed={true}>
        <HeaderTitle>{trip.name}</HeaderTitle>
      </Header>
      <CompleteCard
        id="complete"
        style={{ display: "none" }}
        show={!!showComplete}
      >
        <img src="check.svg" />
        <h1>Отлично!</h1>
        <p>
          <span>{showComplete && trip.challenges[showComplete].bonus} ₽</span>{" "}
          за {showComplete && trip.challenges[showComplete].name} зачислены на
          ваш счет.
        </p>
      </CompleteCard>
      <div id="map" style={{ width: "100vw", height: "70vh" }}></div>
      <Card>
        <CardTitle>Челленджи</CardTitle>
        {trip.challenges &&
          trip.challenges.map(({ icon, name, description }, challange) => (
            <Challenge key={challange}>
              <ChallengeIcon complete={!!getSaved(id, challange)}>
                <img src={icon} alt={name} />
              </ChallengeIcon>
              <ChallengeContent>
                <h1>{name}</h1>
                <p>{description}</p>
              </ChallengeContent>
            </Challenge>
          ))}
      </Card>
    </>
  );
};

export default withRouter(Trip);
