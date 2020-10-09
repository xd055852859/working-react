import moment from 'moment';
import _ from 'lodash';
export const actionTypes = {
  GET_GROUP_TASK: 'GET_GROUP_TASK',
  GET_GROUP_TASK_SUCCESS: 'GET_GROUP_TASK_SUCCESS',
  GET_TEAM_TASK: 'GET_TEAM_TASK',
  GET_TEAM_TASK_SUCCESS: 'GET_TEAM_TASK_SUCCESS',
  GET_PROJECT_TASK: 'GET_PROJECT_TASK',
  GET_PROJECT_TASK_SUCCESS: 'GET_PROJECT_TASK_SUCCESS',
  GET_SELF_TASK: 'GET_SELF_TASK',
  GET_SELF_TASK_SUCCESS: 'GET_SELF_TASK_SUCCESS',
  GET_WORKING_TABLE_TASK: 'GET_WORKING_TABLE_TASK',
  GET_WORKING_TABLE_TASK_SUCCESS: 'GET_WORKING_TABLE_TASK_SUCCESS',
  ADD_WORKING_TABLE_TASK: 'CREATE_WORKING_TABLE_TASK',
  ADD_WORKING_TABLE_TASK_SUCCESS: 'CREATE_WORKING_TABLE_TASK_SUCCESS',
  SET_TASK_KEY: 'SET_TASK_KEY',
  SET_TASK_INFO: 'SET_TASK_INFO',
  SET_CHOOSE_KEY: 'SET_CHOOSE_KEY',
  EDIT_TASK: 'EDIT_TASK',
  EDIT_TASK_SUCCESS: 'EDIT_TASK_SUCCESS',
  SET_FILTER_OBJECT: 'SET_FILTER_OBJECT',
  CHANGE_TASKINFO_VISIBLE: 'CHANGE_TASKINFO_VISIBLE',
  SET_TASK_ACTION: 'SET_TASK_ACTION',
  GET_CALENDAR_LIST: 'GET_CALENDAR_LIST',
  GET_CALENDAR_LIST_SUCCESS: 'GET_CALENDAR_LIST_SUCCESS',
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
  return { type: actionTypes.GET_GROUP_TASK_SUCCESS, data };
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
  return { type: actionTypes.GET_TEAM_TASK_SUCCESS, data };
}
export function getProjectTask(
  finishPercentArray: number[],
  groupKey?: string,
  startTime?: number | null,
  endTime?: number | null
) {
  return {
    type: actionTypes.GET_PROJECT_TASK,
    groupKey: groupKey,
    finishPercentArray: finishPercentArray,
    startTime: startTime,
    endTime: endTime,
  };
}
export function getProjectTaskSuccess(data: any) {
  return { type: actionTypes.GET_PROJECT_TASK_SUCCESS, data };
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
  return { type: actionTypes.GET_SELF_TASK_SUCCESS, data };
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
  return { type: actionTypes.GET_WORKING_TABLE_TASK_SUCCESS, data };
}
export function setTaskKey(taskKey: string | number) {
  return { type: actionTypes.SET_TASK_KEY, taskKey };
}
export function setChooseKey(chooseKey: string | number) {
  return { type: actionTypes.SET_CHOOSE_KEY, chooseKey };
}
export function setTaskInfo(taskInfo: any) {
  return { type: actionTypes.SET_TASK_INFO, taskInfo };
}

export function editTask(data: any, headerIndex: number) {
  return {
    type: actionTypes.EDIT_TASK,
    data,
    headerIndex,
  };
}
export function editTaskSuccess(data: any) {
  return { type: actionTypes.EDIT_TASK_SUCCESS, data };
}
export function addWorkingTableTask(
  title: string,
  groupKey: string,
  groupRole: number | string,
  labelKey: number | string,
  cardIndex: number | string,
  executorKey?: number | string
) {
  return {
    type: actionTypes.ADD_WORKING_TABLE_TASK,
    title: title,
    groupKey: groupKey,
    groupRole: groupRole,
    labelKey: labelKey,
    cardIndex: cardIndex,
    executorKey: executorKey,
  };
}
export function addWorkingTableTaskSuccess(data: any) {
  return { type: actionTypes.ADD_WORKING_TABLE_TASK_SUCCESS, data };
}
export function setFilterObject(filterObj: any) {
  console.log('filterObj', filterObj);
  return {
    type: actionTypes.SET_FILTER_OBJECT,
    filterObj: filterObj,
  };
}
export function changeTaskInfoVisible(taskInfoVisible: boolean) {
  return {
    type: actionTypes.CHANGE_TASKINFO_VISIBLE,
    taskInfoVisible: taskInfoVisible,
  };
}
export function setTaskAction(taskAction: any) {
  return {
    type: actionTypes.SET_TASK_ACTION,
    taskAction: taskAction,
  };
}

export function getCalendarList(
  targetUKey: string,
  startTime: number,
  endTime: number
) {
  return {
    type: actionTypes.GET_CALENDAR_LIST,
    targetUKey: targetUKey,
    startTime: startTime,
    endTime: endTime,
  };
}
export function getCalendarListSuccess(data: any) {
  return { type: actionTypes.GET_CALENDAR_LIST_SUCCESS, data };
}
