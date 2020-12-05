import React, { useState, useEffect, useRef } from 'react';
import './headerSet.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useLocation, useHistory } from 'react-router-dom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { TextField, Button, Checkbox } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import format from '../common/format';
import Switch from '@material-ui/core/Switch';
import Dialog from '../common/dialog';
import DropMenu from '../common/dropMenu';
import Tooltip from '../common/tooltip';
import ClockIn from '../clockIn/clockIn';
import Vitality from '../vitality/vitality';
import Chat from '../../views/chat/chat';
import HeaderBg from './headerBg';
import Task from '../task/task';
import UserCenter from '../userCenter/userCenter';
import MessageBoard from '../../views/board/messageBoard';
import GroupCreate from '../../views/tabs/groupCreate';
import HeaderCreate from './headerCreate';
import { setTheme } from '../../redux/actions/authActions';

import {
  setMessage,
  setUnMessageNum,
  setChatState,
  setSocketObj,
} from '../../redux/actions/commonActions';

import set1Png from '../../assets/img/set1.png';
import set2Png from '../../assets/img/set2.png';
import set3Png from '../../assets/img/set3.png';
import set4Png from '../../assets/img/set4.png';
import set5Png from '../../assets/img/set5.png';
import set6Svg from '../../assets/svg/set6.svg';
import set7Svg from '../../assets/svg/set7.svg';
import rightArrowPng from '../../assets/img/rightArrow.png';
import leftArrowPng from '../../assets/img/leftArrow.png';
import logoutPng from '../../assets/img/logout.png';
import batteryPng from '../../assets/img/battery.png';
import bgImg from '../../assets/img/bgImg.png';
import clockInPng from '../../assets/img/clockIn.png';
import searchPng from '../../assets/img/headerSearch.png';
import addPng from '../../assets/img/taskAdd.png';
import messagePng from '../../assets/img/headerMessage.png';
import chatPng from '../../assets/img/headerChat.png';
import downArrowbPng from '../../assets/img/downArrowb.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';

