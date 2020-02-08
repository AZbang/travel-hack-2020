import React from "react";
import * as ReactLeaflet from "react-leaflet";
import L from "leaflet";

import data from "../data.json";
import useQuery from "../useQuery";
import { Header, HeaderTitle } from "../ui/header";

const { Map: LeafletMap, TileLayer, Marker, Popup } = ReactLeaflet;

const CustomMarker = ({ icon, position }) => {
  const Icon = new L.Icon({
    iconUrl: icon,
    iconRetinaUrl: icon,
    iconAnchor: [32, 32],
    iconSize: [64, 64]
  });

  return <Marker icon={Icon} position={position} />;
};

const Trip = () => {
  const { id } = useQuery();
  const trip = data[id];
  const position = [0, 0];

  return (
    <>
      <Header fixed>
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
              onClick={() => {}}
              icon={Icon}
              key={challange}
              position={[trip.lat, trip.lng]}
            />
          );
        })}
      </LeafletMap>
    </>
  );
};

export default Trip;
