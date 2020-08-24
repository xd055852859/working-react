import { actionTypes } from '../actions/authActions';

export interface AuthType {
  user: any;
  userKey: string;
  mainGroupKey: string;
  targetUserKey: string;
  targetUserInfo: any;
  token: string | null;
}

const defaultState: AuthType = {
  user: null,
  userKey: '',
  mainGroupKey: '',
  targetUserKey: '',
  targetUserInfo: null,
  token: null,
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
    default:
      return state;
  }
};