import api from '../../services/api';
import moment from 'moment';
interface HeaderSetProps { }
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      backgroundColor: '#17B881',
      padding: '6 16px',
      color: '#fff',
    },
    input: {
      width: 'calc(100% - 115px)',
      marginRight: '10px',
      minWidth: '200px',
      '& .MuiInput-formControl': {
        marginTop: '0px',
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
      },
      '& .MuiInputLabel-formControl': {
        marginTop: '-10px',
      },
    },
  })
);
const HeaderSet: React.FC<HeaderSetProps> = (prop) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);

  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const finishPos = useTypedSelector((state) => state.auth.finishPos);

  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  // const groupKey = useTypedSelector((state) => state.group.groupKey);
  const unChatNum = useTypedSelector((state) => state.common.unChatNum);
  const unMessageNum = useTypedSelector((state) => state.common.unMessageNum);
  const socket = useTypedSelector((state) => state.auth.socket);
  const [avatar, setAvatar] = useState<any>(null);
  const [contentSetVisilble, setContentSetVisilble] = useState(false);
  const [bgVisible, setBgVisible] = useState(false);
  const [clockInVisible, setClockInVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [avatarShow, setAvatarShow] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [child, setChild] = useState<any>(null);

  const [searchTaskList, setSearchTaskList] = useState<any>([]);
  const [groupIndex, setGroupIndex] = useState(0);

  const [labelIndex, setLabelIndex] = useState(0);
  const [labelVisible, setLabelVisible] = useState(false);
  const [labelArray, setLabelArray] = useState<any>([]);

  const [userVisible, setUserVisible] = useState(false);
  const [imgBigArr2, setImgBigArr2] = useState<any>([]);
  const [moveState, setMoveState] = useState('');
  const [moveType, setMoveType] = useState(0);
  const [chooseWallKey, setChooseWallKey] = useState('');
  const [showVitality, setShowVitality] = useState(false);
  const [searchCheck, setSearchCheck] = useState(false);
  const [vitalityInfo, setVitalityInfo] = useState<any>(null);
  const [clientWidth, setClientWidth] = useState(1500);
  const childRef: React.RefObject<any> = useRef();
  // const imgBigArr2 = [
  // 'https://cdn-icare.qingtime.cn/1596679428976_8Big@1x.png',
  // 'https://cdn-icare.qingtime.cn/1596679446272_9Big@1x.png',
  // 'https://cdn-icare.qingtime.cn/1596679461595_10Big@1x.png',
  // "https://cdn-icare.qingtime.cn/1596679637933_11Big@1x.png",
  // 'https://cdn-icare.qingtime.cn/1596679674511_12Big@1x.png',
  // 'https://cdn-icare.qingtime.cn/1596679728933_画板.jpg',
  // 'https://cdn-icare.qingtime.cn/1596679825925_画板备份2.jpg',
  // 'https://cdn-icare.qingtime.cn/1596679850655_画板备份3.jpg',
  // 'https://cdn-icare.qingtime.cn/1596679867626_画板备份4.jpg',
  // 'https://cdn-icare.qingtime.cn/1596679885918_画板备份5.jpg',
  // 'https://cdn-icare.qingtime.cn/1596679903471_画板备份6.jpg',
  // 'https://cdn-icare.qingtime.cn/1596679925993_画板备份7.jpg',
  // 'https://cdn-icare.qingtime.cn/1596679943102_画板备份8.jpg',
  // "https://cdn-icare.qingtime.cn/1596679963941_画板备份9.jpg",
  // 'https://cdn-icare.qingtime.cn/1596679987203_画板备份10.jpg',
  // 'https://cdn-icare.qingtime.cn/1596680027535_画板备份11.jpg',
  // 'https://cdn-icare.qingtime.cn/1596680077694_画板备份12.jpg',
  // 'https://cdn-icare.qingtime.cn/1596680095898_画板备份13.jpg',
  // 'https://cdn-icare.qingtime.cn/1596680119545_画板备份14.jpg',
  // 'https://cdn-icare.qingtime.cn/1596679772476_画板备份.jpg',
  // imgBig26
  // ];
  const limit = 10;
  useEffect(() => {
    if (user) {
      setAvatar(user.profile.avatar);
    }
  }, [user]);

  useEffect(() => {
    if (finishPos) {
      let timer1: any = setTimeout(() => {
        setAvatarShow(true);
        clearTimeout(timer1);
        timer1 = null;
      }, 2000);
      let timer2: any = setTimeout(() => {
        setAvatarShow(false);
        clearTimeout(timer2);
        timer2 = null;
      }, 4000);
    }
  }, [finishPos]);
  // useEffect(() => {
  //   if (addVisible && groupArray && groupArray.length > 0) {
  //     getLabelArray(groupArray[0]._key);
  //   }
  // }, [groupArray, addVisible]);
  useEffect(() => {
    if (searchInput == '') {
      setSearchTaskList([]);
      setPage(1);
    }
  }, [searchInput]);
  // const getPng = async () => {
  //   let newImgBigArr2: any = [];
  //   let res: any = await api.auth.getWallPapers(1);
  //   if (res.msg === 'OK') {
  //     res.data.forEach((item: any) => {
  //       newImgBigArr2.push(decodeURI(item.url));
  //     });
  //     setImgBigArr2(newImgBigArr2);
  //   } else {
  //     dispatch(setMessage(true, res.msg, 'error'));
  //   }
  // };
  window.onresize = _.debounce(function () {
    setClientWidth(document.body.clientWidth);
  }, 1000);
  const getVitalityInfo = async () => {
    let res: any = await api.auth.getTargetUserInfo(user._key);
    if (res.msg == 'OK') {
      setVitalityInfo(res.result);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const changeBoard = (type: string) => {
    let newTheme = _.cloneDeep(theme);
    newTheme[type] = newTheme[type] ? false : true;
    dispatch(setTheme(newTheme));
  };

  const searchTask = () => {
    if (searchInput !== '') {
      // this.getSearchList({ param: { name: this.searchInput }, type: 1 })
      getTaskSearch(page, searchCheck);
    }
  };
  const getTaskSearch = async (page: number, check: boolean) => {
    let newSearchTaskList: any = [];
    if (page === 1) {
      setSearchTaskList([]);
    } else {
      newSearchTaskList = _.cloneDeep(searchTaskList);
    }
    let obj: any = {
      curPage: page,
      perPage: limit,
      searchCondition: searchInput,
    };
    if (check) {
      obj.finishPercentStr = '1,2,3';
    }
    let res: any = await api.task.getCardSearch(obj);
    if (res.msg === 'OK') {
      newSearchTaskList.push(...res.result);
      setSearchTaskList(newSearchTaskList);
      setTotal(res.totalNumber);
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };

  const scrollSearchLoading = (e: any) => {
    let newPage = page;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight - 1 &&
      searchTaskList.length < total
    ) {
      newPage = newPage + 1;
      setPage(newPage);
      getTaskSearch(newPage, searchCheck);
    }
  };

  const logout = async () => {
    localStorage.clear();
    socket.emit('logout', user._key);
    dispatch(setMessage(true, '退出登录成功', 'success'));
    history.push('/welcome');
  };
  const onRef = (ref: any) => {
    setChild(ref)
  }
  return (
    <React.Fragment>
      <div className="contentHeader-set">
        {(clientWidth > 1100 && headerIndex !== 3) ||
          (clientWidth > 900 && headerIndex === 3) ? (
            <React.Fragment>
              <Tooltip title="新建任务">
                <img
                  src={addPng}
                  alt=""
                  style={{
                    width: '40px',
                    height: '40px',
                    marginRight: '15px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => {
                    setAddVisible(true);
                  }}
                />
              </Tooltip>
              <Tooltip title="搜索中心">
                <img
                  src={searchPng}
                  alt=""
                  style={{
                    width: '40px',
                    height: '40px',
                    marginRight: '15px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSearchVisible(true);
                  }}
                />
              </Tooltip>
              <Tooltip title="打卡中心">
                <img
                  src={clockInPng}
                  alt=""
                  style={{
                    width: '40px',
                    height: '40px',
                    marginRight: '15px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setClockInVisible(true);
                  }}
                />
                <ClockIn
                  visible={clockInVisible}
                  onClose={() => {
                    setClockInVisible(false);
                  }}
                />
              </Tooltip>
              {headerIndex !== 0 ? (
                <Tooltip title="消息中心">
                  <div style={{ position: 'relative' }}>
                    <img
                      src={messagePng}
                      alt=""
                      style={{
                        width: '40px',
                        height: '40px',
                        marginRight: '15px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setMessageVisible(true);
                        dispatch(setUnMessageNum(0));
                        // dispatch(setSocketObj(null));
                      }}
                    />
                    {unMessageNum ? (
                      <div
                        className="headerSet-unRead"
                        style={{
                          borderRadius: unMessageNum < 10 ? '50%' : '20px',
                        }}
                      >
                        {unMessageNum}
                      </div>
                    ) : null}
                  </div>
                </Tooltip>
              ) : null}
              <Tooltip title="聊天中心">
                <ClickAwayListener
                  onClickAway={() => {
                    dispatch(setChatState(false));
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={chatPng}
                      alt=""
                      style={{
                        width: '40px',
                        height: '40px',
                        marginRight: '15px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        dispatch(setChatState(true));
                      }}
                    />
                    {unChatNum ? (
                      <div
                        className="headerSet-unRead"
                        style={{ borderRadius: unChatNum < 10 ? '50%' : '20px' }}
                      >
                        {unChatNum}
                      </div>
                    ) : null}
                    <Chat />
                  </div>
                </ClickAwayListener>
              </Tooltip>
            </React.Fragment>
          ) : null}
        <Tooltip title="用户中心">
          <div
            className="contentHeader-avatar-info"
            onClick={() => {
              setContentSetVisilble(true);
              setAvatarShow(true);
              getVitalityInfo();
            }}
          >
            <div
              className="contentHeader-avatar"
              style={
                avatarShow
                  ? {
                    animation: 'avatarSmall 500ms',
                    // animationFillMode: 'forwards',
                    width: '30px',
                    height: '30px',
                  }
                  : {
                    animation: 'avatarBig 500ms',
                    // animationFillMode: 'forwards',
                    width: '40px',
                    height: '40px',
                  }
              }
            >
              <img src={avatar} alt="" />
            </div>
            <div className="contentHeader-avatar-bg"></div>
          </div>
        </Tooltip>
        <Dialog
          visible={contentSetVisilble}
          dialogStyle={{
            position: 'fixed',
            width: '260px',
            height:
              moveState === 'right'
                ? moveType
                  ? '295px'
                  : 'calc(100% - 70px)'
                : '520px',
            top: '65px',
            left: 'calc(100% - 260px)',
            overflow: 'hidden',
          }}
          onClose={() => {
            setContentSetVisilble(false);
            setAvatarShow(false);
            setBgVisible(false);
            setUserVisible(false);
            setMoveState('');
            api.auth.chooseWallPapers(chooseWallKey);
          }}
          showMask={false}
          footer={false}
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
                  : { left: '0px', height: '520px' }
            }
          >
            <div className="contentHeader-set-left">
              <div className="contentHeader-set-title">
                <div className="contentHeader-set-avatar">
                  <img src={avatar} alt="" />
                </div>
                <div
                  className="contentHeader-set-item contentHeader-set-vitality"
                  onClick={() => {
                    setShowVitality(true);
                  }}
                >
                  <div className="contentHeader-set-item-bg-info">
                    <img
                      src={set6Svg}
                      alt=""
                      style={{
                        width: '15px',
                        height: '17px',
                        marginRight: '10px',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserVisible(true);
                      }}
                    />
                    <div>{user.profile.nickName}</div>
                  </div>
                  <div className="bg-item-right">
                    <img
                      src={batteryPng}
                      alt=""
                      className="contentHeader-set-numImg"
                    />
                    <div style={{ color: '#17B881', fontSize: '12px' }}>
                      活力 {vitalityInfo && vitalityInfo.energyValueTotal}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="contentHeader-set-item"
                onClick={() => {
                  setMoveState('right');
                  setMoveType(0);
                }}
                style={bgVisible ? { backgroundColor: '#f0f0f0' } : {}}
              >
                <div className="contentHeader-set-item-title contentHeader-set-item-bg">
                  <div className="contentHeader-set-item-bg-info">
                    <img
                      src={bgImg}
                      alt=""
                      style={{
                        width: '15px',
                        height: '17px',
                        marginRight: '10px',
                      }}
                    />
                    <div>壁纸设置</div>
                  </div>
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
                      style={{
                        width: '7px',
                        height: '11px',
                        marginLeft: '5px',
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="contentHeader-set-item"
                onClick={() => {
                  setMoveState('right');
                  setMoveType(1);
                }}
                style={bgVisible ? { backgroundColor: '#f0f0f0' } : {}}
              >
                <div className="contentHeader-set-item-title contentHeader-set-item-bg">
                  <div className="contentHeader-set-item-bg-info">
                    <img
                      src={set7Svg}
                      alt=""
                      style={{
                        width: '18px',
                        height: '18px',
                        marginRight: '10px',
                      }}
                    />
                    <div>创建项目</div>
                  </div>
                  <div className="bg-item-right">
                    <img
                      src={rightArrowPng}
                      alt=""
                      style={{ width: '7px', height: '11px' }}
                    />
                  </div>
                </div>
              </div>
              {headerIndex === 0 ? (
                <div className="contentHeader-set-item">
                  <div className="contentHeader-set-item-title">
                    <img
                      src={set1Png}
                      alt=""
                      style={{
                        width: '15px',
                        height: '17px',
                        marginRight: '10px',
                      }}
                    />
                    <div>提醒</div>
                  </div>
                  <div>
                    <Switch
                      checked={theme.messageVisible ? true : false}
                      onChange={() => {
                        changeBoard('messageVisible');
                      }}
                      name="checkedA"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </div>
                </div>
              ) : null}
              {headerIndex === 0 ? (
                <div className="contentHeader-set-item">
                  <div className="contentHeader-set-item-title">
                    <img
                      src={set2Png}
                      alt=""
                      style={{
                        width: '15px',
                        height: '14px',
                        marginRight: '10px',
                      }}
                    />
                    <div>我的任务</div>
                  </div>
                  <div>
                    <Switch
                      checked={theme.mainVisible ? true : false}
                      onChange={() => {
                        changeBoard('mainVisible');
                      }}
                      name="checkedB"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </div>
                </div>
              ) : null}
              {headerIndex === 0 ? (
                <div className="contentHeader-set-item">
                  <div className="contentHeader-set-item-title">
                    <img
                      src={set3Png}
                      alt=""
                      style={{
                        width: '20px',
                        height: '15px',
                        marginRight: '5px',
                      }}
                    />
                    <div>协作看板</div>
                  </div>
                  <div>
                    <Switch
                      checked={theme.memberVisible ? true : false}
                      onChange={() => {
                        changeBoard('memberVisible');
                      }}
                      name="checkedC"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </div>
                </div>
              ) : null}
              <div className="contentHeader-set-item">
                <div className="contentHeader-set-item-title">
                  <img
                    src={set4Png}
                    alt=""
                    style={{
                      width: '20px',
                      height: '15px',
                      marginRight: '5px',
                    }}
                  />
                  <div>日程</div>
                </div>
                <div>
                  <Switch
                    checked={theme.calendarVisible ? true : false}
                    onChange={() => {
                      changeBoard('calendarVisible');
                    }}
                    name="checkedD"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                </div>
              </div>
              <div className="contentHeader-set-item">
                <div
                  className="contentHeader-set-item-title"
                  onClick={() => {
                    logout();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={logoutPng}
                    alt=""
                    style={{
                      width: '16px',
                      height: '15px',
                      marginRight: '5px',
                    }}
                  />
                  <div>退出登录</div>
                </div>
              </div>
              <Dialog
                visible={userVisible}
                footer={false}
                onClose={() => {
                  setUserVisible(false);
                }}
                title={'用户设置'}
                dialogStyle={{
                  position: 'fixed',
                  top: '65px',
                  right: '270px',
                  width: '400px',
                  height: 'calc(100% - 70px)',
                  overflow: 'visible',
                }}
                showMask={false}
              >
                <UserCenter
                  onClose={() => {
                    setUserVisible(false);
                  }}
                />
              </Dialog>
            </div>
            {moveType ? (
              <div className="bg groupCreate">
                <div className="groupCreate-header">
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
                  创建项目
                </div>
                <GroupCreate />
              </div>
            ) : (
                <HeaderBg
                  setMoveState={setMoveState}
                  setChooseWallKey={setChooseWallKey}
                />
              )}
          </div>
        </Dialog>
      </div>

      <HeaderCreate visible={addVisible} onClose={() => { setAddVisible(false) }} createStyle={{
        position: 'fixed',
        top: '65px',
        right: '0px',
        width: '430px',
        height: 'calc(100% - 70px)',
        overflow: 'auto',
        padding: '0px 15px',
      }} />
      <Dialog
        visible={searchVisible}
        onClose={() => {
          setSearchVisible(false);
        }}
        footer={false}
        title={'搜索中心'}
        dialogStyle={{
          position: 'fixed',
          top: '65px',
          right: '0px',
          width: '430px',
          height: searchTaskList.length > 0 ? 'calc(100% - 70px)' : '175px',
          overflow: 'auto',
        }}
        showMask={false}
      >
        <div className="headerSet-search-title">
          <TextField
            // required
            id="outlined-basic"
            variant="outlined"
            label="搜索"
            className={classes.input}
            style={{ width: '70%' }}
            value={searchInput}
            autoComplete="off"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            onKeyDown={(e: any) => {
              if (e.keyCode === 13) {
                searchTask();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              searchTask();
            }}
            style={{ marginLeft: '10px' }}
            className={classes.button}
          >
            搜索
          </Button>
        </div>
        <div>
          <Checkbox
            checked={searchCheck}
            onChange={(e: any) => {
              setSearchCheck(e.target.checked);
              getTaskSearch(1, e.target.checked);
              setPage(1);
            }}
            color="primary"
          />
          已归档任务
        </div>
        {searchTaskList.length > 0 ? (
          <div className="headerSet-search-info" onScroll={scrollSearchLoading}>
            {searchTaskList.map((taskItem: any, taskIndex: number) => {
              return (
                <Task
                  key={'search' + taskIndex}
                  taskItem={taskItem}
                  showGroupName={true}
                />
              );
            })}
          </div>
        ) : null}
      </Dialog>
      <Dialog
        visible={messageVisible}
        onClose={() => {
          setMessageVisible(false);
        }}
        footer={false}
        title={'消息中心'}
        dialogStyle={{
          position: 'fixed',
          top: '65px',
          right: '0px',
          width: '430px',
          height: 'calc(100% - 70px)',
          overflow: 'auto',
        }}
        showMask={false}
      >
        <MessageBoard type={'header'} />
      </Dialog>
      {/* <canvas ref={canvasRef} className="appCanvas"></canvas> */}
      <Dialog
        visible={showVitality}
        onClose={() => {
          setShowVitality(false);
        }}
        footer={false}
        title={'活力值'}
        dialogStyle={{
          width: '90%',
          height: '90%',
          overflow: 'auto',
        }}
      >
        <Vitality
          vitalityType={2}
          vitalityKey={user._key}
          fatherVitalityInfo={vitalityInfo}
        />
      </Dialog>
    </React.Fragment>
  );
};
export default HeaderSet;
