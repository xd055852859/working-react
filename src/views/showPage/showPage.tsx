import React, { useState, useEffect, useRef } from 'react';
import './showPage.css';
import {
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Tooltip,
  Switch,
} from '@material-ui/core';
import { getSelfTask } from '../../redux/actions/taskActions';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setTheme } from '../../redux/actions/authActions';
import {
  setMessage,
  setCommonHeaderIndex,
} from '../../redux/actions/commonActions';
import format from '../../components/common/format';
import traditionalDate from '../../components/common/date';
import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';
import MainBoard from '../board/mainBoard';
import ClockNew from '../../components/clock/clockNew';
import HeaderBg from '../../components/headerSet/headerBg';
// import ClockNew from '../../components/clock/clockNew';
import HeaderCreate from '../../components/headerSet/headerCreate';
import infoPng from '../../assets/img/info.png';
import logoSvg from '../../assets/svg/logo.svg';
import mindcuteLogoSvg from '../../assets/svg/mindcuteLogo.svg';

import leftArrowPng from '../../assets/img/leftArrow.png';
import rightArrowPng from '../../assets/img/rightArrow.png';
import radioCheckPng from '../../assets/img/radioCheck.png';
import unradioCheckPng from '../../assets/img/unradioCheck.png';
import search1Png from '../../assets/img/search1.png';
import search2Png from '../../assets/img/search2.png';
import search3Png from '../../assets/img/search3.png';
import search4Png from '../../assets/img/search4.png';
import showAddSvg from '../../assets/svg/showAdd.svg';
import { getGroup } from '../../redux/actions/groupActions';
import bgImg from '../../assets/img/bgImg.png';
import { getTokenSourceMapRange } from 'typescript';
import DropMenu from '../../components/common/dropMenu';
interface ShowPageProps {
  changeShowType: any;
}

