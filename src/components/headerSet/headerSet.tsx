import React, { useState, useEffect, useRef } from 'react';
import './headerSet.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useLocation, useHistory } from 'react-router-dom';
import {
  TextField,
  Button,
  Checkbox,
  ClickAwayListener,
  Badge,
  Tooltip,
} from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import Dialog from '../common/dialog';

import ClockIn from '../clockIn/clockIn';
import MessageBoard from '../../views/board/messageBoard';
import Chat from '../../views/chat/chat';
import Task from '../task/task';
import HeaderCreate from './headerCreate';
import HeaderContent from './headerContent';
import HeaderMessage from './headerMessage';

import { setTheme } from '../../redux/actions/authActions';

import {
  setMessage,
  setUnMessageNum,
  setChatState,
  setSocketObj,
} from '../../redux/actions/commonActions';

import clockInPng from '../../assets/img/clockIn.png';
import searchPng from '../../assets/img/headerSearch.png';
import addPng from '../../assets/img/taskAdd.png';
import messagePng from '../../assets/img/headerMessage.png';
import chatPng from '../../assets/img/headerChat.png';
import downArrowbPng from '../../assets/img/downArrowb.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';

import _ from 'lodash';
import api from '../../services/api';
import moment from 'moment';
interface HeaderSetProps {}
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
    badgeRoot: {
      width: '45px',
      height: '40px',
      marginRight: '5px',
    },
  })
);
const HeaderSet: React.FC<HeaderSetProps> = (prop) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTypedSelector((state) => state.auth.theme);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const unChatNum = useTypedSelector((state) => state.common.unChatNum);
  const unMessageNum = useTypedSelector((state) => state.common.unMessageNum);
  const socket = useTypedSelector((state) => state.auth.socket);
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const chatState = useTypedSelector((state) => state.common.chatState);
  const [contentSetVisilble, setContentSetVisilble] = useState(false);

  const [clockInVisible, setClockInVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [avatarShow, setAvatarShow] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchTaskList, setSearchTaskList] = useState<any>([]);

  const [avatar, setAvatar] = useState<any>(null);

  const [searchCheck, setSearchCheck] = useState(false);
  const [groupCheck, setGroupCheck] = useState(false);
  const [meCheck, setMeCheck] = useState(false);

  let timer1Ref = useRef<any>(null);
  let timer2Ref = useRef<any>(null);

  const limit = 10;
  useEffect(() => {
    return () => {
      if (timer1Ref.current) {
        clearTimeout(timer1Ref.current);
      }
      if (timer2Ref.current) {
        clearTimeout(timer2Ref.current);
      }
    };
  }, []);
  useEffect(() => {
    if (user) {
      setAvatar(user.profile.avatar);
    }
  }, [user]);
  useEffect(() => {
    setPage(1);
    setSearchTaskList([]);
    setSearchInput('');
  }, [groupKey, headerIndex]);

  // useEffect(() => {
  //   if (finishPos) {
  //     if(!timer1Ref.current){
  //     timer1Ref.current = setTimeout(() => {
  //       setAvatarShow(true);
  //       clearTimeout(timer1Ref.current);
  //     }, 2000);
  //   }
  //   if(!timer2Ref.current){
  //     timer2Ref.current = setTimeout(() => {
  //       setAvatarShow(false);
  //       clearTimeout(timer2Ref.current);
  //     }, 4000);
  //   }
  // }, [finishPos]);
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

  const changeBoard = (type: string) => {
    let newTheme = _.cloneDeep(theme);
    newTheme[type] = newTheme[type] ? false : true;
    dispatch(setTheme(newTheme));
  };

  const searchTask = () => {
    if (searchInput !== '') {
      // this.getSearchList({ param: { name: this.searchInput }, type: 1 })
      getTaskSearch(page, searchCheck, groupCheck, meCheck);
    }
  };
  const getTaskSearch = async (
    page: number,
    check: boolean,
    groupCheck: boolean,
    meCheck: boolean
  ) => {
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
      searchType: 1,
    };
    if (check) {
      obj.finishPercentStr = '1,2,3';
    }
    if (groupCheck) {
      obj.groupKey = groupKey;
      obj.searchType = 3;
    }
    if (meCheck) {
      obj.searchType = 2;
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
      getTaskSearch(newPage, searchCheck, groupCheck, meCheck);
    }
  };

  return (
    <React.Fragment>
      <div className="contentHeader-set">
        <React.Fragment>
          <Tooltip title="新建任务">
            <img
              src={addPng}
              alt=""
              style={{
                width: '40px',
                height: '40px',
                marginRight: '5px',
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
                marginRight: '8px',
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
                marginRight: '8px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setClockInVisible(true);
              }}
            />
          </Tooltip>
          {headerIndex !== 0 ? (
            <Tooltip title="消息中心">
              <Badge badgeContent={unMessageNum} color="error" overlap="circle">
                <img
                  src={messagePng}
                  alt=""
                  style={{
                    width: '40px',
                    height: '40px',
                    marginRight: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setMessageVisible(true);
                    dispatch(setUnMessageNum(0));
                    // dispatch(setSocketObj(null));
                  }}
                />
              </Badge>
            </Tooltip>
          ) : null}
          <ClickAwayListener
            onClickAway={() => {
              dispatch(setChatState(false));
            }}
          >
            <React.Fragment>
              <Tooltip title="聊天中心">
                <Badge
                  badgeContent={unChatNum ? unChatNum : 0}
                  color="error"
                  overlap="circle"
                  // style={{ marginLeft: '-3px', marginRight: '16px' }}
                >
                  <img
                    src={chatPng}
                    alt=""
                    style={{
                      width: '40px',
                      height: '40px',
                      marginRight: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      dispatch(setChatState(!chatState));
                    }}
                  />
                </Badge>
              </Tooltip>
              <Chat />
            </React.Fragment>
          </ClickAwayListener>
        </React.Fragment>

        <Tooltip title="用户中心">
          <div
            className="contentHeader-avatar-info"
            onClick={() => {
              setContentSetVisilble(true);
              setAvatarShow(true);
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
      </div>

      <ClockIn
        visible={clockInVisible}
        onClose={() => {
          setClockInVisible(false);
        }}
      />
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
            checked={meCheck}
            onChange={(e: any) => {
              setMeCheck(e.target.checked);
              if (e.target.checked) {
                setGroupCheck(false);
              }

              getTaskSearch(
                1,
                searchCheck,
                !e.target.checked,
                e.target.checked
              );
              setPage(1);
            }}
            color="primary"
          />
          与我有关
        </div>
        <div>
          <Checkbox
            checked={searchCheck}
            onChange={(e: any) => {
              setSearchCheck(e.target.checked);
              getTaskSearch(1, e.target.checked, groupCheck, meCheck);
              setPage(1);
            }}
            color="primary"
          />
          已归档任务
        </div>
        {headerIndex == 3 ? (
          <div>
            <Checkbox
              checked={groupCheck}
              onChange={(e: any) => {
                setGroupCheck(e.target.checked);
                if (e.target.checked) {
                  setMeCheck(false);
                }
                getTaskSearch(
                  1,
                  searchCheck,
                  e.target.checked,
                  !e.target.checked
                );
                setPage(1);
              }}
              color="primary"
            />
            当前项目下搜索
          </div>
        ) : null}

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
      {/* <HeaderMessage
        visible={messageVisible}
        onClose={() => {
          setMessageVisible(false);
        }}
        messageStyle={{
          position: 'fixed',
          top: '65px',
          right: '0px',
          width: '430px',
          height: 'calc(100% - 70px)',
          overflow: 'auto',
        }}
      /> */}
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
      <HeaderContent
        visible={contentSetVisilble}
        onClose={() => {
          setContentSetVisilble(false);
          setAvatarShow(false);
        }}
      />
    </React.Fragment>
  );
};
export default HeaderSet;
