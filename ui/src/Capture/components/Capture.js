import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";

import "./Capture.scss";

import NoImage from "./no-image.svg"

function Capture() {
  const [image, setImage] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(null);
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);


  useEffect(() => {
    enableCamera();
  }, []);

  const videoRef = useCallback(node => {
    setVideo(node);
    if (node) {
      navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => node.srcObject = stream);
    }
  }, []);

  const canvasRef = useCallback(node => {
    setCanvas(node);
  }, []);

  function onInputChanged(e) {
    let targetFile = e.target.files[0];
    console.log(targetFile);
    setImage(URL.createObjectURL(targetFile))
  }

  function enableCamera() {
    setCameraEnabled(!cameraEnabled);
    setImage(null);
  }

  function onCameraToggled() {
    enableCamera();
  }

  function onCameraClicked() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(
      video,
      0, 0,
      video.videoWidth,
      video.videoHeight
    );

    video.srcObject.getVideoTracks().forEach(track => {
      track.stop()
    });

    setImage(canvas.toDataURL());
    setCameraEnabled(false);
  }

  function onUploadClicked() {
    let imageData = canvas.toDataURL('image/jpeg');
    console.log("imageData=", imageData);
    let uploadData = imageData.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    console.log("imageData=", imageData);
    console.log("uploadData=", uploadData);
  }

  function renderCameraToggle() {
    const supportsCamera = "mediaDevices" in navigator;
    if (!supportsCamera) {
      return null;
    }

    if (cameraEnabled) {
      return <button onClick={onCameraToggled}> Disable Camera </button>;
    }

    return <button onClick={onCameraToggled}> Enable Camera </button>;
  }

  function renderCamera() {
    if (!cameraEnabled || image) {
      return null;
    }

    return (
      <>
        <div>
          <video
            ref={videoRef}
            controls={false} autoPlay
          />
        </div>
        <div>
          <button onClick={onCameraClicked}> Take Picture</button>
        </div>
      </>
    );
  }

  function renderImage() {
    if (!image || cameraEnabled) {
      return null;
    }
    return (
      <>
        <div className="captured-image">
          <img
            src={image || NoImage}
            alt="image"
          />
        </div>
        <div>
          <button onClick={onCameraToggled}> Re-take</button>
          <button onClick={onUploadClicked}> Upload</button>
        </div>
      </>
    );
  }

  function renderSnapshot() {
    return (
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    )
  }

  return (
    <div className="capture">
      {renderCamera()}
      {renderImage()}
      {renderSnapshot()}
    </div>
  );
}

function mapStateToProps(state) {
  return state.captureReducer;
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Capture);
