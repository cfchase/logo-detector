import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { resetSearch, searchPhoto } from '../actions';
import Camera from '@material-ui/icons/Camera';
import Cached from '@material-ui/icons/Cached';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import './Search.scss';


const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

const labelSettings = {
  'Dynatrace': {
    bgColor: '#3DB048',
    width: 107
  },
  'IBM': {
    bgColor: '#1870C2',
    width: 42
  },
  'Intel': {
    bgColor: '#0071C6',
    width: 49
  },
  'Anaconda': {
    bgColor: '#3DB048',
    width: 110
  },
  'SAS': {
    bgColor: '#007CC2',
    width: 60
  },
  'Cloudera': {
    bgColor: '#F96703',
    width: 110
  },
  'Red Hat': {
    bgColor: '#EE0001',
    width: 110
  }
};

function getLabelSettings(label) {
  const defaultSettings = {
    color: '#EE0001'
  };

  return (labelSettings[label] || defaultSettings)
}

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
  const [cameraOverlay, setCameraOverlay] = useState(null);
  const [video, setVideo] = useState(null);
  const [imageCanvas, setImageCanvas] = useState(null);
  const [imageOverlay, setImageOverlay] = useState(null);
  const [facingMode, setFacingMode] = useState('user');

  const classes = useStyles();

  useEffect(() => {
    enableCamera();
  }, []);

  useEffect(() => {
    drawDetections();
  }, [inference]);

  const videoRef = useCallback(node => {
    setVideo(node);
    if (node) {
      navigator.mediaDevices.getUserMedia({video: { facingMode }})
        .then(stream => node.srcObject = stream);
    }
  }, []);

  const imageCanvasRef = useCallback(node => {
    setImageCanvas(node);
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
    imageCanvas.width = video.videoWidth;
    imageCanvas.height = video.videoHeight;

    imageCanvas.getContext('2d').drawImage(
      video,
      0, 0,
      video.videoWidth,
      video.videoHeight
    );

    video.srcObject.getVideoTracks().forEach(track => {
      track.stop();
    });

    setImage(imageCanvas.toDataURL());
    setCameraEnabled(false);

    let imageData = imageCanvas.toDataURL('image/jpeg');
    searchPhoto(imageData);
  }

  function drawDetections() {
    if (!inference || !imageCanvas.getContext) {
      return
    }

    inference.detections.forEach(d => drawDetection(d));
  }

  function drawDetection({box, label, score}) {
    // const ctx = imageCanvas.getContext('2d');
    const width = Math.floor((box.xMax - box.xMin) * imageCanvas.width);
    const height = Math.floor((box.yMax - box.yMin) * imageCanvas.height);
    const x = Math.floor(box.xMin * imageCanvas.width);
    const y = Math.floor(box.yMin * imageCanvas.height);
    const labelSettings = getLabelSettings(label);
    drawBox(x, y, width, height, labelSettings.bgColor);
    drawBoxTextBG(x + 10, y + height - 33, labelSettings.width, 30, labelSettings.bgColor);
    drawBoxText(label, x + 10, y + height - 10)
  }

  function drawBox(x, y, width, height, color) {
    const ctx = imageCanvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    // ctx.setLineDash([16, 16]);
    ctx.strokeRect(x, y, width, height);
  }

  function drawBoxTextBG(x, y, width, height, color) {
    const ctx = imageCanvas.getContext('2d');

    // ctx.strokeStyle = getLabelSettings(label).color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, 30);
  }

  function drawBoxText(text, x, y) {
    const ctx = imageCanvas.getContext('2d');
    // ctx.lineWidth = 0;
    ctx.font = '24px Roboto';
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
  }

  function renderCamera() {
    if (!cameraEnabled || image) {
      return null;
    }

    return (
      <div className='camera'>
        <div className='img-container'>
          <video
            className='camera-preview'
            ref={videoRef}
            controls={false}
            autoPlay
            playsInline
          />
          <div className='horizontal camera-overlay'></div>
          <div className='vertical camera-overlay'></div>
        </div>
        <div className='action-container'>
          <div className='button-bar'>
            <Button
              variant='contained'
              size='large'
              className='take-picture-button'
              onClick={onCameraClicked}
            ><RadioButtonUncheckedIcon style={{fontSize: 60}}/>
            </Button>
          </div>
        </div>
      </div>
    );
  }


  function renderSnapshot() {
    const display = image ? 'flex' : 'none';

    return (
      <div className='result' style={{display}}>
        <div className='img-container'>
          <canvas
            className='search-result'
            ref={imageCanvasRef}
          />
        </div>
        <div className='action-container'>
          <div className='button-bar'>
            <Button
              variant='contained'
              size='large'
              className='re-take-picture-button'
              onClick={onCameraToggled}
            >Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='search'>
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

