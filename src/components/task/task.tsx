import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import _ from 'lodash'
import './task.css';


import unfinishPng from '../../assets/img/unfinish.png';
import finishPng from '../../assets/img/finish.png';
import defaultPerson from '../../assets/img/defaultPerson.png';
import important from '../../assets/img/important.png';
import unimportant from '../../assets/img/unimportant.png';
import { setTaskKey, editTask } from '../../redux/actions/taskActions';

interface TaskProps {
  taskItem: any;
  executorKey?: number | string;
}
const Task: React.FC<TaskProps> = (props) => {
  const { taskItem } = props;
  const bottomtype = '';
  const taskKey = useTypedSelector((state) => state.task.taskKey);
  const user = useTypedSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [endtime, setEndtime] = useState(0);
  const [taskDayColor, setTaskDayColor] = useState<any>();
  const [editRole, setEditRole] = useState(false);
  const [editState, setEditState] = useState(false);
  const [taskDetail, setTaskDetail] = useState<any>(null);

  useEffect(() => {
    // 用户已登录
    if (taskItem) {
      let time = 0;
      let endTime = 0;
      let taskDayColor = null;
      let endState = false;
      let editRole = false;
      let taskDetail = {}
      if (taskItem.taskEndDate) {
        time = Math.floor(
          (moment(taskItem.taskEndDate).endOf('day').valueOf() -
            moment().endOf('day').valueOf()) /
          86400000
        );
        // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
      }
      endTime = time < 0 ? Math.abs(time) : Math.abs(time) + 1;
      endState = time < 0 ? false : true
      taskDayColor = !endState
        ? taskItem.finishPercent == 0
          ? { backgroundColor: 'red' }
          : { backgroundColor: '#417505' }
        : null;
      editRole = (taskItem.groupRole && taskItem.groupRole > 0 && taskItem.groupRole < 4) || taskItem.creatorKey == user._key ||
        taskItem.executorKey == user._key
      console.log(editRole);
      setEndtime(endTime);
      setTaskDayColor(taskDayColor);
      setEditRole(editRole);
      taskDetail = _.cloneDeep(taskItem)
      setTaskDetail(taskDetail)
    }
  }, [taskItem]);
  const chooseTask = (e: React.MouseEvent) => {
    dispatch(setTaskKey(taskItem._key));
  };
  const cancelTask = (e: React.MouseEvent) => {

    if (taskKey != 0) {
      console.log(taskKey);
      console.log(taskItem, taskDetail)
      console.log(editState)
      if (editState) {
        dispatch(editTask({ key: taskKey, ...taskDetail }));
        setEditState(false)
      }
      dispatch(setTaskKey(0));
    }
  };
  const changeFinishPercent = (finishPercent: number) => {
    taskDetail.finishPercent = finishPercent != 0 ? 0 : 1
    if (taskDetail.finishPercent == 1) {
      taskDetail.todayTaskTime = moment().valueOf();
    } else if (taskDetail.finishPercent == 0) {
      taskDetail.todayTaskTime = 0;
    }
    setNewDetail(taskDetail)
  }
  const changeTitle = (e: any) => {
    // console.log(e.type);
    // console.log(e.target.value);
    taskDetail.title = e.target.value
    setNewDetail(taskDetail)
  }
  const setNewDetail = (taskDetail: any) => {
    if (editRole) {
      let newTaskItem = {}
      newTaskItem = _.cloneDeep(taskDetail)
      setTaskDetail(newTaskItem)
      setEditState(true)
    }
  }
  return (
    <div className="taskItem" onClick={chooseTask} onMouseLeave={cancelTask}>
      {taskDetail ?
        <React.Fragment>
          {taskDetail.finishPercent != 10 ?
            <div className="taskItem-finishIcon" onClick={() => { changeFinishPercent(taskDetail.finishPercent) }} >
              <img src={taskDetail.finishPercent == 0 ? unfinishPng : finishPng} />
            </div>
            : null}
          <div className="taskItem-container">
            <div className="taskItem-info">
              <div className="taskItem-day" style={taskDayColor}>
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
                  <input
                    placeholder="请输入标题"
                    value={taskDetail.title}
                    style={
                      taskDetail.finishPercent == 2
                        ? {
                          marginTop: '2px',
                          textDecoration: 'line-through',
                          minHeight: '22px',
                        }
                        : { marginTop: '2px', minHeight: '22px' }
                    }
                    onChange={changeTitle}
                  />
                ) : (
                    <div
                      // v-show="cardRole||cardKey!=taskItem._key"
                      style={{
                        width: '100%',
                        minHeight: '28px',
                        backgroundColor: bottomtype
                          ? 'transparent'
                          : taskDetail.finishPercent == 0 ||
                            taskDetail.finishPercent == 10
                            ? ''
                            : '#E5E7EA',
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
                    {taskDetail.serialNumber ? '#' + taskDetail.serialNumber : ''}
                  </span>
                  <span style={{ flexShrink: 0 }} >
                    {taskDetail.creatorName.length > 3
                      ? taskDetail.creatorName.substring(0, 3) + '...'
                      : taskDetail.creatorName}
                  </span>
                  <span></span>
                  <span style={{ flexShrink: 0 }} >
                    {taskDetail.executorName && taskDetail.executorName.length > 3
                      ? taskDetail.executorName.substring(0, 3) + '...'
                      : taskDetail.executorName}
                  </span>
                </div>
                <div className="taskItem-img">
                  <img
                    src={
                      taskDetail.executorAvatar
                        ? taskDetail.executorAvatar
                        : defaultPerson
                    }
                  />
                </div>
              </div>
              <div style={{ maxWidth: '64px', display: 'flex' }}>
                <div className="taskItem-check-icon">
                  {taskDetail.importantStatus ? (
                    <img
                      src={important}
                      alt="重要"
                    />
                  ) : (
                      <img src={unimportant} alt="不重要" />
                    )}
                </div>
                <div
                  className="taskItem-check-icon"
                  style={{ color: '#333' }}
                ></div>
              </div>
            </div>
            <div className="taskItem-taskType"></div>
            {/*  style={cardKey==taskItem._key?{borderTop:'10px solid '+color[taskItem.taskType==10?5:taskItem.taskType-1],borderRight:'10px solid '+color[taskItem.taskType==10?5:taskItem.taskType-1],  borderLeft: '10px solid transparent',
  borderBottom: '10px solid transparent'}:{borderTop:'7px solid '+color[taskItem.taskType==10?5:taskItem.taskType-1],borderRight:'7px solid '+color[taskItem.taskType==10?5:taskItem.taskType-1],  borderLeft: '7px solid transparent',
  borderBottom: '7px solid transparent'}} */}
          </div></React.Fragment> : null}
    </div >
  );
};
Task.defaultProps = {
  taskItem: null,
  executorKey: 0,
};
export default Task;
