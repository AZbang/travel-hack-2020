import data from "./data.json";

const basicProfile = {
  name: "HBNSKY",
  balance: 0,
  trips: data.map(v => [])
};

export const profile =
  JSON.parse(localStorage.getItem("profile") || "null") || basicProfile;

export const completeChallenge = (trip, challenge, image, add) => {
  profile.trips[trip][challenge] = image;
  profile.balance += add;
  localStorage.setItem("profile", JSON.stringify(profile));
};

export const getProgress = trip => {
  return (
    (profile.trips[trip].filter(v => v).length / data[trip].challenges.length) *
    100
  );
};

export const totalBonus = trip =>
  data[trip].challenges.reduce((acc, { bonus }) => acc + bonus, 0);

export const currentBonus = trip =>
  data[trip].challenges.reduce((acc, { bonus }, i) => {
    if (profile.trips[trip][i]) return acc + bonus;
    return acc;
  }, 0);

export const getSaved = (trip, challenge) => profile.trips[trip][challenge];
