import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { resetCapture, createPhoto } from "../actions";

import "./Capture.scss";

import NoImage from "./no-image.svg"
import ReactJson from "react-json-view";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

function Capture(
  {
    reset,
    createPhoto,
    inferencePending,
    inferenceResponse,
    inference,
    inferenceError
  }) {
  const [image, setImage] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(null);
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    enableCamera();
  }, []);

  const videoRef = useCallback(node => {
    setVideo(node);
    if (node) {
      navigator.mediaDevices.getUserMedia({video: { facingMode: "environment" }})
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
    reset();
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
      track.stop();
    });

    setImage(canvas.toDataURL());
    setCameraEnabled(false);

    let imageData = canvas.toDataURL('image/jpeg');
    createPhoto(imageData);
  }

  function onUploadClicked() {
    let imageData = canvas.toDataURL('image/jpeg');
    createPhoto(imageData);
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
      <div className="camera">
        <div className="img-container">
          <video
            className="camera-preview"
            ref={videoRef}
            controls={false}
            autoPlay
            playsInline
          />
        </div>
        <div className="button-bar">
          <Button
            variant="contained"
            size="large"
            color="primary"
            className={classes.margin}
            onClick={onCameraClicked}
          > Take Picture
          </Button>
        </div>
      </div>
    );
  }


  function renderUpload() {
    if (!image || cameraEnabled) {
      return null;
    }

    let inferenceResult = null;
    if (inferencePending) {
      inferenceResult = (
        <div className="inference-result">
          <CircularProgress/>
        </div>);
    } else if (inference) {
      inferenceResult = (
        <div className="inference-result">
          {inference.map((logoClass, index) => <h2 key={index}>{logoClass}</h2>)}
        </div>);
    }

    return (
      <div className="upload">
        <div className="img-container">
          <img
            className="upload-preview"
            src={image || NoImage}
            alt="camera-preview"
          />
        </div>
        <div className="button-bar">
          {inferenceResult}
          <div>
            <Button
              variant="contained"
              size="large"
              className={classes.margin}
              onClick={onCameraToggled}
            > Re-take
            </Button>
          </div>
        </div>
      </div>
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

  function renderInference() {
    console.log(inferenceResponse);
    const data = get("data", inferenceResponse);
    console.log(data);

    if (!inferenceResponse || !inferenceResponse.data) {
      return null;
    }

    return (
      <ReactJson
        name={false}
        enableClipboard={false}
        onEdit={false}
        onAdd={false}
        onDelete={false}
        displayDataTypes={false}
        collapseStringsAfterLength={120}
        shouldCollapse={field => field.type === "array" && field.src.length > 4}
        src={inferenceResponse.data}
      />
    );
  }

  return (
    <div className="capture">
      {renderCamera()}
      {renderUpload()}
      {renderSnapshot()}
      {renderInference()}
    </div>
  );
}

function mapStateToProps(state) {
  return state.captureReducer;
}

function mapDispatchToProps(dispatch) {
  return {
    reset: () => {
      dispatch(resetCapture());
    },
    createPhoto: (photo) => {
      dispatch(createPhoto(photo));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Capture);
