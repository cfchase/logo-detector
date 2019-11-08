import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";

import "./Library.scss";


function Library() {
  return (
    <div className="library">
      <h1>Library</h1>
    </div>
  );
}

function mapStateToProps(state) {
  return state.libraryReducer;
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Library);
