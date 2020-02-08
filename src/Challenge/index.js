import React, { useState } from "react";
import styled from "styled-components";

const Wrap = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const Button = styled.button`
	height: 56px;
	padding: 0 20px;
	border-radius: 5px;
	background: #3f51b5;
	color: #fff;
	border: none;
`;

const Challenge = () => {
	const [log, setLog] = useState(null);

	const getImage = () => {
		return new Promise((resolve, reject) => {
			if (!navigator.camera) return reject();
			navigator.camera.getPicture(resolve, reject, {
				quality: 50,
				sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit: true,
				destinationType: window.Camera.DestinationType.FILE_URI
			});
		});
	};

	const shareStory = backgroundImage => {
		return new Promise((resolve, reject) => {
			if (!window.IGStory) return reject();
			const params = {
				backgroundImage,
				attributionURL: "https://www.my-aweseome-app.com/p/BhzbIOUBval/"
			};

			window.IGStory.shareToStory(params, resolve, reject);
		});
	};

	const handleShare = async () => {
		try {
			const image = await getImage();
			await shareStory(image);
			setLog("Done");
		} catch (e) {
			setLog("Failure");
		}
	};

	return (
		<Wrap>
			<Button onClick={handleShare}>Share to Instagram.Stories</Button>
			<p>{log}</p>
		</Wrap>
	);
};

export default Challenge;
