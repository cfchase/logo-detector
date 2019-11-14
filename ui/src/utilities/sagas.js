import { all } from 'redux-saga/effects'
import appSagas from "../App/sagas";
import captureSagas from "../Capture/sagas";
import librarySagas from "../Library/sagas";
import searchSagas from "../Search/sagas";

export default function* rootSaga() {
  yield all([
    ...appSagas,
    ...captureSagas,
    ...librarySagas,
    ...searchSagas,
  ]);
}
