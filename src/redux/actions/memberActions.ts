export const actionTypes = {
  GET_MEMBER: 'GET_MEMBER',
  GET_MEMBER_SUCCESS: 'GET_MEMBER_SUCCESS',
  SET_MEMBER_HEADERINDEX: 'SET_MEMBER_HEADERINDEX'
};

export function getMember(groupId : string | null) {
  return {type: actionTypes.GET_MEMBER, groupId: groupId};
}
export function getMemberSuccess(data : any) {
  return {type: actionTypes.GET_MEMBER_SUCCESS, data};
}
export function setHeaderIndex(memberHeaderIndex : number) {
  return {type: actionTypes.SET_MEMBER_HEADERINDEX, memberHeaderIndex};
}