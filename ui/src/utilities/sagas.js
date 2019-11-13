import { all } from 'redux-saga/effects'
import appSagas from "../App/sagas";
import captureSagas from "../Capture/sagas";

export default function* rootSaga() {
  yield all([
    ...appSagas,
    ...captureSagas,
  ]);
}
