import { all } from 'redux-saga/effects'
import appSagas from '../App/sagas';
import searchSagas from '../Search/sagas';
import videoSagas from '../Video/sagas';

export default function* rootSaga() {
  yield all([
    ...appSagas,
    ...searchSagas,
    ...videoSagas,
  ]);
}
