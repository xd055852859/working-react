import { actionTypes } from '../actions/authActions';

export interface AuthType {
  user: any;
  userKey: string;
  mainGroupKey: string;
  targetUserKey: string;
  targetUserInfo: any;
  token: string | null;
  uploadToken: string | null;
  theme: any;
}

const defaultState: AuthType = {
  user: null,
  userKey: '',
  mainGroupKey: '',
  targetUserKey: '',
  targetUserInfo: null,
  token: null,
  uploadToken: null,
  theme: {
    backgroundColor: '',
    backgroundImg: '',
    mainVisible: true,
    messageVisible: false,
    memberVisible: false,
    groupSortType: 1,
    personSortType: 1,
  },
};

export const auth = (state = defaultState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_USERINFO_SUCCESS:
      localStorage.setItem('auth_token', action.data.token);
      return {
        ...state,
        user: action.data,
        userKey: action.data._key,
        token: action.data.token,
      };
    case actionTypes.GET_MAIN_GROUP_KEY_SUCCESS:
      localStorage.setItem('mainGroupKey', action.data.mainGroupKey);
      return {
        ...state,
        mainGroupKey: action.data.mainGroupKey,
      };
    case actionTypes.SET_TARGET_USER_KEY:
      return {
        ...state,
        targetUserInfo: action.targetUserInfo,
      };
    case actionTypes.GET_TARGET_USERINFO_SUCCESS:
      return {
        ...state,
        targetUserInfo: action.data,
      };
    case actionTypes.GET_THEME_SUCCESS:
      if (!action.data.backgroundColor && action.data.backgroundImg) {
        action.data.backgroundColor = '#46558C';
      }
      action.data.mainVisible =
        action.data.mainVisible === undefined ? true : action.data.mainVisible;
      return {
        ...state,
        theme: action.data,
      };
    case actionTypes.SET_THEME_SUCCESS:
      return {
        ...state,
        theme: action.action.configInfo,
      };
    case actionTypes.GET_UPLOAD_TOKEN_SUCCESS:
      localStorage.setItem('uptoken', action.data);
      return {
        ...state,
        uploadToken: action.data,
      };
    default:
      return state;
  }
};
