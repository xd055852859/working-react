export const actionTypes = {
  GET_USERINFO: 'GET_USERINFO',
  GET_USERINFO_SUCCESS: 'GET_USERINFO_SUCCESS',
  GET_MAIN_GROUP_KEY: 'GET_MAIN_GROUP_KEY',
  GET_MAIN_GROUP_KEY_SUCCESS: 'GET_MAIN_GROUP_KEY_SUCCESS',
  SET_TARGET_USER_KEY: 'SET_TARGET_USER_KEY',
  GET_TARGET_USERINFO: 'GET_TARGET_USERINFO',
  GET_TARGET_USERINFO_SUCCESS: 'GET_TARGET_USERINFO_SUCCESS',
  GET_THEME: 'GET_THEME',
  GET_THEME_SUCCESS: 'GET_THEME_SUCCESS',
  SET_THEME: 'SET_THEME',
  SET_THEME_SUCCESS: 'SET_THEME_SUCCESS',
  GET_UPLOAD_TOKEN: 'GET_UPLOAD_TOKEN',
  GET_UPLOAD_TOKEN_SUCCESS: 'GET_UPLOAD_TOKEN_SUCCESS',
};

export function getUserInfo(token: string | null) {
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

export function setTargetUserKey(targetUserKey: string) {
  return {
    type: actionTypes.SET_TARGET_USER_KEY,
    targetUserKey: targetUserKey,
  };
}
// export function userKeyToGroupKey(targetUserKey: string) {
//   return {
//     type: actionTypes.SET_TARGET_USER_KEY,
//     targetUserKey: targetUserKey,
//   };
// }

export function getTargetUserInfo(targetUserKey: string) {
  return {
    type: actionTypes.GET_TARGET_USERINFO,
    targetUserKey: targetUserKey,
  };
}

export function getTargetUserInfoSuccess(data: any) {
  return {
    type: actionTypes.GET_TARGET_USERINFO_SUCCESS,
    data,
  };
}
export function getTheme() {
  return {
    type: actionTypes.GET_THEME,
  };
}

export function getThemeSuccess(data: any) {
  return {
    type: actionTypes.GET_THEME_SUCCESS,
    data,
  };
}
export function setTheme(configInfo: any) {
  return {
    type: actionTypes.SET_THEME,
    configInfo: configInfo,
  };
}

export function setThemeSuccess(data: any, action: any) {
  return {
    type: actionTypes.SET_THEME_SUCCESS,
    data,
    action,
  };
}
export function getUploadToken() {
  return {
    type: actionTypes.GET_UPLOAD_TOKEN,
  };
}

export function getUploadTokenSuccess(data: any) {
  return {
    type: actionTypes.GET_UPLOAD_TOKEN_SUCCESS,
    data,
  };
}
