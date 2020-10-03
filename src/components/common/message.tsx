import React from "react";
import { useTypedSelector } from "../../redux/reducer/RootState";
import { useDispatch } from "react-redux";
import { setMessage } from "../../redux/actions/commonActions";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Message() {
  const dispatch = useDispatch();
  const message = useTypedSelector((state) => state.common.message);
  return (
    <Snackbar
      open={message.visible}
      autoHideDuration={1000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={() => dispatch(setMessage(false, "", undefined))}
    >
      <Alert
        onClose={() => dispatch(setMessage(false, "", undefined))}
        severity={message.severity}
      >
        {message.text}
      </Alert>
    </Snackbar>
  );
}
