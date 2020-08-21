import moment from 'moment';
export const actionTypes = {
  GET_GROUP_TASK: 'GET_GROUP_TASK',
  GET_GROUP_TASK_SUCCESS: 'GET_GROUP_TASK_SUCCESS',
  GET_TEAM_TASK: 'GET_TEAM_TASK',
  GET_TEAM_TASK_SUCCESS: 'GET_TEAM_TASK_SUCCESS',
  GET_SELF_TASK: 'GET_SELF_TASK',
  GET_SELF_TASK_SUCCESS: 'GET_SELF_TASK_SUCCESS',
  GET_WORKING_TABLE_TASK: 'GET_WORKING_TABLE_TASK',
  GET_WORKING_TABLE_TASK_SUCCESS: 'GET_WORKING_TABLE_TASK_SUCCESS',
  SET_TASK_KEY:'SET_TASK_KEY'
};

export function getGroupTask(
  typeBoard1: number,
  targetUGKey: string | number,
  finishPercentArray: string,
  fileDay?: number
) {
  return {
    type: actionTypes.GET_GROUP_TASK,
    typeBoard1: typeBoard1,
    targetUGKey: targetUGKey,
    finishPercentArray: finishPercentArray,
    fileDay: fileDay,
  };
}
export function getGroupTaskSuccess(data: any) {
  return {
    type: actionTypes.GET_GROUP_TASK_SUCCESS,
    data,
  };
}
export function getTeamTask(
  finishPercentArray: number[],
  groupKey?: string,
  startTime?: number | null,
  endTime?: number | null
) {
  return {
    type: actionTypes.GET_TEAM_TASK,
    groupKey: groupKey,
    finishPercentArray: finishPercentArray,
    startTime: startTime,
    endTime: endTime,
  };
}
export function getTeamTaskSuccess(data: any) {
  return {
    type: actionTypes.GET_TEAM_TASK_SUCCESS,
    data,
  };
}
export function getSelfTask(
  typeBoard1: number,
  targetUGKey: string,
  finishPercentArray: string,
  fileDay?: number
) {
  return {
    type: actionTypes.GET_SELF_TASK,
    typeBoard1: typeBoard1,
    targetUGKey: targetUGKey,
    finishPercentArray: finishPercentArray,
    fileDay: fileDay,
  };
}
export function getSelfTaskSuccess(data: any) {
  return {
    type: actionTypes.GET_SELF_TASK_SUCCESS,
    data,
  };
}
export function getWorkingTableTask(
  type1: number,
  targetUKey: string,
  type2: number,
  finishPercentArray: number[],
  fileDay?: number
) {
  return {
    type: actionTypes.GET_WORKING_TABLE_TASK,
    type1: type1,
    targetUKey: targetUKey,
    type2: type2,
    finishPercentArray: finishPercentArray,
    fileDay: fileDay,
  };
}
export function getWorkingTableSuccess(data: any) {
  return {
    type: actionTypes.GET_WORKING_TABLE_TASK_SUCCESS,
    data,
  };
}
export function setTaskKey(taskKey: string | number) {
  return {
    type: actionTypes.SET_TASK_KEY,
    taskKey,
  };
}