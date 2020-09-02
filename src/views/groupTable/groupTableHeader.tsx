import React, { useState, useEffect } from 'react';
import { Checkbox, Chip, Avatar } from '@material-ui/core';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { setHeaderIndex } from '../../redux/actions/memberActions';
import {
  setCommonHeaderIndex,
  setMessage,
  setMoveState,
} from '../../redux/actions/commonActions';
import { setFilterObject } from '../../redux/actions/taskActions';
import { changeGroupInfo, getGroup } from '../../redux/actions/groupActions';
import { getGroupMember } from '../../redux/actions/memberActions';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import '../workingTable/workingTableHeader.css';
import DropMenu from '../../components/common/dropMenu';
import Dialog from '../../components/common/dialog';
import GroupSet from '../tabs/groupSet';
import GroupMember from '../tabs/groupMember';
import api from '../../services/api';
import HeaderFilter from '../../components/headerFilter/headerFilter';
import VitalityIcon from '../../components/vitalityIcon/vitalityIcon';
import Contact from '../../views/contact/contact';
import boardPng from '../../assets/img/board.png';
import labelPng from '../../assets/img/label.png';
import labelbPng from '../../assets/img/labelb.png';
import calendarPng from '../../assets/img/calendar.png';
import calendarbPng from '../../assets/img/calendarb.png';
import filterPng from '../../assets/img/filter.png';
import chatPng from '../../assets/img/chat.png';
import infoPng from '../../assets/img/info.png';
import filePng from '../../assets/img/file.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import downArrowPng from '../../assets/img/downArrow.png';
import './groupTableHeader.css';
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
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const theme = useTypedSelector((state) => state.auth.theme);
  const dispatch = useDispatch();
  const viewArray: string[] = ['项目', '日历'];
  const viewImg: string[] = [labelPng, calendarPng];
  const viewImgb: string[] = [labelbPng, calendarbPng];
  const checkedTitle = [
    '过期',
    '今天',
    '已完成',
    '未来',
    '计划',
    '未计划',
    '一般卡片',
    '已归档',
  ];
  const [viewVisible, setViewVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [groupVisible, setGroupVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [groupSetVisible, setGroupSetVisible] = useState(false);
  const [groupMemberVisible, setGroupMemberVisible] = useState(false);
  const [groupMember, setGroupMember] = useState<any>([]);
  const [groupObj, setGroupObj] = React.useState<any>(null);
  const [filterCheckedArray, setFilterCheckedArray] = useState<any>([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const chooseMemberHeader = (headIndex: number) => {
    dispatch(setHeaderIndex(headIndex));
    setViewVisible(false);
  };
  useEffect(() => {
    let filterCheckedArray: any = [];
    if (filterObject.filterType.length > 0) {
      filterCheckedArray = checkedTitle.map((item: any) => {
        return filterObject.filterType.indexOf(item) != -1;
      });
    }
    console.log('filterCheckedArray', filterCheckedArray);
    setFilterCheckedArray(filterCheckedArray);
  }, [filterObject]);
  useEffect(() => {
    dispatch(
      setFilterObject({
        groupKey: null,
        groupName: '',
        groupLogo: '',
        creatorKey: null,
        creatorAvatar: '',
        creatorName: '',
        executorKey: null,
        executorAvatar: '',
        executorName: '',
        filterType: ['过期', '今天', '已完成'],
      })
    );
    dispatch(setHeaderIndex(0));
  }, [headerIndex]);
  const changeFilterCheck = (filterTypeText: string) => {
    let filterType = filterObject.filterType;
    let fikterIndex = filterType.indexOf(filterTypeText);
    if (fikterIndex == -1) {
      filterType.push(filterTypeText);
    } else {
      filterType.splice(fikterIndex, 1);
    }
    dispatch(setFilterObject({ filterType: filterType }));
  };
  const saveGroupSet = (obj: any) => {
    setGroupObj(obj);
    console.log(obj);
  };
  const setGroup = () => {
    dispatch(changeGroupInfo(groupKey, groupObj));
    setGroupSetVisible(false);
    dispatch(getGroup(3, null, theme.groupSortType));
  };
  const setMember = (groupMember: any) => {
    console.log('groupMember', groupMember);
    setGroupMember(groupMember);
  };
  const saveGroupMember = () => {
    let newGroupMember = groupMember.map((groupMemberItem: any) => {
      return groupMemberItem.userId;
    });
    api.group.addAllGroupMember(groupKey, newGroupMember);
    dispatch(setMessage(true, '修改群成员成功', 'success'));
    dispatch(getGroupMember(groupKey));
    setGroupMemberVisible(false);
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
    dispatch(setFilterObject(newFilterObject));
  };
  return (
    <div className="workingTableHeader">
      <div
        className="workingTableHeader-logo"
        style={{ width: '56px' }}
        onClick={() => {
          dispatch(setMoveState('out'));
          dispatch(setCommonHeaderIndex(0));
        }}
      >
        <img src={boardPng} alt="" />
      </div>
      <div className="workingTableHeader-line">|</div>
      <div className="groupTableHeader-name">
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
        <div
          className="groupTableHeader-name-title"
          onClick={() => {
            setGroupVisible(true);
          }}
        >
          {groupInfo && groupInfo.groupName}
          <img
            src={downArrowPng}
            alt=""
            className="groupTableHeader-name-title-logo"
          />
          <DropMenu
            visible={groupVisible}
            dropStyle={{
              width: '350px',
              height: '500px',
              top: '40px',
              left: '-40px',
              color: '#333',
            }}
            onClose={() => {
              setGroupVisible(false);
            }}
            title={'群列表'}
          >
            <Contact contactIndex={0} />
          </DropMenu>
        </div>
      </div>
      <div className="groupTableHeader-vitalityNum">
        <div style={{ width: '50px', flexShrink: 0 }}>活力值</div>
        <VitalityIcon
          vitalityNum={groupInfo && groupInfo.energyValueTotal}
          vitalityDirection={'vertical'}
          vitalityStyle={{ marginLeft: '5px' }}
        />
      </div>
      <div className="groupTableHeader-info">
        <img
          src={infoPng}
          alt=""
          style={{ width: '30px', height: '30px', marginRight: '30px' }}
          onClick={() => {
            setInfoVisible(true);
          }}
        />
        <DropMenu
          visible={infoVisible}
          dropStyle={{
            width: '264px',
            height: '194px',
            top: '65px',
            left: '-15px',
            color: '#333',
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
              }}
            >
              <img />
              项目属性
            </div>
            <div
              className="groupTableHeader-info-item"
              onClick={() => {
                setGroupMemberVisible(true);
              }}
            >
              <img /> 群成员
            </div>
          </div>
        </DropMenu>
      </div>
      <img
        src={chatPng}
        alt=""
        style={{ width: '27px', height: '25px', marginRight: '20px' }}
      />
      <img
        src={filePng}
        alt=""
        style={{ width: '30px', height: '25px', marginRight: '30px' }}
      />
      <div className="view-container">
        <div
          className="workingTableHeader-logo"
          style={{ width: '108px' }}
          onClick={() => {
            setViewVisible(true);
          }}
        >
          <img src={viewImg[memberHeaderIndex]} alt=""></img>
          {viewArray[memberHeaderIndex]}
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
            <div className="filter-title">状态</div>
            <div className="filter-menu">
              {checkedTitle.map((item: any, index: number) => {
                return (
                  <div key={'filter' + item} className="filter-menu-item">
                    <Checkbox
                      checked={filterCheckedArray[index]}
                      onChange={() => {
                        changeFilterCheck(item);
                      }}
                    />
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        </DropMenu>
      </div>
      <div>
        <div></div>
      </div>
      <Dialog
        visible={groupSetVisible}
        onClose={() => {
          setGroupSetVisible(false);
        }}
        onOK={() => {
          setGroup();
        }}
        title={'设置群属性'}
        dialogStyle={{ width: '750px', height: '700px' }}
      >
        <GroupSet saveGroupSet={saveGroupSet} type={'设置'} />
      </Dialog>
      <Dialog
        visible={groupMemberVisible}
        onClose={() => {
          setGroupMemberVisible(false);
        }}
        onOK={() => {
          saveGroupMember();
        }}
        title={'设置群成员'}
        dialogStyle={{ width: '850px', height: '700px' }}
      >
        {/* saveGroupSet={saveGroupSet} type={'设置'}  */}
        <GroupMember setMember={setMember} />
      </Dialog>
    </div>
  );
};
export default GroupTableHeader;
