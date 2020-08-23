export const actionTypes = {
  GET_USERINFO: 'GET_USERINFO',
  GET_USERINFO_SUCCESS: 'GET_USERINFO_SUCCESS',
  GET_MAIN_GROUP_KEY: 'GET_MAIN_GROUP_KEY',
  GET_MAIN_GROUP_KEY_SUCCESS: 'GET_MAIN_GROUP_KEY_SUCCESS',
 
};

export function getUserInfo(token: string) {
  return {
    type: actionTypes.GET_USERINFO,
    token: token,
  };
}

export function getUserInfoSuccess(data: any) {
  return {
    type: actionTypes.GET_USERINFO_SUCCESS,
    data,
  };
}
export function getMainGroupKey() {
  return {
    type: actionTypes.GET_MAIN_GROUP_KEY,
  };
}

export function getMainGroupKeySuccess(data: any) {
  return {
    type: actionTypes.GET_MAIN_GROUP_KEY_SUCCESS,
    data,
  };
}


