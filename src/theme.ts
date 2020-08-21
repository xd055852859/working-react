import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

//设置主题色
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "transparent",
    },
  },
});

export default theme;
