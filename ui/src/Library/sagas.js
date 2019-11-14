import axios from "axios"
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAxiosErrorNotification } from "../Notifications";
import {
  UPLOAD_FILE,
  uploadFileFulfilled,
  uploadFilePending,
  uploadFileRejected
} from "./actions";

export const fileApiUrl = "/api/files";

function* executeUploadFile(action) {
  console.log(executeUploadFile);
  yield put(uploadFilePending());
  try {
    const response = yield call(axios.post, fileApiUrl, {file: action.payload.file});
    yield put(uploadFileFulfilled(response));
  } catch (error) {
    yield put(createAxiosErrorNotification(error));
    yield put(uploadFileRejected(error));
  }
}

export function* watchUploadFile() {
  yield takeLatest(UPLOAD_FILE, executeUploadFile);
}

export default [
  watchUploadFile()
];

