import { actionTypes } from '../actions/authActions';
import moment from 'moment';
import io from 'socket.io-client';
import api from '../../services/api';
export interface AuthType {
  user: any;
  userKey: string;
  mainGroupKey: string;
  targetUserKey: string;
  targetUserInfo: any;
  token: string | null;
  uploadToken: string | null;
  theme: any;
  themeBg: any;
  nowTime: number;
  socket: any;
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
    backgroundColor: '#3C3C3C',
    backgroundImg: '',
    mainVisible: true,
    messageVisible: false,
    memberVisible: false,
    randomVisible: false,
    randomType: true,
    calendarVisible: true,
    groupSortType: 1,
    personSortType: 1,
    filterObject: {
      groupKey: null,
      groupName: '',
      groupLogo: '',
      creatorKey: null,
      creatorAvatar: '',
      creatorName: '',
      executorKey: null,
      executorAvatar: '',
      executorName: '',
      filterType: ['过期', '今天', '未来', '已完成'],
      fileDay: 0,
    },
  },
  themeBg: [],
  nowTime: 0,
  socket: null,
};

export const auth = (state = defaultState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_USERINFO_SUCCESS:
      localStorage.setItem('auth_token', action.data.token);
      localStorage.setItem('userKey', action.data._key);
      const socket = io.connect(api.SOCKET_URL);
      // socket.on('online', () => {
      socket.emit('login', action.data._key);
      return {
        ...state,
        user: action.data,
        userKey: action.data._key,
        token: action.data.token,
        nowTime: moment().hour() < 12 ? 0 : 1,
        socket: socket,
        targetUserKey: localStorage.getItem('targetUserKey')
          ? localStorage.getItem('targetUserKey')
          : '',
      };
    case actionTypes.GET_MAIN_GROUP_KEY_SUCCESS:
      localStorage.setItem('mainGroupKey', action.data.mainGroupKey);
      return {
        ...state,
        mainGroupKey: action.data.mainGroupKey,
      };
    case actionTypes.SET_TARGET_USER_KEY:
      localStorage.setItem('targetUserKey', action.targetUserInfo._key);
      return {
        ...state,
        targetUserInfo: action.targetUserInfo,
        targetUserKey: action.targetUserInfo._key,
      };
    case actionTypes.GET_TARGET_USERINFO_SUCCESS:
      localStorage.setItem('targetUserKey', action.data._key);
      return {
        ...state,
        targetUserInfo: action.data,
        targetUserKey: action.data._key,
      };
    case actionTypes.GET_THEME_SUCCESS:
      if (!action.data.backgroundColor && !action.data.backgroundImg) {
        action.data.backgroundColor = '#3C3C3C';
      }
      action.data.mainVisible =
        action.data.mainVisible === undefined ? true : action.data.mainVisible;
      action.data.filterObject = action.data.filterObject
        ? action.data.filterObject
        : {
            groupKey: null,
            groupName: '',
            groupLogo: '',
            creatorKey: null,
            creatorAvatar: '',
            creatorName: '',
            executorKey: null,
            executorAvatar: '',
            executorName: '',
            filterType: ['过期', '今天', '未来', '已完成'],
          };
      action.data.fileDay = !action.data.fileDay ? 7 : action.data.fileDay;
      return {
        ...state,
        theme: action.data,
      };
    case actionTypes.GET_THEME_BG_SUCCESS:
      let themeBg: any = [];
      action.data.forEach((item: any) => {
        themeBg.push(item.url);
      });
      return {
        ...state,
        themeBg: themeBg,
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
