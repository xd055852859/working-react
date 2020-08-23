export const actionTypes = {
  FAILED: "FAILED",
  SWITCH_APPS: "SWITCH_APPS",
  SWITCH_NOTIFICATION: "SWITCH_NOTIFICATION",
  SWITCH_SEARCH: "SWITCH_SEARCH",
  SET_MESSAGE: "SET_MESSAGE",
  SET_HEADERINDEX:'SET_HEADERINDEX'
};

export function Failed(error: any) {
  console.log("---error---", error);
  return {
    type: actionTypes.FAILED,
    error,
  };
}

export function switchApps(visible?: boolean) {
  return {
    type: actionTypes.SWITCH_APPS,
    visible: visible,
  };
}

export function switchNotification(visible?: boolean) {
  return {
    type: actionTypes.SWITCH_NOTIFICATION,
    visible: visible,
  };
}

export function switchSearch(visible?: boolean) {
  return {
    type: actionTypes.SWITCH_SEARCH,
    visible: visible,
  };
}

export function setMessage(
  visible: boolean,
  text: string,
  severity: "success" | "info" | "warning" | "error" | undefined
) {
  return { type: actionTypes.SET_MESSAGE, visible, text, severity };
}
export function setHeaderIndex(headerIndex: number) {
  return {
    type: actionTypes.SET_HEADERINDEX,
    headerIndex
  };
}
