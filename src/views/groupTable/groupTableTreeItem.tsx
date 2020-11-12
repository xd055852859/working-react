import React, { useState, useEffect } from 'react';
import './groupTableTreeItem.css';
import Switch from '@material-ui/core/Switch';
import DropMenu from '../../components/common/dropMenu';
import TimeSet from '../../components/common/timeSet';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import rightArrowPng from '../../assets/img/rightArrow.png';
import defaultPersonPng from '../../assets/img/defaultPerson.png';
import checkPersonPng from '../../assets/img/checkPerson.png';
import moment from 'moment';
import _ from 'lodash';
interface GroupTableTreeItemProps {
  taskDetail: any;
  editTargetTask: any;
}

const GroupTableTreeItem: React.FC<GroupTableTreeItemProps> = (props) => {
  const { taskDetail, editTargetTask } = props;
  const memberArray = useTypedSelector((state) => state.member.memberArray);
  const [timeSetVisible, setTimeSetVisible] = useState(false);
  const [taskItem, setTaskItem] = useState<any>({});
  const [executorVisible, setExecutorVisible] = useState(false);
  const [dayNumber, setDayNumber] = useState<any>(null);
  const [endtime, setEndtime] = useState(0);
  const [timeNumber, setTimeNumber] = useState<any>(null);
  useEffect(() => {
    // 用户已登录
    if (taskDetail) {
      let [time, dayNumber, endTime, endState, newTaskItem]: any = [
        0,
        0,
        0,
        false,
        _.cloneDeep(taskDetail),
      ];
      if (newTaskItem.taskEndDate) {
        time = moment(newTaskItem.taskEndDate)
          .endOf('day')
          .diff(moment().endOf('day'), 'days');
        // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
      }
      endTime = time < 0 ? Math.abs(time) : Math.abs(time) + 1;
      dayNumber = time;
      endState = time < 0 ? false : true;
      // getTaskMemberArray(taskItem.grougKey)
      setEndtime(endTime);
      setDayNumber(time);
      setTimeNumber(newTaskItem.hour);
      newTaskItem.followUKeyArray = newTaskItem.followUKeyArray
        ? newTaskItem.followUKeyArray
        : [];
      setTaskItem(newTaskItem);
    }
  }, [taskDetail]);
  const changeExecutor = (
    executorKey: number | string,
    executorName: string,
    executorAvatar: string,
    index: number
  ) => {
    let newTaskItem = _.cloneDeep(taskItem);
    let newMemberArray = _.cloneDeep(memberArray);
    let executorItem = _.cloneDeep(newMemberArray[index]);
    if (newTaskItem.executorKey === executorKey) {
      newTaskItem.executorKey = '';
      newTaskItem.executorName = '';
      newTaskItem.executorAvatar = '';
    } else {
      newTaskItem.executorKey = executorKey;
      newTaskItem.executorName = executorName;
      newTaskItem.executorAvatar = executorAvatar;
      // newTaskMemberArray.splice(index, 1);
      // newTaskMemberArray.unshift(executorItem);
    }
    editTargetTask(newTaskItem, 1);
  };
  const changeFollow = (followKey: number | string) => {
    let newTaskItem = _.cloneDeep(taskItem);
    let followIndex = newTaskItem.followUKeyArray.indexOf(followKey);
    if (followIndex == -1) {
      newTaskItem.followUKeyArray.push(followKey);
    } else {
      newTaskItem.followUKeyArray.splice(followIndex, 1);
    }
    editTargetTask(newTaskItem, 1);
  };
  const changeTimeSet = (type: string, value: number) => {
    let newTaskItem = _.cloneDeep(taskItem);
    let time = 0;
    if (type === 'hour') {
      setTimeNumber(value);
      newTaskItem.hour = value;
    } else if (type === 'day') {
      newTaskItem.day = value;
      newTaskItem.taskEndDate = moment()
        .add(value - 1, 'day')
        .endOf('day')
        .valueOf();
      time = moment(newTaskItem.taskEndDate)
        .endOf('day')
        .diff(moment().endOf('day'), 'days');
      // this.endTimeText = this.$moment(taskEndDate).format('YYYY年MM月DD日');
      setDayNumber(time);
      setEndtime(time + 1);
    }
    editTargetTask(newTaskItem, 1);
  };
  const changeFinishPercent = (finishPercent: number) => {
    let newTaskItem = _.cloneDeep(taskItem);
    // taskDetail.finishPercent = finishPercent !== 0 ? 0 : 1;
    newTaskItem.finishPercent = finishPercent;
    if (newTaskItem.finishPercent === 1) {
      newTaskItem.todayTaskTime = moment().valueOf();
    } else if (newTaskItem.finishPercent === 0) {
      newTaskItem.todayTaskTime = 0;
    }
    editTargetTask(newTaskItem, 1);
  };
  const changeType = (type: number) => {
    let newTaskItem = _.cloneDeep(taskItem);
    // taskDetail.finishPercent = finishPercent !== 0 ? 0 : 1;
    newTaskItem.type = type === 1 ? 6 : 1;
    editTargetTask(newTaskItem, 1);
  };
  return (
    <div className="groupTableTreeItem">
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          setTimeSetVisible(true);
        }}
      >
        <div className="groupTableTreeItem-title">任务工时</div>
        <img src={rightArrowPng} alt="" />
      </div>
      <div
        className="groupTableTreeItem-item"
        onClick={() => {
          setExecutorVisible(true);
        }}
      >
        <div className="groupTableTreeItem-title">任务执行人</div>
        <img src={rightArrowPng} alt="" />
      </div>
      <div className="groupTableTreeItem-item">
        <div className="groupTableTreeItem-title">切换任务</div>
        <Switch
          checked={taskItem.type === 6}
          onChange={() => {
            changeType(taskItem.type);
          }}
          name="checkedD"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      </div>
      <DropMenu
        visible={timeSetVisible}
        dropStyle={{
          width: '300px',
          height: '350px',
          top: '0px',
          left: '201px',
          overflow: 'auto',
        }}
        onClose={() => {
          setTimeSetVisible(false);
        }}
        title={'选择项目'}
      >
        <TimeSet
          timeSetClick={changeTimeSet}
          percentClick={changeFinishPercent}
          dayNumber={dayNumber + 1}
          timeNumber={timeNumber}
          endDate={taskItem.taskEndDate}
        />
      </DropMenu>
      <DropMenu
        visible={executorVisible}
        dropStyle={{
          width: '260px',
          height: '300px',
          top: '0px',
          left: '201px',
          overflow: 'auto',
        }}
        onClose={() => {
          setExecutorVisible(false);
        }}
        title={'分配任务'}
      >
        <div className="task-executor-dropMenu-info">
          {memberArray.map((taskMemberItem: any, taskMemberIndex: number) => {
            return (
              <div
                className="task-executor-dropMenu-container"
                key={'taskMember' + taskMemberIndex}
                style={
                  taskDetail.executorKey === taskMemberItem.userId
                    ? { background: '#F0F0F0' }
                    : {}
                }
                onClick={() => {
                  changeExecutor(
                    taskMemberItem.userId,
                    taskMemberItem.nickName,
                    taskMemberItem.avatar,
                    taskMemberIndex
                  );
                }}
              >
                <div className="task-executor-dropMenu-left">
                  <div
                    className="task-executor-dropMenu-img"
                    style={
                      (taskDetail.followUKeyArray &&
                        taskDetail.followUKeyArray.indexOf(
                          taskMemberItem.userId
                        ) !== -1) ||
                      taskDetail.executorKey === taskMemberItem.userId ||
                      taskDetail.creatorKey === taskMemberItem.userId
                        ? { border: '3px solid #17b881' }
                        : {}
                    }
                  >
                    <img
                      src={
                        taskMemberItem.avatar
                          ? taskMemberItem.avatar
                          : defaultPersonPng
                      }
                      onClick={(e: any) => {
                        e.stopPropagation();
                        changeFollow(taskMemberItem.userId);
                      }}
                    />
                  </div>
                  <div>{taskMemberItem.nickName}</div>
                </div>
                {taskDetail.executorKey === taskMemberItem.userId ? (
                  <img
                    src={checkPersonPng}
                    alt=""
                    style={{
                      width: '20px',
                      height: '12px',
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </DropMenu>
    </div>
  );
};
GroupTableTreeItem.defaultProps = {};
export default GroupTableTreeItem;
