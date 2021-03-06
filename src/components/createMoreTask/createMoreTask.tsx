import React, { useState, useEffect } from 'react';
import './createMoreTask.css';
import { Tooltip } from '@material-ui/core';

import { useTypedSelector } from '../../redux/reducer/RootState';
import { setMessage } from '../../redux/actions/commonActions';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import checkPersonPng from '../../assets/img/checkPerson.png';
import rightArrowPng from '../../assets/img/rightArrow.png';
import closePng from '../../assets/img/close.png';
import { useDispatch } from 'react-redux';
import {
  getSelfTask,
  getWorkingTableTask,
  getGroupTask,
} from '../../redux/actions/taskActions';
import { changeCreateMusic } from '../../redux/actions/authActions';
import {
  setCommonHeaderIndex,
  setMoveState,
} from '../../redux/actions/commonActions';
import { setGroupKey, getGroup } from '../../redux/actions/groupActions';
import Loading from '../common/loading';
import api from '../../services/api';
import _ from 'lodash';
interface CreateMoreTaskProps {
  visible: boolean;
  moreTitle?: string | undefined;
  onClose?: any;
  createStyle?: any;
  changeGroupArray?: any;
  groupIndex?: number;
  labelIndex?: number;
  labelArray?: any;
  groupArray?: any;
  moveTaskType?: string;
  taskKey?: string;
  taskItem?: any;
}

