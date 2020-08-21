export const actionTypes = {
  GET_GROUP: 'GET_GROUP',
  GET_GROUP_SUCCESS: 'GET_GROUP_SUCCESS',
  SET_GROUP_KEY: 'SET_GROUP_KEY',
};

export function getGroup(listType: number) {
  return {
    type: actionTypes.GET_GROUP,
    listType: listType,
  };
}
export function getGroupSuccess(data: any) {
  return {
    type: actionTypes.GET_GROUP_SUCCESS,
    data,
  };
}
export function setGroupKey(groupKey: string | number) {
  return {
    type: actionTypes.SET_GROUP_KEY,
    groupKey,
  };
}
