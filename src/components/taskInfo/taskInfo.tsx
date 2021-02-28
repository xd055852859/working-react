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
import hourSvg from '../../assets/svg/hour.svg';
import playPng from '../../assets/img/play.png';
import stopPng from '../../assets/img/stop.png';
import unExecutorPng from '../../assets/img/unExecutor.png';
// import taskFinishPng from '../../assets/img/taskFinish.png';
import taskFinishPng from '../../assets/svg/finishb.svg';
import taskUnfinishPng from '../../assets/svg/unfinishb.svg';
import taskClosePng from '../../assets/img/taskClose.png';
import ellipsisbPng from '../../assets/img/ellipsisb.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import fullscreenSvg from '../../assets/svg/fullscreen.svg';
import api from '../../services/api';
import { setMessage } from '../../redux/actions/commonActions';
import {
  editTask,
  changeTaskInfoVisible,
  setChooseKey,
  getSelfTask,
  getWorkingTableTask,
  getGroupTask,
  setTaskInfo,
} from '../../redux/actions/taskActions';
import DropMenu from '../common/dropMenu';
import Dialog from '../common/dialog';
import TimeSet from '../common/timeSet';
import Editor from '../common/Editor';
import Loading from '../common/loading';
import CreateMoreTask from '../createMoreTask/createMoreTask';

interface TaskInfoProps {
  fatherTaskItem?: any;
  onClose?: any;
  type?: string;
}
// pick a date util library
moment.locale('zh-cn');
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '142px',
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
    disbutton: {
      backgroundColor: 'rgba(255,255,255,0.4)',
    },
    datePicker: {
      '& .MuiInput-formControl': {
        marginLeft: '5px',
      },
    },
  })
);

