import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";

import "./Home.scss";


function Home() {
  return (
    <div className="home">
      <h1>Home</h1>
    </div>
  );
}

function mapStateToProps(state) {
  return state.homeReducer;
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
