import { actionTypes } from '../actions/memberActions';
import _ from 'lodash';
export interface MemberType {
  memberArray: any;
  memberHeaderIndex: number;
  groupMemberArray: any;
  groupMemberItem: any;
}

const defaultState: MemberType = {
  memberArray: null,
  memberHeaderIndex: 0,
  groupMemberArray: null,
  groupMemberItem: null,
};

export const member = (state = defaultState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_MEMBER_SUCCESS:
      action.data.forEach((item: any) => {
        if (item.avatar && item.avatar.indexOf('https') === -1) {
          item.avatar = item.avatar.replace('http', 'https');
        }
      });
      return {
        ...state,
        memberArray: action.data,
      };
    case actionTypes.SET_MEMBER_HEADERINDEX:
      return {
        ...state,
        memberHeaderIndex: action.memberHeaderIndex,
      };
    case actionTypes.GET_GROUP_MEMBER_SUCCESS:
      let userIndex = _.findIndex(action.data, {
        userId: localStorage.getItem('userKey'),
      });
      let groupMemberItem = action.data[userIndex];
      action.data.forEach((item: any) => {
        if (item.avatar && item.avatar.indexOf('https') === -1) {
          item.avatar = item.avatar.replace('http', 'https');
        }
      });
      if (!groupMemberItem.config) {
        groupMemberItem.config = {
          groupKey: null,
          groupName: '',
          groupLogo: '',
          creatorKey: null,
          creatorAvatar: '',
          creatorName: '',
          executorKey: null,
          executorAvatar: '',
          executorName: '',
          filterType: ['过期', '今天', '已完成'],
        };
      }
      return {
        ...state,
        groupMemberArray: action.data,
        groupMemberItem: action.data[userIndex],
      };
    default:
      return state;
  }
};
