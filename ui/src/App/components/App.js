import React, {useEffect} from 'react';
import { connect } from "react-redux";
import { getStatus } from "../actions";

import "./App.scss";

function App({status, getStatus}) {
  useEffect(() => {
    getStatus();
  }, []);

  return (
    <div className="app">
      <code>{JSON.stringify(status, null, 2)}</code>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
