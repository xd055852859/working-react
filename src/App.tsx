import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import { useLocation, useHistory } from 'react-router-dom';
import { ConfigProvider, Drawer } from 'antd';
import { useTypedSelector } from './redux/reducer/RootState';
import { getSearchParamValue } from './services/util';
import { useDispatch } from 'react-redux';
import zhCN from 'antd/lib/locale/zh_CN';
import _ from 'lodash';
import {
  getUserInfo,
  changeMusic,
  clearAuth,
  getThemeBg,
  // getMainGroupKey,
  getUploadToken,
  getTheme,
  getTargetUserInfo,
  setClickType,
} from './redux/actions/authActions';
import {
  setCommonHeaderIndex,
  setFileKey,
} from './redux/actions/commonActions';
import { clearMember } from './redux/actions/memberActions';
import { clearGroup } from './redux/actions/groupActions';
import {
  setChooseKey,
  changeTaskInfoVisible,
  clearTask,
} from './redux/actions/taskActions';
import Loadable from 'react-loadable';

import moveSvg from './assets/svg/move.svg';
import { setGroupKey } from './redux/actions/groupActions';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Carousel } from 'antd';
const ShowPage = Loadable({
  loader: () => import('./views/showPage/showPage'),
  loading: () => null,
});
const Company = Loadable({
  loader: () => import('./views/company/company'),
  loading: () => null,
});
const Basic = Loadable({
  loader: () => import('./views/basic/basic'),
  loading: () => null,
});
const Download = Loadable({
  loader: () => import('./views/download/download'),
  loading: () => null,
});
const Create = Loadable({
  loader: () => import('./views/create/create'),
  loading: () => null,
});
const File = Loadable({
  loader: () => import('./views/file/file'),
  loading: () => null,
});

import Common from './views/common/common';

