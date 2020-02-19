import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';

import { getStatus } from "../actions";
import Routes from "../../Routes";

import "./App.scss";

function App({status, getStatus}) {
  useEffect(() => {
    getStatus();
  }, []);    // eslint-disable-line

  return (
    <div className="app">
      <nav className="navbar">
        <a href="/"><HomeOutlinedIcon style={{ fontSize: 48 }}/></a>
        <a href="/video"><VideocamOutlinedIcon style={{ fontSize: 48 }}/></a>
        <a href="/search"><CameraAltOutlinedIcon style={{ fontSize: 48 }}/></a>
      </nav>
      <Routes/>
    </div>
  );
}

function mapStateToProps(state) {
  return state.appReducer;
}

function mapDispatchToProps(dispatch) {
  return {
    getStatus: () => {
      dispatch(getStatus());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
