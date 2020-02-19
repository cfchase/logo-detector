import get from "lodash/get";
import {
  RESET_VIDEO,
  PROCESS_FRAME_PENDING,
  PROCESS_FRAME_FULFILLED,
  PROCESS_FRAME_REJECTED
} from "./actions";

const initialState = {
  inferencePending: false,
  inferenceResponse: null,
  inference: null,
  inferenceError: null
};

export const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_VIDEO:
      return initialState;
    case PROCESS_FRAME_PENDING:
      return {
        ...state,
        inferencePending: true,
        inferenceResponse: null,
      };
    case PROCESS_FRAME_FULFILLED:
      return {
        ...state,
        inferencePending: false,
        inferenceResponse: get(action, "payload.response"),
        inference: get(action, "payload.response.data.inference"),
        frame: get(action, "payload.response.data.photo"),
      };
    case PROCESS_FRAME_REJECTED:
      return {
        ...state,
        inferencePending: false,
        inferenceError: get(action, "payload.response.error"),
      };
    default:
      return state;
  }
};
