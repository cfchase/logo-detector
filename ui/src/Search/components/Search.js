import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import ReactJson from "react-json-view";
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { resetSearch, searchPhoto } from "../actions";

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


  function renderSnapshot() {
    const display = image ? "block" : "none";

    let inferenceResult = null;
    if (inferencePending) {
      inferenceResult = (
        <div className="inference-result">
          <CircularProgress/>
        </div>);
    } else if (inference) {
      if (!inference.detections || inference.detections.length === 0) {
        inferenceResult = (
          <div className="inference-result">
            <h2>No Logos Found</h2>
          </div>);
      } else {
      inferenceResult = (
        <div className="inference-result">
          {inference.detections.map((d, index) => <h2 key={index}>{d.label} <span className="result-score">{Math.floor(d.score[0] * 100)}%</span></h2>)}
        </div>);
      }
    }

    return (
      <div className="result" style={{ display }}>
        <div className="img-container">
          <canvas
            className="search-result"
            ref={canvasRef}
          />
        </div>
        <div className="button-bar">
          {inferenceResult}
          <Button
            variant="contained"
            size="large"
            className={classes.margin}
            onClick={onCameraToggled}
          > Re-Take
          </Button>
        </div>
      </div>



    )
  }

  function renderDebugInfo() {
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
      {renderSnapshot()}
      {renderDebugInfo()}
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
