import { actionTypes } from '../actions/authActions';

export interface AuthType {
  user: any;
  mainGroupKey: string | null;
  headerIndex: number;
}

const defaultState: AuthType = {
  user: null,
  mainGroupKey: null,
  headerIndex: 0,
};

export const auth = (state = defaultState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_USERINFO_SUCCESS:
      return {
        ...state,
        user: action.data,
      };
    case actionTypes.GET_MAIN_GROUP_KEY_SUCCESS:
      localStorage.setItem('mainGroupKey', action.data.mainGroupKey);
      return {
        ...state,
        mainGroupKey: action.data.mainGroupKey,
      };
      case actionTypes.SET_HEADERINDEX:
        return {
          ...state,
          headerIndex: action.headerIndex,
        };
    default:
      return state;
  }
};
