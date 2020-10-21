import React, { useState, useEffect } from 'react';
import './workingTableHeader.css';
import { Checkbox, Chip, Avatar } from '@material-ui/core';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import api from '../../services/api';
import _ from 'lodash';

import DropMenu from '../../components/common/dropMenu';
import HeaderFilter from '../../components/headerFilter/headerFilter';
import Contact from '../../views/contact/contact';
import Tooltip from '../../components/common/tooltip';

import { setHeaderIndex } from '../../redux/actions/memberActions';
import { setFilterObject } from '../../redux/actions/taskActions';
import { setTheme } from '../../redux/actions/authActions';
import {
  setCommonHeaderIndex,
  setMoveState,
  setChatState,
  setMessage,
} from '../../redux/actions/commonActions';

import tablePng from '../../assets/img/table.png';
import labelPng from '../../assets/img/label.png';
import labelTabPng from '../../assets/img/labelTab.png';
import groupPng from '../../assets/img/group.png';
import gridTimePng from '../../assets/img/gridTime.png';
import gridPersonPng from '../../assets/img/gridPerson.png';
import groupTabPng from '../../assets/img/groupTab.png';
import calendarPng from '../../assets/img/calendar.png';
import labelbPng from '../../assets/img/labelb.png';
import labelTabbPng from '../../assets/img/labelTabb.png';
import groupbPng from '../../assets/img/groupb.png';
import groupTabbPng from '../../assets/img/groupTabb.png';
import gridTimebPng from '../../assets/img/gridTimeb.png';
import gridPersonbPng from '../../assets/img/gridPersonb.png';
import calendarbPng from '../../assets/img/calendarb.png';
import downArrowPng from '../../assets/img/downArrow.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import chatPng from '../../assets/img/chat.png';
import filterPng from '../../assets/img/filter.png';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '600px',
    },
    chip: {
      backgroundColor: 'rgba(255,255,255,0.24)',
      color: '#fff',
      marginRight: '10px',
    },
  })
);
const WorkingTableHeader: React.FC = (prop) => {
  const classes = useStyles();
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const theme = useTypedSelector((state) => state.auth.theme);
  const dispatch = useDispatch();
  const viewArray: string[] = [
    '分频道',
    '分项目',
    '时间表',
    '执行表',
    '频道流',
    '项目流',
    '日历',
  ];
  const viewImg: string[] = [
    labelPng,
    groupPng,
    gridTimePng,
    gridPersonPng,
    labelTabPng,
    groupTabPng,
    calendarPng,
  ];
  const viewImgb: string[] = [
    labelbPng,
    groupbPng,
    gridTimebPng,
    gridPersonbPng,
    labelTabbPng,
    groupTabbPng,
    calendarbPng,
  ];
  const checkedTitle = [
    '过期',
    '今天',
    '已完成',
    '未来',
    '重要',
    '未计划',
    '一般卡片',
    '已归档',
  ];
  const [viewVisible, setViewVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [memberVisible, setMemberVisible] = useState(false);
  const [filterCheckedArray, setFilterCheckedArray] = useState<any>([
    true,
    true,
    true,
    false,
    false,
    false,
  ]);
  const [fileState, setFileState] = useState(true);
  const [fileInput, setFileInput] = useState('7');

  const chooseMemberHeader = (headIndex: number) => {
    dispatch(setHeaderIndex(headIndex));
    setViewVisible(false);
  };
  useEffect(() => {
    if (memberArray) {
      let key = '';
      if (headerIndex === 1 && userKey != '') {
        key = userKey;
      } else if (headerIndex === 2 && targetUserKey != '') {
        key = targetUserKey;
      }
    }
  }, [memberArray, userKey, targetUserKey]);
  useEffect(() => {
    dispatch(setFilterObject(theme.filterObject));
    let filterCheckedArray: any = [];
    if (theme.filterObject.filterType.length > 0) {
      filterCheckedArray = checkedTitle.map((item: any) => {
        return theme.filterObject.filterType.indexOf(item) !== -1;
      });
    }
    setFileInput(theme.fileDay);
    setFilterCheckedArray(filterCheckedArray);
  }, [theme]);
  useEffect(() => {
    //   dispatch(
    //     setFilterObject({
    //       groupKey: null,
    //       groupName: '',
    //       groupLogo: '',
    //       creatorKey: null,
    //       creatorAvatar: '',
    //       creatorName: '',
    //       executorKey: null,
    //       executorAvatar: '',
    //       executorName: '',
    //       filterType: ['过期', '今天', '已完成'],
    //     })
    //   );
    dispatch(setHeaderIndex(0));
  }, [headerIndex]);
  const changeFilterCheck = (filterTypeText: string) => {
    let filterType = filterObject.filterType;
    let fikterIndex = filterType.indexOf(filterTypeText);
    if (fikterIndex === -1) {
      filterType.push(filterTypeText);
    } else {
      filterType.splice(fikterIndex, 1);
    }
    let newTheme = _.cloneDeep(theme);
    newTheme.filterObject.filterType = filterType;
    dispatch(setTheme(newTheme));
    dispatch(setFilterObject({ filterType: filterType }));
  };
  const deleteFilter = (filterTypeText: string) => {
    let newFilterObject: any = _.cloneDeep(filterObject);
    switch (filterTypeText) {
      case 'groupKey':
        newFilterObject.groupKey = null;
        newFilterObject.groupLogo = '';
        newFilterObject.groupName = '';
        break;
      case 'creatorKey':
        newFilterObject.creatorKey = null;
        newFilterObject.creatorAvatar = '';
        newFilterObject.creatorName = '';
        break;
      case 'executorKey':
        newFilterObject.executorKey = null;
        newFilterObject.executorAvatar = '';
        newFilterObject.executorName = '';
    }
    let newTheme = _.cloneDeep(theme);
    newTheme.filterObject = newFilterObject;
    dispatch(setTheme(newTheme));
    dispatch(setFilterObject(newFilterObject));
  };
  const changeFileDay = (fileDay: number) => {
    let newTheme = _.cloneDeep(theme);
    newTheme.fileDay = fileDay;
    dispatch(setTheme(newTheme));
    setFileState(true);
  };
  const goChat = async () => {
    const dom: any = document.querySelector('iframe');
    const privatePerson =
      memberArray[_.findIndex(memberArray, { userId: targetUserKey })];
    const privateChatRId = privatePerson.privateChatRId;
    if (privateChatRId) {
      dom.contentWindow.postMessage(
        {
          externalCommand: 'go',
          path: '/direct/' + privateChatRId,
        },
        '*'
      );
      dispatch(setChatState(true));
    } else {
      let chatRes: any = await api.member.getPrivateChatRId(
        mainGroupKey,
        targetUserKey
      );
      if (chatRes.msg === 'OK') {
        dom.contentWindow.postMessage(
          {
            externalCommand: 'go',
            path: '/direct/' + chatRes.result,
          },
          '*'
        );
        dispatch(setChatState(true));
      } else {
        dispatch(setMessage(true, chatRes.msg, 'error'));
      }
    }
  };
  return (
    <div className="workingTableHeader">
      <div
        className="workingTableHeader-logo"
        onClick={() => {
          dispatch(setMoveState('out'));
          dispatch(setCommonHeaderIndex(1));
        }}
      >
        <img src={tablePng} alt="" />
        工作台
      </div>
      <div className="workingTableHeader-line">|</div>
      {headerIndex === 2 ? (
        <div className="groupTableHeader-name">
          <div className="groupTableHeader-logo">
            <img
              src={
                targetUserInfo && targetUserInfo.profile.avatar
                  ? targetUserInfo.profile.avatar
                  : defaultPersonPng
              }
              alt=""
            />
          </div>

          <div
            className="groupTableHeader-name-title"
            onClick={() => {
              setMemberVisible(true);
            }}
          >
            {targetUserInfo && targetUserInfo.profile.nickName}
            <img
              src={downArrowPng}
              alt=""
              className="groupTableHeader-name-title-logo"
            />
            <DropMenu
              visible={memberVisible}
              dropStyle={{
                width: '250px',
                height: '500px',
                top: '40px',
                left: '-40px',
                color: '#333',
                overflow: 'visible',
              }}
              onClose={() => {
                setMemberVisible(false);
              }}
              title={'联系人列表'}
            >
              <Contact contactIndex={1} contactType={true} />
            </DropMenu>
          </div>
        </div>
      ) : null}
      <div className="view-container">
        {memberHeaderIndex < 7 ? (
          <React.Fragment>
            <div
              className="workingTableHeader-logo"
              style={{ width: '108px' }}
              onClick={() => {
                setViewVisible(true);
              }}
            >
              <img src={viewImg[memberHeaderIndex]} alt=""></img>
              <Chip
                size="small"
                label={viewArray[memberHeaderIndex]}
                className={classes.chip}
              />
            </div>
            <DropMenu
              visible={viewVisible}
              dropStyle={{
                width: '180px',
                top: '60px',
                color: '#333',
              }}
              onClose={() => {
                setViewVisible(false);
              }}
              title={'视图切换'}
            >
              {viewArray.map((viewItem, viewIndex) => {
                return (
                  <div
                    className="viewTableHeader-logo"
                    onClick={() => {
                      chooseMemberHeader(viewIndex);
                    }}
                    key={'viewTable' + viewIndex}
                  >
                    <img src={viewImgb[viewIndex]} alt=""></img>
                    {viewItem}
                  </div>
                );
              })}
            </DropMenu>
            <div
              className="workingTableHeader-logo"
              onClick={() => {
                setFilterVisible(true);
              }}
              style={{ width: '40px' }}
            >
              <img src={filterPng} alt="" />
            </div>
            {filterObject.groupKey ? (
              <Chip
                size="small"
                avatar={
                  <Avatar
                    alt=""
                    src={
                      filterObject.groupLogo +
                      '?imageMogr2/auto-orient/thumbnail/20x20/format/jpg'
                    }
                  />
                }
                onClick={() => {
                  setFilterVisible(true);
                }}
                label={filterObject.groupName}
                onDelete={() => deleteFilter('groupKey')}
                className={classes.chip}
              />
            ) : null}
            {filterObject.creatorKey ? (
              <Chip
                size="small"
                avatar={
                  <Avatar
                    alt=""
                    src={
                      filterObject.creatorAvatar +
                      '?imageMogr2/auto-orient/thumbnail/20x20/format/jpg'
                    }
                  />
                }
                onClick={() => {
                  setFilterVisible(true);
                }}
                label={'创建人: ' + filterObject.creatorName}
                onDelete={() => deleteFilter('creatorKey')}
                className={classes.chip}
              />
            ) : null}
            {filterObject.executorKey ? (
              <Chip
                size="small"
                avatar={
                  <Avatar
                    alt=""
                    src={
                      filterObject.executorAvatar +
                      '?imageMogr2/auto-orient/thumbnail/20x20/format/jpg'
                    }
                  />
                }
                onClick={() => {
                  setFilterVisible(true);
                }}
                label={'执行人: ' + filterObject.executorName}
                onDelete={() => deleteFilter('executorKey')}
                className={classes.chip}
              />
            ) : null}
            {filterObject.filterType.length > 0 ? (
              <Chip
                size="small"
                label={filterObject.filterType.join(' / ')}
                className={classes.chip}
                onClick={() => {
                  setFilterVisible(true);
                }}
              />
            ) : null}
            <DropMenu
              visible={filterVisible}
              dropStyle={{
                width: '328px',
                top: '60px',
                left: '108px',
                color: '#333',
              }}
              onClose={() => {
                setFilterVisible(false);
              }}
              title={'过滤器'}
            >
              <HeaderFilter />
              <div className="filter-info">
                <div className="filter-title">状态 :</div>
                <div className="filter-menu">
                  {checkedTitle.map((item: any, index: number) => {
                    return (
                      <div key={'filter' + item} className="filter-menu-item">
                        <Checkbox
                          checked={filterCheckedArray[index]}
                          onChange={() => {
                            changeFilterCheck(item);
                          }}
                          color="primary"
                        />
                        {item}
                        {item === '已归档' ? (
                          <React.Fragment>
                            {fileState ? (
                              <div
                                onClick={() => {
                                  setFileState(false);
                                }}
                                style={{ marginLeft: '8px', cursor: 'pointer' }}
                              >
                                ( 近{fileInput}天 )
                              </div>
                            ) : (
                              <div style={{ marginLeft: '8px' }}>
                                ( 近
                                <input
                                  type="number"
                                  value={fileInput}
                                  onChange={(e) => {
                                    setFileInput(e.target.value);
                                  }}
                                  onBlur={(e) => {
                                    changeFileDay(parseInt(e.target.value));
                                  }}
                                  className="fileday"
                                />
                                天 )
                              </div>
                            )}
                          </React.Fragment>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </DropMenu>
          </React.Fragment>
        ) : null}
      </div>
      <div
        className="view-tab"
        onClick={() => {
          chooseMemberHeader(0);
        }}
        style={
          memberHeaderIndex < 7
            ? {
                borderBottom: '3px solid #17B881',
                // color: '#17B881',
                marginLeft:'10px'
              }
            : {marginLeft:'10px'}
        }
      >
        任务
      </div>
      |
      <div
        className="view-tab"
        onClick={() => {
          chooseMemberHeader(7);
        }}
        style={
          memberHeaderIndex === 7
            ? {
                borderBottom: '3px solid #17B881',
                // color: '#17B881',
              }
            : {}
        }
      >
        日报
      </div>
      |
      <div
        className="view-tab"
        onClick={() => {
          chooseMemberHeader(8);
        }}
        style={
          memberHeaderIndex === 8
            ? {
                borderBottom: '3px solid #17B881',
                // color: '#17B881',
              }
            : {}
        }
      >
        活力
      </div>
      {/* {headerIndex === 2 ? (
        <Tooltip title="群聊天">
          <img
            src={chatPng}
            alt=""
            style={{
              width: '27px',
              height: '25px',
              marginLeft: '10px',
              cursor: 'pointer',
            }}
            onClick={() => {
              goChat();
            }}
          />
        </Tooltip>
      ) : null} */}
    </div>
  );
};
export default WorkingTableHeader;
