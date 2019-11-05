import get from "lodash/get";

import { GET_STATUS_FULFILLED } from "./actions";

const initialState = {
  status: null
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STATUS_FULFILLED:
      return {
        ...state,
        status: get(action, "payload.response.data"),
      };
    default:
      return state;
  }
};
