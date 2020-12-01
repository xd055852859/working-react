import React, { useState, useEffect } from 'react';
import './createMoreTask.css';
import { Button } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { setMessage } from '../../redux/actions/commonActions';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import checkPersonPng from '../../assets/img/checkPerson.png';
import leftArrowPng from '../../assets/img/leftArrow.png';
import closePng from '../../assets/img/close.png';
import { useDispatch } from 'react-redux';
import {
  getSelfTask,
  getWorkingTableTask,
  getGroupTask,
} from '../../redux/actions/taskActions';
import api from '../../services/api';
import _ from 'lodash';
interface CreateMoreTaskProps {
  visible: boolean;
  moreTitle?: string | undefined;
  onClose?: any;
  createStyle?: any;
  taskWidth: number;
  changeGroupArray?: any;
}

const CreateMoreTask: React.FC<CreateMoreTaskProps> = (props) => {
  const {
    visible,
    moreTitle,
    onClose,
    createStyle,
    taskWidth,
    changeGroupArray,
  } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector((state) => state.auth.user);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const [labelArray, setLabelArray] = useState<any>([]);
  const [labelChooseArray, setLabelChooseArray] = useState<any>([]);
  const [groupChooseIndex, setGroupChooseIndex] = useState<any>(0);
  const [moveState, setMoveState] = useState('');
  useEffect(() => {
    if (visible && groupArray && groupArray.length > 0 && !changeGroupArray) {
      // getLabelArray(groupArray[0]._key);
      let newLabelChooseArray: any = [];
      groupArray.map((item: any, index: number) => {
        newLabelChooseArray.push([]);
      });
      setLabelChooseArray(newLabelChooseArray);
    }
  }, [groupArray, visible]);
  const getLabelArray = async (groupKey: string) => {
    let newLabelArray = [];
    let labelRes: any = await api.group.getLabelInfo(groupKey);
    if (labelRes.msg === 'OK') {
      newLabelArray.push(...labelRes.result);
      setLabelArray(newLabelArray);
    } else {
      dispatch(setMessage(true, labelRes.msg, 'error'));
    }
  };
  const addMoreTask = async () => {
    let groupArr: any = [];
    let labelArr: any = _.cloneDeep(labelChooseArray).filter(
      (item: any, index: number) => {
        if (item.length > 0) {
          groupArr.push(groupArray[index]._key);
          return item;
        }
      }
    );
    let addTaskRes: any = await api.task.togetherCreateCard(
      moreTitle ? moreTitle : '',
      groupArr,
      labelArr
    );
    if (addTaskRes.msg === 'OK') {
      dispatch(setMessage(true, '新增对应群任务成功', 'success'));
      if (headerIndex === 0) {
        dispatch(getSelfTask(1, user._key, '[0, 1]'));
      } else if (headerIndex === 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 2) {
        dispatch(getWorkingTableTask(2, targetUserInfo._key, 1, [0, 1, 2, 10]));
      } else if (headerIndex === 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2,10]'));
      }
      onClose();
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  const chooseLabel = (labelItem: any) => {
    let newLabelChooseArray = _.cloneDeep(labelChooseArray);
    let labelIndex: number = newLabelChooseArray.indexOf(labelItem._key);
    if (labelIndex === -1) {
      newLabelChooseArray.push(labelItem);
    } else {
      newLabelChooseArray.splice(labelIndex);
    }
    setLabelChooseArray(newLabelChooseArray);
  };
  return (
    <React.Fragment>
      {visible && groupArray ? (
        <ClickAwayListener
          onClickAway={() => {
            changeGroupArray(groupArray[groupChooseIndex], labelChooseArray);
            onClose();
            setMoveState('left');
            setLabelChooseArray([]);
          }}
        >
          <div
            className="createMoreTask"
            style={{ ...createStyle, width: taskWidth + 'px' }}
          >
            <div
              className="createMoreTask-container"
              style={{
                animation:
                  moveState === 'right'
                    ? taskWidth === 260
                      ? 'moveRight 500ms'
                      : 'moveBigRight 500ms'
                    : moveState === 'left'
                    ? taskWidth === 260
                      ? 'moveRight 500ms'
                      : 'moveBigRight 500ms'
                    : '',
                // animationFillMode: 'forwards',
                left: moveState === 'right' ? -taskWidth + 'px' : '0px',
                width: taskWidth * 2 + 'px',
              }}
            >
              <div
                className="createMoreTask-left"
                style={{ width: taskWidth + 'px' }}
              >
                {!changeGroupArray ? (
                  <div className="createMoreTask-right-header">
                    项目列表
                    <div style={{ display: 'flex', alignItems: 'center' }}>
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
                  </div>
                ) : null}
                <div className="createMoreTask-left-container">
                  {groupArray.length > 0
                    ? groupArray.map((item: any, index: number) => {
                        return (
                          <div
                            className="createMoreTask-item"
                            onClick={(e: any) => {
                              setMoveState('right');
                              getLabelArray(item._key);
                              setGroupChooseIndex(index);
                            }}
                            key={'group' + index}
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
                            {!changeGroupArray &&
                            labelChooseArray[index] &&
                            labelChooseArray[index].length > 0 ? (
                              <img
                                src={checkPersonPng}
                                alt=""
                                className="createMoreTask-logo"
                              />
                            ) : null}
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
              <div
                className="createMoreTask-right"
                style={{ width: taskWidth + 'px' }}
              >
                {!changeGroupArray ? (
                  <div className="createMoreTask-right-header">
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
                  </div>
                ) : null}
                <div className="createMoreTask-right-container">
                  {labelArray.map((item: any, index: number) => {
                    return (
                      <div
                        className="createMoreTask-item"
                        onClick={(e: any) => {
                          if (changeGroupArray) {
                            chooseLabel(item);
                          } else {
                            let newLabelChooseArray = _.cloneDeep(
                              labelChooseArray
                            );
                            let labelIndex: number = newLabelChooseArray[
                              groupChooseIndex
                            ].indexOf(item._key);
                            if (labelIndex === -1) {
                              newLabelChooseArray[groupChooseIndex].push(
                                item._key
                              );
                            } else {
                              newLabelChooseArray[groupChooseIndex].splice(
                                labelIndex
                              );
                            }
                            setLabelChooseArray(newLabelChooseArray);
                          }
                        }}
                        key={'label' + index}
                      >
                        <div className="createMoreTask-item-title">
                          {item.cardLabelName ? item.cardLabelName : 'ToDo'}
                          <div
                            className="createMoreTask-item-name"
                            style={{ marginLeft: '15px' }}
                          >
                            <div className="createMoreTask-avatar">
                              <img
                                src={
                                  item.executorAvatar
                                    ? item.executorAvatar
                                    : defaultPersonPng
                                }
                                alt=""
                              />
                            </div>
                            {item.executorNickName
                              ? item.executorNickName
                              : '无默认执行人'}
                          </div>
                        </div>
                        {!changeGroupArray ? (
                          labelChooseArray[groupChooseIndex] &&
                          labelChooseArray[groupChooseIndex].indexOf(
                            item._key
                          ) !== -1 ? (
                            <img
                              src={checkPersonPng}
                              alt=""
                              className="createMoreTask-logo"
                            />
                          ) : null
                        ) : labelChooseArray &&
                          _.findIndex(labelChooseArray, { _key: item._key }) !==
                            -1 ? (
                          <img
                            src={checkPersonPng}
                            alt=""
                            className="createMoreTask-logo"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ClickAwayListener>
      ) : null}
    </React.Fragment>
  );
};
CreateMoreTask.defaultProps = {};
export default CreateMoreTask;
