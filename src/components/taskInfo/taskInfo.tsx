import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../redux/reducer/RootState';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import DateFnsUtils from '@date-io/moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Button, TextField } from '@material-ui/core';
import './taskInfo.css';
import _ from 'lodash';
import 'moment/locale/zh-cn';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import Comment from '../comment/comment';
import hourPng from '../../assets/img/hour.png';
import playPng from '../../assets/img/play.png';
import stopPng from '../../assets/img/stop.png';
import unExecutorPng from '../../assets/img/unExecutor.png';
// import taskFinishPng from '../../assets/img/taskFinish.png';
import taskFinishPng from '../../assets/img/finishb.png';
import taskUnfinishPng from '../../assets/img/taskUnfinish.png';
import taskClosePng from '../../assets/img/taskClose.png';
import ellipsisbPng from '../../assets/img/ellipsisb.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import downArrowbPng from '../../assets/img/downArrowb.png';
import defaultGroupPng from '../../assets/img/defaultGroup.png';
import api from '../../services/api';
import { setMessage } from '../../redux/actions/commonActions';
import {
  editTask,
  changeTaskInfoVisible,
  setChooseKey,
} from '../../redux/actions/taskActions';
import DropMenu from '../common/dropMenu';
import Dialog from '../common/dialog';
import TimeSet from '../common/timeSet';
import Editor from '../common/Editor';
interface TaskInfoProps {
  fatherTaskItem?: any;
  onClose?: any;
}
// pick a date util library
moment.locale('zh-cn');
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '-10px 0px',
    },
    input: {
      width: '80%',
      color: '#fff',
      '& .MuiInput-formControl': {
        marginTop: '0px',
        borderColor: '#fff',
      },
      '& .MuiOutlinedInput-input': {
        padding: '10px 14px',
        borderColor: '#fff',
        // color: '#fff',
      },
      '& .MuiInputLabel-formControl': {
        marginTop: '-10px',
        // color: '#fff',
      },
    },
    button: {
      backgroundColor: '#17B881',
      color: '#fff',
    },
    datePicker: {
      '& .MuiInput-formControl': {
        marginLeft: '5px',
      },
    },
  })
);

