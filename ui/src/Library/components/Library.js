import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import { Button, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import "./Library.scss";
import { uploadFile } from "../actions";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

function Library({uploadFile}) {
  const [targetFile, setTargetFile] = useState(null);
  const [image, setImage] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const classes = useStyles();

  const canvasRef = useCallback(node => {
    setCanvas(node);
  }, []);

  function onInputChanged(e) {
    let targetFile = e.target.files[0];
    setTargetFile(targetFile);
    console.log(targetFile);
    setImage(URL.createObjectURL(targetFile))
  }

  function onUploadClicked() {
    let imageData = canvas.toDataURL('image/jpeg');

    // let formData = new FormData();
    // formData.append("photo", targetFile);
    // console.log("targetFile", targetFile);
    // console.log("formData", formData);
    // uploadFile(formData);
    uploadFile(imageData);
  }

  function renderImage() {
    if (!image) {
      return null;
    }
    return (
      <>
        <div className="img-container">
          <img
            className="upload-preview"
            src={image}
            alt="Upload Preview"
          />
        </div>
        <div className="button-bar">
          <Button
            variant="contained"
            size="large"
            color="primary"
            className={classes.margin}
            onClick={onUploadClicked}
          > Upload
          </Button>
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
    <div className="library">
      <input
        id="image-upload-input"
        type="file"
        capture="camera"
        accept="image/*"
        onChange={onInputChanged}
      />
      {/*<label htmlFor="image-upload-input">*/}
      {/*  <Button variant="raised" component="span" className={classes.button}>*/}
      {/*    Upload*/}
      {/*  </Button>*/}
      {/*</label>*/}
      {renderImage()}
      {renderSnapshot()}
    </div>
  );
}

function mapStateToProps(state) {
  return state.libraryReducer;
}

function mapDispatchToProps(dispatch) {
  return {
    uploadFile: (file) => {
      dispatch(uploadFile(file));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Library);
