import axios from "axios"
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAxiosErrorNotification } from "../Notifications";
import {
  CREATE_PHOTO,
  createPhotoFulfilled,
  createPhotoPending,
  createPhotoRejected
} from "./actions";

export const photoApiUrl = "/api/photo";

function* executeCreatePhoto(action) {
  console.log(executeCreatePhoto)
  yield put(createPhotoPending());
  try {
    const response = yield call(axios.post, photoApiUrl, {photo: action.payload.photo});
    yield put(createPhotoFulfilled(response));
  } catch (error) {
    yield put(createAxiosErrorNotification(error));
    yield put(createPhotoRejected(error));
  }
}

export function* watchCreatePhoto() {
  yield takeLatest(CREATE_PHOTO, executeCreatePhoto);
}

export default [
  watchCreatePhoto()
];

