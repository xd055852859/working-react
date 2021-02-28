import React, { useState, useEffect } from 'react';
import { Checkbox, Chip, Avatar, Button, Tooltip } from '@material-ui/core';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setHeaderIndex } from '../../redux/actions/memberActions';
import {
  setCommonHeaderIndex,
  setMessage,
  setMoveState,
  setChatState,
} from '../../redux/actions/commonActions';
import { setTheme } from '../../redux/actions/authActions';
import { setFilterObject, getGroupTask } from '../../redux/actions/taskActions';
import {
  changeGroupInfo,
  getGroup,
  setGroupKey,
  getGroupInfo,
} from '../../redux/actions/groupActions';
import { getGroupMember } from '../../redux/actions/memberActions';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import copy from 'copy-to-clipboard';
import moment from 'moment';
import '../workingTable/workingTableHeader.css';
import DropMenu from '../../components/common/dropMenu';
import Dialog from '../../components/common/dialog';
// import Tooltip from '../../components/common/tooltip';
import GroupSet from '../tabs/groupSet';
import GroupMember from '../tabs/groupMember';
import SonGroup from '../tabs/sonGroup';
import Vitality from '../../components/vitality/vitality';
import api from '../../services/api';
import HeaderFilter from '../../components/headerFilter/headerFilter';
import VitalityIcon from '../../components/vitalityIcon/vitalityIcon';
import checkPersonPng from '../../assets/img/checkPerson.png';
import Contact from '../../views/contact/contact';
import boardPng from '../../assets/img/board.png';
import labelPng from '../../assets/img/label.png';
import labelbPng from '../../assets/img/labelb.png';
import calendarPng from '../../assets/img/calendar.png';
import calendarbPng from '../../assets/img/calendarb.png';
import gridTimePng from '../../assets/img/gridTime.png';
import gridPersonPng from '../../assets/img/gridPerson.png';
import gridTimebPng from '../../assets/img/gridTimeb.png';
import gridPersonbPng from '../../assets/img/gridPersonb.png';
import treePng from '../../assets/img/tree.png';
import treebPng from '../../assets/img/treeb.png';
import filterPng from '../../assets/img/filter.png';
import chatPng from '../../assets/img/chat.png';
import infoPng from '../../assets/img/info.png';
import filePng from '../../assets/img/file.png';
import groupSet1Png from '../../assets/img/groupSet1.png';
import groupSet2Png from '../../assets/img/groupSet2.png';
import groupSet3Png from '../../assets/img/groupSet3.png';
import groupSet4Png from '../../assets/img/groupSet4.png';
import groupSet5Png from '../../assets/img/groupSet5.png';
import tabb0Svg from '../../assets/svg/tab0.svg';
import tabb1Svg from '../../assets/svg/tab1.svg';
import tabb2Svg from '../../assets/svg/tab2.svg';
import tabb3Svg from '../../assets/svg/tab3.svg';
import tabb4Svg from '../../assets/svg/tab4.svg';
import tabb5Svg from '../../assets/svg/tab5.svg';
import tabb6Svg from '../../assets/svg/tab6.svg';
import tab0Svg from '../../assets/svg/tabw0.svg';
import tab1Svg from '../../assets/svg/tabw1.svg';
import tab2Svg from '../../assets/svg/tabw2.svg';
import tab3Svg from '../../assets/svg/tabw3.svg';
import tab4Svg from '../../assets/svg/tabw4.svg';
import tab5Svg from '../../assets/svg/tabw5.svg';
import tab6Svg from '../../assets/svg/tabw6.svg';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import downArrowPng from '../../assets/img/downArrow.png';
import logoutPng from '../../assets/img/logout.png';
import './groupTableHeader.css';
import sonGroup from '../tabs/sonGroup';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      backgroundColor: 'rgba(255,255,255,0.24)',
      color: '#fff',
      marginRight: '10px',
      padding: ' 0px 5px',
      height: '26px !important',
    },
    small1: {
      width: '16px !important',
      height: '16px !important',
      marginRight: '0px !important',
    },
    small2: {
      width: '20px !important',
      height: '16px !important',
      marginRight: '0px !important',
    },
  })
);
const GroupTableHeader: React.FC = (prop) => {
  const classes = useStyles();
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const filterObject = useTypedSelector((state) => state.task.filterObject);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const labelArray = useTypedSelector((state) => state.task.labelArray);
  const taskArray = useTypedSelector((state) => state.task.taskArray);
  const groupRole = useTypedSelector((state) => state.group.groupRole);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const groupMemberItem = useTypedSelector(
    (state) => state.member.groupMemberItem
  );
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const theme = useTypedSelector((state) => state.auth.theme);
  const moveState = useTypedSelector((state) => state.common.moveState);
  const dispatch = useDispatch();
  const viewArray: string[] = ['项目', '时间表', '执行表', '日历'];
  //
  const viewImg: string[] = [
    labelPng,
    gridTimePng,
    gridPersonPng,
    calendarPng,
    treePng,
  ];
  const viewImgb: string[] = [
    labelbPng,
    gridTimebPng,
    gridPersonbPng,
    calendarbPng,
    treebPng,
  ];
  const tabImg: string[] = [
    tab0Svg,
    tab1Svg,
    tab2Svg,
    tab3Svg,
    tab4Svg,
    tab5Svg,
    tab6Svg,
  ];
  const tabbImg: string[] = [
    tabb0Svg,
    tabb1Svg,
    tabb2Svg,
    tabb3Svg,
    tabb4Svg,
    tabb5Svg,
    tabb6Svg,
  ];
  const checkedTitle = [
    '过期',
    '今天',
    '已完成',
    '未来',
    '重要',
    '一般卡片',
    '已归档',
    // '树任务',
  ];
  const tabArray = ['任务', '日报', '排行榜', '文档', '活力', '知识树', '日程'];
  const [viewVisible, setViewVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [groupVisible, setGroupVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [groupSetVisible, setGroupSetVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [vitalityVisible, setVitalityVisible] = useState(false);

  const [sonGroupVisible, setSonGroupVisible] = useState(false);
  const [joinCount, setJoinCount] = useState(0);
  const [dismissVisible, setDismissVisible] = useState(false);
  const [groupMember, setGroupMember] = useState<any>([]);
  const [groupObj, setGroupObj] = React.useState<any>(null);
  const [groupTabIndex, setGroupTabIndex] = React.useState(0);
  const [cloneGroupVisible, setCloneGroupVisible] = useState(false);
  const [filterCheckedArray, setFilterCheckedArray] = useState<any>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [outGroupVisible, setOutGroupVisible] = useState(false);
  const [fileState, setFileState] = useState(true);
  const [fileInput, setFileInput] = useState('7');
  const [infoChangeState, setInfoChangeState] = useState(false);

  const chooseMemberHeader = async (headIndex: number) => {
    dispatch(setHeaderIndex(headIndex));
    setViewVisible(false);
    let newFilterObject: any = _.cloneDeep(filterObject);
    newFilterObject.headerIndex = headIndex;
    // await api.member.setConfig(groupMemberItem._key, newFilterObject);
    dispatch(setFilterObject(newFilterObject));
  };
  useEffect(() => {
    if (groupMemberItem) {
      dispatch(setFilterObject(groupMemberItem.config));
      // if (!groupMemberItem.config.headerIndex) {
      //   groupMemberItem.config.headerIndex = 0;
      // }
      // dispatch(setHeaderIndex(groupMemberItem.config.headerIndex));
      // dispatch(setHeaderIndex(0));
    }
  }, [groupMemberItem]);
  useEffect(() => {
    if (groupInfo && infoChangeState) {
      dispatch(getGroup(3));
      setInfoChangeState(false);
      dispatch(setMessage(true, '修改群属性成功', 'success'));
    }
  }, [groupInfo]);

  useEffect(() => {
    let index = memberHeaderIndex === 0 ? 0 : memberHeaderIndex - 6;
    setTabIndex(index);
  }, [memberHeaderIndex]);
  useEffect(() => {
    if (groupInfo) {
      setJoinCount(groupInfo.applyJoinGroupMemberCount);
    }
  }, [groupInfo]);
  useEffect(() => {
    if (filterObject) {
      let filterCheckedArray: any = [];
      if (filterObject.filterType.length > 0) {
        filterCheckedArray = checkedTitle.map((item: any) => {
          return filterObject.filterType.indexOf(item) !== -1;
        });
      }
      setFileInput(filterObject.fileDay);
      setFilterCheckedArray(filterCheckedArray);
    }
  }, [filterObject]);
  const changeFilterCheck = async (filterTypeText: string) => {
    let newFilterObject: any = _.cloneDeep(filterObject);
    let fikterIndex = newFilterObject.filterType.indexOf(filterTypeText);
    if (fikterIndex === -1) {
      newFilterObject.filterType.push(filterTypeText);
    } else {
      newFilterObject.filterType.splice(fikterIndex, 1);
    }
    await api.member.setConfig(groupMemberItem._key, newFilterObject);
    dispatch(setFilterObject({ filterType: newFilterObject.filterType }));
  };
  const saveGroupSet = (obj: any) => {
    setGroupObj(obj);
  };
  const setGroup = async () => {
    if (groupObj) {
      if (groupRole === 1) {
        setInfoChangeState(true);
        dispatch(changeGroupInfo(groupKey, groupObj));
      } else {
        dispatch(setMessage(false, '权限不够,无法修改群属性', 'success'));
      }
    }
  };
  const setMember = (groupMember: any) => {
    setGroupMember(groupMember);
  };
  const saveGroupMember = async () => {
    if (groupMember.length > 0) {
      let newGroupMember: any = [];
      groupMember.forEach((groupMemberItem: any) => {
        // let newGroupIndex = _.findIndex(groupMemberArray, {
        //   userId: groupMemberItem.userId,
        // });
        // if (newGroupIndex === -1) {
        newGroupMember.push({
          userKey: groupMemberItem.userId,
          nickName: groupMemberItem.nickName,
          avatar: groupMemberItem.avatar,
          gender: groupMemberItem.gender,
          role: groupMemberItem.role,
        });
        // }
      });
      let addRes: any = await api.group.addGroupMember(
        groupKey,
        newGroupMember
      );
      // api.group.addAllGroupMember(groupKey, newGroupMember);
      // dispatch(setMessage(true, '修改群成员成功', 'success'));

      if (addRes.msg === 'OK') {
        dispatch(getGroupMember(groupKey));
        dispatch(setMessage(true, '修改群成员成功', 'success'));
      } else {
        dispatch(setMessage(true, addRes.msg, 'error'));
      }
    }
  };
  const deleteFilter = async (filterTypeText: string) => {
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
    await api.member.setConfig(groupMemberItem._key, newFilterObject);
    dispatch(setFilterObject(newFilterObject));
  };

  const dismissGroup = async () => {
    let groupRes: any = await api.group.dismissGroup(groupKey);
    if (groupRes.msg === 'OK') {
      dispatch(setMessage(true, '解散群组成功', 'success'));
      dispatch(getGroup(3));
      dispatch(setCommonHeaderIndex(1));
      if (!theme.moveState) {
        dispatch(setMoveState('out'));
      }
    } else {
      dispatch(setMessage(true, groupRes.msg, 'error'));
    }
  };
  const goChat = () => {
    const dom: any = document.querySelector('iframe');
    dom.contentWindow.postMessage(
      {
        externalCommand: 'go',
        path: '/channel/' + groupInfo.groupUUID,
      },
      '*'
    );
    dispatch(setChatState(true));
  };
  const shareGroup = () => {
    const redirect = `${window.location.protocol}//${window.location.host}`;
    copy(redirect + '/home/basic?groupKey=' + groupKey);
    dispatch(setMessage(true, '复制链接群成功', 'success'));
  };
  const addTemplate = async () => {
    let patchData = {
      type: '用户模板',
      name: groupInfo.groupName,
      description: groupInfo.groupDesc,
      templateUrl: '',
      modelUrl: groupInfo.modelUrl
        ? groupInfo.modelUrl
        : theme.backgroundImg
        ? theme.backgroundImg
        : '',
      templateJson: [
        // {
        //   name: '测试频道1',
        //   children: [{ name: '测试任务11' }, { name: '测试任务12' }],
        // },
        // {
        //   name: '测试频道2',
        //   children: [{ name: '测试任务21' }, { name: '测试任务22' }],
        // },
      ],
    };
    let templateJson: any = [{ name: 'ToDo', children: [] }];
    labelArray.forEach((labelItem: any, labelIndex: number) => {
      if (labelItem.cardLabelName) {
        templateJson[labelIndex] = {
          name: labelItem.cardLabelName,
          children: [],
        };
      }
      taskArray.forEach((taskItem: any, taskIndex: number) => {
        if (
          taskItem.taskEndDate >= moment().startOf('day').valueOf() &&
          taskItem.taskEndDate <= moment().endOf('day').valueOf()
        ) {
          if (taskItem.labelKey) {
            if (taskItem.labelKey === labelItem._key) {
              templateJson[labelIndex].children.push({ name: taskItem.title });
            }
          } else {
            templateJson[labelIndex].children.push({ name: taskItem.title });
          }
        }
      });
    });
    patchData.templateJson = templateJson;
    let templateRes: any = await api.group.addTemplate(patchData);
    if (templateRes.msg === 'OK') {
      dispatch(setMessage(true, '模板生成成功,请等待审核', 'success'));
    } else {
      dispatch(setMessage(true, templateRes.msg, 'error'));
    }
  };
  const outGroup = async () => {
    let memberRes: any = await api.group.outGroup(groupKey);
    if (memberRes.msg === 'OK') {
      dispatch(setMessage(true, '退出项目成功', 'success'));
      dispatch(getGroup(3));
      dispatch(setCommonHeaderIndex(1));
      if (!theme.moveState) {
        dispatch(setMoveState('out'));
      }
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  const changeFileDay = async (fileDay: number) => {
    let newFilterObject = _.cloneDeep(filterObject);
    newFilterObject.fileDay = fileDay;
    let res: any = await api.member.setConfig(
      groupMemberItem._key,
      newFilterObject
    );
    if (res.msg === 'OK') {
      console.log('设置成功');
      // dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
      setFileState(true);
      dispatch(setFilterObject(newFilterObject));
    } else {
      dispatch(setMessage(true, res.msg, 'error'));
    }
  };
  const cloneGroup = async () => {
    let cloneRes: any = await api.group.cloneGroup(
      groupInfo._key,
      groupInfo.groupName + '_副本'
    );
    if (cloneRes.msg === 'OK') {
      dispatch(setMessage(true, '克隆群成功', 'success'));
      dispatch(setGroupKey(cloneRes.result));
      dispatch(getGroupInfo(cloneRes.result));
      dispatch(setCommonHeaderIndex(3));
      if (!theme.moveState) {
        dispatch(setMoveState('in'));
      }
      await api.group.visitGroupOrFriend(2, cloneRes.result);
      dispatch(getGroup(3));
    } else {
      dispatch(setMessage(true, cloneRes.msg, 'error'));
    }
  };
  return (
    <React.Fragment>
      <div
        className="workingTableHeader groupTableHeader"
        style={{ left: moveState === 'in' ? '0px' : '320px' }}
      >
        <div
          className="workingTableHeader-logo"
          style={{ width: '35px' }}
          onClick={() => {
            dispatch(setMoveState(''));
            dispatch(setCommonHeaderIndex(1));
          }}
        >
          <img src={boardPng} alt="" />
        </div>
        <div className="workingTableHeader-line">|</div>
        <div
          className="groupTableHeader-name"
          onClick={() => {
            setGroupVisible(true);
          }}
        >
          <div className="groupTableHeader-logo">
            <img
              src={
                groupInfo && groupInfo.groupLogo
                  ? groupInfo.groupLogo +
                    '?imageMogr2/auto-orient/thumbnail/80x'
                  : defaultGroupPng
              }
              alt=""
            />
          </div>
          <div className="groupTableHeader-name-title">
            {groupInfo && groupInfo.groupName}
          </div>
          <img
            src={downArrowPng}
            alt=""
            className="groupTableHeader-name-title-logo"
          />
          <DropMenu
            visible={groupVisible}
            dropStyle={{
              width: '300px',
              height: '500px',
              top: '55px',
              left: '0px',
              color: '#333',
              overflow: 'visible',
            }}
            onClose={() => {
              setGroupVisible(false);
            }}
            title={'群列表'}
          >
            <Contact contactIndex={0} contactType={'header'} />
          </DropMenu>
        </div>
        {/* <div
        className="groupTableHeader-vitalityNum"
        onClick={() => {
          setVitalityVisible(true);
        }}
      >
        <div style={{ width: '50px', flexShrink: 0 }}>活力值</div>
        <VitalityIcon
          vitalityNum={groupInfo && groupInfo.energyValueTotal}
          vitalityDirection={'vertical'}
          vitalityStyle={{ marginLeft: '5px', color: '#fff' }}
        />
      </div> */}

        <div className="groupTableHeader-info">
          <Tooltip title="群属性">
            <img
              src={infoPng}
              alt=""
              style={{ width: '18px', height: '18px' }}
              onClick={() => {
                setFilterVisible(false);
                setTabVisible(false);
                setViewVisible(false);
                setInfoVisible(true);
              }}
              onMouseEnter={() => {
                setFilterVisible(false);
                setTabVisible(false);
                setViewVisible(false);
                setInfoVisible(true);
              }}
            />
          </Tooltip>
          <DropMenu
            visible={infoVisible}
            dropStyle={{
              width: '264px',
              top: '45px',
              left: '-15px',
              color: '#333',
              overflow: 'visible',
            }}
            onClose={() => {
              setInfoVisible(false);
            }}
            // title={'视图切换'}
          >
            <div className="groupTableHeader-info-container">
              <div
                className="groupTableHeader-info-item"
                onClick={() => {
                  setGroupSetVisible(true);
                  setGroupTabIndex(0);
                }}
              >
                <img
                  src={groupSet1Png}
                  alt=""
                  style={{ width: '18px', height: '18px' }}
                />
                项目属性
              </div>
              <div
                className="groupTableHeader-info-item"
                onClick={() => {
                  setGroupSetVisible(true);
                  setGroupTabIndex(1);
                }}
              >
                <img
                  src={groupSet5Png}
                  alt=""
                  style={{ width: '22px', height: '20px' }}
                />
                群成员
                {groupInfo && joinCount > 0 ? (
                  <div
                    className="group-member-title-num"
                    style={
                      joinCount > 10
                        ? { borderRadius: '12px', padding: '0px 3px' }
                        : { borderRadius: '50%', width: '20px' }
                    }
                  >
                    {joinCount}
                  </div>
                ) : null}
              </div>
              {/* <div
                className="groupTableHeader-info-item"
                onClick={() => {
                  setSonGroupVisible(true);
                }}
              >
                <img />
                子群列表
              </div> */}
              <div
                className="groupTableHeader-info-item"
                onClick={() => {
                  shareGroup();
                }}
              >
                <img
                  src={groupSet2Png}
                  alt=""
                  style={{ width: '20px', height: '19px' }}
                />
                分享群组
              </div>
              {groupInfo && groupInfo.role == 1 ? (
                <div
                  className="groupTableHeader-info-item"
                  onClick={() => {
                    setDismissVisible(true);
                  }}
                >
                  <img
                    src={groupSet4Png}
                    alt=""
                    style={{ width: '20px', height: '18px' }}
                  />
                  解散群组
                </div>
              ) : null}
              {/* {groupInfo && groupInfo.role == 1 ? ( */}
              {/* <div
                  className="groupTableHeader-info-item"
                  onClick={() => {
                    addTemplate();
                  }}
                >
                  <img
                    src={groupSet3Png}
                    alt=""
                    style={{ width: '17px', height: '17px' }}
                  />
                  设为模板
                </div> */}
              <div
                className="groupTableHeader-info-item"
                onClick={() => {
                  setCloneGroupVisible(true);
                }}
              >
                <img
                  src={groupSet3Png}
                  alt=""
                  style={{ width: '17px', height: '17px' }}
                />
                克隆群
              </div>
              {/* ) : null} */}
            </div>
          </DropMenu>
        </div>

        {tabIndex !== 5 ? (
          <div className="groupTableHeader-info">
            <Tooltip title="知识树">
              <img
                src={tabImg[5]}
                alt=""
                style={{
                  width: '18px',
                  height: '18px',
                  marginRight: '7px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  chooseMemberHeader(11);
                  setTabIndex(5);
                }}
              />
            </Tooltip>
          </div>
        ) : null}
        <div className="view-container">
          {memberHeaderIndex === 0 || memberHeaderIndex > 5 ? (
            <div
              // style={{ width: '85px' }}
              onMouseEnter={() => {
                setTabVisible(true);
                setViewVisible(false);
                setFilterVisible(false);
                setInfoVisible(false);
              }}
              onClick={() => {
                setTabVisible(true);
                setViewVisible(false);
                setFilterVisible(false);
                setInfoVisible(false);
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
                      className="viewTableHeader-logo  viewTableHeader-tab"
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
          ) : null}
          {memberHeaderIndex < 5 ? (
            <React.Fragment>
              <div
                // style={{ width: '85px' }}
                onMouseEnter={() => {
                  setViewVisible(true);
                  setTabVisible(false);
                  setFilterVisible(false);
                  setInfoVisible(false);
                }}
                onClick={() => {
                  setViewVisible(true);
                  setTabVisible(false);
                  setFilterVisible(false);
                  setInfoVisible(false);
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
              </div>
              {memberHeaderIndex == 0 ? (
                <React.Fragment>
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
                            setInfoVisible(false);
                          }}
                          onMouseEnter={() => {
                            setFilterVisible(true);
                            setTabVisible(false);
                            setViewVisible(false);
                            setInfoVisible(false);
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
                        />
                      }
                      label={filterObject.groupName}
                      onClick={() => {
                        setFilterVisible(true);
                      }}
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
                      label={'创建人: ' + filterObject.creatorName}
                      onClick={() => {
                        setFilterVisible(true);
                      }}
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
                      label={'执行人: ' + filterObject.executorName}
                      onClick={() => {
                        setFilterVisible(true);
                      }}
                      onDelete={() => deleteFilter('executorKey')}
                      className={classes.chip}
                    />
                  ) : null}
                </React.Fragment>
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
                          {item == '已归档' ? (
                            <React.Fragment>
                              {fileState ? (
                                <div
                                  onClick={() => {
                                    setFileState(false);
                                  }}
                                  style={{
                                    marginLeft: '8px',
                                    cursor: 'pointer',
                                  }}
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
        {/* <Tooltip title="群聊天">
        <img
          src={chatPng}
          alt=""
          style={{
            width: '27px',
            height: '25px',
            marginRight: '10px',
            cursor: 'pointer',
          }}
          onClick={() => {
            goChat();
          }}
        />
      </Tooltip> */}
        {/* <Dialog
        visible={vitalityVisible}
        onClose={() => {
          setVitalityVisible(false);
        }}
        footer={false}
        // title={'搜索中心'}
        dialogStyle={{
          width: 'calc(100% - 330px)',
          height: 'calc(100% - 20px)',
          marginLeft: '330px',
        }}
      >
        <Vitality vitalityType={3} vitalityKey={groupKey} />
      </Dialog> */}
      </div>
      <Dialog
        visible={dismissVisible}
        onClose={() => {
          setDismissVisible(false);
        }}
        onOK={() => {
          dismissGroup();
        }}
        title={'解散群组'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">是否解散该群</div>
      </Dialog>
      <Dialog
        visible={groupSetVisible}
        onClose={() => {
          setGroupSetVisible(false);
        }}
        onOK={() => {
          if (groupTabIndex === 0) {
            setGroup();
          } else if (groupTabIndex === 1) {
            saveGroupMember();
          }
          // setGroupSetVisible(false);
        }}
        // title={'设置群'}
        dialogStyle={{
          width: '850px',
          height: '700px',
        }}
        // showMask={false}
      >
        <div className="groupSet-tab">
          <div
            onClick={() => {
              setGroupTabIndex(0);
              // saveGroupMember();
            }}
            className="groupSet-tab-item"
            style={
              groupTabIndex == 0
                ? {
                    borderBottom: '2px solid #17B881',
                    color: '#17B881',
                  }
                : {}
            }
          >
            项目属性
          </div>
          <div
            onClick={() => {
              setGroupTabIndex(1);
              // setGroup();
            }}
            className="groupSet-tab-item"
            style={
              groupTabIndex == 1
                ? {
                    borderBottom: '2px solid #17B881',
                    color: '#17B881',
                  }
                : {}
            }
          >
            成员
          </div>
          {/* <div
            onClick={() => {
              setGroupTabIndex(2);
              saveGroupMember();
              setGroup();
            }}
            className="groupSet-tab-item"
            style={
              groupTabIndex == 2
                ? {
                    borderBottom: '2px solid #17B881',
                    color: '#17B881',
                  }
                : {}
            }
          >
            子群
          </div> */}
        </div>
        {groupTabIndex === 0 ? (
          <GroupSet
            saveGroupSet={saveGroupSet}
            type={'设置'}
            groupInfo={groupInfo}
          />
        ) : null}
        {groupTabIndex === 1 ? (
          <GroupMember
            setMember={setMember}
            changeCount={(count: any) => {
              setJoinCount(count);
            }}
          />
        ) : null}
        {groupTabIndex === 2 ? (
          <SonGroup
            onClose={() => {
              setGroupSetVisible(false);
            }}
          />
        ) : null}
        <img
          src={logoutPng}
          alt=""
          className="contact-dialog-out"
          onClick={() => {
            setOutGroupVisible(true);
          }}
        />
      </Dialog>
      <Dialog
        visible={outGroupVisible}
        onClose={() => {
          setOutGroupVisible(false);
        }}
        onOK={() => {
          outGroup();
        }}
        title={'退出项目'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">是否退出该群</div>
      </Dialog>
      <Dialog
        visible={cloneGroupVisible}
        onClose={() => {
          setCloneGroupVisible(false);
        }}
        onOK={() => {
          setCloneGroupVisible(false);
          cloneGroup();
        }}
        title={'克隆群'}
        dialogStyle={{ width: '400px', height: '200px' }}
      >
        <div className="dialog-onlyTitle">
          是否克隆群:{groupInfo?.groupName}
        </div>
      </Dialog>
    </React.Fragment>
  );
};
export default GroupTableHeader;
