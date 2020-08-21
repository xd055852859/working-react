import { call, put, takeLatest } from 'redux-saga/effects';
import {
  actionTypes,
  getUserInfoSuccess,
  getMainGroupKeySuccess,
} from '../actions/authActions';
import { Failed } from '../actions/commonActions';
import api from '../../services/api';

function* getUser(action: any) {
  try {
    const res = yield call(api.auth.getUserInfo, action.token);
    if (res.msg === 'OK') {
      yield put(getUserInfoSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getMainGroupKey(action: any) {
  try {
    const res = yield call(api.auth.getMainGroupKey);

    if (res.msg === 'OK') {
      yield put(getMainGroupKeySuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}

const authSaga = [
  takeLatest(actionTypes.GET_USERINFO, getUser),
  takeLatest(actionTypes.GET_MAIN_GROUP_KEY, getMainGroupKey),
];
export default authSaga;
