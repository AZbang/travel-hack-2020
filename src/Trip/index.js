import React from "react";
import * as ReactLeaflet from "react-leaflet";
import styled from "styled-components";

import L from "leaflet";
import { withRouter } from "react-router-dom";

import data from "../data.json";
import useQuery from "../useQuery";
import { Header, HeaderTitle } from "../ui/header";

const { Map: LeafletMap, TileLayer, Marker, Popup } = ReactLeaflet;

const Card = styled.div`
  border-radius: 10px 10px 0 0;
  background: #fff;
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 300px;
  z-index: 10000;
  border-radius: 10px;
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
  const trip = data[id];
  const position = [0, 0];

  return (
    <>
      <Header fixed={true}>
        <HeaderTitle>{trip.name}</HeaderTitle>
      </Header>
      <LeafletMap center={[trip.lat, trip.lng]} zoom={trip.zoom}>
        <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        {trip.challenges.map(({ icon }, challange) => {
          const Icon = new L.Icon({
            iconUrl: icon,
            iconRetinaUrl: icon,
            iconAnchor: [32, 32],
            iconSize: [64, 64]
          });

          return (
            <Marker
              onClick={() =>
                history.push(`/challenge?trip=${id}&challenge=${challange}`)
              }
              icon={Icon}
              key={challange}
              position={[trip.lat, trip.lng]}
            />
          );
        })}
      </LeafletMap>
      <Card>
        <CardTitle>Челленджи</CardTitle>
      </Card>
    </>
  );
};

export default withRouter(Trip);
