import { actionTypes } from '../actions/memberActions';

export interface MemberType {
  memberArray: [] | null;
}

const defaultState: MemberType = {
  memberArray: null,
};

export const member = (state = defaultState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_MEMBER_SUCCESS:
      return {
        ...state,
        memberArray: action.data,
      };
    default:
      return state;
  }
};
