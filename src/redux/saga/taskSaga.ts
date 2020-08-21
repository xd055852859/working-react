import {call, put, takeLatest} from 'redux-saga/effects';
import {
  actionTypes,
  getGroupTaskSuccess,
  getTeamTaskSuccess,
  getSelfTaskSuccess,
  getWorkingTableSuccess,
  editTaskSuccess
} from '../actions/taskActions';
import {Failed} from '../actions/commonActions';
import api from '../../services/api';

function * getGroupTask(action : any) {
  try {
    const res = yield call(api.task.getTaskList, action.typeBoard1, action.targetUGKey, action.finishPercentArray, action.fileDay);
    console.log('res', res);
    if (res.msg === 'OK') {
      yield put(getGroupTaskSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function * getTeamTask(action : any) {
  try {
    const res = yield call(api.task.getTeamTask, action.finishPercentArray, action.groupKey, action.startTime, action.endTime);
    if (res.msg === 'OK') {
      yield put(getTeamTaskSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function * getSelfTask(action : any) {
  try {
    const res = yield call(api.task.getTaskList, action.typeBoard1, action.targetUGKey, action.finishPercentArray, action.fileDay);
    if (res.msg === 'OK') {
      yield put(getSelfTaskSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}

function * getWorkingTableTask(action : any) {
  try {
    const res = yield call(api.task.getGroupTask, action.type1, action.targetUKey, action.type2, action.finishPercentArray, action.fileDay);
    console.log('res', res);
    if (res.msg === 'OK') {
      yield put(getWorkingTableSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
function * editTask(action : any) {
  try {
    const res = yield call(api.task.editTask, action.key, action.title, action.finishPercent, action.taskEndDate, action.todayTaskTime, action.content, action.taskType, action.executorKey, action.importantStatus);
    console.log('res', res);
    if (res.msg === 'OK') {
      yield put(editTaskSuccess(res.result));
    } else {
      yield put(Failed(res));
    }
  } catch (e) {
    yield put(Failed(e));
  }
}
const taskSaga = [
  takeLatest(actionTypes.GET_GROUP_TASK, getGroupTask),
  takeLatest(actionTypes.GET_TEAM_TASK, getTeamTask),
  takeLatest(actionTypes.GET_SELF_TASK, getSelfTask),
  takeLatest(actionTypes.GET_WORKING_TABLE_TASK, getWorkingTableTask),
  takeLatest(actionTypes.EDIT_TASK, editTask)
];

export default taskSaga;
