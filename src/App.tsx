import React, { useState, useEffect } from 'react';
import './App.css';
import { useLocation, useHistory } from 'react-router-dom';
import { useTypedSelector } from './redux/reducer/RootState';
import { getSearchParamValue } from './services/util';
import { useDispatch } from 'react-redux';
import {
  getUserInfo,
  getMainGroupKey,
  getUploadToken,
  getTheme,
  getTargetUserInfo,
} from './redux/actions/authActions';
import {
  setCommonHeaderIndex,
  setMoveState,
} from './redux/actions/commonActions';
import {
  setChooseKey,
  changeTaskInfoVisible,
} from './redux/actions/taskActions';
import Home from './views/home/home';
import Content from './views/content/content';
import WorkingTable from './views/workingTable/workingTable';
import GroupTable from './views/groupTable/groupTable';
import Chat from './views/chat/chat';
import TaskInfo from './components/taskInfo/taskInfo';
import { setGroupKey } from './redux/actions/groupActions';
const App: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const token = useTypedSelector((state) => state.auth.token);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const taskInfoVisible = useTypedSelector(
    (state) => state.task.taskInfoVisible
  );
  const theme = useTypedSelector((state) => state.auth.theme);
  const message = useTypedSelector((state) => state.common.message);
  useEffect(() => {
    // 用户已登录
    if (
      user &&
      user._key &&
      token &&
      token === localStorage.getItem('auth_token')
    ) {
      // console.log(user);
      dispatch(getMainGroupKey());
      dispatch(getTheme());
      const headerIndex = localStorage.getItem('headerIndex');

      if (headerIndex) {
        dispatch(setCommonHeaderIndex(parseInt(headerIndex)));
        if (headerIndex == '3') {
          dispatch(setMoveState('in'));
        } else {
          const targetUserKey = localStorage.getItem('targetUserKey');
          if (headerIndex == '2' && targetUserKey) {
            dispatch(getTargetUserInfo(targetUserKey));
          }
          dispatch(setMoveState('out'));
        }
      }
      const groupKey = localStorage.getItem('groupKey');
      if (groupKey) {
        dispatch(setGroupKey(groupKey));
        // dispatch(setMoveState('in'));
        // dispatch(setCommonHeaderIndex(3));
        // localStorage.setItem('groupKey', '');
      }
      const shareKey = localStorage.getItem('shareKey');
      if (shareKey) {
        dispatch(setChooseKey(shareKey));
        dispatch(changeTaskInfoVisible(true));
        localStorage.setItem('shareKey', '');
      }
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
        dispatch(getUploadToken());
      } else {
        history.push('/bootpage');
      }
      const groupKey = getSearchParamValue(location.search, 'groupKey');
      if (groupKey) {
        localStorage.setItem('groupKey', groupKey);
        window.location.href = window.location.origin + '/';
      }
      const shareKey = getSearchParamValue(location.search, 'shareKey');
      if (shareKey) {
        localStorage.setItem('shareKey', shareKey);
        window.location.href = window.location.origin + '/';
      }
    }
  }, [history, dispatch, location.search, user, token]);
  // useEffect(() => {
  //   if (document.querySelectorAll('svg')) {
  //     Array.from(document.querySelectorAll('svg')).forEach((item: any) => {
  //       if (item.parentElement.parentElement.style.width) {
  //         item.parentElement.parentElement.style.display = 'none';
  //       }
  //     });
  //   }
  // }, [document.querySelectorAll('svg')]);
  return (
    <div
      className="App"
      style={
        theme.backgroundImg
          ? { backgroundImage: 'url(' + theme.backgroundImg + ')' }
          : { backgroundColor: theme.backgroundColor }
      }
    >
      <Home />
      {headerIndex === 0 ? <Content /> : null}
      {headerIndex === 1 ? <WorkingTable /> : null}
      {headerIndex === 3 ? <GroupTable /> : null}
      {headerIndex === 2 ? <WorkingTable /> : null}
      <Chat />
      {taskInfoVisible ? <TaskInfo /> : null}
    </div>
  );
};

export default App;
