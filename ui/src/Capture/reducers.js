import get from "lodash/get";
import {
  RESET_CAPTURE,
  CREATE_PHOTO_PENDING,
  CREATE_PHOTO_FULFILLED,
  CREATE_PHOTO_REJECTED
} from "./actions";

const initialState = {
  inferencePending: false,
  inferenceResponse: null,
  inference: null,
  inferenceError: null
};

export const captureReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_CAPTURE:
      return initialState;
    case CREATE_PHOTO_PENDING:
      return {
        ...state,
        inferencePending: true,
        inferenceResponse: null,
        inference: null,
      };
    case CREATE_PHOTO_FULFILLED:
      return {
        ...state,
        inferencePending: false,
        inferenceResponse: get(action, "payload.response"),
        inference: get(action, "payload.response.data.inference.logo_classes"),
      };
    case CREATE_PHOTO_REJECTED:
      return {
        ...state,
        inferencePending: false,
        inferenceError: get(action, "payload.response.error"),
      };
    default:
      return state;
  }
};
