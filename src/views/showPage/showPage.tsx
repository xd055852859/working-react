import React, { useState, useEffect } from 'react';
import './showPage.css';
import {
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Switch,
} from '@material-ui/core';
import { getSelfTask } from '../../redux/actions/taskActions';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setTheme } from '../../redux/actions/authActions';
import { setMessage } from '../../redux/actions/commonActions';
import format from '../../components/common/format';
import traditionalDate from '../../components/common/date';
import moment from 'moment';
import _ from 'lodash';
import api from '../../services/api';
import MainBoard from '../board/mainBoard';
import ClockNew from '../../components/clock/clockNew';
import HeaderBg from '../../components/headerSet/headerBg';
// import ClockNew from '../../components/clock/clockNew';
import infoPng from '../../assets/img/info.png';
import logoPng from '../../assets/img/logo.png';
import rightArrowPng from '../../assets/img/rightArrow.png';
import radioCheckPng from '../../assets/img/radioCheck.png';
import unradioCheckPng from '../../assets/img/unradioCheck.png';
import bgImg from '../../assets/img/bgImg.png';
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
  const [bg, setBg] = useState<any>('');

  const year = moment().year();
  const month = moment().month();
  const day = moment().date();
  const week = moment().day();
  const weekStr = ['日', '一', '二', '三', '四', '五', '六'];
  useEffect(() => {
    let interval: any = null;
    let newShowPoint = true;
    if (localStorage.getItem('bg')) {
      setBg(localStorage.getItem('bg'));
    }
    setShowPoint(!newShowPoint);
    newShowPoint = !newShowPoint;
    interval = setInterval(() => {
      setNowTime(new Date());
      setShowPoint(newShowPoint);
      newShowPoint = !newShowPoint;
    }, 1000);
    // getSocket();
    setTimeInterval(interval);
    getPrompt();
    localStorage.setItem('page', 'show');
    // getWeather();
    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    };
  }, []);
  useEffect(() => {
    if (theme.backgroundImg) {
      localStorage.setItem('url', theme.backgroundImg);
      setBg(theme.backgroundImg);
    } else {
      localStorage.removeItem('url');
    }
  }, [theme]);
  const changeFinishPercentArr = (e: any, type: string) => {
    console.log(e.target.checked);
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
    if (promptRes.msg === 'OK') {
      setPrompt(promptRes.result.content);
      // dispatch(setMessage(true, '申请加群成功', 'success'));
    } else {
      dispatch(setMessage(true, promptRes.msg, 'error'));
    }
  };
  const getPosition = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            let data = {
              latitude: latitude,
              longitude: longitude,
            };
            resolve(data);
          },
          function () {
            reject(arguments);
          }
        );
      } else {
        reject('你的浏览器不支持当前地理位置信息获取');
      }
    });
  };
  const getWeather = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log(position.coords.longitude);
          console.log(position.coords.latitude);
        },
        function (e) {
          throw e.message;
        }
      );
    }
    let result: any = await getPosition();
    if (result) {
      // let queryData = {
      //   longtitude: String(result.longitude).match(/\d+\.\d{0,6}/)[0],
      //   latitude: String(result.latitude).match(/\d+\.\d{0,6}/)[0],
      //   channelType: '00'
      // }

      console.log(result);
    }
    // let weatherRes: any = await api.common.getWeather();
    // if (weatherRes.msg === 'OK') {
    //   // setPrompt(promptRes.result.content);
    //   console.log(weatherRes);
    //   // dispatch(setMessage(true, '申请加群成功', 'success'));
    // } else {
    //   dispatch(setMessage(true, weatherRes.msg, 'error'));
    // }
  };
  const onKeyDownchange = (e: any) => {
    if (e.keyCode == 13) {
      //事件操作
      window.open('http://www.baidu.com/s?wd=' + searchInput);
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
    >
      {theme.searchShow ? (
        <input
          type="text"
          className="showPage-input"
          placeholder="搜索"
          value={searchInput}
          onChange={(e: any) => {
            setSearchInput(e.target.value);
          }}
          onKeyDown={(e) => {
            onKeyDownchange(e);
          }}
        />
      ) : null}
      <div className="showPage-clock">
        <div className="showPage-time">
          {theme.timeShow ? (
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
              {!theme.timeShow ? moment(nowTime).format('HH:mm') : ''}
            </div>
            {theme.cDayShow ? (
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
        {theme.taskShow ? (
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
            className="home-header-logo"
            onClick={(e: any) => {
              window.location.href = window.location.origin + '/';
              // changeShowType();
              e.stopPropagation();
            }}
          >
            <img src={logoPng} alt="" />
          </div>
        </div>
        {theme.taskShow ? (
          <div className="showPage-task-container">
            <MainBoard showType="showPage" />
          </div>
        ) : null}
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
                        '?imageMogr2/auto-orient/thumbnail/160x160/format/jpg)'
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
                checked={theme.cDayShow ? true : false}
                onChange={() => {
                  changeBoard('cDayShow');
                }}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
            <div className="showPage-set-title">
              任务看板
              <Switch
                checked={theme.taskShow ? true : false}
                onChange={() => {
                  changeBoard('taskShow');
                }}
                name="checkedC"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
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
                inputProps={{ 'aria-label': 'secondary checkbox' }}
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
                checked={theme.searchShow ? true : false}
                onChange={() => {
                  changeBoard('searchShow');
                }}
                name="checkedB"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
          </div>
          <HeaderBg
            setMoveState={setMoveState}
            setChooseWallKey={setChooseWallKey}
          />
        </div>
      </div>
    </div>
  );
};
ShowPage.defaultProps = {};
export default ShowPage;
