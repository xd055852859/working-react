import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { useLocation, useHistory } from 'react-router-dom';
import { useTypedSelector } from './redux/reducer/RootState';
import { getSearchParamValue } from './services/util';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import format from './components/common/format';
import {
  getUserInfo,
  getMainGroupKey,
  getUploadToken,
  getTheme,
  getTargetUserInfo,
  getThemeBg,
  setTheme,
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

import HeaderSet from './components/headerSet/headerSet';
import Home from './views/home/home';
import Content from './views/content/content';
import WorkingTable from './views/workingTable/workingTable';
import GroupTable from './views/groupTable/groupTable';
import Calendar from './views/calendar/calendar';
import ShowPage from './views/showPage/showPage';
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
  const themeBg = useTypedSelector((state) => state.auth.themeBg);
  const [intervalTime, setIntervalTime] = useState<any>(null);
  const [bgIntervalTime, setBgIntervalTime] = useState<any>(null);
  const [playAction, setPlayAction] = useState<any>({});
  const [playState, setPlayState] = useState(false);
  const [showType, setShowType] = useState('3');
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
    // 用户已登录
    if (user && user._key && token && token === localStorage.getItem('token')) {
      dispatch(getMainGroupKey());
      dispatch(getTheme());
      dispatch(
        getCalendarList(
          user._key,
          moment().startOf('month').startOf('day').valueOf(),
          moment().endOf('month').endOf('day').valueOf()
        )
      );
      dispatch(getThemeBg(1));
      let headerIndex = localStorage.getItem('headerIndex')
        ? localStorage.getItem('headerIndex')
        : '1';

      if (headerIndex) {
        if (headerIndex == '3' || headerIndex == '2') {
          dispatch(setMoveState('in'));
        } else {
          dispatch(setMoveState('out'));
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
        localStorage.removeItem('shareKey');
      }
      const showType = localStorage.getItem('showType');
      if (showType) {
        setShowType('2');
        localStorage.removeItem('showType');
      } else {
        setShowType('1');
      }
    }
    if (!user) {
      // 用户未登录
      const token =
        getSearchParamValue(location.search, 'token') ||
        localStorage.getItem('token');
      if (token) {
        // 获取用户信息
        localStorage.setItem('token', token);
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
        localStorage.setItem('headerIndex', '3');
        window.location.href = window.location.origin + '/';
      }
      const shareKey = getSearchParamValue(location.search, 'shareKey');
      if (shareKey) {
        localStorage.setItem('shareKey', shareKey);
        window.location.href = window.location.origin + '/';
      }
      const showType = getSearchParamValue(location.search, 'showType');
      if (showType) {
        localStorage.setItem('showType', showType);
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
    return () => {
      clearInterval(intervalTime);
    };
  }, [taskActionArray]);
  useEffect(() => {
    if (
      themeBg.length > 0 &&
      theme.randomVisible &&
      theme.randomType
      // &&canvasRef.current
    ) {
      clearInterval(bgIntervalTime);
      let newIntervalTime: any = 0;
      const randomTime =
        theme.randomType === '1'
          ? 60000
          : theme.randomType === '2'
          ? 3600000
          : theme.randomType === '3'
          ? 86400000
          : 60000;
      randomBg();
      newIntervalTime = setInterval(randomBg, randomTime);
      setBgIntervalTime(newIntervalTime);
    }
    if (themeBg.length == 0 || !theme.randomVisible) {
      clearInterval(bgIntervalTime);
    }
    return () => {
      clearInterval(bgIntervalTime);
    };
  }, [themeBg, theme]);
  // , canvasRef
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
  const randomBg = () => {
    const localTime = localStorage.getItem('localTime')
      ? localStorage.getItem('localTime')
      : '';
    const randomTime =
      theme.randomType === '1'
        ? 60000
        : theme.randomType === '2'
        ? 3600000
        : theme.randomType === '3'
        ? 86400000
        : 60000;
    if (!localTime || parseInt(localTime) + randomTime <= moment().valueOf()) {
      changeBg();
      localStorage.setItem('localTime', moment().valueOf() + '');
    }
  };
  const changeBg = () => {
    let newTheme = _.cloneDeep(theme);
    let newThemeBg = _.cloneDeep(themeBg);
    const randomNum = Math.round(Math.random() * (newThemeBg.length - 1));
    let img = new Image();
   
    img.src = newThemeBg[randomNum].url;
    // img.crossOrigin = 'anonymous'
    // 确定图片加载完成后再进行背景图片切换
    img.onload = function () {
      // console.log(format.formatColor(canvasRef.current, img));
      newTheme.backgroundImg = newThemeBg[randomNum].url;
      newTheme.backgroundColor = '';
      dispatch(setTheme(newTheme));
    };
  };
  return (
    <div
      className="App"
      // onClick={() => {
      //   dispatch(setTaskKey(''));
      // }}
      ref={pageRef}
    >
      <div
        className="App-bg1"
        style={{
          background: 'rgba(0,0,0,' + theme.grayPencent + ')',
        }}
      ></div>
      <div
        className="App-bg2"
        style={
          theme.backgroundImg
            ? {
                backgroundImage: 'url(' + theme.backgroundImg + ')',
              }
            : {
                backgroundColor: theme.backgroundColor
                  ? theme.backgroundColor
                  : '#3C3C3C',
              }
        }
      ></div>
      {showType === '2' ? (
        <ShowPage
          changeShowType={() => {
            setShowType('1');
          }}
        />
      ) : showType === '1' ? (
        <React.Fragment>
          <Home />
          {headerIndex === 0 ? <Content /> : null}
          {headerIndex === 1 ? <WorkingTable /> : null}
          {headerIndex === 3 ? <GroupTable /> : null}
          {headerIndex === 2 ? <WorkingTable /> : null}
          {headerIndex === 5 && theme && theme.calendarVisible ? (
            <Calendar />
          ) : null}
          <HeaderSet />
        </React.Fragment>
      ) : null}
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
