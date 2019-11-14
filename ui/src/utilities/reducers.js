import { combineReducers } from "redux";
import { appReducer } from "../App/reducers";
import { homeReducer } from "../Home/reducers";
import { captureReducer } from "../Capture/reducers";
import { libraryReducer } from "../Library/reducers";
import { searchReducer } from "../Search/reducers";

const rootReducer = combineReducers({
  appReducer,
  homeReducer,
  captureReducer,
  libraryReducer,
  searchReducer
});

export default rootReducer;
