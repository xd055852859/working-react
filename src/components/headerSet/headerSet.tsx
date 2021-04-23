import React, { useState, useEffect, useRef } from 'react';
import './headerSet.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { Input, Checkbox, Tooltip, Badge, Drawer, Tabs } from 'antd';

import { useHistory } from 'react-router-dom';
const { Search } = Input;
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import api from '../../services/api';

import {
  setMessage,
  setUnMessageNum,
  setChatState,
} from '../../redux/actions/commonActions';

import ClockIn from '../clockIn/clockIn';
import MessageBoard from '../../views/board/messageBoard';
import Chat from '../../views/chat/chat';
import Task from '../task/task';
import HeaderCreate from './headerCreate';
import HeaderContent from './headerContent';

import searchPng from '../../assets/img/headerSearch.png';
import addPng from '../../assets/img/taskAdd.png';
import messagePng from '../../assets/img/headerMessage.png';
import chatPng from '../../assets/img/headerChat.png';
import clockInPng from '../../assets/img/clockIn.png';
import helpSvg from '../../assets/svg/help.svg';
interface HeaderSetProps {}

const HeaderSet: React.FC<HeaderSetProps> = (prop) => {
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const unChatNum = useTypedSelector((state) => state.common.unChatNum);
  const unMessageNum = useTypedSelector((state) => state.common.unMessageNum);
  const user = useTypedSelector((state) => state.auth.user);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const chatState = useTypedSelector((state) => state.common.chatState);
  const [contentSetVisilble, setContentSetVisilble] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [clockVisible, setClockVisible] = useState(false);
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
  const [clientWidth, setClientWidth] = useState(0);
  let timer1Ref = useRef<any>(null);
  let timer2Ref = useRef<any>(null);
  const childRef = useRef<any>();
  const setRef: React.RefObject<any> = useRef();

  const limit = 20;
  useEffect(() => {
    let width: any =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    setClientWidth(width);
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

  useEffect(() => {
    if (searchInput == '') {
      setSearchTaskList([]);
      setPage(1);
    }
  }, [searchInput]);

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
      curPage: 1,
      perPage: limit * page,
      searchCondition: searchInput,
      searchType: 1,
    };
    if (check) {
      obj.finishPercentStr = '0,1,2';
    }
    if (groupCheck) {
      obj.groupKey = groupKey;
      obj.searchType = 3;
    }
    if (meCheck) {
      obj.searchType = 2;
    }
    if (groupCheck && meCheck) {
      obj.searchType = 4;
    }
    let res: any = await api.task.getCardSearch(obj);
    if (res.msg === 'OK') {
      newSearchTaskList = _.cloneDeep(res.result);
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
  window.onresize = _.debounce(function () {
    let width: any =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    setClientWidth(width);
  }, 500);
  return (
    <div
      ref={setRef}
      style={{ position: 'fixed', top: '0px', right: '10px', zIndex: 5 }}
    >
      <div className="contentHeader-set">
        <React.Fragment>
          <Tooltip title="新建任务" getPopupContainer={() => setRef.current}>
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
          <Tooltip title="搜索中心" getPopupContainer={() => setRef.current}>
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

          <Tooltip title="消息中心" getPopupContainer={() => setRef.current}>
            <Badge count={unMessageNum} offset={[-10, 5]}>
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
          <Tooltip title="聊天中心" getPopupContainer={() => setRef.current}>
            <Badge count={unChatNum ? unChatNum : 0} offset={[-10, 5]}>
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
          <Tooltip title="打卡中心" getPopupContainer={() => setRef.current}>
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
                setClockVisible(true);
              }}
            />
          </Tooltip>
        </React.Fragment>
        {/* <Tooltip title="用户中心"> */}
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
        {/* </Tooltip> */}
      </div>

      <Drawer
        visible={addVisible}
        onClose={() => {
          setAddVisible(false);
        }}
        width={430}
        bodyStyle={{
          padding: '10px',
          boxSizing: 'border-box',
        }}
        headerStyle={{
          padding: '10px',
          boxSizing: 'border-box',
        }}
        destroyOnClose={true}
        getContainer={() => setRef.current}
        title={'新建任务'}
      >
        <HeaderCreate
          createType={'local'}
          onClose={() => {
            setAddVisible(false);
          }}
          visible={addVisible}
        />
      </Drawer>
      <Drawer
        visible={searchVisible}
        onClose={() => {
          setSearchVisible(false);
        }}
        width={430}
        bodyStyle={{
          padding: '10px',
          boxSizing: 'border-box',
        }}
        headerStyle={{
          padding: '10px',
          boxSizing: 'border-box',
        }}
        destroyOnClose={true}
        getContainer={() => setRef.current}
        title={'搜索任务'}
        push={false}
      >
        <Search
          placeholder="请输入搜索内容"
          value={searchInput}
          autoComplete="off"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          onSearch={() => searchTask()}
          allowClear
        />
        <div style={{ marginTop: '15px' }}>
          <Checkbox
            checked={meCheck}
            onChange={(e: any) => {
              setMeCheck(e.target.checked);
              getTaskSearch(1, searchCheck, groupCheck, e.target.checked);
              setPage(1);
            }}
          >
            与我有关
          </Checkbox>
          <Checkbox
            checked={searchCheck}
            onChange={(e: any) => {
              setSearchCheck(e.target.checked);
              getTaskSearch(1, e.target.checked, groupCheck, meCheck);
              setPage(1);
            }}
          >
            已归档任务
          </Checkbox>
          {headerIndex == 3 ? (
            <Checkbox
              checked={groupCheck}
              onChange={(e: any) => {
                setGroupCheck(e.target.checked);
                getTaskSearch(1, searchCheck, e.target.checked, meCheck);
                setPage(1);
              }}
            >
              当前项目下搜索
            </Checkbox>
          ) : null}
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
      </Drawer>
      <Drawer
        visible={messageVisible}
        onClose={() => {
          setMessageVisible(false);
        }}
        width={430}
        bodyStyle={{
          padding: '0px 10px',
          boxSizing: 'border-box',
        }}
        headerStyle={{
          padding: '10px',
          boxSizing: 'border-box',
        }}
        destroyOnClose={true}
        getContainer={() => setRef.current}
        title={'消息中心'}
        push={false}
      >
        <MessageBoard type={'header'} />
      </Drawer>
      <Drawer
        visible={clockVisible}
        onClose={() => {
          if (childRef?.current) {
            //@ts-ignore
            childRef.current.saveClockIn();
          }
          setClockVisible(false);
        }}
        width={280}
        bodyStyle={{
          padding: '10px',
          boxSizing: 'border-box',
        }}
        destroyOnClose={true}
        headerStyle={{
          padding: '10px',
          boxSizing: 'border-box',
        }}
        title={'打卡'}
      >
        <ClockIn ref={childRef} />
      </Drawer>
      <Drawer
        visible={contentSetVisilble}
        onClose={() => {
          setContentSetVisilble(false);
          setAvatarShow(false);
          // if (childRef?.current) {
          //   //@ts-ignore
          //   childRef.current.getInfo();
          // }
        }}
        width={280}
        bodyStyle={{
          padding: '0px',
          boxSizing: 'border-box',
        }}
        headerStyle={{
          display: 'none',
        }}
        destroyOnClose={true}
        getContainer={() => setRef.current}
        push={false}
      >
        <HeaderContent />
      </Drawer>
      <Chat />
    </div>
  );
};
export default HeaderSet;
