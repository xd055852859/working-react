import { call, put, takeLatest } from 'redux-saga/effects';
import { actionTypes, getGroupSuccess } from '../actions/groupActions';
import { Failed } from '../actions/commonActions';
import api from '../../services/api';

function* getGroup(action: any) {
  try {
    const res = yield call(api.group.getGroup, action.listType);
    if (res.msg === 'OK') {
      yield put(getGroupSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}

const groupSaga = [takeLatest(actionTypes.GET_GROUP, getGroup)];
export default groupSaga;
