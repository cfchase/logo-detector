import { combineReducers } from "redux";
import { appReducer } from "../App/reducers";
import { homeReducer } from "../Home/reducers";
import { searchReducer } from "../Search/reducers";
import { videoReducer } from "../Video/reducers";

const rootReducer = combineReducers({
  appReducer,
  homeReducer,
  searchReducer,
  videoReducer
});

export default rootReducer;