const TaskInfo: React.FC<TaskInfoProps> = (prop) => {
  const { fatherTaskItem, onClose } = prop;
  const classes = useStyles();
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const chooseKey = useTypedSelector((state) => state.task.chooseKey);
  const taskKey = useTypedSelector((state) => state.task.taskKey);
  const titleRef: React.RefObject<any> = useRef();
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const taskInfoVisible = useTypedSelector(
    (state) => state.task.taskInfoVisible
  );
  const user = useTypedSelector((state) => state.auth.user);
  const groupArray = useTypedSelector((state) => state.group.groupArray);
  const [labelArray, setLabelArray] = useState<any>([]);
  const [taskItem, setTaskItem] = useState<any>(null);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [editRole, setEditRole] = useState(false);
  const [editState, setEditState] = useState(false);
  const [taskHistoryArray, setTaskHistoryArray] = useState<any>([]);
  const [taskHistoryTotal, setTaskHistoryTotal] = useState<any>(null);
  const [taskHistoryPage, setTaskHistoryPage] = useState(1);
  const [taskCommentArray, setTaskCommentArray] = useState<any>([]);
  const [taskCommentTotal, setTaskCommentTotal] = useState<any>(null);
  const [taskCommentPage, setTaskCommentPage] = useState(1);
  const [commentIndex, setCommentIndex] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [suggestVisible, setSuggestVisible] = useState(false);
  const [hourVisible, setHourVisible] = useState(false);
  const [executorVisible, setExecutorVisible] = useState(false);
  const [ellipsisVisible, setEllipsisVisible] = useState(false);
  const [moveTaskVisible, setMoveTaskVisible] = useState(false);
  const [taskTypeIndex, setTaskTypeIndex] = useState(0);
  const [taskMemberArray, setTaskMemberArray] = useState<any>([]);
  const [countDownTime, setCountDownTime] = useState(0);
  const [countDownState, setCountDownState] = useState(false);
  const [countInterval, setCountInterval] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [groupIndex, setGroupIndex] = useState(0);
  const [groupVisible, setGroupVisible] = useState(false);
  const [labelIndex, setLabelIndex] = useState(0);
  const [labelVisible, setLabelVisible] = useState(false);
  const color = [
    '#6FD29A',
    '#21ABE4',
    '#F5A623',
    '#FB8444',
    '#FF5D5B',
    '#9F33FE',
  ];
  const backgroundColor = [
    '#DAF6E6',
    '#D8ECFF',
    '#FBE6C4',
    '#FFDDCC',
    '#FFE3DE',
    '#F3E5FF',
  ];
  const taskTypeArr = [
    { name: '建议', id: 1 },
    { name: '强烈建议', id: 2 },
    { name: '错误', id: 3 },
    { name: '严重错误', id: 4 },
    { name: '致命错误', id: 5 },
    { name: '顶级优先', id: 10 },
  ];
  const taskLimit = 10;
  useEffect(() => {
    if (chooseKey) {
      if (taskInfoVisible && !taskInfo) {
        getTaskItem();
      } else if (fatherTaskItem) {
        changeTaskInfo(fatherTaskItem);
      } else if (taskInfo) {
        changeTaskInfo(taskInfo);
      }
    }
    return () => {
      clearInterval(countInterval);
    };
  }, [chooseKey, taskInfoVisible, taskInfo, fatherTaskItem]);
  useEffect(() => {
    if (groupArray && groupArray.length > 0) {
      getLabelArray(groupArray[0]._key);
    }
  }, [groupArray]);
  // useEffect(() => {
  //   console.log('改变', taskItem);
  // }, [taskItem]);
  // useEffect(() => {
  //   if (editState) {
  //     let newTaskItem: any = stopCountdown();
  //     dispatch(
  //       editTask(
  //         { key: newTaskItem._key, ...newTaskItem },
  //         headerIndex == 5 ? 1 : headerIndex
  //       )
  //     );
  //     // setTaskItem(null);
  //     // setEditState(false);
  //   }
  // }, [chooseKey]);
  const getTaskItem = async () => {
    let taskItemRes: any = await api.task.getTaskInfo(chooseKey);
    if (taskItemRes.msg === 'OK') {
      let taskInfo = _.cloneDeep(taskItemRes.result);
      changeTaskInfo(taskInfo);
    } else {
      dispatch(setMessage(true, taskItemRes.msg, 'error'));
    }
  };
  const changeTaskInfo = (taskInfo: any) => {
    getHistoryList(taskHistoryPage, taskInfo);
    getCommentList(taskHistoryPage, taskInfo);
    setStartDate(
      new Date(
        taskInfo.taskStartDate ? taskInfo.taskStartDate : taskInfo.taskEndDate
      )
    );
    setEndDate(new Date(taskInfo.taskEndDate));
    taskTypeArr.filter((item: any, index: number) => {
      if (item.id === taskInfo.taskType) {
        setTaskTypeIndex(index);
      }
    });
    setTaskItem(taskInfo);
    setEditRole(
      (taskInfo.groupRole &&
        taskInfo.groupRole > 0 &&
        taskInfo.groupRole < 4) ||
        taskInfo.creatorKey === user._key ||
        taskInfo.executorKey === user._key
    );
    setCountDownTime(taskInfo.countDownTime);
    getTaskMemberArray(taskInfo.groupKey);
  };
  const getTaskMemberArray = async (groupKey: string) => {
    let taskMemberRes: any = null;
    taskMemberRes = await api.member.getMember(groupKey);
    if (taskMemberRes.msg === 'OK') {
      setTaskMemberArray(taskMemberRes.result);
    }
  };
  const getCommentList = async (page: number, taskInfo: any) => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    if (page == 1) {
      newCommentArray = [];
    }
    let commentRes: any = await api.task.getTaskComment(
      taskInfo._key,
      page,
      taskLimit
    );
    if (commentRes.msg === 'OK') {
      newCommentArray.push(...commentRes.result);
      setTaskCommentArray(newCommentArray);
      setTaskCommentTotal(commentRes.totalNumber);
    } else {
      dispatch(setMessage(true, commentRes.msg, 'error'));
    }
  };

  const getHistoryList = async (page: number, taskInfo: any) => {
    let newHistoryArray = _.cloneDeep(taskHistoryArray);
    if (page == 1) {
      newHistoryArray = [];
    }
    let historyRes: any = await api.task.getTaskHistory(
      taskInfo._key,
      page,
      taskLimit
    );
    if (historyRes.msg === 'OK') {
      newHistoryArray.push(...historyRes.result);
      setTaskHistoryArray(newHistoryArray);
      setTaskHistoryTotal(historyRes.totalNumber);
    } else {
      dispatch(setMessage(true, historyRes.msg, 'error'));
    }
  };
  const handleDateChange = (date: any, type: string) => {
    if (type === 'start') {
      setStartDate(date);
      changeTaskItem('taskStartDate', date.valueOf());
    } else if ((type = 'end')) {
      setEndDate(date);
      changeTaskItem('taskEndDate', date.valueOf());
    }
    setEditState(true);
  };
  //滚动加载
  const scrollCommentLoading = async (e: any) => {
    let page = taskCommentPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let clientHeight = e.target.clientHeight;
    if (
      clientHeight + scrollTop >= scrollHeight &&
      taskCommentArray.length < taskCommentTotal
    ) {
      page = page + 1;
      setTaskCommentPage(page);
      getCommentList(page, taskItem);
    }
  };
  const scrollHistoryLoading = async (e: any) => {
    let page = taskHistoryPage;
    //文档内容实际高度（包括超出视窗的溢出部分）
    let scrollHeight = e.target.scrollHeight;
    //滚动条滚动距离
    let scrollTop = e.target.scrollTop;
    //窗口可视范围高度
    let height = e.target.clientHeight;
    if (
      height + scrollTop >= scrollHeight &&
      taskHistoryArray.length < taskHistoryTotal
    ) {
      page = page + 1;
      setTaskHistoryPage(page);
      getHistoryList(page, taskItem);
    }
  };
  const changeInput = (e: any) => {
    setCommentInput(e.target.value);
    setEditState(true);
  };
  const changeTaskContent = (value: string) => {
    changeTaskItem('content', value);
  };
  const changeTimeSet = (type: string, hour: number) => {
    changeTaskItem(type, hour);
  };
  const changeExecutor = (
    executorKey: number | string,
    executorName: string,
    executorAvatar: string
  ) => {
    let newTaskItem: any = _.cloneDeep(taskItem);
    newTaskItem['executorKey'] = executorKey;
    newTaskItem['executorName'] = executorName;
    newTaskItem['executorAvatar'] = executorAvatar;
    setEditState(true);
    setTaskItem(newTaskItem);
  };
  const saveCommentMsg = async () => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    let newCommentTotal = taskCommentTotal;
    if (commentInput !== '') {
      //保存
      let saveRes: any = await api.task.addComment(taskItem._key, commentInput);
      if (saveRes.msg === 'OK') {
        dispatch(setMessage(true, '评论成功', 'success'));
        newCommentArray.push(saveRes.result);
        newCommentTotal = newCommentTotal + 1;
        setTaskCommentArray(newCommentArray);
        setTaskCommentTotal(newCommentTotal);
        setCommentInput('');
      } else {
        dispatch(setMessage(true, saveRes.msg, 'error'));
      }
    }
  };
  const deleteCommentMsg = async (commentIndex: number, commentkey: string) => {
    let newCommentArray = _.cloneDeep(taskCommentArray);
    let newCommentTotal = taskCommentTotal;
    let deleteRes: any = await api.task.deleteComment(commentkey);
    if (deleteRes.msg === 'OK') {
      dispatch(setMessage(true, '删除评论成功', 'success'));
      newCommentArray.splice(commentIndex, 1);
      newCommentTotal = newCommentTotal - 1;
      setTaskCommentArray(newCommentArray);
      setTaskCommentTotal(newCommentTotal);
    } else {
      dispatch(setMessage(true, deleteRes.msg, 'error'));
    }
  };
  const changeTaskItem = (type: string, value: any) => {
    let newTaskItem: any = _.cloneDeep(taskItem);
    newTaskItem[type] = value;
    setEditState(true);
    setTaskItem(newTaskItem);
  };
  const playCountdown = () => {
    let newCountDownTime = countDownTime;
    let newCountInterval = countInterval;
    let newTaskItem: any = _.cloneDeep(taskItem);
    setCountDownState(true);
    clearInterval(countInterval);
    newCountInterval = setInterval(() => {
      newCountDownTime = newCountDownTime + 1000;
      setCountDownTime(newCountDownTime);
      newTaskItem['countDownTime'] = newCountDownTime;
      setEditState(true);
      setTaskItem(newTaskItem);
    }, 1000);
    setCountInterval(newCountInterval);
  };
  const stopCountdown = () => {
    clearInterval(countInterval);
    setCountDownState(false);
    let newTaskItem: any = _.cloneDeep(taskItem);
    newTaskItem['countDownTime'] = countDownTime;
    setTaskItem(newTaskItem);
    return newTaskItem;
  };
  const formatHour = (formatTime: number) => {
    let hours = parseInt(
      (formatTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + ''
    );
    let minutes = parseInt((formatTime % (1000 * 60 * 60)) / (1000 * 60) + '');
    let seconds = parseInt((formatTime % (1000 * 60)) / 1000 + '');
    return addZero(hours) + ' : ' + addZero(minutes) + ' : ' + addZero(seconds);
  };
  const addZero = (num: number) => {
    return num > 9 ? num + '' : '0' + num;
  };
  const shareTask = () => {
    const redirect = `${window.location.protocol}//${window.location.host}`;
    copy(redirect + '/?shareKey=' + chooseKey);
    dispatch(setMessage(true, '复制链接任务成功', 'success'));
  };
  const getLabelArray = async (groupKey: string) => {
    let newLabelArray = [
      { _key: null, cardLabelName: 'ToDo', executorKey: user._key },
    ];
    let labelRes: any = await api.group.getLabelInfo(groupKey);
    if (labelRes.msg === 'OK') {
      newLabelArray.push(...labelRes.result);
      setLabelArray(newLabelArray);
    } else {
      dispatch(setMessage(true, labelRes.msg, 'error'));
    }
  };
  return (
    // changeTaskInfoVisible
    <ClickAwayListener
      onClickAway={() => {
        dispatch(changeTaskInfoVisible(false));
        if (onClose) {
          onClose();
        }
        if (editState) {
          dispatch(editTask({ key: taskItem._key, ...taskItem }, headerIndex));
          // if (onClose) {
          //   onClose();
          // }
          // dispatch(setMessage(true, '保存成功', 'success'));
        }
      }}
    >
      <div className="taskInfo">
        {taskItem ? (
          <React.Fragment>
            <div className="taskInfo-mainTitle">
              <div className="taskInfo-mainTitle-left">
                {taskItem.finishPercent === 0 ? (
                  <img
                    src={taskUnfinishPng}
                    alt=""
                    className="taskInfo-mainTitle-left-icon"
                    onClick={() => {
                      changeTaskItem('finishPercent', 1);
                    }}
                  />
                ) : taskItem.finishPercent === 1 ? (
                  <img
                    src={taskFinishPng}
                    alt=""
                    className="taskInfo-mainTitle-left-icon"
                    onClick={() => {
                      changeTaskItem('finishPercent', 0);
                    }}
                  />
                ) : null}

                <div
                  className="taskInfo-mainTitle-left-info"
                  onClick={() => {
                    setExecutorVisible(true);
                  }}
                >
                  <div className="taskInfo-mainTitle-left-avatar">
                    <img
                      src={
                        taskItem.executorAvatar
                          ? taskItem.executorAvatar
                          : unExecutorPng
                      }
                      alt=""
                    />
                  </div>
                  <div>
                    {taskItem.executorName ? taskItem.executorName : '未分配'}
                  </div>
                  <DropMenu
                    visible={executorVisible}
                    dropStyle={{
                      width: '180px',
                      height: '350px',
                      top: '60px',
                      left: '0px',
                    }}
                    onClose={() => {
                      setExecutorVisible(false);
                    }}
                    title={'分配任务'}
                  >
                    <div className="task-executor-dropMenu-info">
                      {taskMemberArray.map(
                        (taskMemberItem: any, taskMemberIndex: number) => {
                          return (
                            <div
                              className="task-executor-dropMenu-container"
                              key={'taskMember' + taskMemberIndex}
                              style={
                                taskItem.executorKey === taskMemberItem.userId
                                  ? { background: '#F0F0F0' }
                                  : {}
                              }
                              onClick={() => {
                                changeExecutor(
                                  taskMemberItem.userId,
                                  taskMemberItem.nickName,
                                  taskMemberItem.avatar
                                );
                              }}
                            >
                              <div className="task-executor-dropMenu-img">
                                <img
                                  src={
                                    taskMemberItem.avatar
                                      ? taskMemberItem.avatar +
                                        '?imageMogr2/auto-orient/thumbnail/50x50/format/jpg'
                                      : defaultPersonPng
                                  }
                                />
                              </div>
                              <div>{taskMemberItem.nickName}</div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </DropMenu>
                </div>
              </div>
              <div className="taskInfo-mainTitle-right">
                <div
                  className="taskInfo-mainTitle-right-icon"
                  onClick={() => {
                    setEllipsisVisible(true);
                  }}
                >
                  <img
                    src={ellipsisbPng}
                    alt="详情"
                    style={{ width: '12px', height: '2px' }}
                  />
                  <DropMenu
                    visible={ellipsisVisible}
                    dropStyle={{
                      width: '120px',
                      top: '45px',
                      left: '-88px',
                    }}
                    onClose={() => {
                      setEllipsisVisible(false);
                    }}
                  >
                    <div
                      className="dropMenu-item"
                      onClick={() => {
                        shareTask();
                      }}
                    >
                      分享任务
                    </div>
                    <div
                      className="dropMenu-item"
                      onClick={() => {
                        setMoveTaskVisible(true);
                      }}
                    >
                      移动任务
                    </div>
                    <div
                      className="dropMenu-item"
                      onClick={() => {
                        changeTaskItem('finishPercent', 2);
                      }}
                    >
                      {taskItem.finishPercent < 2 ? '归档' : '取消归档'}
                    </div>
                    <div
                      className="dropMenu-item"
                      onClick={() => {
                        changeTaskItem(
                          'importantStatus',
                          taskItem.importantStatus ? 0 : 1
                        );
                      }}
                    >
                      {!taskItem.importantStatus ? '设为重要' : '取消重要'}
                    </div>
                    <Dialog
                      visible={moveTaskVisible}
                      dialogStyle={{
                        width: '320px',
                        height: '160px',
                        position: 'fixed',
                        top: '129px',
                        right: '158px',
                        overflow: 'visible',
                      }}
                      onOK={() => {
                        setMoveTaskVisible(false);
                      }}
                      onClose={() => {
                        setMoveTaskVisible(false);
                      }}
                      showMask={false}
                    >
                      {labelArray && labelArray.length > 0 ? (
                        <div className="addTask-container">
                          <div
                            className="addTask-item"
                            onClick={() => {
                              setGroupVisible(true);
                            }}
                          >
                            <div className="addTask-avatar">
                              <img
                                src={
                                  groupArray[groupIndex].groupLogo
                                    ? groupArray[groupIndex].groupLogo
                                    : defaultGroupPng
                                }
                                alt=""
                              />
                            </div>
                            <div>{groupArray[groupIndex].groupName}</div>
                            <img
                              src={downArrowbPng}
                              alt=""
                              className="addTask-logo"
                            />
                            {groupVisible ? (
                              <DropMenu
                                visible={groupVisible}
                                dropStyle={{
                                  width: '300px',
                                  height: '350px',
                                  top: '50px',
                                  overflow: 'auto',
                                }}
                                onClose={() => {
                                  setGroupVisible(false);
                                }}
                                title={'选择项目'}
                              >
                                <React.Fragment>
                                  {groupArray.map(
                                    (item: any, index: number) => {
                                      return (
                                        <div
                                          className="chooseItem"
                                          onClick={(e: any) => {
                                            setGroupIndex(index);
                                            getLabelArray(item._key);
                                            setGroupVisible(false);
                                            e.stopPropagation();
                                            changeTaskItem(
                                              'groupKey',
                                              item._key
                                            );
                                          }}
                                          key={'group' + index}
                                        >
                                          <div className="addTask-avatar">
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
                                      );
                                    }
                                  )}
                                </React.Fragment>
                              </DropMenu>
                            ) : null}
                          </div>
                          <div
                            className="addTask-item"
                            onClick={() => {
                              setLabelVisible(true);
                            }}
                          >
                            <div>{labelArray[labelIndex].cardLabelName}</div>
                            <img
                              src={downArrowbPng}
                              alt=""
                              className="addTask-logo"
                            />
                            {labelVisible ? (
                              <DropMenu
                                visible={labelVisible}
                                dropStyle={{
                                  width: '100%',
                                  height: '350px',
                                  top: '50px',
                                  overflow: 'auto',
                                }}
                                onClose={() => {
                                  setLabelVisible(false);
                                }}
                                title={'选择频道'}
                              >
                                <React.Fragment>
                                  {labelArray.map(
                                    (item: any, index: number) => {
                                      return (
                                        <div
                                          className="chooseItem"
                                          onClick={(e: any) => {
                                            setLabelIndex(index);
                                            setLabelVisible(false);
                                            e.stopPropagation();
                                            changeTaskItem(
                                              'labelKey',
                                              item._key
                                            );
                                          }}
                                          key={'label' + index}
                                        >
                                          <div
                                            style={{
                                              textAlign: 'center',
                                              width: '100%',
                                            }}
                                          >
                                            {item.cardLabelName}
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </React.Fragment>
                              </DropMenu>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </Dialog>
                  </DropMenu>
                </div>
                <div className="taskInfo-mainTitle-right-icon">
                  <img
                    src={taskClosePng}
                    alt=""
                    style={{ width: '12px', height: '12px' }}
                    onClick={() => {
                      dispatch(changeTaskInfoVisible(false));
                      dispatch(setChooseKey(''));
                      if (onClose) {
                        onClose();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="taskInfo-container">
              <div
                className="taskInfo-title"
                // onChange={(e: any) => {
                //   setEditState(true);
                //   changeTaskItem('title', e.target.value);
                // }}
                contentEditable
                suppressContentEditableWarning
                // onKeyUp={(e: any) => {
                //   if (e.target.innerText != taskItem.title) {
                //     setEditState(true);
                //   }
                // }}
                onBlur={(e: any) => {
                  if (e.target.innerText != taskItem.title) {
                    changeTaskItem('title', e.target.innerText);
                  }
                  // setEditState(true);
                }}
                ref={titleRef}
              >
                {taskItem.title}
              </div>

              <div className="taskInfo-item">
                <div className="taskInfo-item-title">开始</div>
                <div className="taskInfo-item-info">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="yyyy-MM-DD"
                      margin="normal"
                      id="date-picker-inline"
                      // label="开始日期"
                      value={startDate}
                      onChange={(date) => {
                        handleDateChange(date, 'start');
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      className={classes.root}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </div>
              <div className="taskInfo-item">
                <div className="taskInfo-item-title">截止</div>
                <div className="taskInfo-item-info">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="yyyy-MM-DD"
                      margin="normal"
                      id="date-picker-inline"
                      // label="截止日期"
                      value={endDate}
                      onChange={(date) => {
                        handleDateChange(date, 'end');
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      className={classes.root}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </div>
              <div className="taskInfo-item">
                <div className="taskInfo-item-title">工时</div>
                <div className="taskInfo-item-info">
                  <div
                    className="taskInfo-item-hour"
                    onClick={() => {
                      setHourVisible(true);
                    }}
                  >
                    <img src={hourPng} alt="" />
                    {taskItem.hour ? taskItem.hour + ' 小时' : '预计工时'}
                    <DropMenu
                      visible={hourVisible}
                      dropStyle={{ top: '36px' }}
                      onClose={() => {
                        setHourVisible(false);
                      }}
                      title="预计工时"
                    >
                      <TimeSet
                        timeSetClick={changeTimeSet}
                        timestate={'hour'}
                        dayNumber={0}
                        timeNumber={taskItem.hour}
                      />
                    </DropMenu>
                  </div>
                  <div
                    className="taskInfo-item-countdown"
                    onClick={() => {
                      countDownState ? stopCountdown() : playCountdown();
                    }}
                  >
                    <img src={countDownState ? stopPng : playPng} alt="" />
                    {formatHour(countDownTime)}
                  </div>
                </div>
              </div>
              <div className="taskInfo-item">
                <div className="taskInfo-item-title">类型</div>
                <div
                  className="taskInfo-item-suggest"
                  onClick={() => {
                    setSuggestVisible(true);
                  }}
                  style={{
                    color: color[taskTypeIndex],
                    backgroundColor: backgroundColor[taskTypeIndex],
                  }}
                >
                  {taskTypeArr[taskTypeIndex].name}
                  <DropMenu
                    visible={suggestVisible}
                    dropStyle={{ width: '100%', top: '36px' }}
                    onClose={() => {
                      setSuggestVisible(false);
                    }}
                  >
                    {taskTypeArr.map((taskTypeItem, taskTypeIndex) => {
                      return (
                        <div
                          key={'taskType' + taskTypeIndex}
                          className="taskInfo-item-suggest-item"
                          style={{
                            color: color[taskTypeIndex],
                            backgroundColor: backgroundColor[taskTypeIndex],
                          }}
                          onClick={() => {
                            setTaskTypeIndex(taskTypeIndex);
                            changeTaskItem('taskType', taskTypeItem.id);
                            setSuggestVisible(false);
                          }}
                        >
                          {taskTypeItem.name}
                        </div>
                      );
                    })}
                  </DropMenu>
                </div>
              </div>
              <div className="taskInfo-item">
                <div className="taskInfo-item-title">关注</div>
                <div className="taskInfo-item-follow"></div>
                {editable ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className="editor-button"
                    onClick={() => {
                      dispatch(
                        editTask(
                          { key: taskItem._key, ...taskItem },
                          headerIndex
                        )
                      );
                      dispatch(setMessage(true, '备注保存成功', 'success'));
                      // dispatch(changeTaskInfoVisible(false));
                    }}
                  >
                    保存
                  </Button>
                ) : null}
              </div>
              <div
                onClick={() => {
                  setEditable(true);
                }}
                style={
                  !editable ? { cursor: 'pointer', margin: '30px 0px' } : {}
                }
              >
                {!editable ? (
                  taskItem.content ? (
                    <Editor
                      // editorHeight={'300px'}
                      data={taskItem.content}
                      editable={editable}
                    />
                  ) : (
                    <div>请点击输入备注信息</div>
                  )
                ) : (
                  <Editor
                    // editorHeight={'300px'}
                    data={taskItem.content}
                    onChange={changeTaskContent}
                    editable={editable}
                  />
                )}
              </div>
              <div className="taskInfo-comment">
                <div className="taskInfo-comment-tabs">
                  <div
                    className="taskInfo-comment-tabs-item"
                    onClick={() => {
                      setCommentIndex(0);
                    }}
                    style={
                      commentIndex === 0
                        ? {
                            borderBottom: '1px solid #17B881',
                            color: '#17B881',
                          }
                        : {}
                    }
                  >
                    评论({taskCommentTotal})
                  </div>
                  <div
                    className="taskInfo-comment-tabs-item"
                    onClick={() => {
                      setCommentIndex(1);
                    }}
                    style={
                      commentIndex === 1
                        ? {
                            borderBottom: '1px solid #17B881',
                            color: '#17B881',
                          }
                        : {}
                    }
                  >
                    历史({taskHistoryTotal})
                  </div>
                </div>
                {commentIndex === 0 ? (
                  <React.Fragment>
                    <div
                      className="taskInfo-comment-tab"
                      onScroll={scrollCommentLoading}
                    >
                      {taskCommentArray.map(
                        (commentItem: any, commentIndex: number) => {
                          return (
                            <Comment
                              commentItem={commentItem}
                              commentIndex={commentIndex}
                              key={'comment' + commentIndex}
                              commentClick={deleteCommentMsg}
                            />
                          );
                        }
                      )}
                    </div>
                    <div className="taskInfo-comment-input">
                      <TextField
                        required
                        id="outlined-basic"
                        variant="outlined"
                        label="评论"
                        className={classes.input}
                        onChange={changeInput}
                        value={commentInput}
                        onKeyDown={(e: any) => {
                          if (e.keyCode === 13) {
                            saveCommentMsg();
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={() => {
                          saveCommentMsg();
                        }}
                      >
                        发布
                      </Button>
                    </div>
                  </React.Fragment>
                ) : (
                  <div
                    className="taskInfo-comment-tab"
                    onScroll={scrollHistoryLoading}
                  >
                    {taskHistoryArray.map(
                      (historyItem: any, historyIndex: number) => {
                        return (
                          <div
                            key={'history' + historyIndex}
                            className="taskInfo-comment-historyLog"
                          >
                            <div className="point"></div> {historyItem.log}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        ) : null}
      </div>
    </ClickAwayListener>
  );
};
TaskInfo.defaultProps = {
  fatherTaskItem: null,
};
export default TaskInfo;
