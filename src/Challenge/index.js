import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { withRouter } from "react-router-dom";

import data from "../data.json";
import useQuery from "../useQuery";
import { completeChallenge, getSaved } from "../profile";

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
		transform: rotate(360deg);
	}
	100% {
		transform: rotate(0deg);
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
  height: 350px;
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

const ErrorLog = styled.p`
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.23px;
  text-align: center;
  color: #c11a1a;
`;

const Challenge = ({ history }) => {
  const { trip, challenge: id, fromHome } = useQuery();
  const challenge = (data[trip] && data[trip].challenges[id]) || {};
  const isCompleted = !!getSaved(trip, id);

  const [status, setStatus] = useState(false);
  const [shareImage, setShareImage] = useState(null);
  const [verify, setVerify] = useState(false);
  const [image, setImage] = useState(getSaved(trip, id));
  const [log, setLog] = useState(null);

  const uploadImage = async () => {
    if (status) return;

    try {
      const data = await getImage();
      setImage("data:image/jpeg;base64," + data);
      setVerify(false);

      await verifyImage(data);
    } catch {
      setLog(null);
    }

    // const file = document.querySelector("#challengeImage > input[type='file']");
    // const submit = document.querySelector(
    //   "#challengeImage > input[type='submit']"
    // );
    // const onChange = e => {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setImage(reader.result);
    //   };
    //   if (file.files[0]) {
    //     setVerify(false);
    //     reader.readAsDataURL(file.files[0]);
    //     submit.click();
    //   }
    // };
    // file.click();
    // file.addEventListener("change", onChange);
  };

  const verifyImage = async base64 => {
    if (status) return false;

    try {
      setStatus(true);
      //const formData = new FormData(document.querySelector("#challengeImage"));
      //setLog("create formData");
      const formData = { b64photo: base64, trip: data[trip].name };
      const response = await fetch("http://85.143.218.224/process_photo", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      //setLog(null);

      const body = JSON.parse(await response.text());
      const isVerify =
        body.is_selfie &&
        body.landmarks.some(
          v => v.toLowerCase() === challenge.trigger.toLowerCase()
        );
      setVerify(isVerify);
      if (isVerify) setShareImage("http://85.143.218.224/img/" + body.filename);
      else setLog("Упс, кажется Ваше фото не подходит для этого челенджа");
    } catch (e) {
      console.log(e);
      setLog(e.toString());
    }

    setStatus(false);
    return false;
  };

  const getImage = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.camera) return reject();
      navigator.camera.getPicture(resolve, reject, {
        quality: 50,
        allowEdit: true,
        sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY,
        //cameraDirection: window.Camera.Direction.FRONT,
        destinationType: window.Camera.DestinationType.DATA_URL
      });
    });
  };

  const shareStory = image => {
    return new Promise((resolve, reject) => {
      if (!window.IGStory) return reject();
      const params = {
        backgroundImage: "https://i.ibb.co/vPsxXqh/Story.png",
        stickerImage: image
      };
      window.IGStory.shareToStory(params, resolve, reject);
    });
  };

  const handleShare = async () => {
    if (!verify || !shareImage) return;
    try {
      setStatus(true);
      await shareStory(shareImage);
      completeChallenge(trip, id, shareImage, challenge.bonus);
      window.completeChallenge = id;
      history.goBack();
    } catch (e) {
      setLog("Ошибка, невозможно опубликовать сторис!");
    }
    setStatus(false);
  };

  return (
    <section>
      <Preview image={challenge.image}>
        <PreviewLabel>{challenge.name}</PreviewLabel>
        <PreviewBonus>{challenge.bonus} ₽</PreviewBonus>
      </Preview>

      <Content>
        <Description>{challenge.description}</Description>
        <Tutor>Сделайте селфи на его фоне и опубликуйте в истории!</Tutor>
        <PhotoArea image={image} onClick={uploadImage}>
          {/* <form onSubmit={verifyImage} id="challengeImage" hidden>
            <input name="photo" accept="image/*" capture="camera" type="file" />
            <input type="submit" />
          </form> */}

          {!image && (
            <>
              <PhotoAreaIcon>+</PhotoAreaIcon>
              <PhotoAreaText>СДЕЛАТЬ ФОТО</PhotoAreaText>
            </>
          )}
        </PhotoArea>

        <ErrorLog>{log}</ErrorLog>

        <Button isLoading={status} isDisable={!verify} onClick={handleShare}>
          {status ? (
            <img width={36} height={36} src="Spinner.gif" />
          ) : (
            <img src="insta.svg" />
          )}
          {status && verify
            ? "Публикуем в сторисы..."
            : status
            ? "Проверяем..."
            : "Поделиться в Instagram"}
        </Button>
      </Content>
    </section>
  );
};

export default withRouter(Challenge);