const CreateMoreTask: React.FC<CreateMoreTaskProps> = (props) => {
  const {
    visible,
    moreTitle,
    onClose,
    createStyle,
    changeGroupArray,
    labelIndex,
    groupIndex,
    labelArray,
    groupArray,
    moveTaskType,
    taskKey,
    taskItem,
  } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const theme = useTypedSelector((state) => state.auth.theme);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const mainGroupKey = useTypedSelector((state) => state.auth.mainGroupKey);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const [labelChooseArray, setLabelChooseArray] = useState<any>([
    {
      executorAvatar: '',
      executorKey: '',
      executorName: '',
      labelKey: null,
      labelName: 'Todo',
    },
  ]);
  const [groupChooseIndex, setGroupChooseIndex] = useState<any>(0);
  const [labelChooseIndex, setLabelChooseIndex] = useState<any>(0);
  const [groupAllArray, setGroupAllArray] = useState<any>([]);
  const [labelAllArray, setLabelAllArray] = useState<any>([]);
  const [searchGroupArray, setSearchGroupArray] = useState<any>([]);
  const [searchLabelArray, setSearchLabelArray] = useState<any>([]);
  const [searchGroupInput, setSearchGroupInput] = useState<any>('');
  const [searchLabelInput, setSearchLabelInput] = useState<any>('');
  const [loading, setLoading] = useState(false);
  let unDistory = true;
  useEffect(() => {
    if (visible) {
      setLabelChooseIndex(labelIndex ? labelIndex : 0);
      setGroupChooseIndex(groupIndex ? groupIndex : 0);
      setGroupAllArray(_.cloneDeep(groupArray));
      setLabelAllArray(_.cloneDeep(labelArray));
      setSearchGroupArray(_.cloneDeep(groupArray));
      setSearchLabelArray(_.cloneDeep(labelArray));
      if (!changeGroupArray) {
        getGroupArray();
      }
    }
    return () => {
      unDistory = false;
    };
  }, [visible]);
  useEffect(() => {
    // 用户已登录
    const newGroupAllArray = _.cloneDeep(groupAllArray);
    if (!searchGroupInput) {
      setSearchGroupArray(newGroupAllArray);
    }
  }, [searchGroupInput]);
  useEffect(() => {
    // 用户已登录
    const newLabelAllArray = _.cloneDeep(labelAllArray);
    if (!searchLabelInput) {
      setSearchLabelArray(newLabelAllArray);
    }
  }, [searchLabelInput]);

  const getGroupArray = async () => {
    let newGroupArray: any = [];
    let newLabelAllArray: any = [];
    let groupRes: any = await api.group.getGroup(3, null, 6);
    if (unDistory) {
      if (groupRes.msg === 'OK') {
        newGroupArray.push(...groupRes.result);
        groupRes.result.forEach((item: any, index: number) => {
          newLabelAllArray[index] = _.cloneDeep(item.labelInfo);
        });
        setGroupAllArray(newGroupArray);
        setLabelAllArray(newLabelAllArray);
        let newLabelChooseArray: any = [];
        newGroupArray.map((item: any, index: number) => {
          newLabelChooseArray.push([]);
        });
        setLabelChooseArray(newLabelChooseArray);
        setSearchGroupArray(_.cloneDeep(newGroupArray));
        setSearchLabelArray(_.cloneDeep(newLabelAllArray));
      } else {
        dispatch(setMessage(true, groupRes.msg, 'error'));
      }
    }
  };
  const addMoreTask = async (groupKey: string, labelKey: string) => {
    setLoading(true);
    let addTaskRes: any = await api.task.togetherCreateCard({
      title: moreTitle ? moreTitle : '',
      taskType: taskItem.taskType,
      groupKeyArray: [groupKey],
      labelKey2Array: [[labelKey]],
    });
    if (addTaskRes.msg === 'OK') {
      // setLoading(false);
      dispatch(setMessage(true, '复制任务成功', 'success'));
      onClose();
      if (
        taskItem.groupKey !== mainGroupKey ||
        headerIndex !== 3 ||
        (headerIndex === 3 && taskItem.groupKey !== groupKey)
      ) {
        dispatch(setGroupKey(groupKey));
        // dispatch(getGroupInfo(groupKey));
        dispatch(setCommonHeaderIndex(3));
        if (!theme.moveState) {
          dispatch(setMoveState('in'));
        }
        await api.group.visitGroupOrFriend(2, groupKey);
        dispatch(getGroup(3));
      }
    } else {
      setLoading(false);
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const moveMoreTask = async (groupAllKey: string, labelAllKey: string) => {
    let addTaskRes: any = await api.task.editTask({
      groupKey: groupAllKey,
      labelKey: labelAllKey,
      key: taskKey,
    });
    if (addTaskRes.msg === 'OK') {
      dispatch(setMessage(true, '移动任务成功', 'success'));
      onClose();
      if (
        taskItem.groupKey !== mainGroupKey ||
        headerIndex !== 3 ||
        (headerIndex === 3 && taskItem.groupKey !== groupAllKey)
      ) {
        dispatch(setGroupKey(groupAllKey));
        // dispatch(getGroupInfo(groupKey));
        dispatch(setCommonHeaderIndex(3));
        if (!theme.moveState) {
          dispatch(setMoveState('in'));
        }
        await api.group.visitGroupOrFriend(2, groupAllKey);
        dispatch(getGroup(3));
      }
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const chooseLabel = (labelItem: any, index: number) => {
    let newLabelChooseArray = _.cloneDeep(labelChooseArray);
    let newGroupArray = _.cloneDeep(groupAllArray);
    let labelIndex: number = newLabelChooseArray.indexOf(labelItem.labelKey);
    labelItem.index = index;
    // if (labelIndex === -1) {
    // newLabelChooseArray.push(labelItem);
    // } else {
    //   newLabelChooseArray.splice(labelIndex);
    // }
    // setLabelChooseArray(newLabelChooseArray);
    newLabelChooseArray = [labelItem];
    newGroupArray[groupChooseIndex].index = groupChooseIndex;
    changeGroupArray(newGroupArray[groupChooseIndex], newLabelChooseArray);
    setLabelChooseArray([]);
    onClose();
  };
  const searchGroup = (e: any, type: string) => {
    let input = e.target.value;
    let newSearchArray: any =
      type === 'group'
        ? _.cloneDeep(groupAllArray)
        : _.cloneDeep(labelAllArray)[groupChooseIndex];
    if (input) {
      newSearchArray = newSearchArray.filter((item: any) => {
        let name =
          type === 'group'
            ? item.groupName
            : item.labelName
            ? item.labelName
            : 'ToDo';
        return name && name.toUpperCase().indexOf(input.toUpperCase()) !== -1;
      });
    }
    if (type === 'group') {
      setSearchGroupInput(input);
      setSearchGroupArray(newSearchArray);
    } else {
      setSearchLabelInput(input);
      let newSearchAllArray = _.cloneDeep(searchLabelArray);
      newSearchAllArray[groupChooseIndex] = newSearchArray;
      setSearchLabelArray(newSearchAllArray);
    }
  };
  return (
    <React.Fragment>
      {visible && groupAllArray ? (
        <React.Fragment>
          <div
            className="createMoreTask"
            style={{ ...createStyle }}
            onClick={(e: any) => {
              e.stopPropagation();
            }}
          >
            {loading ? (
              <Loading loadingWidth="80px" loadingHeight="80px" />
            ) : null}
            <div className="createMoreTask-left">
              <div className="createMoreTask-right-header">
                项目列表
                {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={closePng}
                    onClick={onClose}
                    style={{
                      height: '25px',
                      width: '25px',
                      cursor: 'pointer',
                    }}
                  />
                </div> */}
                <input
                  type="text"
                  className="createMoreTask-left-input"
                  placeholder={'输入项目名…'}
                  onChange={(e: any) => {
                    searchGroup(e, 'group');
                  }}
                  value={searchGroupInput}
                />
              </div>

              <div className="createMoreTask-left-container">
                {searchGroupArray.length > 0
                  ? searchGroupArray.map((item: any, index: number) => {
                      return (
                        <div
                          className="createMoreTask-item"
                          onMouseEnter={(e: any) => {
                            // setMoveState('right');
                            setGroupChooseIndex(
                              _.findIndex(groupAllArray, { _key: item._key })
                            );
                          }}
                          key={'group' + index}
                          style={
                            groupChooseIndex ===
                            _.findIndex(groupAllArray, {
                              _key: item._key,
                            })
                              ? {
                                  background: '#F0F0F0',
                                  color: '#17B881',
                                }
                              : {}
                          }
                        >
                          <div className="createMoreTask-item-title">
                            <div className="createMoreTask-avatar">
                              <img
                                src={
                                  item.groupLogo
                                    ? item.groupLogo +
                                      '?imageMogr2/auto-orient/thumbnail/80x'
                                    : defaultGroupPng
                                }
                                alt=""
                              />
                            </div>
                            <Tooltip title={item.groupName}>
                              <div className="createMoreTask-groupName">
                                {item.groupName}
                              </div>
                            </Tooltip>
                          </div>
                          {groupChooseIndex === index ? (
                            <img
                              src={rightArrowPng}
                              alt=""
                              style={{
                                width: '7px',
                                height: '11px',
                              }}
                            />
                          ) : null}
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
            <div className="createMoreTask-right">
              <div className="createMoreTask-right-header">频道列表</div>
              {/* <input
                type="text"
                className="createMoreTask-left-input"
                placeholder={'输入频道名…'}
                onChange={(e: any) => {
                  searchGroup(e, 'label');
                }}
                value={searchLabelInput}
              /> */}
              <div className="createMoreTask-right-container">
                {searchLabelArray[groupChooseIndex]
                  ? searchLabelArray[groupChooseIndex].map(
                      (item: any, index: number) => {
                        return (
                          <div
                            className="createMoreTask-item"
                            onClick={() => {
                              if (changeGroupArray) {
                                chooseLabel(
                                  item,
                                  _.findIndex(labelAllArray, {
                                    _key: item._key,
                                  })
                                );
                              } else if (moveTaskType === '复制') {
                                addMoreTask(
                                  groupAllArray[groupChooseIndex]._key,
                                  item.labelKey
                                );
                              } else if (moveTaskType === '移动') {
                                moveMoreTask(
                                  groupAllArray[groupChooseIndex]._key,
                                  item.labelKey
                                );
                              }
                            }}
                            key={'label' + index}
                            // style={
                            //   labelChooseIndex === index
                            //     ? { background: '#F0F0F0' }
                            //     : {}
                            // }
                          >
                            <div className="createMoreTask-item-title">
                              <div className="createMoreTask-item-left">
                                {/* <Tooltip
                                  title={
                                    item.labelName ? item.labelName : 'ToDo'
                                  }
                                > */}
                                  <div className="createMoreTask-item-label" style={{width:'100%'}}>
                                    {item.labelName ? item.labelName : 'ToDo'} ( {item.executorName
                                    ? item.executorName
                                    : '无默认执行人'} )
                                  </div>
                                {/* </Tooltip> */}
                                {/* <div
                                  className="createMoreTask-item-name"
                                  style={{
                                    marginLeft: '10px',
                                    fontSize: '12px',
                                  }}
                                >
                                  {item.executorName
                                    ? item.executorName
                                    : '无默认执行人'}
                                </div>
                              </div>
                              <div
                                className="createMoreTask-avatar"
                                style={{
                                  width: '25px',
                                  height: '25px',
                                  borderRadius: '50%',
                                }}
                              >
                                <img
                                  src={
                                    item.executorAvatar
                                      ? item.executorAvatar +
                                        '?imageMogr2/auto-orient/thumbnail/80x'
                                      : defaultPersonPng
                                  }
                                  alt=""
                                  onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultPersonPng;
                                  }}
                                /> */}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  : null}
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
CreateMoreTask.defaultProps = { labelArray: [], groupArray: [] };

export default CreateMoreTask;
