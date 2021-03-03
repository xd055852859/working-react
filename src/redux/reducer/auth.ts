import { actionTypes } from '../actions/authActions';
import moment from 'moment';
import io from 'socket.io-client';
import api from '../../services/api';
import _ from 'lodash';
export interface AuthType {
  user: any;
  userKey: string;
  mainGroupKey: string;
  mainEnterpriseGroup: any;
  targetUserKey: string;
  targetUserInfo: any;
  token: string | null;
  uploadToken: string | null;
  theme: any;
  themeBg: any;
  themeBgTotal: number;
  nowTime: number;
  socket: any;
  finishMusic: boolean;
  messageMusic: boolean;
  unFinishMusic: boolean;
  batchMusic: boolean;
  createMusic: boolean;
  startMusic: boolean;
  finishPos: any;
  clickType: string;
}

const defaultState: AuthType = {
  user: null,
  userKey: '',
  mainGroupKey: '',
  mainEnterpriseGroup: {},
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
    hourVisible: false,
    randomType: '1',
    calendarVisible: true,
    groupSortType: 1,
    personSortType: 1,
    finishPercentArr: ['0', '1', '2'],
    cDayShow: true,
    taskShow: true,
    timeShow: true,
    searchShow: true,
    weatherShow: true,
    grayPencent: 0,
    moveState: false,
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
      headerIndex: 0,
    },
  },
  themeBg: [],
  themeBgTotal: 0,
  nowTime: 0,
  socket: null,
  finishMusic: false,
  messageMusic: false,
  unFinishMusic: false,
  batchMusic: false,
  createMusic: false,
  startMusic: false,
  finishPos: [],
  clickType: 'other',
};

export const auth = (state = defaultState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_USERINFO_SUCCESS:
      localStorage.setItem('token', action.data.token);
      localStorage.setItem('userKey', action.data._key);
      const socket = io.connect(api.SOCKET_URL);
      // socket.on('online', () => {
      socket.emit('login', action.data._key);
      console.log(moment().hour());
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
    // case actionTypes.GET_MAIN_GROUP_KEY_SUCCESS:
    // localStorage.setItem('mainGroupKey', action.data.mainGroupKey);   return {
    // ...state,   };
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
      let theme: any = action.data.result;
      let otherInfo: any = action.data.otherInfo;
      if (!theme.backgroundColor && !theme.backgroundImg) {
        theme.backgroundColor = '#3C3C3C';
        theme.backgroundImg = '';
      }
      for (let key in state.theme) {
        if (
          theme[key] === undefined &&
          key !== 'backgroundColor' &&
          key !== 'backgroundImg'
        ) {
          theme[key] = state.theme[key];
        }
      }
      localStorage.setItem('mainGroupKey', otherInfo.mainGroupKey);
      return {
        ...state,
        theme: theme,
        mainGroupKey: otherInfo.mainGroupKey,
        mainEnterpriseGroup: {
          mainEnterpriseGroupKey: otherInfo.mainEnterpriseGroupKey
            ? otherInfo.mainEnterpriseGroupKey
            : '',
          mainEnterpriseGroupLogo: otherInfo.mainEnterpriseGroupLogo
            ? otherInfo.mainEnterpriseGroupLogo
            : '',
          mainEnterpriseGroupName: otherInfo.mainEnterpriseGroupName
            ? otherInfo.mainEnterpriseGroupName
            : '所有项目',
        },
      };
    case actionTypes.GET_THEME_BG_SUCCESS:
      let themeBg: any = _.cloneDeep(state.themeBg);
      if (action.data.page == 1) {
        themeBg = [];
      }
      action.data.res.data.forEach((item: any, index: number) => {
        item.url = encodeURI(item.url);
        themeBg.push(item);
      });

      return {
        ...state,
        themeBg: themeBg,
        themeBgTotal: action.data.res.total,
      };
    case actionTypes.SET_THEME_SUCCESS:
      return {
        ...state,
        theme: action.action.configInfo,
      };
    case actionTypes.SET_UPLOAD_TOKEN:
      return {
        ...state,
        uploadToken: action.uploadToken,
      };
    case actionTypes.GET_UPLOAD_TOKEN_SUCCESS:
      localStorage.setItem('uptoken', action.data);
      return {
        ...state,
        uploadToken: action.data,
      };
    case actionTypes.CHANGE_FINISH_MUSIC:
      return {
        ...state,
        finishMusic: action.finishMusic,
      };
    case actionTypes.CHANGE_MESSAGE_MUSIC:
      return {
        ...state,
        messageMusic: action.messageMusic,
      };
    case actionTypes.CHANGE_UNFINISH_MUSIC:
      return {
        ...state,
        unFinishMusic: action.unFinishMusic,
      };
    case actionTypes.CHANGE_BATCH_MUSIC:
      return {
        ...state,
        batchMusic: action.batchMusic,
      };
    case actionTypes.CHANGE_CREATE_MUSIC:
      return {
        ...state,
        createMusic: action.createMusic,
      };
    case actionTypes.CHANGE_START_MUSIC:
      return {
        ...state,
        startMusic: action.startMusic,
      };
    case actionTypes.CHANGE_MOVE:
      return {
        ...state,
        finishPos: action.finishPos,
      };
    case actionTypes.CLEAR_AUTH:
      state.targetUserKey = '';
      state.targetUserInfo = null;
      return {
        ...state,
      };
    case actionTypes.SET_CLICK_TYPE:
      return {
        ...state,
        clickType: action.clickType,
      };
    case actionTypes.CHANGE_MAINENTERPRISE_GROUP:
      console.log(action);
      return {
        ...state,
        mainEnterpriseGroup: {
          mainEnterpriseGroupKey: action.mainEnterpriseGroupKey,
          mainEnterpriseGroupLogo: action.mainEnterpriseGroupLogo,
          mainEnterpriseGroupName: action.mainEnterpriseGroupName,
        },
      };

    default:
      return state;
  }
};
