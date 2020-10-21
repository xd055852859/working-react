import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import {} from '../../redux/actions/taskActions';
import {
  setTaskKey,
  editTask,
  getSelfTask,
  getWorkingTableTask,
  getGroupTask,
  setChooseKey,
  changeTaskInfoVisible,
  setTaskInfo,
} from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import moment from 'moment';
import _ from 'lodash';
import './task.css';
import api from '../../services/api';
import TaskInfo from '../taskInfo/taskInfo';
import Dialog from '../common/dialog';
import DropMenu from '../common/dropMenu';
import TimeSet from '../common/timeSet';
import unfinishPng from '../../assets/img/unfinish.png';
import finishPng from '../../assets/img/finish.png';
import unfinishbPng from '../../assets/img/unfinishb.png';
import finishbPng from '../../assets/img/finishb.png';
import defaultPerson from '../../assets/img/defaultPerson.png';
import importantPng from '../../assets/img/important.png';
import unimportantPng from '../../assets/img/unimportant.png';
import ellipsisbPng from '../../assets/img/ellipsisb.png';
import taskAddPng from '../../assets/img/contact-plus.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
interface TaskProps {
  taskItem: any;
  executorKey?: number | string;
  changeTask?: any;
  taskIndex?: number;
  taskInfoIndex?: number;
  showGroupName?: boolean;
  bottomtype?: string;
  timeSetStatus?: boolean;
  myState?: boolean;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '600px',
      height: '500px',
    },
    button: {
      // padding: '6px 16px',
    },
  })
);
const Task: React.FC<TaskProps> = (props) => {
  const {
    taskItem,
    changeTask,
    taskIndex,
    taskInfoIndex,
    showGroupName,
    bottomtype,
    timeSetStatus,
    myState,
  } = props;
  const taskKey = useTypedSelector((state) => state.task.taskKey);
  // const addKey = useTypedSelector((state) => state.task.addKey);

  const user = useTypedSelector((state) => state.auth.user);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const groupInfo = useTypedSelector((state) => state.group.groupInfo);
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const memberHeaderIndex = useTypedSelector(
    (state) => state.member.memberHeaderIndex
  );
  const dispatch = useDispatch();
  const classes = useStyles();
  const [endtime, setEndtime] = useState(0);
  const [taskDayColor, setTaskDayColor] = useState<any>();
  const [editRole, setEditRole] = useState(false);
  const [suggestVisible, setSuggestVisible] = useState(false);
  const [taskTypeIndex, setTaskTypeIndex] = useState(0);
  const [editState, setEditState] = useState(false);
  const [taskDetail, setTaskDetail] = useState<any>(null);
  const [taskExecutorShow, setTaskExecutorShow] = useState<any>(false);
  const [taskMemberArray, setTaskMemberArray] = useState<any>([]);
  const [taskShow, setTaskShow] = useState(true);
  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const [timeSetShow, setTimeSetShow] = useState(false);
  const [dayNumber, setDayNumber] = useState<any>(null);
  const [timeNumber, setTimeNumber] = useState<any>(null);
  const [taskInfoDialogShow, setTaskInfoDialogShow] = useState(false);
  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [addInput, setAddInput] = useState('');

  const titleRef: React.RefObject<any> = useRef();
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
  useEffect(() => {
    // 用户已登录
    if (taskItem) {
      let [
        time,
        dayNumber,
        endTime,
        taskDayColor,
        endState,
        editRole,
        taskDetail,
      ]: any = [0, 0, 0, null, false, false, {}];
      if (taskItem.taskEndDate) {
        time = moment(taskItem.taskEndDate)
          .endOf('day')
          .diff(moment().endOf('day'), 'days');
        // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
      }
      endTime = time < 0 ? Math.abs(time) : Math.abs(time) + 1;
      dayNumber = time;
      endState = time < 0 ? false : true;
      taskDayColor = !endState
        ? taskItem.finishPercent === 0
          ? { backgroundColor: 'red' }
          : { backgroundColor: '#417505' }
        : null;
      editRole =
        (taskItem.groupRole &&
          taskItem.groupRole > 0 &&
          taskItem.groupRole < 4) ||
        taskItem.creatorKey === user._key ||
        taskItem.executorKey === user._key;

      // getTaskMemberArray(taskItem.grougKey)
      taskTypeArr.filter((item: any, index: number) => {
        if (item.id === taskItem.taskType) {
          setTaskTypeIndex(index);
        }
      });
      setEndtime(endTime);
      setTaskDayColor(taskDayColor);
      setEditRole(editRole);
      setDayNumber(time);
      setTimeNumber(taskItem.hour);
      taskDetail = _.cloneDeep(taskItem);
      setTaskDetail(taskDetail);
    }
  }, [taskItem]);
  useEffect(() => {
    // dispatch(setTaskKey('0'));
    // dispatch(setChooseKey('0'));
  }, [headerIndex, groupKey]);
  // useEffect(() => {
  //   if (titleRef.current && taskKey === taskDetail._key && editRole) {
  // if (titleRef.current.setSelectionRange) {
  //   titleRef.current.setSelectionRange(
  //     titleRef.current.value.length,
  //     titleRef.current.value.length
  //   );
  // } else {
  //   let range = titleRef.current.createTextRange();
  //   range.moveStart('character', titleRef.current.value.length);
  //   range.moveEnd('character', titleRef.current.value.length);
  //   range.select();
  // }
  //   let range = document.createRange();
  //   range.selectNodeContents(titleRef.current);
  //   range.collapse(false);
  //   let sel: any = window.getSelection();
  //   sel.removeAllRanges();
  //   sel.addRange(range);
  // }
  // dispatch(setChooseKey('0'));
  // }, [titleRef.current]);
  const getTaskMemberArray = async (groupKey: string) => {
    let taskMemberRes: any = null;
    taskMemberRes = await api.member.getMember(groupKey);
    if (taskMemberRes.msg === 'OK') {
      setTaskMemberArray(taskMemberRes.result);
    }
  };
  const chooseTask = (e: React.MouseEvent) => {
    dispatch(setTaskKey(taskItem._key));
    // dispatch(setChooseKey(taskItem._key));
    // let dom: any = document.getElementById('taskDetailText' + taskItem._key);
    // dom.focus()
  };
  const cancelTask = async (e: React.MouseEvent) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    let newEditState = editState;
    titleRef.current.blur();
    if (taskKey !== '') {
      if (newEditState) {
        dispatch(
          editTask(
            {
              key: taskKey,
              ...newTaskDetail,
            },
            headerIndex
          )
        );
        setEditState(false);
        setTaskExecutorShow(false);
        dispatch(setTaskInfo(newTaskDetail));
      }
      if (changeTask) {
        changeTask(newTaskDetail);
      }
      // dispatch(setTaskKey(''));
      setTaskExecutorShow(false);
      setTimeSetShow(false);
      // setAddTaskVisible(false);
      // setAddInput('');
    }
  };
  const changeFinishPercent = (finishPercent: number) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    // taskDetail.finishPercent = finishPercent !== 0 ? 0 : 1;
    newTaskDetail.finishPercent = finishPercent;
    if (newTaskDetail.finishPercent === 1) {
      newTaskDetail.todayTaskTime = moment().valueOf();
    } else if (newTaskDetail.finishPercent === 0) {
      newTaskDetail.todayTaskTime = 0;
    }
    setNewDetail(newTaskDetail);
  };
  const changeTitle = (title: string) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    newTaskDetail.title = title;
    setEditState(true);
    setNewDetail(newTaskDetail);
  };
  // const changeTextArea = (e: any) => {
  //   if (e.keyCode === 13) {
  //     setTextHeight(textHeight + 17);
  //   }
  // };
  const changeImportant = (importantStatus: number) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    newTaskDetail.importantStatus = importantStatus;
    setNewDetail(newTaskDetail);
  };
  const changeTaskType = (taskType: number) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    newTaskDetail.taskType = taskType;
    setNewDetail(newTaskDetail);
  };
  const chooseExecutor = (e: React.MouseEvent) => {
    if (editRole) {
      setTaskExecutorShow(true);
      getTaskMemberArray(taskItem.groupKey);
    }
  };
  const changeExecutor = (
    executorKey: number | string,
    executorName: string,
    executorAvatar: string
  ) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    newTaskDetail.executorKey = executorKey;
    newTaskDetail.executorName = executorName;
    newTaskDetail.executorAvatar = executorAvatar;
    setNewDetail(newTaskDetail);
  };
  const changeTime = () => {
    if (editRole) {
      setTimeSetShow(true);
    }
  };

  const changeTimeSet = (type: string, value: number) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    let time = 0;
    if (type === 'hour') {
      setTimeNumber(value);
      newTaskDetail.hour = value;
    } else if (type === 'day') {
      newTaskDetail.day = value;
      newTaskDetail.taskEndDate = moment()
        .add(value - 1, 'day')
        .endOf('day')
        .valueOf();
      time = moment(newTaskDetail.taskEndDate)
        .endOf('day')
        .diff(moment().endOf('day'), 'days');
      // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
      setDayNumber(time);
      setEndtime(time + 1);
    }
    setNewDetail(newTaskDetail);
  };
  const taskKeyDown = (e: any) => {
    if (e.keyCode === 46) {
      setDeleteDialogShow(true);
    }
  };
  const deleteTask = async () => {
    setTaskShow(false);
    setDeleteDialogShow(false);
    let deleteRes: any = await api.task.deleteTask(
      taskDetail._key,
      taskDetail.groupKey
    );
    if (deleteRes.msg === 'OK') {
      dispatch(setMessage(true, '删除成功', 'success'));
    } else {
      dispatch(setMessage(true, deleteRes.msg, 'error'));
    }
  };
  const setNewDetail = (taskDetail: any) => {
    if (editRole) {
      setEditState(true);
      let newTaskItem = {};
      newTaskItem = _.cloneDeep(taskDetail);
      setTaskDetail(newTaskItem);
    }
  };
  const plusTask = async () => {
    let addTaskRes: any = await api.task.addTask(
      groupInfo._key,
      groupInfo.groupRole,
      taskDetail.labelKey,
      taskDetail.executorKey,
      addInput,
      taskIndex ? taskIndex + 1 : 1
    );
    if (addTaskRes.msg === 'OK') {
      setAddTaskVisible(false);
      setAddInput('');
      setChooseKey(addTaskRes.result._key);
      dispatch(setMessage(true, '新增成功', 'success'));
      dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  return (
    <React.Fragment>
      {taskShow && taskDetail ? (
        <div
          className="task-container"
          onMouseLeave={cancelTask}
          onClick={(e: any) => {
            e.stopPropagation();
          }}
        >
          <div
            className="taskItem"
            onClick={chooseTask}
            tabIndex={taskItem._key}
            onKeyDown={taskKeyDown}
            style={{
              background: bottomtype
                ? 'transparent'
                : taskDetail.finishPercent === 0 ||
                  taskDetail.finishPercent === 10
                ? 'rgb(255,255,255,0.95)'
                : 'rgb(229,231,234,0.9)',
              // opacity:
              //   taskDetail.finishPercent === 0 ||
              //   taskDetail.finishPercent === 10
              //     ? 1
              //     : 0.9,
              boxShadow:
                !bottomtype && taskItem._key === taskKey
                  ? '0 0 7px 0 rgba(0, 0, 0, 0.26)'
                  : '',
            }}
          >
            <React.Fragment>
              {!bottomtype && !myState ? (
                <div
                  className="taskItem-taskType"
                  style={{
                    borderTop: '9px solid ' + color[taskTypeIndex],
                    borderRight: '9px solid ' + color[taskTypeIndex],
                    borderLeft: '9px solid transparent',
                    borderBottom: '9px solid transparent',
                  }}
                  onClick={() => {
                    if (taskKey === taskDetail._key && editRole) {
                      setSuggestVisible(true);
                    }
                  }}
                >
                  {suggestVisible ? (
                    <DropMenu
                      visible={suggestVisible}
                      dropStyle={{
                        width: '100px',
                        top: '-6px',
                        left: '-109px',
                        zIndex: '20',
                      }}
                      onClose={() => {
                        setSuggestVisible(false);
                      }}
                    >
                      {taskTypeArr.map((taskTypeItem, taskTypeIndex) => {
                        return (
                          <div
                            key={'taskType' + taskTypeIndex}
                            className="taskItem-suggest-item"
                            style={{
                              color: color[taskTypeIndex],
                              backgroundColor: backgroundColor[taskTypeIndex],
                            }}
                            onClick={() => {
                              setTaskTypeIndex(taskTypeIndex);
                              changeTaskType(taskTypeItem.id);
                              setSuggestVisible(false);
                            }}
                          >
                            {taskTypeItem.name}
                          </div>
                        );
                      })}
                    </DropMenu>
                  ) : null}
                </div>
              ) : null}
              {taskDetail.finishPercent !== 10 ? (
                <div
                  className="taskItem-finishIcon"
                  onClick={() => {
                    changeFinishPercent(taskDetail.finishPercent !== 0 ? 0 : 1);
                  }}
                >
                  <img
                    src={
                      taskDetail.finishPercent === 0
                        ? bottomtype
                          ? unfinishPng
                          : unfinishbPng
                        : bottomtype
                        ? finishPng
                        : finishbPng
                    }
                  />
                </div>
              ) : null}
              <div className="taskItem-container">
                <div className="taskItem-info">
                  {!myState ? (
                    <div
                      className="taskItem-day"
                      style={taskDayColor}
                      onClick={() => {
                        changeTime();
                      }}
                    >
                      <div
                        className="taskItem-time-day"
                        style={{ left: endtime < 10 ? '5px' : '0px' }}
                      >
                        {endtime}
                      </div>
                      <div className="taskItem-time"></div>
                      <div
                        className="taskItem-time-hour"
                        style={{ right: taskDetail.hour < 1 ? '5px' : '0px' }}
                      >
                        {taskDetail.hour}
                      </div>
                    </div>
                  ) : null}
                  <DropMenu
                    visible={timeSetShow}
                    dropStyle={{
                      width: '318px',
                      height: '245px',
                      top: !timeSetStatus ? '28px' : '-245px',
                      left: '-25px',
                    }}
                    onClose={() => {
                      setTimeSetShow(false);
                    }}
                  >
                    <TimeSet
                      timeSetClick={changeTimeSet}
                      percentClick={changeFinishPercent}
                      dayNumber={dayNumber + 1}
                      timeNumber={timeNumber}
                      endDate={taskDetail.taskEndDate}
                    />
                  </DropMenu>
                  {bottomtype === 'grid' ? (
                    <div
                      className="taskItem-img"
                      style={{ width: '25px', height: '25px' }}
                    >
                      <img
                        src={
                          taskDetail.executorAvatar
                            ? taskDetail.executorAvatar
                            : defaultPerson
                        }
                        style={{ marginTop: '0px' }}
                      />
                    </div>
                  ) : null}
                  <div className="taskItem-title">
                    {/* {taskKey === taskDetail._key && editRole ? ( */}
                    <div
                      // onKeyDown={changeTextArea}
                      style={{
                        // height: textHeight + 'px',
                        width: '100%',
                        minHeight: '28px',
                        backgroundColor: bottomtype ? 'transparent' : '',
                        color: bottomtype ? '#fff' : '#333',
                        textDecoration:
                          taskDetail.finishPercent === 2
                            ? 'line-through #a9a9a9 solid'
                            : '',
                      }}
                      contentEditable={taskKey === taskDetail._key && editRole}
                      suppressContentEditableWarning
                      onMouseLeave={(e: any) => {
                        if (e.target.innerText != taskDetail.title) {
                          changeTitle(e.target.innerText);
                        }
                        // setEditState(true);
                      }}
                      // onBlur={(e: any) => {
                      //   if (e.target.innerText != taskDetail.title) {
                      //     changeTitle(e.target.innerText);
                      //   }
                      //   // setEditState(true);
                      // }}
                      // onChange={(e: any) => {
                      //   console.log(e)
                      // }}
                      // style={{ height: textHeight + 'px' }}
                      id={'taskDetailText' + taskDetail._key}
                      ref={titleRef}
                    >
                      {taskDetail.title}
                    </div>
                    {/* ) */}
                    {/* : (
                      <div
                        style={{
                          width: '100%',
                          minHeight: '28px',
                          backgroundColor: bottomtype ? 'transparent' : '',
                          color: bottomtype ? '#fff' : '#333',
                          textDecoration:
                            taskDetail.finishPercent === 2
                              ? 'line-through'
                              : '',
                        }}
                        id={'taskDetail' + taskDetail._key}
                      >
                        {taskDetail.title}
                      </div>
                    )} */}
                  </div>
                </div>
                {!bottomtype && !myState ? (
                  <div className="taskItem-footer">
                    <div className="taskItem-footer-left">
                      <div className="taskItem-name">
                        {!showGroupName ? (
                          <span>
                            {taskDetail.serialNumber
                              ? '#' + taskDetail.serialNumber
                              : ''}
                          </span>
                        ) : (
                          <span style={{ flexShrink: 0 }}>
                            {taskDetail.groupName.split('_')[0]}
                          </span>
                        )}
                        <span style={{ flexShrink: 0 }}>
                          {taskDetail.creatorName.length > 3
                            ? taskDetail.creatorName.substring(0, 3) + '...'
                            : taskDetail.creatorName}
                        </span>
                        <span>⇀</span>
                        <span style={{ flexShrink: 0 }}>
                          {taskDetail.executorName &&
                          taskDetail.executorName.length > 3
                            ? taskDetail.executorName.substring(0, 3) + '...'
                            : taskDetail.executorName}
                        </span>
                      </div>
                      <div className="taskItem-img-container">
                        <div className="taskItem-img" onClick={chooseExecutor}>
                          <img
                            src={
                              taskDetail.executorAvatar
                                ? taskDetail.executorAvatar
                                : defaultPerson
                            }
                          />
                        </div>

                        <DropMenu
                          visible={taskExecutorShow}
                          dropStyle={{
                            width: '180px',
                            height: '350px',
                            top: '18px',
                            left: '-30px',
                          }}
                          onClose={() => {
                            setTaskExecutorShow(false);
                          }}
                          title={'分配任务'}
                        >
                          <div className="task-executor-dropMenu-info">
                            {taskMemberArray.map(
                              (
                                taskMemberItem: any,
                                taskMemberIndex: number
                              ) => {
                                return (
                                  <div
                                    className="task-executor-dropMenu-container"
                                    key={'taskMember' + taskMemberIndex}
                                    style={
                                      taskDetail.executorKey ===
                                      taskMemberItem.userId
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

                    <div className="taskItem-icon-group">
                      {editRole &&
                      headerIndex === 3 &&
                      memberHeaderIndex === 0 ? (
                        <div
                          className="taskItem-check-icon"
                          onClick={() => {
                            setAddTaskVisible(true);
                          }}
                        >
                          <img
                            src={taskAddPng}
                            alt=""
                            style={{ height: '18px', width: '18px' }}
                          />
                        </div>
                      ) : null}
                      {taskDetail.importantStatus ? (
                        <div
                          className="taskItem-check-icon"
                          style={{ display: 'flex' }}
                        >
                          <img
                            src={importantPng}
                            alt="重要"
                            onClick={() => {
                              changeImportant(0);
                            }}
                            style={{ height: '18px', width: '19px' }}
                          />
                        </div>
                      ) : (
                        <div className="taskItem-check-icon">
                          <img
                            src={unimportantPng}
                            alt="不重要"
                            onClick={() => {
                              changeImportant(1);
                            }}
                            style={{ height: '18px', width: '19px' }}
                          />
                        </div>
                      )}
                      {editRole ? (
                        <div
                          className="taskItem-check-icon"
                          style={
                            taskDetail.content !== '' ? { display: 'flex' } : {}
                          }
                          onClick={() => {
                            // dispatch(changeTaskInfoVisible(true));
                            setTaskInfoDialogShow(true);
                            // dispatch(setTaskInfo(taskDetail));
                            dispatch(setChooseKey(taskDetail._key));
                          }}
                        >
                          <img
                            src={ellipsisbPng}
                            alt="详情"
                            style={{ height: '2px', width: '12px' }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                <div className="taskItem-taskType"></div>
                {/*  style={cardKey===taskItem._key?{borderTop:'10px solid '+color[taskItem.taskType===10?5:taskItem.taskType-1],borderRight:'10px solid '+color[taskItem.taskType===10?5:taskItem.taskType-1],  borderLeft: '10px solid transparent',
  borderBottom: '10px solid transparent'}:{borderTop:'7px solid '+color[taskItem.taskType===10?5:taskItem.taskType-1],borderRight:'7px solid '+color[taskItem.taskType===10?5:taskItem.taskType-1],  borderLeft: '7px solid transparent',
  borderBottom: '7px solid transparent'}} */}
              </div>
            </React.Fragment>
          </div>
          {addTaskVisible ? (
            <div className="taskItem-plus-title">
              <div className="taskItem-plus-input">
                <input
                  // required
                  placeholder="任务标题"
                  value={addInput}
                  autoComplete="off"
                  onChange={(e) => {
                    setAddInput(e.target.value);
                  }}
                />
              </div>
              <div className="taskItem-plus-button">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    plusTask();
                  }}
                  style={{ marginRight: '10px', color: '#fff' }}
                  className={classes.button}
                >
                  确定
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setAddTaskVisible(false);
                    setAddInput('');
                  }}
                  className={classes.button}
                >
                  取消
                </Button>
              </div>
            </div>
          ) : null}
          {taskInfoDialogShow ? (
            <TaskInfo
              fatherTaskItem={taskDetail}
              onClose={() => {
                setTaskInfoDialogShow(false);
              }}
            />
          ) : null}
        </div>
      ) : null}
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
    </React.Fragment>
  );
};
Task.defaultProps = {
  taskItem: null,
  executorKey: 0,
  changeTask: null,
  showGroupName: false,
  taskIndex: 0,
};
export default Task;
