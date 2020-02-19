import axios from "axios"
import { call, put, takeEvery } from 'redux-saga/effects';
import { createAxiosErrorNotification } from "../Notifications";
import {
  PROCESS_FRAME,
  processFrameFulfilled,
  processFramePending,
  processFrameRejected
} from "./actions";

export const photoApiUrl = "/api/photos";

function* executeSearchPhoto(action) {
  yield put(processFramePending());
  try {
    const response = yield call(axios.post, photoApiUrl, {photo: action.payload.photo});
    yield put(processFrameFulfilled(response));
  } catch (error) {
    yield put(createAxiosErrorNotification(error));
    yield put(processFrameRejected(error));
  }
}

export function* watchProcessFrame() {
  yield takeEvery(PROCESS_FRAME, executeSearchPhoto);
}

export default [
  watchProcessFrame()
];

