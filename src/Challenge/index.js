import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useParams } from "react-router-dom";
import data from "../data.json";

const Wrap = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const rotation = keyframes`
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
`;

const Spinner = styled.img`
	width: 28px;
	height: 28px;
	animation: ${rotation} 2s linear infinite;
`;

const Button = styled.button`
	margin-top: 20px;
	border-radius: 10px;
	width: 100%;
	height: 56px;
	padding: 0 20px;
	border: none;
	font-size: 20px;
	font-weight: 600;
	font-stretch: normal;
	font-style: normal;
	line-height: 1.2;
	letter-spacing: 0.38px;
	text-align: center;
	outline: none;
	display: flex;
	justify-content: center;
	align-items: center;

	color: ${({ isLoading }) =>
		isLoading ? "rgba(60, 60, 67, 0.6)" : "#ffffff"};
	background-color: ${({ isLoading, isDisable }) =>
		isLoading ? "#d6d6d6" : isDisable ? "rgba(0, 185, 86, 0.5)" : "#00b956"};

	img {
		display: block;
		margin-right: 10px;
	}
`;

const Preview = styled.section`
	width: 100vw;
	height: 200px;
	display: flex;
	justify-content: flex-end;
	flex-direction: column;
	position: relative;
	background-image: ${({
		image
	}) => `linear-gradient(to bottom, rgba(0, 0, 0, 0) 45%, #000000),
		url(${image})`};
	background-position: center;
	background-size: cover;
`;

const PreviewLabel = styled.h1`
	font-size: 21px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: 0.95;
	letter-spacing: -0.34px;
	color: #ffffff;
	margin: 0;
	margin-left: 15px;
	margin-bottom: 5px;
`;

const PreviewBonus = styled.p`
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: 1.13;
	letter-spacing: -0.1px;
	color: #00b956;
	margin: 0;
	margin-left: 15px;
	margin-bottom: 15px;
`;

const Content = styled.div`
	padding: 13px 15px;
`;

const Description = styled.p`
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.1px;
	color: #3a3a3a;
`;

const Tutor = styled(Description)`
	color: #00b956;
`;

const PhotoArea = styled.div`
	height: 250px;
	border-radius: 5px;
	border: ${({ image }) => !image && "dashed 3px #c5c5c5"};
	background-position: center;
	background-size: cover;
	background-image: ${({ image }) => image && `url(${image})`};
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const PhotoAreaText = styled.p`
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.1px;
	text-align: center;
	color: #c5c5c5;
	margin: 0;
`;

const PhotoAreaIcon = styled.p`
	margin: 0;
	font-size: 48px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.29px;
	text-align: center;
	color: #c5c5c5;
`;

const Challenge = () => {
	const { trip, challenge: id } = useParams();
	const challenge = data[trip].challenges[id];

	const [status, setStatus] = useState(false);
	const [verify, setVerify] = useState(false);
	const [image, setImage] = useState(null);

	const uploadImage = () => {
		if (status) return;
		const file = document.querySelector("#challengeImage > input[type='file']");
		const submit = document.querySelector(
			"#challengeImage > input[type='submit']"
		);
		const onChange = e => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
			};
			if (file.files[0]) {
				reader.readAsDataURL(file.files[0]);
				submit.click();
				setStatus(true);
			}
		};
		file.click();
		file.addEventListener("change", onChange, { once: true });
	};

	const verifyImage = async e => {
		e.preventDefault();
		if (status) return false;

		const response = await fetch("http://85.143.218.224/process_photo", {
			method: "POST",
			body: new FormData(e.target)
		});

		const body = JSON.parse(await response.text());
		const isVerify =
			body.is_selfie && body.landmarks.some(v => v.toLowerCase() === "big ben");
		console.log(body, isVerify);
		setStatus(false);
		setVerify(isVerify);
		return false;
	};

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
		// try {
		// 	const image = await getImage();
		// 	await shareStory(image);
		// 	setLog("Done");
		// } catch (e) {
		// 	setLog("Failure");
		// }
	};

	return (
		<section>
			<Preview image={challenge.image}>
				<PreviewLabel>{challenge.name}</PreviewLabel>
				<PreviewBonus>{challenge.bonus}</PreviewBonus>
			</Preview>

			<Content>
				<Description>{challenge.description}</Description>
				<Tutor>Сделайте селфи на его фоне!</Tutor>
				<PhotoArea image={image} onClick={uploadImage}>
					<form onSubmit={verifyImage} id="challengeImage" hidden>
						<input name="photo" type="file" />
						<input type="submit" />
					</form>

					{!image && (
						<>
							<PhotoAreaIcon>+</PhotoAreaIcon>
							<PhotoAreaText>ПРИКРЕПИТЬ ФОТО</PhotoAreaText>
						</>
					)}
				</PhotoArea>
				<Button isLoading={status} isDisable={!verify} onClick={handleShare}>
					{status ? <Spinner src="./Spinner.png" /> : <img src="./insta.svg" />}
					{status ? "Проверяем..." : "Поделиться в Instagram"}
				</Button>
			</Content>
		</section>
	);
};

export default Challenge;
