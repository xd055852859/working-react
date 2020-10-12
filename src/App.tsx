import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { useLocation, useHistory } from 'react-router-dom';
import { useTypedSelector } from './redux/reducer/RootState';
import { getSearchParamValue } from './services/util';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

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
  getCalendarList,
  setTaskKey,
} from './redux/actions/taskActions';
import Home from './views/home/home';
import Content from './views/content/content';
import WorkingTable from './views/workingTable/workingTable';
import GroupTable from './views/groupTable/groupTable';
import Chat from './views/chat/chat';
import Calendar from './views/calendar/calendar';
import TaskInfo from './components/taskInfo/taskInfo';

import closePng from './assets/img/close.png';
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
  const taskActionArray = useTypedSelector(
    (state) => state.task.taskActionArray
  );
  const taskAction = useTypedSelector((state) => state.task.taskAction);
  const theme = useTypedSelector((state) => state.auth.theme);
  const [intervalTime, setIntervalTime] = useState<any>(null);
  const [playAction, setPlayAction] = useState<any>({});
  const [playState, setPlayState] = useState(false);
  const [clientWidth, setClientWidth] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const calendarColor = [
    '#39B98D',
    '#3C8FB5',
    '#B762BD',
    '#86B93F',
    '#8B572A',
    '#D0021B',
    '#F5A623',
    '#FC766A',
    '#4A4A4A',
    '#9B9B9B',
  ];
  const pageRef: React.RefObject<any> = useRef();
  useEffect(() => {
    if (pageRef.current) {
      setClientWidth(pageRef.current.clientWidth);
      let clientHeight = pageRef.current.clientHeight;
      setClientHeight(clientHeight);
    }
  }, [pageRef.current]);
  useEffect(() => {
    // 用户已登录
    if (
      user &&
      user._key &&
      token &&
      token === localStorage.getItem('auth_token')
    ) {
      dispatch(getMainGroupKey());
      dispatch(getTheme());
      dispatch(
        getCalendarList(
          user._key,
          moment().startOf('month').startOf('day').valueOf(),
          moment().endOf('month').endOf('day').valueOf()
        )
      );
      let headerIndex = localStorage.getItem('headerIndex')
        ? localStorage.getItem('headerIndex')
        : '0';

      if (headerIndex) {
        if (headerIndex == '3') {
          dispatch(setMoveState('in'));
        }
        if (headerIndex == '5') {
          if (theme && !theme.calendarVisible) {
            headerIndex = '0';
          }
        } else {
          const targetUserKey = localStorage.getItem('targetUserKey');
          if (headerIndex == '2' && targetUserKey) {
            dispatch(getTargetUserInfo(targetUserKey));
          }
          dispatch(setMoveState('out'));
        }
        dispatch(setCommonHeaderIndex(parseInt(headerIndex)));
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
      if (getSearchParamValue(location.search, 'token')) {
        window.location.href = window.location.origin + '/';
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
      let url = window.location.href;
      // 自动切换为https
      if (url.indexOf('http://localhost') == -1 && url.indexOf('https') < 0) {
        url = url.replace('http:', 'https:');
        window.location.replace(url);
      }
    }
  }, [history, dispatch, location.search, user, token]);
  useEffect(() => {
    if (taskActionArray.length > 0) {
      clearInterval(intervalTime);
      let newIntervalTime: any = 0;
      formatAction();
      newIntervalTime = setInterval(formatAction, 1000);
      setIntervalTime(newIntervalTime);
    }
    if (taskActionArray.length == 0) {
      clearInterval(intervalTime);
    }
  }, [taskActionArray]);
  useEffect(() => {
    setPlayAction(_.cloneDeep(taskAction));
  }, [taskAction]);

  const formatAction = () => {
    const nowTime = moment().valueOf();
    taskActionArray.forEach((item: any, index: number) => {
      if (
        item.taskEndDate < nowTime + 1000 &&
        item.taskEndDate > nowTime - 1000 &&
        item.finishPercent
      ) {
        setPlayAction(item);
        setPlayState(true);
      }
    });
  };
  window.onresize = _.debounce(function () {
    setClientWidth(pageRef.current.clientWidth);
    let clientHeight = pageRef.current.clientHeight;
    setClientHeight(clientHeight);
  }, 500);
  return (
    <div
      className="App"
      style={
        theme.backgroundImg
          ? {
              backgroundImage:
                'url(' +
                theme.backgroundImg +
                '?imageMogr2/auto-orient/thumbnail/' +
                clientWidth +
                'x' +
                clientHeight +
                '/format/jpg' +
                ')',
            }
          : { backgroundColor: theme.backgroundColor }
      }
      onClick={() => {
        dispatch(setTaskKey(''));
      }}
      ref={pageRef}
    >
      <Home />
      {headerIndex === 0 ? <Content /> : null}
      {headerIndex === 1 ? <WorkingTable /> : null}
      {headerIndex === 3 ? <GroupTable /> : null}
      {headerIndex === 2 ? <WorkingTable /> : null}
      {headerIndex === 5 && theme && theme.calendarVisible ? (
        <Calendar />
      ) : null}
      <Chat />
      {taskInfoVisible ? <TaskInfo /> : null}
      {playState ? (
        <div className="action">
          <div className="action-title">日程提醒</div>
          <div
            className="action-container"
            style={{
              borderLeft: '2px solid ' + calendarColor[playAction.taskType],
            }}
          >
            {playAction.title}
          </div>
          <img
            src={closePng}
            className="action-close"
            onClick={() => {
              setPlayAction({});
              setPlayState(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default App;
