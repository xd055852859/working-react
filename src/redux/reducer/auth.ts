import {actionTypes} from '../actions/authActions';

export interface AuthType {
  user : any;
  mainGroupKey : string;
}

const defaultState : AuthType = {
  user: null,
  mainGroupKey: ''
};

export const auth = (state = defaultState, action : any) => {
  switch (action.type) {
    case actionTypes.GET_USERINFO_SUCCESS:
      return {
        ...state,
        user: action.data
      };
    case actionTypes.GET_MAIN_GROUP_KEY_SUCCESS:
      localStorage.setItem('mainGroupKey', action.data.mainGroupKey);
      return {
        ...state,
        mainGroupKey: action.data.mainGroupKey
      };
    default:
      return state;
  }
};
