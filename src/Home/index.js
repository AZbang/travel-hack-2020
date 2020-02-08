import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import data from "../data.json";

const Header = styled.header`
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	font-weight: bold;
	font-size: 23px;
	color: #fff;
	background: green;
	font-family: "Graphik";
`;

const Profile = styled.section``;

const UserName = styled.h1``;

const Balance = styled.p``;

const TravelList = styled.section`
	background: #ccc;
	display: flex;
	justify-content: center;
	flex-direction: column;
	padding: 10px;
`;

const TravelCard = styled.div`
	border-radius: 5px;
	margin-bottom: 10px;
	background: #fff;
	padding: 10px;
`;

const TravelCardTitle = styled.h1``;

const Home = () => {
	return (
		<section>
			<Header>
				<h1>Кешбэк</h1>
			</Header>
			<Profile>
				<UserName>Марина</UserName>
				<Balance>Заработано: 145345 руб</Balance>
			</Profile>
			<TravelList>
				{Object.entries(data).map(([id, { name }]) => (
					<TravelCard key={name}>
						<Link to={`/challenge?id=${id}`}>
							<TravelCardTitle>{name}</TravelCardTitle>
						</Link>
					</TravelCard>
				))}
			</TravelList>
		</section>
	);
};

export default Home;
