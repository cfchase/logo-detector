import React, { useState, useEffect, useCallback, Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { resetSearch, searchPhoto } from '../actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import {ReactComponent as VerticalCameraBorder} from "./vertical-camera-border.svg";
import {ReactComponent as HorizontalCameraBorder} from "./horizontal-camera-border.svg";

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
  const [video, setVideo] = useState(null);
  const [imageCanvas, setImageCanvas] = useState(null);
  const [zonesCanvas, setZonesCanvas] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

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
  }, [facingMode]);

  const imageCanvasRef = useCallback(node => {
    setImageCanvas(node);
  }, []);

  const zonesCanvasRef = useCallback(node => {
    setZonesCanvas(node);
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
    updateImageCanvas();
    
    let imageData = imageCanvas.toDataURL('image/jpeg');
    const base64data = imageData.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    searchPhoto(base64data);
    
    updateZonesCanvas()
  }

  function updateImageCanvas() {
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
  }

  function updateZonesCanvas() {
    zonesCanvas.width = imageCanvas.width;
    zonesCanvas.height = imageCanvas.height;

    const ctx = zonesCanvas.getContext('2d');

    ctx.fillStyle = '#565656';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0, 0,
      zonesCanvas.width,
      zonesCanvas.height);
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
    clearZone(x, y, width, height)
  }

  function drawBox(x, y, width, height, color) {
    const ctx = imageCanvas.getContext('2d');
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'white';
    ctx.setLineDash([16, 16]);
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

  function clearZone(x, y, width, height) {
    const ctx = zonesCanvas.getContext('2d');
    ctx.clearRect(x-3, y-6, width+6, height+6);
  }

  function onFacingModeClicked() {
    if (facingMode === 'user') {
      setFacingMode('environment')
    } else {
      setFacingMode('user')
    }
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
          <div className='horizontal overlay'>
            <HorizontalCameraBorder className={'horizontal-camera-border-svg'}/>
          </div>
          <div className='vertical overlay'>
            <VerticalCameraBorder className={'vertical-camera-border-svg'}/>
          </div>
        </div>
        <div className='left-button-container button-container'>
          <Button
            variant='contained'
            size='large'
            className='choose-camera-button'
            onClick={onFacingModeClicked}
          ><FontAwesomeIcon icon={faSync}/>
          </Button>
        </div>
        <div className='center-button-container button-container'>
          <Button
            variant='contained'
            size='large'
            className='take-picture-button'
            onClick={onCameraClicked}
          ><FontAwesomeIcon icon={faCircle}/>
          </Button>
        </div>
        <div className='right-button-container button-container'>
        </div>
      </div>
    );
  }


  function renderSnapshot() {
    const displayResult = image ? 'flex' : 'none';
    const displayButtons = inferencePending ? 'none' : 'block';
    const displayZones = inferencePending ? 'flex' : 'flex';
    const displayLoading = inferencePending ? 'flex' : 'none';

    return (
      <div className='result' style={{display: displayResult}}>
        <div className='img-container'>
          <canvas
            className='result-canvas'
            ref={imageCanvasRef}
          />
          <div className='zones overlay' style={{display: displayZones}}>
            <canvas
              className='zones-canvas'
              ref={zonesCanvasRef}
            />
          </div>
          <div className='loading overlay' style={{display: displayLoading}}>
            <div>
              <FontAwesomeIcon className='loading-icon' icon={faCircleNotch} spin/>
            </div>
            <div className='loading-text'>Loading ...</div>
          </div>
        </div>
        <div className='left-button-container button-container' style={{display: displayButtons}}>
        </div>
        <div className='center-button-container button-container' style={{display: displayButtons}}>
          <Button
            variant='contained'
            size='large'
            className='re-take-picture-button'
            onClick={onCameraToggled}
          ><span className='label-word'>Try</span><span className='label-word'>again</span>
          </Button>
        </div>
        <div className='right-button-container button-container' style={{display: displayButtons}}>
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

