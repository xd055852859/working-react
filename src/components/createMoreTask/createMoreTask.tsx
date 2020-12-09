import React, { useState, useEffect } from 'react';
import './createMoreTask.css';
import { Button } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
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
  } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  // const groupArray = useTypedSelector((state) => state.group.groupArray);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
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
  const [moveState, setMoveState] = useState<any>(null);
  useEffect(() => {
    if (visible) {
      setLabelChooseIndex(labelIndex ? labelIndex : 0);
      setGroupChooseIndex(groupIndex ? groupIndex : 0);
      setGroupAllArray(_.cloneDeep(groupArray));
      setLabelAllArray(_.cloneDeep(labelArray));
      if (!changeGroupArray) {
        getGroupArray();
      }
    }
  }, [visible]);
  const getGroupArray = async () => {
    let newGroupArray: any = [];
    let newLabelAllArray: any = [];
    let groupRes: any = await api.group.getGroup(3, null, 6);
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
    } else {
      dispatch(setMessage(true, groupRes.msg, 'error'));
    }
  };
  const addMoreTask = async (groupKey: string, labelKey: string) => {
    let addTaskRes: any = await api.task.togetherCreateCard(
      moreTitle ? moreTitle : '',
      [groupKey],
      [[labelKey]]
    );
    if (addTaskRes.msg === 'OK') {
      dispatch(setMessage(true, '复制任务成功', 'success'));
      if (headerIndex === 0) {
        dispatch(getSelfTask(1, user._key, '[0, 1]'));
      } else if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            targetUserInfo._key === user._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
      }
      onClose();
    } else {
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
      dispatch(changeCreateMusic(true));
      if (headerIndex === 0) {
        dispatch(getSelfTask(1, user._key, '[0, 1]'));
      } else if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(
          getWorkingTableTask(
            targetUserInfo._key === user._key ? 4 : 2,
            targetUserInfo._key,
            1,
            [0, 1, 2, 10]
          )
        );
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
      }
      onClose();
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
    newLabelChooseArray.push(labelItem);
    // } else {
    //   newLabelChooseArray.splice(labelIndex);
    // }
    // setLabelChooseArray(newLabelChooseArray);
    newLabelChooseArray = [labelItem];
    newGroupArray[groupChooseIndex].index = groupChooseIndex;
    console.log('?????', newLabelChooseArray);
    changeGroupArray(newGroupArray[groupChooseIndex], newLabelChooseArray);
    setMoveState(null);
    setLabelChooseArray([]);
    onClose();
  };
  return (
    <React.Fragment>
      {visible && groupAllArray ? (
        <ClickAwayListener
          onClickAway={() => {
            // changeGroupArray(groupArray[groupChooseIndex], labelChooseArray);
            onClose();
            setMoveState(null);
            setLabelChooseArray([]);
          }}
        >
          <div className="createMoreTask" style={{ ...createStyle }}>
            <div className="createMoreTask-left">
              {/* <div className="createMoreTask-right-header">
                项目列表
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={closePng}
                    onClick={onClose}
                    style={{
                      height: '25px',
                      width: '25px',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div> */}
              <div className="createMoreTask-left-container">
                {groupAllArray.length > 0
                  ? groupAllArray.map((item: any, index: number) => {
                      return (
                        <div
                          className="createMoreTask-item"
                          onMouseEnter={(e: any) => {
                            // setMoveState('right');
                            setGroupChooseIndex(index);
                          }}
                          key={'group' + index}
                          style={
                            groupChooseIndex === index
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
                                    ? item.groupLogo
                                    : defaultGroupPng
                                }
                                alt=""
                              />
                            </div>
                            <div>{item.groupName}</div>
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
              {/* <div className="createMoreTask-right-header">
                <img
                  src={leftArrowPng}
                  alt=""
                  style={{
                    width: '7px',
                    height: '11px',
                    marginRight: '10px',
                  }}
                  onClick={() => {
                    setMoveState('left');
                  }}
                />
                {!changeGroupArray ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      addMoreTask();
                    }}
                    style={{
                      marginLeft: '10px',
                      color: '#fff',
                      height: '25px',
                    }}
                  >
                    复制任务
                  </Button>
                ) : null}
              </div> */}
              <div className="createMoreTask-right-container">
                {labelAllArray[groupChooseIndex]
                  ? labelAllArray[groupChooseIndex].map(
                      (item: any, index: number) => {
                        return (
                          <div
                            className="createMoreTask-item"
                            onClick={(e: any) => {
                              if (changeGroupArray) {
                                chooseLabel(item, index);
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
                                <div className="createMoreTask-item-label">
                                  {item.labelName ? item.labelName : 'ToDo'}
                                </div>
                                <div
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
                                style={{ width: '25px', height: '25px' }}
                              >
                                <img
                                  src={
                                    item.executorAvatar
                                      ? item.executorAvatar
                                      : defaultPersonPng
                                  }
                                  alt=""
                                />
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
        </ClickAwayListener>
      ) : null}
    </React.Fragment>
  );
};
CreateMoreTask.defaultProps = { labelArray: [], groupArray: [] };

export default CreateMoreTask;
