import { actionTypes as commonActionTypes } from '../actions/commonActions';
interface Message {
  visible: boolean;
  text: string;
  severity: 'success' | 'info' | 'warning' | 'error' | undefined;
}

export interface Common {
  loading: boolean;
  showApps: boolean;
  showNotification: boolean;
  showSearch: boolean;
  message: Message;
  headerIndex: any;
  moveState: string;
  chatState: boolean;
}

const defaultState: Common = {
  loading: false,
  showApps: false,
  showNotification: false,
  showSearch: false,
  message: {
    visible: false,
    text: '',
    severity: undefined,
  },
  // headerIndex: 3,
  headerIndex: null,
  moveState: '',
  chatState: false,
};

export const common = (state = defaultState, action: any) => {
  switch (action.type) {
    case commonActionTypes.FAILED:
      if (action.error.statusCode === '701') {
        const redirect = `${window.location.protocol}//${window.location.host}`;
        // window.location.href = `https://account.qingtime.cn?apphigh=27&redirect=${redirect}&logo=https://working.vip/page/logo2.svg`;
        window.location.href = `${redirect}/bootpage`;
      }
      return {
        ...state,
        loading: false,
        message: {
          visible: true,
          text: action.error.msg,
          severity: 'error',
        },
      };
    case commonActionTypes.SWITCH_APPS:
      return {
        ...state,
        showApps:
          action.visible !== undefined ? action.visible : !state.showApps,
      };
    case commonActionTypes.SWITCH_NOTIFICATION:
      return {
        ...state,
        showNotification:
          action.visible !== undefined
            ? action.visible
            : !state.showNotification,
      };
    case commonActionTypes.SWITCH_SEARCH:
      return {
        ...state,
        showSearch:
          action.visible !== undefined ? action.visible : !state.showSearch,
      };
    case commonActionTypes.SET_MESSAGE:
      return {
        ...state,
        message: {
          visible: action.visible,
          text: action.text,
          severity: action.severity ? action.severity : state.message.severity,
        },
      };
    case commonActionTypes.SET_HEADERINDEX:
      return {
        ...state,
        headerIndex: action.headerIndex,
      };
    case commonActionTypes.SET_MOVESTATE:
      return {
        ...state,
        moveState: action.moveState,
      };
    case commonActionTypes.LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case commonActionTypes.SET_CHATSTATE:
      return {
        ...state,
        chatState: action.chatState,
      };
    default:
      return state;
  }
};
