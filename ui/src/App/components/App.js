import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getStatus } from "../actions";
import Routes from "../../Routes";

import "./App.scss";

function App({status, getStatus}) {
  useEffect(() => {
    getStatus();
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <a href="/">Home</a>
        <a href="/capture">Capture</a>
        <a href="/library">Library</a>
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
    getStatus: (notification) => {
      dispatch(getStatus());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
