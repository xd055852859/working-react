import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

//设置主题色
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#17B881',
    },
    secondary: {
      main: '#19857b',
    },
    // #e94848
    error: {
      main: red.A400,
    },
    background: {
      default: 'transparent',
    },
  },
  overrides: {
    // 样式表的名字 ⚛️
    MuiDialog: {
      // 规则的名字
      paper: {
        // 一些 CSS
        minWidth: '400px',
        minHeight: '300px',
      },
    },
  },
});

export default theme;
