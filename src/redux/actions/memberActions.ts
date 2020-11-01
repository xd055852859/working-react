export const actionTypes = {
  GET_MEMBER: 'GET_MEMBER',
  GET_MEMBER_SUCCESS: 'GET_MEMBER_SUCCESS',
  SET_MEMBER_HEADERINDEX: 'SET_MEMBER_HEADERINDEX',
  GET_GROUP_MEMBER: 'GET_GROUP_MEMBER',
  GET_GROUP_MEMBER_SUCCESS: 'GET_GROUP_MEMBER_SUCCESS'
};

export function getMember(groupId : string | null, sortType?: number) {
  return {type: actionTypes.GET_MEMBER, groupId: groupId, sortType: sortType};
}
export function getMemberSuccess(data : any) {
  return {type: actionTypes.GET_MEMBER_SUCCESS, data};
}
export function setHeaderIndex(memberHeaderIndex : number) {
  return {type: actionTypes.SET_MEMBER_HEADERINDEX, memberHeaderIndex};
}
export function getGroupMember(groupId : string | null, sortType?: number) {
  return {type: actionTypes.GET_GROUP_MEMBER, groupId: groupId, sortType: sortType};
}
export function getGroupMemberSuccess(data : any) {
  return {type: actionTypes.GET_GROUP_MEMBER_SUCCESS, data};
}