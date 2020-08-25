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
  ADD_WORKING_TABLE_TASK: 'CREATE_WORKING_TABLE_TASK',
  ADD_WORKING_TABLE_TASK_SUCCESS: 'CREATE_WORKING_TABLE_TASK_SUCCESS',
  SET_TASK_KEY: 'SET_TASK_KEY',
  EDIT_TASK: 'EDIT_TASK',
  EDIT_TASK_SUCCESS: 'EDIT_TASK_SUCCESS',
  SET_Filter_OBJECT: 'SET_Filter_OBJECT',
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
export function editTask(data: any) {
  return {
    type: actionTypes.EDIT_TASK,
    key: data.key,
    title: data.title,
    finishPercent: data.finishPercent,
    taskEndDate: data.taskEndDate,
    todayTaskTime: data.todayTaskTime,
    content: data.content,
    taskType: data.taskType,
    executorKey: data.executorKey,
    importantStatus: data.importantStatus,
  };
}
export function editTaskSuccess(data: any) {
  return { type: actionTypes.EDIT_TASK_SUCCESS, data };
}
export function addWorkingTableTask(
  title: string,
  groupKey: number | string,
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
  return {
    type: actionTypes.SET_Filter_OBJECT,
    filterObj: filterObj,
  };
}
