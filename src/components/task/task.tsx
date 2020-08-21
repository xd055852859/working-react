import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import './task.css';

import task2 from '../../assets/svg/task2.svg';
import task4 from '../../assets/svg/task4.svg';
import task6 from '../../assets/svg/task6.svg';
import defaultPerson from '../../assets/img/defaultPerson.png';
import important from '../../assets/img/important.png';
import unimportant from '../../assets/img/unimportant.png';
import { setTaskKey } from '../../redux/actions/taskActions';

interface TaskProps {
  taskItem: any;
  executorKey?: number | string;
}
const Task: React.FC<TaskProps> = (props) => {
  const { taskItem } = props;
  const bottomtype = '';
  const taskKey = useTypedSelector((state) => state.task.taskKey);
  const dispatch = useDispatch();
  const [endtime, setEndtime] = useState(0);
  const [endState, setEndState] = useState(false);
  const [taskDayColor, setTaskDayColor] = useState<any>();
  const [editRole, setEditRole] = useState(false);

  useEffect(() => {
    // 用户已登录
    if (taskItem) {
      let time = 0;
      let endTime = 0;
      let taskDayColor = null;
      if (taskItem.taskEndDate) {
        time = Math.floor(
          (moment(taskItem.taskEndDate).endOf('day').valueOf() -
            moment().endOf('day').valueOf()) /
            86400000
        );
        // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
      }
      endTime = time < 0 ? Math.abs(time) : Math.abs(time) + 1;
      taskDayColor = !endState
        ? taskItem.finishPercent == 0
          ? { backgroundColor: 'red' }
          : { backgroundColor: '#417505' }
        : null;
      setEndtime(endTime);
      setEndState(endState);
      setTaskDayColor(taskDayColor);
    }
  }, [taskItem]);
  const chooseTask = () => {
    dispatch(setTaskKey(taskItem._key));
  };
  return (
    <div className="taskItem" onClick={chooseTask}>
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
              {taskItem.hour}
            </div>
          </div>
          <div
            className="taskItem-img"
            v-if="bottomtype=='grid'"
            style={{ width: '25px', height: '25px' }}
          >
            <img
              src={
                taskItem.executorAvatar
                  ? taskItem.executorAvatar
                  : defaultPerson
              }
              style={{ marginTop: '0px' }}
            />
          </div>
          <div className="taskItem-title">
            {taskKey != taskItem._key ? (
              <div
                // v-show="cardRole||cardKey!=taskItem._key"
                style={{
                  width: '100%',
                  minHeight: '28px',
                  backgroundColor: bottomtype
                    ? 'transparent'
                    : taskItem.finishPercent == 0 ||
                      taskItem.finishPercent == 10
                    ? ''
                    : '#E5E7EA',
                  textDecoration:
                    taskItem.finishPercent == 2 ? 'line-through' : '',
                }}
              >
                {taskItem.title}
              </div>
            ) : (
              <input
                placeholder="请输入标题"
                value={taskItem.title}
                style={
                  taskItem.finishPercent == 2
                    ? {
                        marginTop: '2px',
                        textDecoration: 'line-through',
                        minHeight: '22px',
                      }
                    : { marginTop: '2px', minHeight: '22px' }
                }
              />
            )}
          </div>
        </div>
        <div className="taskItem-footer">
          <div className="taskItem-footer-left">
            <div className="taskItem-name">
              <span>
                {taskItem.serialNumber ? '#' + taskItem.serialNumber : ''}
              </span>
              <span>
                {taskItem.creatorName.length > 3
                  ? taskItem.creatorName.substring(0, 3) + '...'
                  : taskItem.creatorName}
              </span>
              <span></span>
              <span>
                {taskItem.executorName && taskItem.executorName.length > 3
                  ? taskItem.executorName.substring(0, 3) + '...'
                  : taskItem.executorName}
              </span>
            </div>
            <div className="taskItem-img">
              <img
                src={
                  taskItem.executorAvatar
                    ? taskItem.executorAvatar
                    : defaultPerson
                }
              />
            </div>
          </div>
          <div style={{ maxWidth: '64px', display: 'flex' }}>
            <div className="taskItem-check-icon">
              {taskItem.importantStatus ? (
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
      </div>
    </div>
  );
};
Task.defaultProps = {
  taskItem: null,
  executorKey: 0,
};
export default Task;
