import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { setTaskKey, editTask } from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';
import moment from 'moment';
import _ from 'lodash';
import './task.css';
import api from '../../services/api';
import Dialog from '../common/dialog';
import DropMenu from '../common/dropMenu';
import TimeSet from '../common/timeSet';
import TaskInfo from '../taskInfo/taskInfo';
import unfinishPng from '../../assets/img/unfinish.png';
import finishPng from '../../assets/img/finish.png';
import defaultPerson from '../../assets/img/defaultPerson.png';
import importantPng from '../../assets/img/important.png';
import unimportantPng from '../../assets/img/unimportant.png';
import ellipsisbPng from '../../assets/img/ellipsisb.png';

interface TaskProps {
  taskItem: any;
  executorKey?: number | string;
  changeTask?: any;
  taskIndex?: number;
  taskInfoIndex?: number;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '600px',
      height: '500px',
    },
  })
);
const Task: React.FC<TaskProps> = (props) => {
  const { taskItem, changeTask, taskIndex, taskInfoIndex } = props;
  const bottomtype = '';
  const taskKey = useTypedSelector((state) => state.task.taskKey);
  const user = useTypedSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [endtime, setEndtime] = useState(0);
  const [taskDayColor, setTaskDayColor] = useState<any>();
  const [editRole, setEditRole] = useState(false);
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
  const titleRef: React.RefObject<any> = useRef();
  const color = [
    '#6FD29A',
    '#21ABE4',
    '#F5A623',
    '#FB8444',
    '#FF5D5B',
    '#9F33FE',
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
        time = Math.floor(
          (moment(taskItem.taskEndDate).endOf('day').valueOf() -
            moment().endOf('day').valueOf()) /
            86400000
        );
        // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
      }
      endTime = time < 0 ? Math.abs(time) : Math.abs(time) + 1;
      dayNumber = taskItem.taskEndDate;
      endState = time < 0 ? false : true;
      taskDayColor = !endState
        ? taskItem.finishPercent == 0
          ? { backgroundColor: 'red' }
          : { backgroundColor: '#417505' }
        : null;
      editRole =
        (taskItem.groupRole &&
          taskItem.groupRole > 0 &&
          taskItem.groupRole < 4) ||
        taskItem.creatorKey == user._key ||
        taskItem.executorKey == user._key;

      // getTaskMemberArray(taskItem.grougKey)

      setEndtime(endTime);
      setTaskDayColor(taskDayColor);
      setEditRole(editRole);
      setDayNumber(dayNumber);
      setTimeNumber(taskItem.hour);
      taskDetail = _.cloneDeep(taskItem);
      setTaskDetail(taskDetail);
    }
  }, [taskItem]);
  const getTaskMemberArray = async (groupKey: string) => {
    let taskMemberRes: any = null;
    taskMemberRes = await api.member.getMember(groupKey);
    if (taskMemberRes.msg == 'OK') {
      setTaskMemberArray(taskMemberRes.result);
    }
  };
  const chooseTask = (e: React.MouseEvent) => {
    dispatch(setTaskKey(taskItem._key));
  };
  const cancelTask = (e: React.MouseEvent) => {
    if (taskKey != 0) {
      if (editState) {
        taskDetail.title = titleRef.current.innerText;
        setNewDetail(taskDetail);
        dispatch(editTask({ key: taskKey, ...taskDetail }));
        setEditState(false);
        setTaskExecutorShow(false);
      }
      dispatch(setTaskKey(0));
    }
  };
  const changeFinishPercent = (finishPercent: number) => {
    let newTaskDetail = _.cloneDeep(taskDetail);
    // taskDetail.finishPercent = finishPercent != 0 ? 0 : 1;
    newTaskDetail.finishPercent = finishPercent;
    if (newTaskDetail.finishPercent == 1) {
      newTaskDetail.todayTaskTime = moment().valueOf();
    } else if (newTaskDetail.finishPercent == 0) {
      newTaskDetail.todayTaskTime = 0;
    }
    setNewDetail(newTaskDetail);
  };
  const changeTitle = (e: any) => {
    setEditState(true);
  };
  const changeImportant = (importantStatus: number) => {
    taskDetail.importantStatus = importantStatus;
    setNewDetail(taskDetail);
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
    taskDetail.executorKey = executorKey;
    taskDetail.executorName = executorName;
    taskDetail.executorAvatar = executorAvatar;
    setNewDetail(taskDetail);
  };
  const changeTime = () => {
    if (editRole) {
      setTimeSetShow(true);
    }
  };

  const changeTimeSet = (type: string, value: number) => {
    if (type == 'hour') {
      setTimeNumber(value);
      taskDetail.hour = value;
    } else if (type == 'day') {
      setDayNumber(value);
      taskDetail.day = value;
      taskDetail.taskEndDate = new Date().getTime() + 86400000 * (value - 1);
    }
    setNewDetail(taskDetail);
  };
  const taskKeyDown = (e: any) => {
    if (e.keyCode == 46) {
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
    if (deleteRes.msg == 'OK') {
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
      if (changeTask) {
        changeTask(newTaskItem, taskIndex, taskInfoIndex);
      }
    }
  };

  return (
    <React.Fragment>
      {taskShow && taskDetail ? (
        <div
          className="taskItem"
          onClick={chooseTask}
          onMouseLeave={cancelTask}
          tabIndex={taskItem._key}
          onKeyDown={taskKeyDown}
          style={{
            backgroundColor: bottomtype
              ? 'transparent'
              : taskDetail.finishPercent == 0 || taskDetail.finishPercent == 10
              ? 'rgb(255,255,255)'
              : 'rgba(255,255,255,0.66)',
          }}
        >
          <React.Fragment>
            <div
              className="taskItem-taskType"
              style={{
                borderTop:
                  '7px solid ' +
                  color[
                    taskDetail.taskType == 10 ? 5 : taskDetail.taskType - 1
                  ],
                borderRight:
                  '7px solid ' +
                  color[
                    taskDetail.taskType == 10 ? 5 : taskDetail.taskType - 1
                  ],
                borderLeft: '7px solid transparent',
                borderBottom: '7px solid transparent',
              }}
            ></div>
            {taskDetail.finishPercent != 10 ? (
              <div
                className="taskItem-finishIcon"
                onClick={() => {
                  changeFinishPercent(taskDetail.finishPercent != 0 ? 0 : 1);
                }}
              >
                <img
                  src={taskDetail.finishPercent == 0 ? unfinishPng : finishPng}
                />
              </div>
            ) : null}
            <div className="taskItem-container">
              <div className="taskItem-info">
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
                    style={{ right: taskItem.hour < 1 ? '5px' : '0px' }}
                  >
                    {taskDetail.hour}
                  </div>
                </div>
                <DropMenu
                  visible={timeSetShow}
                  title={'预计工时'}
                  dropStyle={{
                    width: '318px',
                    height: '230px',
                    top: '28px',
                    left:'-25px'
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
                  />
                </DropMenu>
                {/* <div
                className="taskItem-img"
                // v-if="bottomtype=='grid'"
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
              </div> */}
                <div className="taskItem-title">
                  {taskKey == taskDetail._key && editRole ? (
                    <div
                      suppressContentEditableWarning
                      contentEditable
                      ref={titleRef}
                      style={{
                        width: '100%',
                        minHeight: '28px',
                        backgroundColor: bottomtype ? 'transparent' : '',
                        textDecoration:
                          taskDetail.finishPercent == 2 ? 'line-through' : '',
                      }}
                      onInput={changeTitle}
                      // onKeyDown={changeKeyTitle}
                    >
                      {taskDetail.title}
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        minHeight: '28px',
                        backgroundColor: bottomtype ? 'transparent' : '',
                        textDecoration:
                          taskDetail.finishPercent == 2 ? 'line-through' : '',
                      }}
                    >
                      {taskDetail.title}
                    </div>
                  )}
                </div>
              </div>
              <div className="taskItem-footer">
                <div className="taskItem-footer-left">
                  <div className="taskItem-name">
                    <span>
                      {taskDetail.serialNumber
                        ? '#' + taskDetail.serialNumber
                        : ''}
                    </span>
                    <span style={{ flexShrink: 0 }}>
                      {taskDetail.creatorName.length > 3
                        ? taskDetail.creatorName.substring(0, 3) + '...'
                        : taskDetail.creatorName}
                    </span>
                    <span></span>
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
                        height: '290px',
                        top: '18px',
                      }}
                      onClose={() => {
                        setTaskExecutorShow(false);
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
                                  taskDetail.executorKey ==
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
                                  <img src={taskMemberItem.avatar} />
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
                <div
                  style={{
                    maxWidth: '64px',
                    display: 'flex',
                    height: '100%',
                  }}
                >
                  <div className="taskItem-check-icon">
                    {taskDetail.importantStatus ? (
                      <img
                        src={importantPng}
                        alt="重要"
                        onClick={() => {
                          changeImportant(0);
                        }}
                      />
                    ) : (
                      <img
                        src={unimportantPng}
                        alt="不重要"
                        onClick={() => {
                          changeImportant(1);
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="taskItem-check-icon"
                    style={taskDetail.content != '' ? { display: 'flex' } : {}}
                    onClick={() => {
                      setTaskInfoDialogShow(true);
                    }}
                  >
                    <img src={ellipsisbPng} alt="详情" />
                  </div>
                </div>
              </div>
              <div className="taskItem-taskType"></div>
              {/*  style={cardKey==taskItem._key?{borderTop:'10px solid '+color[taskItem.taskType==10?5:taskItem.taskType-1],borderRight:'10px solid '+color[taskItem.taskType==10?5:taskItem.taskType-1],  borderLeft: '10px solid transparent',
  borderBottom: '10px solid transparent'}:{borderTop:'7px solid '+color[taskItem.taskType==10?5:taskItem.taskType-1],borderRight:'7px solid '+color[taskItem.taskType==10?5:taskItem.taskType-1],  borderLeft: '7px solid transparent',
  borderBottom: '7px solid transparent'}} */}
            </div>
          </React.Fragment>
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
        <div>是否删除该任务</div>
      </Dialog>
      <Dialog
        visible={taskInfoDialogShow}
        footer={false}
        dialogStyle={{ width: '414px', height: '80%' }}
      >
        <TaskInfo
          taskInfo={taskDetail}
          setNewDetail={setNewDetail}
          onClose={() => {
            setTaskInfoDialogShow(false);
          }}
        />
      </Dialog>
    </React.Fragment>
  );
};
Task.defaultProps = {
  taskItem: null,
  executorKey: 0,
  changeTask: null,
};
export default Task;
