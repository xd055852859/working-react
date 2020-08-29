import React, { useState, useEffect } from 'react';
import './App.css';
import { useLocation } from 'react-router-dom';
import { getSearchParamValue } from './services/util';
import { useDispatch } from 'react-redux';
import { getUserInfo, getMainGroupKey } from './redux/actions/authActions';
import { useHistory } from 'react-router-dom';
import { useTypedSelector } from './redux/reducer/RootState';
import Home from './views/home/home';
import Content from './views/content/content';
import WorkingTable from './views/workingTable/workingTable';
import GroupTable from './views/groupTable/groupTable';
import Chat from './views/chat/chat';
const App: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const token = useTypedSelector((state) => state.auth.token);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const theme = useTypedSelector((state) => state.auth.theme);
  const message = useTypedSelector((state) => state.common.message);
  useEffect(() => {
    // 用户已登录
    if (
      user &&
      user._key &&
      token &&
      token == localStorage.getItem('auth_token')
    ) {
      // console.log(user);
      dispatch(getMainGroupKey());
    }
    if (!user) {
      // 用户未登录
      const token =
        getSearchParamValue(location.search, 'token') ||
        localStorage.getItem('auth_token');
      if (token) {
        // 获取用户信息
        localStorage.setItem('auth_token', token);
        dispatch(getUserInfo(token));
      } else {
        history.push('/bootpage');
      }
    }
  }, [history, dispatch, location.search, user, token]);

  return (
    <div className="App" style={ theme.backgroundImg?{backgroundImage:'url('+theme.backgroundImg+')'}:{backgroundColor:theme.backgroundColor}}>
      <Home />
      {headerIndex == 0 ? <Content /> : null}
      {headerIndex == 1 ? <WorkingTable /> : null}
      {headerIndex == 3 ? <GroupTable /> : null}
      {headerIndex == 2 ? <WorkingTable /> : null}
      <div
        className="home-chat"
        style={headerIndex == 4 ? { zIndex: 1 } : { zIndex: -1 }}
      >
        <Chat />
      </div>
    </div>
  );
};

export default App;
