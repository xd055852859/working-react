export const actionTypes = {
  GET_MEMBER: 'GET_MEMBER',
  GET_MEMBER_SUCCESS: 'GET_MEMBER_SUCCESS',
};

export function getMember(groupId: string) {
  return {
    type: actionTypes.GET_MEMBER,
    groupId: groupId,
  };
}
export function getMemberSuccess(data: any) {
  return {
    type: actionTypes.GET_MEMBER_SUCCESS,
    data,
  };
}
