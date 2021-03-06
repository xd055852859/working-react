import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { useLocation, useHistory } from 'react-router-dom';
import { useTypedSelector } from './redux/reducer/RootState';
import { getSearchParamValue } from './services/util';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import {
  getUserInfo,
  setTheme,
  changeMusic,
  changeMessageMusic,
  changeunMusic,
  changeBatchMusic,
  changeCreateMusic,
  changeStartMusic,
  clearAuth,
  getThemeBg,
  // getMainGroupKey,
  getUploadToken,
  getTheme,
  getTargetUserInfo,
} from './redux/actions/authActions';
import {
  setMoveState,
  setCommonHeaderIndex,
  changeTimeSetVisible,
  changeTaskMemberVisible,
} from './redux/actions/commonActions';
import { clearMember } from './redux/actions/memberActions';
import { clearGroup } from './redux/actions/groupActions';
import {
  setChooseKey,
  changeTaskInfoVisible,
  clearTask,
} from './redux/actions/taskActions';
import Loadable from 'react-loadable';
import TimeSet from './components/common/timeSet';
import TaskMember from './components/task/taskMember';
import TaskInfo from './components/taskInfo/taskInfo';
import moveSvg from './assets/svg/move.svg';
import { setGroupKey } from './redux/actions/groupActions';
import { Route, Switch, Redirect } from 'react-router-dom';
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
  const finishMusic = useTypedSelector((state) => state.auth.finishMusic);
  const messageMusic = useTypedSelector((state) => state.auth.messageMusic);
  const unFinishMusic = useTypedSelector((state) => state.auth.unFinishMusic);
  const batchMusic = useTypedSelector((state) => state.auth.batchMusic);
  const createMusic = useTypedSelector((state) => state.auth.createMusic);
  const startMusic = useTypedSelector((state) => state.auth.startMusic);
  const finishPos = useTypedSelector((state) => state.auth.finishPos);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const taskInfoVisible = useTypedSelector(
    (state) => state.task.taskInfoVisible
  );
  const timeSetVisible = useTypedSelector(
    (state) => state.common.timeSetVisible
  );
  const taskMemberVisible = useTypedSelector(
    (state) => state.common.taskMemberVisible
  );
  const timeSetX = useTypedSelector((state) => state.common.timeSetX);
  const timeSetY = useTypedSelector((state) => state.common.timeSetY);
  const taskMemberX = useTypedSelector((state) => state.common.taskMemberX);
  const taskMemberY = useTypedSelector((state) => state.common.taskMemberY);
  const [finishIndex, setFinishIndex] = useState(0);
  const doneAudioRef: React.RefObject<any> = useRef();
  const doneMessageRef: React.RefObject<any> = useRef();
  const undoneAudioRef: React.RefObject<any> = useRef();
  const createRef: React.RefObject<any> = useRef();
  const batchRef: React.RefObject<any> = useRef();
  const startRef: React.RefObject<any> = useRef();
  const [timesetObj, setTimesetObj] = useState<any>(null);
  const [taskMemberObj, setTaskMemberObj] = useState<any>(null);
  const [showType, setShowType] = useState('3');
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
    if (getSearchParamValue(location.search, 'token')) {
      dispatch(changeStartMusic(true));
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
      const showType = localStorage.getItem('showType');
      if (showType) {
        setShowType('2');
        // localStorage.removeItem('showType');
        history.push('/home/showPage');
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
        // dispatch(getMember(mainGroupKey, 1, 1));
        dispatch(getUploadToken());
      } else {
        history.push('/');
        return;
      }

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
      const showType = getSearchParamValue(location.search, 'showType');
      if (showType) {
        localStorage.setItem('showType', showType);
      }

      if (getSearchParamValue(location.search, 'token')) {
        if (showType) {
          history.push('/home/showPage');
        } else if (localStorage.getItem('createType')) {
          history.push('/home/create');
        } else {
          history.push('/home/basic');
        }
      }
    }
  }, [user]);
  useEffect(() => {
    if (theme.moveState) {
      dispatch(setMoveState(''));
    } else if (headerIndex == '3' || headerIndex == '2') {
      dispatch(setMoveState('in'));
    } else {
      dispatch(setMoveState(''));
    }
    if (theme.randomVisible) {
      dispatch(getThemeBg(1));
    }
  }, [theme]);
  useEffect(() => {
    if (
      themeBg.length > 0 &&
      theme.randomVisible &&
      theme.randomType &&
      !bgRef.current
      // &&canvasRef.current
    ) {
      const randomTime =
        theme.randomType === '1'
          ? 60000
          : theme.randomType === '2'
          ? 3600000
          : theme.randomType === '3'
          ? 86400000
          : 60000;
      randomBg();
      bgRef.current = setInterval(randomBg, randomTime);
    }
    if (themeBg.length == 0 || !theme.randomVisible) {
      clearInterval(bgRef.current);
    }
  }, [themeBg, theme]);
  // , canvasRef
  useEffect(() => {
    if (finishMusic) {
      doneAudioRef.current.play();
      dispatch(changeMusic(false));
    }
  }, [finishMusic]);
  useEffect(() => {
    if (unFinishMusic) {
      undoneAudioRef.current.play();
      dispatch(changeunMusic(false));
    }
  }, [unFinishMusic]);
  useEffect(() => {
    if (batchMusic) {
      batchRef.current.play();
      dispatch(changeBatchMusic(false));
    }
  }, [batchMusic]);
  useEffect(() => {
    if (messageMusic) {
      doneMessageRef.current.play();
      dispatch(changeMessageMusic(false));
    }
  }, [messageMusic]);
  useEffect(() => {
    if (createMusic) {
      createRef.current.play();
      dispatch(changeCreateMusic(false));
    }
  }, [createMusic]);
  useEffect(() => {
    if (startMusic) {
      startRef.current.play();
      dispatch(changeStartMusic(false));
    }
  }, [startMusic]);

  useEffect(() => {
    if (finishPos.length > 0) {
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
        // Math.random().toFixed(2) +
        // ', ' +
        // Math.random().toFixed(2) +
        // ', ' +
        // Math.random().toFixed(2) +
        // ', ' +
        // Math.random().toFixed(2) +

        //  cubic-bezier(.66,.1,1,.41)';

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
  useEffect(() => {
    if (timeSetVisible) {
      let obj: any = {};
      if (pageRef.current.offsetHeight - timeSetY > 205) {
        obj.top = timeSetY + 10;
      } else {
        obj.bottom = pageRef.current.offsetHeight - timeSetY;
      }
      if (pageRef.current.offsetWidth - timeSetX > 274) {
        obj.left = timeSetX;
      } else {
        obj.right = pageRef.current.offsetWidth - timeSetX;
      }
      obj.display = 'block';
      if (!theme.hourVisible) {
        obj.height = '160px';
      }
      setTimesetObj(obj);
    }
  }, [timeSetX, timeSetY]);
  useEffect(() => {
    let obj: any = {};
    if (taskMemberVisible) {
      if (pageRef.current.offsetHeight * 0.5 > taskMemberY) {
        obj.top = taskMemberY - 20;
      } else {
        obj.bottom = pageRef.current.offsetHeight - taskMemberY - 20;
      }
      if (pageRef.current.offsetWidth - taskMemberX > 260) {
        obj.left = taskMemberX - 130;
      } else {
        obj.right = pageRef.current.offsetWidth - taskMemberX;
      }
      obj.display = 'block';
      setTaskMemberObj(obj);
    }
  }, [taskMemberX, taskMemberY]);
  useEffect(() => {
    dispatch(clearTask(4));
    if (headerIndex !== 2) {
      dispatch(clearAuth());
    }
    if (headerIndex !== 3) {
      dispatch(clearMember());
      dispatch(clearGroup());
    }
  }, [headerIndex, targetUserKey, groupKey]);

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
      newTheme.backgroundImg = newThemeBg[randomNum].url;
      newTheme.backgroundColor = '';
      dispatch(setTheme(newTheme));
    };
  };
  return (
    <div className="App" ref={pageRef}>
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
        // <Router>
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
        </Switch>
      ) : null}
      {taskInfoVisible ? <TaskInfo /> : null}
      {timeSetVisible && timeSetX && timeSetY ? (
        <div
          className="timeSet-container"
          style={timesetObj}
          onMouseLeave={() => {
            dispatch(changeTimeSetVisible(false, 0, 0));
          }}
        >
          <TimeSet type="new" />
        </div>
      ) : null}
      {taskMemberVisible && taskMemberX && taskMemberY ? (
        <div
          className="taskMember-container"
          style={taskMemberObj}
          onMouseLeave={() => {
            dispatch(changeTaskMemberVisible(false, 0, 0));
          }}
        >
          <TaskMember />
        </div>
      ) : null}
      <audio
        ref={doneAudioRef}
        src="https://cdn-icare.qingtime.cn/1605433190681_workingVip"
        // muted
        // controls
        style={{ position: 'fixed', zIndex: -5, opacity: 0 }}
      >
        您的浏览器不支持 audio 标签。
      </audio>
      <audio
        ref={doneMessageRef}
        src="https://cdn-icare.qingtime.cn/1605432111005_workingVip"
        // muted
        // controls
        style={{ position: 'fixed', zIndex: -5, opacity: 0 }}
      >
        您的浏览器不支持 audio 标签。
      </audio>
      <audio
        ref={undoneAudioRef}
        src="https://cdn-icare.qingtime.cn/1606524071707_workingVip"
        // muted
        // controls
        style={{ position: 'fixed', zIndex: -5, opacity: 0 }}
      >
        您的浏览器不支持 audio 标签。
      </audio>
      <audio
        ref={batchRef}
        src="https://cdn-icare.qingtime.cn/1605495620233_workingVip"
        // muted
        // controls
        style={{ position: 'fixed', zIndex: -5, opacity: 0 }}
      >
        您的浏览器不支持 audio 标签。
      </audio>
      <audio
        ref={createRef}
        src="https://cdn-icare.qingtime.cn/1607480783765_workingVip"
        // muted
        // controls
        style={{ position: 'fixed', zIndex: -5, opacity: 0 }}
      >
        您的浏览器不支持 audio 标签。
      </audio>
      <audio
        ref={startRef}
        src="https://cdn-icare.qingtime.cn/EB137B51.mp3"
        // muted
        // controls
        style={{ position: 'fixed', zIndex: -5, opacity: 0 }}
      >
        您的浏览器不支持 audio 标签。
      </audio>
    </div>
  );
};

export default App;
