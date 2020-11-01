import React, { useState, useEffect } from 'react';
import { Checkbox, Chip, Avatar, Button } from '@material-ui/core';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setHeaderIndex } from '../../redux/actions/memberActions';
import {
  setCommonHeaderIndex,
  setMessage,
  setMoveState,
  setChatState,
} from '../../redux/actions/commonActions';
import { setFilterObject } from '../../redux/actions/taskActions';
import { changeGroupInfo, getGroup } from '../../redux/actions/groupActions';
import { getGroupMember } from '../../redux/actions/memberActions';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import copy from 'copy-to-clipboard';
import moment from 'moment';
import '../workingTable/workingTableHeader.css';
import DropMenu from '../../components/common/dropMenu';
import Dialog from '../../components/common/dialog';
import Tooltip from '../../components/common/tooltip';
import GroupSet from '../tabs/groupSet';
import GroupMember from '../tabs/groupMember';
import SonGroup from '../tabs/sonGroup';
import Vitality from '../../components/vitality/vitality';
import api from '../../services/api';
import HeaderFilter from '../../components/headerFilter/headerFilter';
import VitalityIcon from '../../components/vitalityIcon/vitalityIcon';
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
import defaultGroupPng from '../../assets/img/defaultGroup.png';
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
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const groupMemberArray = useTypedSelector(
    (state) => state.member.groupMemberArray
  );
  const groupMemberItem = useTypedSelector(
    (state) => state.member.groupMemberItem
  );
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const theme = useTypedSelector((state) => state.auth.theme);
  const dispatch = useDispatch();
  const viewArray: string[] = ['项目', '时间表', '执行表', '日历', '任务树'];
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
  const checkedTitle = [
    '过期',
    '今天',
    '已完成',
    '未来',
    '重要',
    '未计划',
    '一般卡片',
    '已归档',
    // '树任务',
  ];
  const [viewVisible, setViewVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [groupVisible, setGroupVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [groupSetVisible, setGroupSetVisible] = useState(false);
  const [vitalityVisible, setVitalityVisible] = useState(false);
  const [groupMemberVisible, setGroupMemberVisible] = useState(false);
  const [sonGroupVisible, setSonGroupVisible] = useState(false);
  const [dismissVisible, setDismissVisible] = useState(false);
  const [groupMember, setGroupMember] = useState<any>([]);
  const [groupObj, setGroupObj] = React.useState<any>(null);
  const [groupTabIndex, setGroupTabIndex] = React.useState(0);
  const [filterCheckedArray, setFilterCheckedArray] = useState<any>([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [outGroupVisible, setOutGroupVisible] = useState(false);
  const chooseMemberHeader = (headIndex: number) => {
    dispatch(setHeaderIndex(headIndex));
    setViewVisible(false);
  };
  useEffect(() => {
    if (groupMemberItem) {
      dispatch(setFilterObject(groupMemberItem.config));
    }
  }, [groupMemberItem]);
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
  useEffect(() => {
    let filterCheckedArray: any = [];
    if (filterObject.filterType.length > 0) {
      filterCheckedArray = checkedTitle.map((item: any) => {
        return filterObject.filterType.indexOf(item) !== -1;
      });
    }
    setFilterCheckedArray(filterCheckedArray);
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
  const setGroup = () => {
    if (groupObj) {
      dispatch(changeGroupInfo(groupKey, groupObj));
      // dispatch(setMessage(true, '修改群属性成功', 'success'));
      // dispatch(getGroup(3, null, theme.groupSortType));
      dispatch(getGroup(3));
    }
  };
  const setMember = (groupMember: any) => {
    setGroupMember(groupMember);
  };
  const saveGroupMember = () => {
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
      api.group.addGroupMember(groupKey, newGroupMember);
      // api.group.addAllGroupMember(groupKey, newGroupMember);
      // dispatch(setMessage(true, '修改群成员成功', 'success'));
      dispatch(getGroupMember(groupKey));
      setGroupMemberVisible(false);
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
      dispatch(setMoveState('out'));
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
    copy(redirect + '/?groupKey=' + groupKey);
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
      dispatch(setMoveState('out'));
    } else {
      dispatch(setMessage(true, memberRes.msg, 'error'));
    }
  };
  return (
    <React.Fragment>
      <div className="workingTableHeader">
        <div
          className="workingTableHeader-logo"
          style={{ width: '35px' }}
          onClick={() => {
            dispatch(setMoveState('out'));
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
                  ? groupInfo.groupLogo
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
              width: '250px',
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
            <Contact contactIndex={0} contactType={true} />
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
        <Tooltip title="群属性">
          <div className="groupTableHeader-info">
            <img
              src={infoPng}
              alt=""
              style={{ width: '30px', height: '30px' }}
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
                <div
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
                </div>
                {/* ) : null} */}
              </div>
            </DropMenu>
          </div>
        </Tooltip>
        {/* <Tooltip title="群文件">
        <img
          src={filePng}
          alt=""
          style={{ width: '30px', height: '25px', marginRight: '30px' }}
        />
      </Tooltip> */}
        <div className="view-container">
          {memberHeaderIndex < 5 ? (
            <React.Fragment>
              <div
                className="workingTableHeader-logo"
                style={{ width: '108px' }}
                onMouseEnter={() => {
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
              {memberHeaderIndex == 0 ? (
                <React.Fragment>
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
                      avatar={<Avatar alt="" src={filterObject.groupLogo} />}
                      label={filterObject.groupName}
                      onClick={() => {
                        setFilterVisible(true);
                      }}
                      onDelete={() => deleteFilter('groupKey')}
                      className={classes.chip}
                    />
                  ) : null}
                  {filterObject.creatorKey ? (
                    <Chip
                      size="small"
                      avatar={
                        <Avatar alt="" src={filterObject.creatorAvatar} />
                      }
                      label={'创建人: ' + filterObject.creatorName}
                      onClick={() => {
                        setFilterVisible(true);
                      }}
                      onDelete={() => deleteFilter('creatorKey')}
                      className={classes.chip}
                    />
                  ) : null}
                  {filterObject.executorKey ? (
                    <Chip
                      size="small"
                      avatar={
                        <Avatar alt="" src={filterObject.executorAvatar} />
                      }
                      label={'执行人: ' + filterObject.executorName}
                      onClick={() => {
                        setFilterVisible(true);
                      }}
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
                            <div
                              style={{ marginLeft: '8px', cursor: 'pointer' }}
                            >
                              ( 近7天 )
                            </div>
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
                marginLeft: '10px',
              }
              : { marginLeft: '10px' }
          }
        >
          任务
        </div>
        |
        <div
          className="view-tab"
          onClick={() => {
            chooseMemberHeader(9);
          }}
          style={
            memberHeaderIndex === 9
              ? {
                borderBottom: '3px solid #17B881',
              }
              : {}
          }
        >
          文档
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
              }
              : {}
          }
        >
          动态
        </div>
        |
        <div
          className="view-tab"
          onClick={() => {
            chooseMemberHeader(10);
          }}
          style={
            memberHeaderIndex === 10
              ? {
                borderBottom: '3px solid #17B881',
              }
              : {}
          }
        >
          活力
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
          setGroupSetVisible(false);
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
              saveGroupMember();
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
              setGroup();
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
          <div
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
          </div>
          <img
            src={logoutPng}
            alt=""
            className="contact-dialog-out"
            onClick={() => {
              setOutGroupVisible(true);
            }}
          />
        </div>
        {groupTabIndex === 0 ? (
          <GroupSet saveGroupSet={saveGroupSet} type={'设置'} />
        ) : null}
        {groupTabIndex === 1 ? <GroupMember setMember={setMember} /> : null}
        {groupTabIndex === 2 ? (
          <SonGroup
            onClose={() => {
              setSonGroupVisible(false);
            }}
          />
        ) : null}
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
    </React.Fragment>
  );
};
export default GroupTableHeader;