const TaskInfo: React.FC<TaskInfoProps> = (prop) => {
  const { fatherTaskItem, onClose, type } = prop;
  const classes = useStyles();
  const dispatch = useDispatch();
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const chooseKey = useTypedSelector((state) => state.task.chooseKey);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const titleRef: React.RefObject<any> = useRef();
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const taskInfoVisible = useTypedSelector(
    (state) => state.task.taskInfoVisible
  );
  const user = useTypedSelector((state) => state.auth.user);
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
  const [isEdit, setIsEdit] = useState(false);

  const [loading, setLoading] = useState(false);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [editorDialogShow, setEditorDialogShow] = useState(false);

  const [moveTaskType, setMoveTaskType] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [content, setContent] = useState('<p>备注信息:</p>');
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
  let countRef = useRef<any>(null);
  let unDistory = true;
  useEffect(() => {
    return () => {
      if (countRef.current) {
        clearInterval(countRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if ((chooseKey || taskInfo) && taskInfoVisible) {
      if (!taskInfo || chooseKey !== taskInfo._key) {
        getTaskItem();
      } else if (taskInfo) {
        changeTaskInfo(taskInfo);
      }
    }
    return () => {
      unDistory = false;
    };
  }, [chooseKey, taskInfo]);

  const getTaskItem = async () => {
    setLoading(true);
    let taskItemRes: any = await api.task.getTaskInfo(chooseKey);
    if (unDistory) {
      if (taskItemRes.msg === 'OK') {
        let taskInfo = _.cloneDeep(taskItemRes.result);
        setLoading(false);
        setTaskItem(taskInfo);
        changeTaskInfo(taskInfo, 1);
      } else {
        setLoading(false);
        dispatch(setMessage(true, taskItemRes.msg, 'error'));
      }
    }
  };
  const changeTaskInfo = async (taskInfo: any, type?: number) => {
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
    setEditRole(
      (taskInfo.groupRole &&
        taskInfo.groupRole > 0 &&
        taskInfo.groupRole < 4) ||
        taskInfo.creatorKey === user._key ||
        taskInfo.executorKey === user._key
    );
    if (taskInfo.content) {
      setContent(taskInfo.content);
    }
    if (taskInfo.extraData && taskInfo.extraData.url) {
      setUrlInput(taskInfo.extraData.url);
    }
    setCountDownTime(taskInfo.countDownTime);
    getTaskMemberArray(taskInfo.groupKey);
    if (!type) {
      setLoading(true);
      let taskItemRes: any = await api.task.getTaskInfo(chooseKey);
      if (unDistory) {
        if (taskItemRes.msg === 'OK') {
          setLoading(false);
          taskInfo.content = _.cloneDeep(taskItemRes.result).content;
          if (taskInfo.content) {
            setContent(taskInfo.content);
          }
          setTaskItem(taskInfo);
        } else {
          setLoading(false);
          dispatch(setMessage(true, taskItemRes.msg, 'error'));
        }
      }
    }
  };
  const getTaskMemberArray = async (groupKey: string) => {
    let taskMemberRes: any = null;
    taskMemberRes = await api.member.getMember(groupKey, 4);
    if (taskMemberRes.msg === 'OK' && unDistory) {
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
    if (unDistory) {
      if (commentRes.msg === 'OK') {
        newCommentArray.push(...commentRes.result);
        setTaskCommentArray(newCommentArray);
        setTaskCommentTotal(commentRes.totalNumber);
      } else {
        dispatch(setMessage(true, commentRes.msg, 'error'));
      }
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
    if (unDistory) {
      if (historyRes.msg === 'OK') {
        newHistoryArray.push(...historyRes.result);
        setTaskHistoryArray(newHistoryArray);
        setTaskHistoryTotal(historyRes.totalNumber);
      } else {
        dispatch(setMessage(true, historyRes.msg, 'error'));
      }
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
    if (value) {
      setContent(value);
    } else {
      setContent('<p>备注信息:</p>');
    }
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
  const deleteTask = async () => {
    setDeleteDialogShow(false);
    dispatch(changeTaskInfoVisible(false));
    if (onClose) {
      onClose();
    }
    let deleteRes: any = await api.task.deleteTask(
      taskItem._key,
      taskItem.groupKey
    );
    if (deleteRes.msg === 'OK') {
      dispatch(setMessage(true, '删除成功', 'success'));
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
    } else {
      dispatch(setMessage(true, deleteRes.msg, 'error'));
    }
  };
  const changeTaskItem = (type: string, value: any) => {
    let newTaskItem: any = _.cloneDeep(taskItem);
    newTaskItem[type] = value;
    if (type === 'finishPercent' && value === 1) {
      newTaskItem.taskEndDate = moment().valueOf();
    }
    if (type === 'content' && value !== '') {
      newTaskItem.hasContent = true;
    }
    setEditState(true);
    setTaskItem(newTaskItem);
  };
  const playCountdown = () => {
    let newCountDownTime = countDownTime;
    let newTaskItem: any = _.cloneDeep(taskItem);
    setCountDownState(true);
    clearInterval(countRef.current);
    countRef.current = setInterval(() => {
      newCountDownTime = newCountDownTime + 1000;
      setCountDownTime(newCountDownTime);
      newTaskItem['countDownTime'] = newCountDownTime;
      setEditState(true);
      setTaskItem(newTaskItem);
    }, 1000);
  };
  const stopCountdown = () => {
    clearInterval(countRef.current);
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
    copy(
      redirect +
        '/home/showPage?shareKey=' +
        (chooseKey ? chooseKey : taskItem._key) +
        '&showType=1'
    );
    dispatch(setMessage(true, '复制链接任务成功', 'success'));
  };
  // const getLabelArray = async (groupKey: string) => {
  //   let newLabelArray = [
  //     { _key: null, cardLabelName: 'ToDo', executorKey: user._key },
  //   ];
  //   let labelRes: any = await api.group.getLabelInfo(groupKey);
  //   if (labelRes.msg === 'OK') {
  //     newLabelArray.push(...labelRes.result);
  //     setLabelArray(newLabelArray);
  //   } else {
  //     dispatch(setMessage(true, labelRes.msg, 'error'));
  //   }
  // };
  const saveTaskInfo = (type?: number) => {
    if (!editRole) {
      dispatch(setMessage(true, '无编辑权限,请提升权限或加入对应群', 'error'));
    }
    let newTaskItem = _.cloneDeep(taskItem);
    if (newTaskItem) {
      if (!newTaskItem.extraData) {
        newTaskItem.extraData = {};
      }
      if (urlInput) {
        if (urlInput.includes('http://') || urlInput.includes('https://')) {
          newTaskItem.extraData.url = urlInput;
        } else {
          newTaskItem.extraData.url = `https://${urlInput}`;
        }
      }
      dispatch(setTaskInfo(newTaskItem));
      if (onClose) {
        onClose();
      }
      if (editState) {
        dispatch(
          editTask({ key: newTaskItem._key, ...newTaskItem }, headerIndex)
        );
      }
    }
    dispatch(changeTaskInfoVisible(false));
  };
  return (
    // changeTaskInfoVisible
    <ClickAwayListener
      onClickAway={() => {
        if (!isEdit) {
          saveTaskInfo();
        }
      }}
    >
      <div className="taskInfo">
        {loading ? <Loading loadingHeight="90px" loadingWidth="90px" /> : null}
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
                      // changeTaskItem('todayTaskTime', 0);
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
                          ? taskItem.executorAvatar +
                            '?imageMogr2/auto-orient/thumbnail/80x'
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
                              style={{
                                background:
                                  taskItem.executorKey === taskMemberItem.userId
                                    ? '#F0F0F0'
                                    : '',
                                justifyContent: 'flex-start',
                              }}
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
                                        '?imageMogr2/auto-orient/thumbnail/80x'
                                      : defaultPersonPng
                                  }
                                  onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultPersonPng;
                                  }}
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
                    dropStyle={{ width: '100px', top: '36px', left: '-60px' }}
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
                        setMoveTaskType('复制');
                      }}
                    >
                      复制任务
                    </div>
                    <div
                      className="dropMenu-item"
                      onClick={() => {
                        setMoveTaskVisible(true);
                        setMoveTaskType('移动');
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
                    {taskItem.groupRole < 3 ? (
                      <div
                        className="dropMenu-item"
                        onClick={() => {
                          setDeleteDialogShow(true);
                        }}
                      >
                        删除任务
                      </div>
                    ) : null}
                    <CreateMoreTask
                      visible={moveTaskVisible}
                      createStyle={{ top: '129px', right: '158px' }}
                      onClose={() => {
                        setMoveTaskVisible(false);
                        setDeleteDialogShow(false);
                        dispatch(changeTaskInfoVisible(false));
                      }}
                      moreTitle={taskItem.title}
                      moveTaskType={moveTaskType}
                      taskKey={taskItem._key}
                      taskItem={taskItem}
                    />
                  </DropMenu>
                </div>
                <div className="taskInfo-mainTitle-right-icon">
                  <img
                    src={taskClosePng}
                    alt=""
                    style={{ width: '12px', height: '12px' }}
                    onClick={() => {
                      dispatch(setChooseKey(''));
                      saveTaskInfo(2);
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
                <div className="taskInfo-item-title">日期</div>
                <div
                  className="taskInfo-item-info"
                  style={{ justifyContent: 'flex-start' }}
                >
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
                      style={{ margin: '0px 15px' }}
                    />
                  </MuiPickersUtilsProvider>
                  <div
                    className="taskInfo-item-hour"
                    onClick={() => {
                      setHourVisible(true);
                    }}
                  >
                    <img src={hourSvg} alt="" />
                    {/* {taskItem.hour ? taskItem.hour + ' 小时' : '预计工时'} */}
                    <DropMenu
                      visible={hourVisible}
                      dropStyle={{ top: '36px', left: '-200px' }}
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
                </div>
              </div>
              {/* <div className="taskInfo-item">
                <div className="taskInfo-item-title">工时</div>
                <div className="taskInfo-item-info">
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
              </div> */}
              <div className="taskInfo-item">
                <div className="taskInfo-item-title">链接</div>
                <input
                  className="taskInfo-item-input"
                  value={urlInput}
                  onChange={(e: any) => {
                    setUrlInput(e.target.value);
                    setEditState(true);
                  }}
                  placeholder="请输入链接地址"
                />
              </div>
              <div className="taskInfo-item" style={{ height: '0px' }}>
                {/* <div className="taskInfo-item-title">关注</div>
                <div className="taskInfo-item-follow"></div> */}
                {/* {!localStorage.getItem('page') ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className="editor-button"
                    onClick={() => {
                      saveTaskInfo(1);
                      // dispatch(changeTaskInfoVisible(false));
                    }}
                  >
                    保存
                  </Button>
                ) : null} */}
              </div>
              {!localStorage.getItem('page') ? (
                <div className="taskInfo-Editor">
                  <Editor
                    // editorHeight={'300px'}
                    data={content}
                    onChange={changeTaskContent}
                    editable={true}
                    fullType={'small'}
                    changeIsEdit={(state: boolean) => {
                      setIsEdit(state);
                    }}
                  />
                  <img
                    src={fullscreenSvg}
                    alt=""
                    className="taskInfo-Editor-img"
                    onClick={() => {
                      setEditorDialogShow(true);
                    }}
                  />
                </div>
              ) : null}
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
                            <div className="taskInfo-comment-avatar">
                              <img
                                src={
                                  historyItem.etc && historyItem.etc.avatar
                                    ? historyItem.etc.avatar +
                                      '?imageMogr2/auto-orient/thumbnail/80x'
                                    : defaultPersonPng
                                }
                                alt=""
                              />
                            </div>
                            <div className="taskInfo-comment-info">
                              <div>
                                {moment(
                                  parseInt(historyItem.createTime)
                                ).fromNow()}
                              </div>
                              <div
                                style={{ fontSize: '12px', color: '#8091a0' }}
                              >
                                {historyItem.log}
                              </div>
                            </div>
                            {/* {historyItem.log} */}
                          </div>
                        );
                      }
                    )}
                  </div>
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
                  onFocus={() => {
                    setIsEdit(true);
                  }}
                  onBlur={() => {
                    setIsEdit(false);
                  }}
                />
                {commentInput ? (
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
                ) : (
                  <Button
                    variant="contained"
                    className={classes.disbutton}
                    disabled
                  >
                    发布
                  </Button>
                )}
              </div>
              <Dialog
                visible={deleteDialogShow}
                onClose={() => {
                  setDeleteDialogShow(false);
                }}
                onOK={() => {
                  deleteTask();
                }}
                title={'删除任务'}
                dialogStyle={{ width: '400px', height: '200px' }}
              >
                <div className="dialog-onlyTitle">是否删除该任务</div>
              </Dialog>
              <Dialog
                visible={editorDialogShow}
                onClose={() => {
                  setEditorDialogShow(false);
                }}
                title={'编辑详情'}
                dialogStyle={{ width: '95%', height: '95%' }}
                footer={false}
              >
                <Editor
                  editorHeight={document.body.clientHeight * 0.95 - 50 + 'px'}
                  data={content}
                  onChange={changeTaskContent}
                  editable={true}
                  fullType={'big'}
                />
              </Dialog>
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
