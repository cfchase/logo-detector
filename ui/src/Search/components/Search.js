import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { resetSearch, searchPhoto } from "../actions";
import Camera from '@material-ui/icons/Camera';
import Cached from '@material-ui/icons/Cached';

import "./Search.scss";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

function Search(
  {
    reset,
    searchPhoto,
    inferencePending,
    inferenceResponse,
    inference,
    inferenceError
  }) {
  const [image, setImage] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(null);
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [facingMode, setFacingMode] = useState("user");

  const classes = useStyles();

  useEffect(() => {
    enableCamera();
  }, []);

  useEffect(() => {
    drawBoxes();
  }, [inference]);

  const videoRef = useCallback(node => {
    setVideo(node);
    if (node) {
      navigator.mediaDevices.getUserMedia({video: { facingMode }})
        .then(stream => node.srcObject = stream);
    }
  }, []);

  const canvasRef = useCallback(node => {
    setCanvas(node);
  }, []);

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
    searchPhoto(imageData);
  }

  function drawBoxes() {
    if (!inference || !canvas.getContext) {
      return
    }

    inference.detections.forEach(d => drawBox(d));
  }

  function drawBox({box, label, score}) {
    const ctx = canvas.getContext('2d');
    const width = Math.floor((box.xMax - box.xMin) * canvas.width);
    const height = Math.floor((box.yMax - box.yMin) * canvas.height);
    const x = Math.floor(box.xMin * canvas.width);
    const y = Math.floor(box.yMin * canvas.height);
    ctx.lineWidth = 3;

    if (score > .9) {
      ctx.strokeStyle = "lightgreen";
    } else if (score > .8) {
      ctx.strokeStyle = "yellow";
    } else {
      ctx.strokeStyle = "orange";
    }

    ctx.strokeRect(x, y, width, height);
    ctx.font = '32px sans-serif';
    ctx.strokeText(label, x + 10, y + height - 10);
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
        <div className="action-container">
          <div className="button-bar">
            <Button
              variant="contained"
              size="large"
              className="take-picture-button"
              onClick={onCameraClicked}
            ><Camera style={{fontSize: 60}}/>
            </Button>
          </div>
        </div>
      </div>
    );
  }


  function renderSnapshot() {
    const display = image ? "flex" : "none";

    let inferenceResult = null;
    if (inferencePending) {
      inferenceResult = (
        <div className="inference-result in-progress">
          <div className="inference-result-line">Loading...</div>
        </div>);
    } else if (inference) {
      if (!inference.detections || inference.detections.length === 0) {
        inferenceResult = (
          <div className="inference-result no-logos">
            <div className="inference-result-line">No Logos Found</div>
          </div>);
      } else {
      inferenceResult = (
        <div className="inference-result logos">
          {inference.detections.map((d, index) => <div className="inference-result-line" key={index}>{d.label} <span className="result-score">{Math.floor(d.score * 100)}%</span></div>)}
        </div>);
      }
    }

    return (
      <div className="result" style={{display}}>
        <div className="img-container">
          <canvas
            className="search-result"
            ref={canvasRef}
          />
        </div>
        <div className="action-container">
          <div className="button-bar">
            <Button
              variant="contained"
              size="large"
              className="re-take-picture-button"
              onClick={onCameraToggled}
            ><Cached style={{fontSize: 60}}/>
            </Button>
          </div>
          {inferenceResult}
        </div>
      </div>
    );
  }

  return (
    <div className="search">
      {renderCamera()}
      {renderSnapshot()}
    </div>
  );
}

function mapStateToProps(state) {
  return state.searchReducer;
}

function mapDispatchToProps(dispatch) {
  return {
    reset: () => {
      dispatch(resetSearch());
    },
    searchPhoto: (photo) => {
      dispatch(searchPhoto(photo));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
