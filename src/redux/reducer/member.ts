import {actionTypes} from '../actions/memberActions';

export interface MemberType {
  memberArray : any;
  memberHeaderIndex : number
}

const defaultState : MemberType = {
  memberArray: null,
  memberHeaderIndex: 0
};

export const member = (state = defaultState, action : any) => {
  switch (action.type) {
    case actionTypes.GET_MEMBER_SUCCESS:
      return {
        ...state,
        memberArray: action.data
      };
    case actionTypes.SET_MEMBER_HEADERINDEX:
      return {
        ...state,
        memberHeaderIndex: action.memberHeaderIndex
      };
    default:
      return state;
  }
};
