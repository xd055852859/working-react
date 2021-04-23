import React from 'react';
import ReactDOM from 'react-dom';
// import './index.less';
import './index.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import Views from './view';
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <Views />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);
