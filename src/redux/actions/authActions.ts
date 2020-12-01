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
  GET_THEME_BG: 'GET_THEME_BG',
  GET_THEME_BG_SUCCESS: 'GET_THEME_BG_SUCCESS',
  SET_THEME_BG_PAGE: 'SET_THEME_BG_PAGE',
  SET_THEME: 'SET_THEME',
  SET_THEME_SUCCESS: 'SET_THEME_SUCCESS',
  GET_UPLOAD_TOKEN: 'GET_UPLOAD_TOKEN',
  GET_UPLOAD_TOKEN_SUCCESS: 'GET_UPLOAD_TOKEN_SUCCESS',
  CHANGE_FINISH_MUSIC: 'CHANGE_FINISH_MUSIC',
  CHANGE_MESSAGE_MUSIC:'CHANGE_MESSAGE_MUSIC',
  CHANGE_UNFINISH_MUSIC:'CHANGE_UNFINISH_MUSIC',
  CHANGE_BATCH_MUSIC:'CHANGE_BATCH_MUSIC',
  CHANGE_MOVE: 'CHANGE_MOVE',
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
export function getThemeBg(page: number) {
  return {
    type: actionTypes.GET_THEME_BG,
    page: page,
  };
}

export function getThemeBgSuccess(data: any) {
  return {
    type: actionTypes.GET_THEME_BG_SUCCESS,
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
export function changeMusic(finishMusic: boolean) {
  return {
    type: actionTypes.CHANGE_FINISH_MUSIC,
    finishMusic,
  };
}

export function changeMessageMusic(messageMusic: boolean) {
  return {
    type: actionTypes.CHANGE_MESSAGE_MUSIC,
    messageMusic,
  };
}
export function changeunMusic(unFinishMusic: boolean) {
  return {
    type: actionTypes.CHANGE_UNFINISH_MUSIC,
    unFinishMusic,
  };
}
export function changeBatchMusic(batchMusic: boolean) {
  return {
    type: actionTypes.CHANGE_BATCH_MUSIC,
    batchMusic,
  };
}
export function changeMove(finishPos: any) {
  return {
    type: actionTypes.CHANGE_MOVE,
    finishPos,
  };
}
