import { actionTypes as commonActionTypes } from "../actions/commonActions";

interface Message {
  visible: boolean;
  text: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

export interface Common {
  loading: boolean;
  showApps: boolean;
  showNotification: boolean;
  showSearch: boolean;
  message: Message;
}

const defaultState: Common = {
  loading: false,
  showApps: false,
  showNotification: false,
  showSearch: false,
  message: {
    visible: false,
    text: "",
    severity: undefined,
  },
};

export const common = (state = defaultState, action: any) => {
  switch (action.type) {
    case commonActionTypes.FAILED:
      return {
        ...state,
        loading: false,
        message: {
          visible: true,
          text: action.error.msg,
          severity: "error",
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
    default:
      return state;
  }
};