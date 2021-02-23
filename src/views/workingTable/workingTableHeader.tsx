import React, { useState, useEffect } from 'react';
import './workingTableHeader.css';
import { Checkbox, Chip, Avatar } from '@material-ui/core';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import api from '../../services/api';
import _ from 'lodash';
import Dialog from '../../components/common/dialog';
import DropMenu from '../../components/common/dropMenu';
import HeaderFilter from '../../components/headerFilter/headerFilter';
import Contact from '../../views/contact/contact';
import Tooltip from '../../components/common/tooltip';
import { setFilterObject } from '../../redux/actions/taskActions';
import { setHeaderIndex, getMember } from '../../redux/actions/memberActions';
import { setTheme } from '../../redux/actions/authActions';
import {
  setCommonHeaderIndex,
  setMoveState,
  setMessage,
} from '../../redux/actions/commonActions';
import infoPng from '../../assets/img/info.png';
import groupSet1Png from '../../assets/img/groupSet1.png';
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
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import checkPersonPng from '../../assets/img/checkPerson.png';
import tabb0Svg from '../../assets/svg/tab0.svg';
import tabb1Svg from '../../assets/svg/tab1.svg';
import tabb4Svg from '../../assets/svg/tab4.svg';
import tabb6Svg from '../../assets/svg/tab6.svg';
import tab0Svg from '../../assets/svg/tabw0.svg';
import tab1Svg from '../../assets/svg/tabw1.svg';
import tab4Svg from '../../assets/svg/tabw4.svg';
import tab6Svg from '../../assets/svg/tabw6.svg';
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
      padding: ' 0px 5px',
      height:'26px !important'
    },
    small1: {
      width: '16px !important',
      height: '16px !important',
      marginRight:'0px !important'
    },
    small2: {
      width: '20px !important',
      height: '16px !important',
      marginRight:'0px !important'
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
  const moveState = useTypedSelector((state) => state.common.moveState);
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const user = useTypedSelector((state) => state.auth.user);
  const userKey = useTypedSelector((state) => state.auth.userKey);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const targetUserKey = useTypedSelector((state) => state.auth.targetUserKey);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const theme = useTypedSelector((state) => state.auth.theme);
  const dispatch = useDispatch();
  const tabArray: string[] = ['任务', '日报', '活力', '日程'];
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
  const tabImg: string[] = [tab0Svg, tab1Svg, tab4Svg, tab6Svg];
  const tabbImg: string[] = [tabb0Svg, tabb1Svg, tabb4Svg, tabb6Svg];
  const [infoVisible, setInfoVisible] = useState(false);
  const checkedTitle = [
    '过期',
    '今天',
    '已完成',
    '未来',
    '重要',
    '一般卡片',
    '已归档',
  ];

  const [deleteMemberVisible, setDeleteMemberVisible] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [memberVisible, setMemberVisible] = useState(false);
  const [filterCheckedArray, setFilterCheckedArray] = useState<any>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [fileState, setFileState] = useState(true);
  const [fileInput, setFileInput] = useState('7');
  const [viewArray, setViewArray] = useState<any>([
    '分频道',
    '分项目',
    '时间表',
    '执行表',
    '频道流',
    '项目流',
    '日历',
  ]);
  const chooseMemberHeader = (headIndex: number) => {
    dispatch(setHeaderIndex(headIndex));
    setViewVisible(false);
    let newFilterObject: any = _.cloneDeep(filterObject);
    let newTheme = _.cloneDeep(theme);
    newTheme.filterObject.headerIndex = headIndex;
    newFilterObject.headerIndex = headIndex;
    dispatch(setTheme(newTheme));
    dispatch(setFilterObject(newFilterObject));
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
    if (
      headerIndex &&
      user &&
      user._key &&
      targetUserInfo &&
      targetUserInfo._key
    )
      setViewArray(
        headerIndex === 1
          ? ['分频道', '分项目', '时间表', '执行表', '频道流', '项目流', '日历']
          : user._key !== targetUserInfo._key
          ? ['分频道', '分项目', '时间表', '', '频道流', '项目流', '日历']
          : ['分频道', '分项目', '', '', '频道流', '项目流', '']
      );
  }, [headerIndex, user, targetUserInfo]);
  useEffect(() => {
    dispatch(setFilterObject(theme.filterObject));
    // dispatch(setHeaderIndex(theme.filterObject.headerIndex));
    // dispatch(setHeaderIndex(0));
    let filterCheckedArray: any = [true, true, true, false, false, false];
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
    // dispatch(setHeaderIndex(0));
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
  const deleteMember = async () => {
    let memberRes: any = await api.group.deleteGroupMember(mainGroupKey, [
      targetUserInfo._key,
    ]);
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '删除好友成功', 'success'));
      dispatch(getMember(mainGroupKey));
      dispatch(setCommonHeaderIndex(1));
      setDeleteMemberVisible(false);
      if (!theme.moveState) {
        dispatch(setMoveState('out'));
      }
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  return (
    <div className="workingTableHeader">
      <div
        className="workingTableHeader-logo"
        onClick={() => {
          if (!theme.moveState) {
            dispatch(setMoveState(moveState === 'in' ? 'out' : 'in'));
          }
          dispatch(setCommonHeaderIndex(1));
        }}
      >
        <img src={tablePng} alt="" />
        工作台
      </div>
      <div className="workingTableHeader-line">|</div>
      {headerIndex === 2 ? (
        <React.Fragment>
          <div className="workingTableHeader-name">
            <div
              className="workingTableHeader-logo"
              style={{ borderRadius: '50%' }}
            >
              <img
                src={
                  targetUserInfo && targetUserInfo.profile.avatar
                    ? targetUserInfo.profile.avatar +
                      '?imageMogr2/auto-orient/thumbnail/80x'
                    : defaultPersonPng
                }
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = defaultPersonPng;
                }}
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
                <Contact contactIndex={1} contactType={'header'} />
              </DropMenu>
            </div>
          </div>

          <Tooltip title="好友设置">
            <div className="workingTableHeader-info">
              <img
                src={infoPng}
                alt=""
                style={{ width: '18px', height: '18px' }}
                onClick={() => {
                  setInfoVisible(true);
                }}
              />
              <DropMenu
                visible={infoVisible}
                dropStyle={{
                  width: '264px',
                  top: '40px',
                  left: '-15px',
                  color: '#333',
                  overflow: 'visible',
                }}
                onClose={() => {
                  setInfoVisible(false);
                }}
              >
                <div className="workingTableHeader-info-container">
                  <div
                    className="workingTableHeader-info-item"
                    onClick={() => {
                      setDeleteMemberVisible(true);
                    }}
                  >
                    <img
                      src={groupSet1Png}
                      alt=""
                      style={{ width: '18px', height: '18px' }}
                    />
                    删除好友
                  </div>
                </div>
              </DropMenu>
            </div>
          </Tooltip>
        </React.Fragment>
      ) : null}
      <div className="view-container">
        <div
          // className="workingTableHeader-logo"
          // style={{ width: '90px' }}
          onMouseEnter={() => {
            setTabVisible(true);
            setViewVisible(false);
            setFilterVisible(false);
          }}
          onClick={() => {
            setTabVisible(true);
            setViewVisible(false);
            setFilterVisible(false);
          }}
        >
          {/* <img src={tabImg[tabIndex]} alt=""></img> */}
          <Chip
            size="small"
            label={tabArray[tabIndex]}
            className={classes.chip}
            avatar={
              <Avatar
                alt="Natacha"
                variant="square"
                src={tabImg[tabIndex]}
                className={classes.small1}
              />
            }
          />
          <DropMenu
            visible={tabVisible}
            dropStyle={{
              width: '180px',
              top: '60px',
              left: '0px',
              color: '#333',
            }}
            onClose={() => {
              setTabVisible(false);
            }}
            closeType={1}
          >
            {tabArray.map((tabItem: any, index: number) => {
              return (
                <div
                  className="viewTableHeader-logo viewTableHeader-tab"
                  onClick={() => {
                    chooseMemberHeader(index === 0 ? 0 : index + 6);
                    setTabIndex(index);
                  }}
                  key={'tabTable' + index}
                  style={{
                    backgroundColor: tabIndex === index ? '#f0f0f0' : '',
                  }}
                >
                  <div className="viewTableHeader-tab">
                    <img src={tabbImg[index]} alt=""></img>
                    {tabItem}
                  </div>
                  {tabIndex === index ? (
                    <img
                      src={checkPersonPng}
                      alt=""
                      style={{
                        width: '20px',
                        height: '12px',
                      }}
                    ></img>
                  ) : null}
                </div>
              );
            })}
          </DropMenu>
        </div>
        {memberHeaderIndex < 7 ? (
          <div
            // className="workingTableHeader-logo"
            // style={{ width: '108px' }}
            onMouseEnter={() => {
              setViewVisible(true);
              setTabVisible(false);
              setFilterVisible(false);
            }}
            onClick={() => {
              setViewVisible(true);
              setTabVisible(false);
              setFilterVisible(false);
            }}
          >
            {/* <img src={viewImg[memberHeaderIndex]} alt=""></img> */}
            <Chip
              size="small"
              label={viewArray[memberHeaderIndex]}
              className={classes.chip}
              avatar={
                <Avatar
                  alt="Natacha"
                  variant="square"
                  src={viewImg[memberHeaderIndex]}
                  className={classes.small2}
                />
              }
            />
            <DropMenu
              visible={viewVisible}
              dropStyle={{
                width: '180px',
                top: '60px',
                left: memberHeaderIndex < 7 ? '70px' : '0px',
                color: '#333',
              }}
              onClose={() => {
                setViewVisible(false);
              }}
              title={'视图切换'}
              closeType={1}
            >
              {viewArray.map((viewItem: any, viewIndex: number) => {
                return (
                  <React.Fragment key={'viewTable' + viewIndex}>
                    {viewItem ? (
                      <div
                        className="viewTableHeader-logo"
                        onClick={() => {
                          chooseMemberHeader(viewIndex);
                        }}
                      >
                        <img src={viewImgb[viewIndex]} alt=""></img>
                        {viewItem}
                      </div>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </DropMenu>
          </div>
        ) : null}

        {memberHeaderIndex < 2 ? (
          <React.Fragment>
            {/* <div
              className="workingTableHeader-logo"
             
              style={{ width: '40px' }}
            >
              <img src={filterPng} alt="" />
            </div> */}
            {filterObject?.filterType.length > 0 ? (
              <Chip
                size="small"
                label={filterObject.filterType.join(' / ')}
                className={classes.chip}
                onClick={() => {
                  setFilterVisible(true);
                }}
                avatar={
                  <Avatar
                    alt="Natacha"
                    variant="square"
                    src={filterPng}
                    className={classes.small1}
                    onClick={() => {
                      setFilterVisible(true);
                      setTabVisible(false);
                      setViewVisible(false);
                    }}
                    onMouseEnter={() => {
                      setFilterVisible(true);
                      setTabVisible(false);
                      setViewVisible(false);
                    }}
                  />
                }
              />
            ) : null}
            {filterObject?.groupKey ? (
              <Chip
                size="small"
                avatar={
                  <Avatar
                    alt=""
                    src={
                      filterObject.groupLogo
                        ? filterObject.groupLogo +
                          '?imageMogr2/auto-orient/thumbnail/80x'
                        : defaultGroupPng
                    }
                    style={{ borderRadius: '5px' }}
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
            {filterObject?.creatorKey ? (
              <Chip
                size="small"
                avatar={
                  <Avatar
                    alt=""
                    src={
                      filterObject.creatorAvatar
                        ? filterObject.creatorAvatar +
                          '?imageMogr2/auto-orient/thumbnail/80x'
                        : defaultPersonPng
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
            {filterObject?.executorKey ? (
              <Chip
                size="small"
                avatar={
                  <Avatar
                    alt=""
                    src={
                      filterObject.executorAvatar
                        ? filterObject.executorAvatar +
                          '?imageMogr2/auto-orient/thumbnail/80x'
                        : defaultPersonPng
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
                          checked={!!filterCheckedArray[index]}
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
      <Dialog
        visible={deleteMemberVisible}
        onClose={() => {
          setDeleteMemberVisible(false);
        }}
        onOK={() => {
          deleteMember();
        }}
        title={'删除好友'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">是否删除该好友</div>
      </Dialog>
    </div>
  );
};
export default WorkingTableHeader;
