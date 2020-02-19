import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { processFrame } from '../actions';

import './Video.scss';

function Video(
  {
    processFrame,
    inference,
    frame
  }) {
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [feed, setFeed] = useState(null);
  const [intId, setIntId] = useState(null);
  const [recording, setRecording] = useState(false);
  const [framerate, setFramerate] = useState(5);

  useEffect(() => {
    setFrame();
  }, [inference, frame]);

  const videoRef = useCallback(node => {
    setVideo(node);
    if (node) {
      navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment' }})
        .then(stream => {
          node.srcObject = stream;
        });
    }
  }, []);

  const canvasRef = useCallback(node => {
    setCanvas(node);
  }, []);

  const feedRef = useCallback(node => {
    setFeed(node);
  }, []);

  function captureFrame() {
    canvas.getContext('2d').drawImage(
      video,
      0, 0,
      video.videoWidth,
      video.videoHeight
    );

    let imageData = canvas.toDataURL('image/jpeg');
    processFrame(imageData);
  }

  function setFrame() {
    if (!feed || !frame) {
      return;
    }

    let imageObj = new Image();
    imageObj.onload = function() {
      const ctx = feed.getContext('2d');
      ctx.drawImage(
        this,
        0, 0,
        feed.width,
        feed.height
      );
      drawBoxes();
    };

    imageObj.src = frame;
  }

  function drawBoxes() {
    if (!inference || !feed.getContext) {
      return
    }

    inference.detections.forEach(d => drawBox(d));
  }

  function drawBox({box, label, score}) {
    const ctx = feed.getContext('2d');
    const width = Math.floor((box.xMax - box.xMin) * feed.width);
    const height = Math.floor((box.yMax - box.yMin) * feed.height);
    const x = Math.floor(box.xMin * feed.width);
    const y = Math.floor(box.yMin * feed.height);
    ctx.lineWidth = 3;

    if (score > .9) {
      ctx.strokeStyle = 'lightgreen';
    } else if (score > .8) {
      ctx.strokeStyle = 'yellow';
    } else {
      ctx.strokeStyle = 'orange';
    }

    ctx.strokeRect(x, y, width, height);
    ctx.font = '32px sans-serif';
    ctx.strokeText(label, x + 10, y + height - 10);
  }

  function startFeed() {
    if (intId) {
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    feed.width = canvas.width;
    feed.height = canvas.height;

    let x = setInterval(() => captureFrame(), Math.ceil(1000 / framerate));
    setIntId(x);
    setRecording(true);
  }

  function stopFeed() {
    clearInterval(intId);
    setIntId(null);
    setRecording(false);
  }

  function onFramerateChange(event, newValue) {
    console.log(newValue);
    setFramerate(newValue);
    if (recording) {
      clearInterval(intId);
      let x = setInterval(() => captureFrame(), 1000 / framerate);
      setIntId(x);
    }
  }

  function renderPreview() {
    return <div className='preview' style={{display: recording ? 'none' : 'block'}}>
      <video
        className='camera-preview'
        ref={videoRef}
        controls={false}
        autoPlay
        playsinline
      />
    </div>
  }

  function renderCaptureCanvas() {
    return (
      <div className='capture' style={{display: 'none'}}>
        <canvas
          className='capture-canvas'
          ref={canvasRef}
        />
      </div>);
  }

  function renderFeed() {
    return (
      <div className='feed' style={{display: recording ? 'block' : 'none'}}>
        <canvas
          className='feed-canvas'
          ref={feedRef}
        />
      </div>);
  }

  const marks = [
    {
      value: 1,
    },
    {
      value: 5,
    },
    {
      value: 10,
    },
    {
      value: 15,
    },
  ];

  const FramerateSlider = withStyles({
    root: {
      color: '#f1f1f1',
      height: 4,
    },
    thumb: {
      height: 16,
      width: 16,
      backgroundColor: 'white',
      border: '2px solid currentColor',
      marginTop: -6,
      marginLeft: -8,
      '&:focus,&:hover,&$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 11px)',
      top: -10,
      '& *': {
        background: 'transparent',
        color: 'white',
      },
    },
    track: {
      height: 4,
      borderRadius: 2,
    },
    rail: {
      height: 4,
      borderRadius: 2,
    },
    mark: {
      backgroundColor: '#fff',
      height: 16,
      width: 2,
      marginTop: -6,
    },
    markActive: {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  })(Slider);

  return (
    <div className='video'>
      <div className='button-bar' >
        <Button
          variant='contained'
          onClick={() => startFeed()}
        > Start
        </Button>
        <Button
          variant='contained'
          onClick={() => stopFeed()}
        > Stop
        </Button>
        <div className="slider-container">
          <Typography id="framerate-slider">
            Framerate
          </Typography>
          <FramerateSlider
            value={framerate}
            onChange={onFramerateChange}
            min={1}
            max={15}
            step={1}
            marks={marks}
            valueLabelDisplay="on"
            aria-labelledby="framerate-slider"
          />
        </div>
      </div>
      {renderFeed()}
      {renderPreview()}
      {renderCaptureCanvas()}

    </div>
  );
}

function mapStateToProps(state) {
  return state.videoReducer;
}

function mapDispatchToProps(dispatch) {
  return {
    processFrame: (photo, width, height) => {
      dispatch(processFrame(photo, width, height));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Video);