const ShowPage: React.FC<ShowPageProps> = (props) => {
  const { changeShowType } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const [nowTime, setNowTime] = useState<any>(new Date());
  const [timeInterval, setTimeInterval] = useState<any>(null);
  const [showState, setShowState] = useState<any>(null);
  const [showPoint, setShowPoint] = useState(true);
  const [prompt, setPrompt] = useState();
  const [moveState, setMoveState] = useState('');
  const [chooseWallKey, setChooseWallKey] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);
  const [bg, setBg] = useState<any>('');
  const [menuShow, setMenuShow] = useState(0);
  const [timeOsToken, setTimeOsToken] = useState(null);
  const [addVisible, setAddVisible] = useState(false);
  const [searchIconVisible, setSearchIconVisible] = useState(false);

  const [weatherObj, setWeatherObj] = useState<any>({});
  const showPageRef: React.RefObject<any> = useRef();
  const year = moment().year();
  const month = moment().month();
  const day = moment().date();
  const week = moment().day();
  const weekStr = ['日', '一', '二', '三', '四', '五', '六'];
  const searchImgArr = [search2Png, search1Png, search4Png, search3Png];
  let timerRef = useRef<any>(null);
  let unDistory = true;
  useEffect(() => {
    let newShowPoint = true;
    if (localStorage.getItem('bg')) {
      setBg(localStorage.getItem('bg'));
    }
    setShowPoint(!newShowPoint);
    newShowPoint = !newShowPoint;
    timerRef.current = setInterval(() => {
      setNowTime(new Date());
      setShowPoint(newShowPoint);
      newShowPoint = !newShowPoint;
    }, 1000);
    // getSocket();
    setTimeInterval(timerRef.current);
    localStorage.setItem('page', 'show');
    localStorage.setItem('headerIndex', '0');
    // getWeather();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (user) {
      getPrompt();
      getToken();
      dispatch(setCommonHeaderIndex(0));
      dispatch(getGroup(3));
      if (
        parseInt(user.profile.lo) !== user.profile.lo &&
        parseInt(user.profile.la) !== user.profile.la &&
        user.profile.la &&
        user.profile.lo
      ) {
        getWeather();
      }
    }
    return () => {
      unDistory = false;
    };
  }, [user]);
  useEffect(() => {
    if (theme.backgroundImg) {
      localStorage.setItem('url', theme.backgroundImg);
      setBg(theme.backgroundImg);
    } else {
      setBg('');
      localStorage.removeItem('url');
    }
    if (!theme.taskShow) {
      setMenuShow(1);
    }
  }, [theme]);
  const getToken = async () => {
    let res: any = await api.auth.switchToken();
    if (unDistory) {
      if (res.msg == 'OK') {
        setTimeOsToken(res.result.token);
      } else {
        dispatch(setMessage(true, res.msg, 'error'));
      }
    }
  };
  const changeFinishPercentArr = (e: any, type: string) => {
    let newTheme = _.cloneDeep(theme);
    if (e.target.checked) {
      newTheme.finishPercentArr.push(type);
    } else {
      let index = _.findIndex(newTheme.finishPercentArr, type);
      newTheme.finishPercentArr.splice(index, 1);
    }
    dispatch(setTheme(newTheme));
    dispatch(
      getSelfTask(
        1,
        user._key,
        '[0, 1]',
        1,
        moment().add(1, 'days').startOf('day').valueOf(),
        1
      )
    );
  };
  const changeBoard = (type: string, bool?: string) => {
    let newTheme = _.cloneDeep(theme);
    if (bool) {
      newTheme[type] = bool === 'true' ? true : false;
    } else {
      newTheme[type] = newTheme[type] ? false : true;
    }

    dispatch(setTheme(newTheme));
  };
  const getPrompt = async () => {
    let promptRes: any = await api.auth.getPrompt();
    if (unDistory) {
      if (promptRes.msg === 'OK') {
        setPrompt(promptRes.result.content);
      } else {
        dispatch(setMessage(true, promptRes.msg, 'error'));
      }
    }
  };
  const getWeather = async () => {
    let newWeatherObj: any = {};
    let weatherRes: any = await api.common.getWeather(
      user.profile.lo,
      user.profile.la
    );
    if (unDistory) {
      if (weatherRes.msg === 'OK') {
        newWeatherObj = _.cloneDeep(weatherRes.result);
        setWeatherObj(newWeatherObj);
      } else {
        dispatch(setMessage(true, weatherRes.msg, 'error'));
      }
    }
  };
  const onKeyDownchange = (e: any) => {
    if (e.keyCode == 13) {
      //事件操作
      let str = '';
      switch (searchIndex) {
        case 0:
          str = 'https://cn.bing.com/search?q=' + searchInput;
          break;
        case 1:
          str = 'https://www.baidu.com/s?wd=' + searchInput;
          break;
        case 2:
          str = 'https://www.sogou.com/web?query=' + searchInput;
          break;
        case 3:
          str = 'https://www.google.com/search?q=' + searchInput;
          break;
      }
      window.open(str);
    }
  };
  return (
    <div
      onClick={() => {
        if (showState === 'left') {
          setShowState('right');
        }
      }}
      className="showPage-container"
      ref={showPageRef}
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
          bg
            ? {
                backgroundImage: 'url(' + bg + ')',
                paddingRight: showState === 'left' ? '625px' : '365px',
              }
            : {
                backgroundColor: theme.backgroundColor
                  ? theme.backgroundColor
                  : '#3C3C3C',
                paddingRight: showState === 'left' ? '625px' : '365px',
              }
        }
      ></div>
      {theme.searchShow !== false ? (
        <div className="showPage-input">
          <div className="showPage-input-img">
            <Tooltip title="选择搜索引擎">
              <img
                src={searchImgArr[searchIndex]}
                alt=""
                onClick={() => {
                  setSearchIconVisible(true);
                }}
              />
            </Tooltip>
            <DropMenu
              visible={searchIconVisible}
              dropStyle={{
                width: '85px',
                height: '150px',
                top: '35px',
                left: '0px',
                color: '#333',
              }}
              onClose={() => {
                setSearchIconVisible(false);
              }}
            >
              {searchImgArr.map((item: any, index: number) => {
                return (
                  <div className="showPage-input-img" key={'icon' + index}>
                    <img
                      src={item}
                      alt=""
                      onClick={() => {
                        setSearchIndex(index);
                      }}
                    />
                  </div>
                );
              })}
            </DropMenu>
          </div>
          <input
            type="text"
            placeholder="搜索"
            value={searchInput}
            onChange={(e: any) => {
              setSearchInput(e.target.value);
            }}
            onKeyDown={(e) => {
              onKeyDownchange(e);
            }}
          />
        </div>
      ) : null}
      {theme.weatherShow !== false &&
      parseInt(user.profile.lo) !== user.profile.lo &&
      parseInt(user.profile.la) !== user.profile.la &&
      user.profile.la &&
      user.profile.lo ? (
        <div
          className="showPage-weather"
          style={{ left: theme.searchShow !== false ? '320px' : '10px' }}
        >
          <div className="showPage-weather-item">
            <div className="showPage-weather-item-top">
              {weatherObj.basic && weatherObj.basic.province}
            </div>
            <div className="showPage-weather-item-bottom">
              {weatherObj.basic && weatherObj.basic.city}
            </div>
          </div>
          <div className="showPage-weather-item">
            <div className="showPage-weather-item-top">
              {weatherObj.now &&
                weatherObj.now.condition &&
                weatherObj.now.condition.description}
            </div>
            <div className="showPage-weather-item-img">
              <img
                src={
                  weatherObj.now && weatherObj.now.condition
                    ? require('../../assets/weather/w' +
                        weatherObj.now.condition.code +
                        '@3x.png')
                    : null
                }
                alt=""
              />
            </div>
          </div>
          <div className="showPage-weather-item">
            <div className="showPage-weather-item-top">温度</div>
            <div className="showPage-weather-item-bottom">
              {weatherObj.now && weatherObj.now.temperature}
              <div className="showPage-weather-icon">℃</div>
            </div>
          </div>
          <div className="showPage-weather-item">
            <div className="showPage-weather-item-top">湿度</div>
            <div className="showPage-weather-item-bottom">
              {weatherObj.now && weatherObj.now.humidity}
              <div className="showPage-weather-icon">%</div>
            </div>
          </div>
          <div className="showPage-weather-item">
            <div className="showPage-weather-item-top">PM2.5</div>
            <div className="showPage-weather-item-bottom">
              {weatherObj.now && weatherObj.now.aqi && weatherObj.now.aqi.pm25}
            </div>
          </div>
        </div>
      ) : null}
      <div className="showPage-clock">
        <div className="showPage-time">
          {theme.timeShow !== false ? (
            <div className="showPage-time-title">
              {moment(nowTime).format('HH')}
              <span
                style={{
                  width: '50px',
                  marginTop: '-24px',
                  marginLeft: '10px',
                }}
              >
                {showPoint ? ':' : ''}
              </span>
              {moment(nowTime).format('mm')}
            </div>
          ) : (
            <ClockNew nowTime={nowTime} />
          )}

          <div className="showPage-time-subtitle">
            <div className="showPage-time-subtitle-top">
              {year +
                '.' +
                (month + 1) +
                '.' +
                day +
                ' 星期' +
                weekStr[week] +
                ' '}
              {!theme.timeShow !== false ? moment(nowTime).format('HH:mm') : ''}
            </div>
            {theme.cDayShow !== false ? (
              <div>
                {' 农历 ' +
                  format.formatJq(year, month, day) +
                  ' ' +
                  traditionalDate.GetLunarDay(moment())[1] +
                  traditionalDate.GetLunarDay(moment())[2]}
              </div>
            ) : null}
          </div>

          {/* <Button
            color="primary"
            onClick={(e: any) => {
              window.location.href = window.location.origin + '/';
              // changeShowType();
              e.stopPropagation();
            }}
            style={{ color: '#fff' }}
            variant="contained"
          >
            Working / Today
          </Button> */}
        </div>
        <div className="showPage-time-prompt">{prompt}</div>
      </div>
      <div
        className="showPage"
        style={
          showState === 'left'
            ? {
                animation: 'showLeft 500ms',
                // animationFillMode: 'forwards',
                right: '260px',
              }
            : showState === 'right'
            ? {
                animation: 'showRight 500ms',
                // animationFillMode: 'forwards',
                right: '0px',
              }
            : { right: '0px' }
        }
      >
        {theme.taskShow !== false ? (
          //    <div
          //     className="showPage-bg1"
          //     style={{
          //       background: 'rgba(0,0,0,' + theme.grayPencent + ')',
          //     }}
          //   ></div>
          // <div
          //     className="showPage-bg2"
          //     style={
          //       theme.backgroundImg
          //         ? {
          //             backgroundImage: 'url(' + theme.backgroundImg + ')',
          //           }
          //         : { backgroundColor: theme.backgroundColor }
          //     }
          //   ></div>
          <div className="showPage-b"></div>
        ) : null}
        <div className="showPage-task-title">
          <div
            className="showPage-bigLogo"
            onClick={(e: any) => {
              window.top.location.href = window.location.origin + '/home/basic';
              // changeShowType();
              localStorage.removeItem('showType');
              e.stopPropagation();             
            }}
          >
            <img src={logoSvg} alt="" />
          </div>
          {/* <div
            className="showPage-bigLogo"
            onClick={(e: any) => {
              window.open('https://mindcute.com/login?token=' + timeOsToken);
            }}
          >
            <img src={mindcuteLogoSvg} alt="" />
          </div> */}
        </div>
        <div className="showPage-task-menu">
          {theme.taskShow ? (
            <div
              className="showPage-task-menu-item"
              style={{
                borderBottom:
                  menuShow === 0
                    ? '2px solid #17B881'
                    : '2px solid transparent',
              }}
              onClick={() => {
                setMenuShow(0);
              }}
            >
              今日事务
            </div>
          ) : null}
          {/* <div
            className="showPage-task-menu-item"
            style={{
              borderBottom:
                menuShow === 1 ? '2px solid #17B881' : '2px solid transparent',
              marginLeft: '15px',
            }}
            onClick={() => {
              setMenuShow(1);
            }}
          >
            我的文件
          </div> */}
        </div>
        {menuShow === 0 ? (
          theme.taskShow !== false ? (
            <div className="showPage-task-container">
              <MainBoard showType="showPage" />
            </div>
          ) : null
        ) : menuShow === 1 ? (
          <div className="showPage-timeos-container">
            {timeOsToken ? (
              <iframe
                src={
                  'https://mindcute.com/login?token=' +
                  timeOsToken +
                  '&redirect-router=/home/recent&chatToken=5PgR5CuV1awS7deh_NCgqzldKJsv9LgGGK3iHSH5K3z'
                }
                style={{
                  width: '100%',
                  height: showPageRef.current.clientHeight + 15,
                  border: '0px',
                }}
              ></iframe>
            ) : null}
          </div>
        ) : null}
        <img
          src={showAddSvg}
          alt=""
          className="showPage-logo"
          style={{ top: '24px', right: '45px', height: '20px', width: '20px' }}
          onClick={(e: any) => {
            setAddVisible(true);
            e.stopPropagation();
          }}
        />
        <img
          src={infoPng}
          alt=""
          className="showPage-logo"
          onClick={(e: any) => {
            setShowState('left');
            e.stopPropagation();
          }}
        />
      </div>
      <div
        className="showPage-set"
        style={
          showState === 'left'
            ? {
                animation: 'setLeft 500ms',
                // animationFillMode: 'forwards',
                right: '0px',
              }
            : showState === 'right'
            ? {
                animation: 'setRight 500ms',
                // animationFillMode: 'forwards',
                right: '-260px',
              }
            : { right: '-260px' }
        }
        onClick={(e: any) => {
          e.stopPropagation();
        }}
      >
        <div
          className="contentHeader-set-container"
          style={
            moveState === 'right'
              ? {
                  animation: 'moveRight 500ms',
                  // animationFillMode: 'forwards',
                  left: '-260px',
                }
              : moveState === 'left'
              ? {
                  animation: 'moveLeft 500ms',
                  // animationFillMode: 'forwards',
                  left: '0px',
                }
              : { left: '0px', height: '460px' }
          }
        >
          <div className="contentHeader-set-left">
            <div
              className="showPage-set-title"
              onClick={() => {
                setMoveState('right');
              }}
              style={{ height: '40px' }}
            >
              <div>壁纸设置</div>
              <div className="bg-item-right">
                <div
                  className="bg-item"
                  style={{
                    backgroundImage: theme.backgroundImg
                      ? 'url(' +
                        theme.backgroundImg +
                        '?imageMogr2/auto-orient/thumbnail/80x)'
                      : '',
                    backgroundColor: !theme.backgroundImg
                      ? theme.backgroundColor
                      : '',
                    marginBottom: '0px',
                    width: '44px',
                    height: '25px',
                  }}
                ></div>
                <img
                  src={rightArrowPng}
                  alt=""
                  style={{ width: '7px', height: '11px', marginLeft: '5px' }}
                />
              </div>
            </div>
            <div className="showPage-set-title">任务设置</div>
            <div>
              <Checkbox
                checked={
                  theme.finishPercentArr &&
                  theme.finishPercentArr.indexOf('1') != -1
                }
                onChange={(e) => {
                  changeFinishPercentArr(e, '1');
                }}
                color="primary"
              />
              今日已完成
            </div>
            <div className="showPage-set-title">
              农历显示
              <Switch
                checked={theme.cDayShow !== false ? true : false}
                onChange={() => {
                  changeBoard('cDayShow');
                }}
                name="checkedA"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
            <div className="showPage-set-title">
              任务看板
              <Switch
                checked={theme.taskShow !== false ? true : false}
                onChange={() => {
                  changeBoard('taskShow');
                  setMenuShow(1);
                }}
                name="checkedC"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
            <div className="showPage-set-title">
              时钟风格
              {/* <Switch
                checked={theme.timeShow ? true : false}
                onChange={() => {
                  changeBoard('timeShow');
                }}
                name="checkedB"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              /> */}
              <div
                onClick={() => {
                  changeBoard('timeShow', 'true');
                }}
                className="showPage-set-time"
              >
                {theme.timeShow ? (
                  <img src={radioCheckPng} alt="" />
                ) : (
                  <img src={unradioCheckPng} alt="" />
                )}
                数字
              </div>
              <div
                onClick={() => {
                  changeBoard('timeShow', 'false');
                }}
                className="showPage-set-time"
              >
                {!theme.timeShow ? (
                  <img src={radioCheckPng} alt="" />
                ) : (
                  <img src={unradioCheckPng} alt="" />
                )}
                时钟
              </div>
            </div>
            <div className="showPage-set-title">
              搜索引擎
              <Switch
                checked={theme.searchShow !== false ? true : false}
                onChange={() => {
                  changeBoard('searchShow');
                }}
                name="checkedB"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
            {parseInt(user.profile.lo) !== user.profile.lo &&
            parseInt(user.profile.la) !== user.profile.la &&
            user.profile.la &&
            user.profile.lo ? (
              <div className="showPage-set-title">
                天气情况
                <Switch
                  checked={theme.weatherShow !== false ? true : false}
                  onChange={() => {
                    changeBoard('weatherShow');
                  }}
                  name="checkedB"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </div>
            ) : null}
          </div>

          <div className="bg">
            <div>
              <img
                src={leftArrowPng}
                alt=""
                style={{
                  width: '10px',
                  height: '13px',
                  marginRight: '10px',
                }}
                onClick={() => {
                  setMoveState('left');
                }}
              />
              壁纸设置
              <Switch
                checked={theme.randomVisible ? true : false}
                onChange={() => {
                  changeBoard('randomVisible');
                }}
                name="checkedD"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
            <HeaderBg
              setMoveState={setMoveState}
              setChooseWallKey={setChooseWallKey}
              headerType="show"
            />
          </div>
        </div>
      </div>
      <HeaderCreate
        visible={addVisible}
        onClose={() => {
          setAddVisible(false);
        }}
        createStyle={{
          position: 'fixed',
          top: '65px',
          right: '0px',
          width: '430px',
          height: 'calc(100% - 70px)',
          overflow: 'auto',
          padding: '0px 15px',
        }}
      />
    </div>
  );
};
ShowPage.defaultProps = {};
export default ShowPage;