const App: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const token = useTypedSelector((state) => state.auth.token);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const theme = useTypedSelector((state) => state.auth.theme);
  const themeBg = useTypedSelector((state) => state.auth.themeBg);
  const finishPos = useTypedSelector((state) => state.auth.finishPos);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const [showType, setShowType] = useState('3');
  const [finishIndex, setFinishIndex] = useState(0);

  const pageRef: React.RefObject<any> = useRef();
  let bgRef = useRef<any>(null);
  let starRef = useRef<any>(null);
  useEffect(() => {
    let url = window.location.href;
    // 自动切换为https
    if (url.indexOf('http://localhost') == -1 && url.indexOf('https') < 0) {
      url = url.replace('http:', 'https:');
      window.location.replace(url);
    }
    if (
      getSearchParamValue(location.search, 'token') &&
      !localStorage.getItem('createType') &&
      !getSearchParamValue(location.search, 'createType')
    ) {
      dispatch(changeMusic(6));
    }
    return () => {
      if (bgRef.current) {
        clearInterval(bgRef.current);
      }
      if (starRef.current) {
        clearTimeout(starRef.current);
      }
    };
  }, []);
  useEffect(() => {
    // 用户已登录
    if (user && token && token === localStorage.getItem('token')) {
      // dispatch(getMainGroupKey());
      dispatch(getTheme());
      let headerIndex = localStorage.getItem('headerIndex')
        ? localStorage.getItem('headerIndex')
        : '1';
      if (headerIndex) {
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
      }
      const shareKey = localStorage.getItem('shareKey');
      if (shareKey) {
        dispatch(setChooseKey(shareKey));
        dispatch(changeTaskInfoVisible(true));
        localStorage.removeItem('shareKey');
      }
      const fileKey = localStorage.getItem('fileKey');
      if (fileKey) {
        console.log(fileKey);
        dispatch(setFileKey(fileKey));
        history.push('/home/file');
        localStorage.removeItem('fileKey');
      }
      dispatch(getUploadToken());
    }
    if (!user) {
      // 用户未登录
      const token =
        getSearchParamValue(location.search, 'token') ||
        localStorage.getItem('token');

      const groupKey = getSearchParamValue(location.search, 'groupKey');
      if (groupKey) {
        localStorage.setItem('groupKey', groupKey);
        localStorage.setItem('headerIndex', '3');
        history.push('/home/basic');
      }
      const shareKey = getSearchParamValue(location.search, 'shareKey');
      if (shareKey) {
        localStorage.setItem('shareKey', shareKey);
        history.push('/home/showPage');
      }
      const fileKey = getSearchParamValue(location.search, 'fileKey');
      if (fileKey) {
        localStorage.setItem('fileKey', fileKey);
        // history.push('/home/file');
      }
      const showType = getSearchParamValue(location.search, 'showType');
      if (showType) {
        localStorage.setItem('showType', showType);
        history.push('/home/showPage');
      }
      const createType = getSearchParamValue(location.search, 'createType');
      if (createType) {
        localStorage.setItem('createType', createType);
        history.push('/home/create');
      }
      if (token) {
        // 获取用户信息
        localStorage.setItem('token', token);
        dispatch(getUserInfo(token));
        // history.push('/home/basic');
        // dispatch(getMember(mainGroupKey, 1, 1));
      } else {
        history.push('/');
        return;
      }
    }
  }, [user]);
  useEffect(() => {
    // if (theme.moveState) {
    //   dispatch(setMoveState(''));
    // } else if (headerIndex == '3' || headerIndex == '2') {
    //   dispatch(setMoveState('in'));
    // } else {
    //   dispatch(setMoveState(''));
    // }
    if (theme.randomVisible) {
      dispatch(getThemeBg(1));
    }
  }, [theme]);

  useEffect(() => {
    dispatch(clearTask(4));
    if (headerIndex !== 2) {
      dispatch(clearAuth());
      dispatch(setClickType('out'));
    }
    if (headerIndex !== 3) {
      dispatch(clearMember());
      dispatch(clearGroup());
    }
  }, [headerIndex, targetUserKey, groupKey]);

  useMemo(() => {
    if (finishPos.length > 0 && pageRef?.current) {
      let newFinishIndex = finishIndex;
      let style: any = document.styleSheets[8];
      if (style && !style.href) {
        let dom = document.createElement('div');
        dom.style.top = finishPos[1] - 20 + 'px';
        dom.style.right =
          pageRef.current.clientWidth - finishPos[0] - 20 + 'px';
        dom.style.animation =
          'run-right-right' +
          newFinishIndex +
          ' 2s 0.4s 1 linear,run-right-top' +
          newFinishIndex +
          ' 2s 0.4s 1 cubic-bezier(0,1,0,1)';
        dom.style.animationFillMode = 'forwards';
        let img = new Image();
        img.src = moveSvg;
        img.width = 40;
        img.height = 40;
        dom.classList.add('ball');
        // dom.classList.add('run_top_right');
        dom.appendChild(img);
        pageRef.current.appendChild(dom);
        starRef.current = setTimeout(() => {
          if (pageRef.current) {
            pageRef.current.removeChild(dom);
          }
          if (style) {
            style.deleteRule(style.cssRules.length - 5);
            style.deleteRule(style.cssRules.length - 4);
          }
          // clearTimeout(starRef.current);
        }, 2800);

        style.insertRule(
          '@keyframes run-right-top' +
            newFinishIndex +
            ' { 0% {top: ' +
            (finishPos[1] - 20) +
            'px}  30% {top: ' +
            (finishPos[1] - 20) +
            'px} 100% {top: 15px}}',
          0
        );
        style.insertRule(
          '@keyframes run-right-right' +
            newFinishIndex +
            '  {0% {transform: scale(1)} 30% { right: ' +
            (pageRef.current.clientWidth - finishPos[0] - 20) +
            'px;transform: scale(1.25);} 100% { right: 30px;transform: scale(0.45);}',
          1
        );
        newFinishIndex++;
        setFinishIndex(newFinishIndex);
      }
    }
  }, [finishPos]);
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App" ref={pageRef}>
        {!localStorage.getItem('createType') &&
        !getSearchParamValue(location.search, 'createType') ? (
          <React.Fragment>
            <div
              className="App-bg1"
              style={{
                background: 'rgba(0,0,0,' + theme.grayPencent + ')',
              }}
            ></div>

            <div
              className="App-bg2"
              style={
                !theme.randomVisible
                  ? theme.backgroundImg
                    ? {
                        backgroundImage: 'url(' + theme.backgroundImg + ')',
                      }
                    : {
                        backgroundColor: theme.backgroundColor
                          ? theme.backgroundColor
                          : '#3C3C3C',
                      }
                  : {}
              }
            >
              {themeBg && theme.randomVisible ? (
                <Carousel
                  effect="fade"
                  dots={false}
                  autoplaySpeed={
                    theme.randomType === '1'
                      ? 60000
                      : theme.randomType === '2'
                      ? 3600000
                      : theme.randomType === '3'
                      ? 86400000
                      : 60000
                  }
                  autoplay
                >
                  {themeBg.map((item: any) => {
                    return <img src={item.url} alt="" />;
                  })}
                </Carousel>
              ) : null}
            </div>
          </React.Fragment>
        ) : null}
        <Switch>
          <Route
            exact
            path="/home/"
            render={() => <Redirect to="/home/basic" />}
          />
          <Route path="/home/basic" component={Basic} />
          <Route exact path="/home/showPage" component={ShowPage} />
          <Route path="/home/company" component={Company} />
          <Route exact path="/home/download" component={Download} />
          <Route exact path="/home/create" component={Create} />
          <Route exact path="/home/file" component={File} />
        </Switch>
        <Common
          clientWidth={pageRef?.current?.offsetWidth}
          clientHeight={pageRef?.current?.offsetHeight}
        />
      </div>
    </ConfigProvider>
  );
};

export default App;
