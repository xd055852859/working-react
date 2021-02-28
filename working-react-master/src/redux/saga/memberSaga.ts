import { call, put, takeLatest } from 'redux-saga/effects';
import {
  actionTypes,
  getMemberSuccess,
  getGroupMemberSuccess,
} from '../actions/memberActions';
import { Failed } from '../actions/commonActions';
import api from '../../services/api';

function* getMember(action: any) {
  try {
    const res = yield call(
      api.member.getMember,
      action.groupId,   
      action.sortType,
      action.simple,
    );
    if (res.msg === 'OK') {
      yield put(getMemberSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function* getGroupMember(action: any) {
  try {
    const res = yield call(api.member.getMember, action.groupId, action.sortType);
    if (res.msg === 'OK') {
      yield put(getGroupMemberSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}

const memberSaga = [
  takeLatest(actionTypes.GET_MEMBER, getMember),
  takeLatest(actionTypes.GET_GROUP_MEMBER, getGroupMember),
];
export default memberSaga;
