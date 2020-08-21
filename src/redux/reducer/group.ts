import { actionTypes } from '../actions/groupActions';

export interface GroupType {
  groupArray: [] | null;
  groupKey: number | string;
}

const defaultState: GroupType = {
  groupArray: null,
  groupKey: 0,
};

export const group = (state = defaultState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_GROUP_SUCCESS:
      let groupArray = action.data.filter((item: any, index: number) => {
        return item.groupName.indexOf('主群') == -1;
      });
      return {
        ...state,
        groupArray: groupArray,
      };
    case actionTypes.SET_GROUP_KEY:
      console.log(action);
      return {
        ...state,
        groupKey: action.groupKey,
      };
    default:
      return state;
  }
};
