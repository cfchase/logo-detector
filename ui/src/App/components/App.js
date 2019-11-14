import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// import HomeIcon from '@material-ui/icons/Home';
// import CameraAltIcon from '@material-ui/icons/CameraAlt';
// import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
// import SvgIcon from '@material-ui/core/SvgIcon';

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';

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
        {/*<a href="/capture"><CameraAltOutlinedIcon style={{ fontSize: 48 }}/></a>*/}
        {/*<a href="/library"><PhotoLibraryIcon style={{ fontSize: 48 }}/></a>*/}
        <a href="/search"><ImageSearchIcon style={{ fontSize: 48 }}/></a>
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
