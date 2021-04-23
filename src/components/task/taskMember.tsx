import React, { useState, useEffect,useRef } from 'react';
import './task.css';
import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import _ from 'lodash';
import { editTask, setTaskInfo } from '../../redux/actions/taskActions';

import defaultPersonPng from '../../assets/img/defaultPerson.png';
import checkPersonPng from '../../assets/img/checkPerson.png';
import eyeSvg from '../../assets/svg/eye.svg';
import uneyeSvg from '../../assets/svg/uneye.svg';
interface TaskMemberProps {
  targetGroupKey?: string;
  onClose?: any;
  chooseFollow?: any;
  showMemberVisible?: boolean;
}

const TaskMember: React.FC<TaskMemberProps> = (props) => {
  const { targetGroupKey, onClose, chooseFollow, showMemberVisible } = props;
  const dispatch = useDispatch();
  const taskInfo = useTypedSelector((state) => state.task.taskInfo);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const taskMemberVisible = useTypedSelector(
    (state) => state.common.taskMemberVisible
  );
  const [taskMemberArray, setTaskMemberArray] = useState<any>([]);
  const [searchMemberArray, setSearchMemberArray] = useState<any>([]);
  const [taskMemberInfo, setTaskMemberInfo] = useState<any>({});
  const [followIndex, setFollowIndex] = useState<any>(null);
  const [searchInput, setSearchInput] = useState<any>('');

let unDistory = useRef<any>(null);   unDistory.current=true;
  useEffect(() => {
    // 用户已登录
    if (targetGroupKey) {
      getTaskMemberArray(targetGroupKey);
    } else if (taskInfo && (taskMemberVisible || showMemberVisible)) {
      getTaskMemberArray(taskInfo.groupKey);
    }
    return () => {
      // unDistory.current = false;
    };
  }, [targetGroupKey, taskInfo]);
  useEffect(() => {
    // 用户已登录
    const newTaskMemberArray = _.cloneDeep(taskMemberArray);
    if (!searchInput) {
      setSearchMemberArray(newTaskMemberArray);
    }
  }, [searchInput]);

  const getTaskMemberArray = async (groupKey: string) => {
    let taskMemberRes: any = null;
    taskMemberRes = await api.member.getMember(groupKey, 4);
    if (unDistory.current) {
      if (taskMemberRes.msg === 'OK') {
        setTaskMemberArray(taskMemberRes.result);
        setSearchMemberArray(taskMemberRes.result);
        setTaskMemberInfo(taskInfo);
      }
    }
  };
  const changeExecutor = (
    executorKey: number | string,
    executorName: string,
    executorAvatar: string,
    index: number
  ) => {
    let newTaskDetail = _.cloneDeep(taskMemberInfo);
    let followIndex = newTaskDetail.followUKeyArray.indexOf(executorKey);
    if (followIndex == -1) {
      newTaskDetail.followUKeyArray.push(executorKey);
    } else {
      newTaskDetail.followUKeyArray.splice(followIndex, 1);
    }

    if (newTaskDetail.executorKey === executorKey) {
      newTaskDetail.executorKey = '';
      newTaskDetail.executorName = '';
      newTaskDetail.executorAvatar = '';
    } else {
      newTaskDetail.executorKey = executorKey;
      newTaskDetail.executorName = executorName;
      newTaskDetail.executorAvatar = executorAvatar;
    }
    getTaskMemberArray(newTaskDetail.groupKey);
    setTaskMemberInfo(newTaskDetail);
    dispatch(setTaskInfo(newTaskDetail));
    dispatch(
      editTask(
        {
          key: newTaskDetail._key,
          executorKey: executorKey,
          executorName: executorName,
          executorAvatar: executorAvatar,
          followUKeyArray: newTaskDetail.followUKeyArray,
        },
        headerIndex
      )
    );
  };
  const changeFollow = (followKey: number | string) => {
    let newTaskDetail = _.cloneDeep(taskMemberInfo);
    let followIndex = newTaskDetail.followUKeyArray.indexOf(followKey);
    if (followIndex == -1) {
      newTaskDetail.followUKeyArray.push(followKey);
    } else {
      newTaskDetail.followUKeyArray.splice(followIndex, 1);
    }
    setTaskMemberInfo(newTaskDetail);
    dispatch(setTaskInfo(newTaskDetail));
    dispatch(
      editTask(
        {
          key: newTaskDetail._key,
          followUKeyArray: newTaskDetail.followUKeyArray,
        },
        headerIndex
      )
    );
  };
  const searchPerson = (e: any) => {
    let input = e.target.value;
    setSearchInput(input);
    if (input) {
      let newSearchMemberArray = _.cloneDeep(taskMemberArray);
      newSearchMemberArray = newSearchMemberArray.filter(
        (item: any, index: number) => {
          return (
            item.nickName &&
            item.nickName.toUpperCase().indexOf(input.toUpperCase()) !== -1
          );
        }
      );
      setSearchMemberArray(newSearchMemberArray);
    }
  };
  return (
    <div className="task-executor-dropMenu-info">
      <input
        type="text"
        className="task-executor-input"
        placeholder={'输入用户名…'}
        onChange={searchPerson}
        value={searchInput}
      />
      {searchMemberArray.map((taskMemberItem: any, taskMemberIndex: number) => {
        return (
          <div
            className="task-executor-dropMenu-container"
            key={'taskMember' + taskMemberIndex}
            // style={
            //   taskDetail.executorKey ===
            //     taskMemberItem.userId
            //     ? { background: '#F0F0F0' }
            //     : {}
            // }
            onClick={() => {
              if (targetGroupKey) {
                chooseFollow(taskMemberItem);
              } else {
                changeExecutor(
                  taskMemberItem.userId,
                  taskMemberItem.nickName,
                  taskMemberItem.avatar,
                  taskMemberIndex
                );
              }
            }}
            onMouseEnter={() => {
              if (!targetGroupKey) {
                setFollowIndex(taskMemberIndex);
              }
            }}
          >
            <div className="task-executor-dropMenu-left">
              <div className="task-executor-dropMenu-img">
                <img
                  src={
                    taskMemberItem.avatar
                      ? taskMemberItem.avatar +
                        '?imageMogr2/auto-orient/thumbnail/80x'
                      : defaultPersonPng
                  }
                  alt=""
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = defaultPersonPng;
                  }}
                />
              </div>
              <div>{taskMemberItem.nickName}</div>
            </div>
            {!targetGroupKey &&
            taskMemberInfo.executorKey === taskMemberItem.userId ? (
              <img
                src={checkPersonPng}
                alt=""
                style={{
                  width: '20px',
                  height: '12px',
                }}
              />
            ) : null}
            <div
              className="task-executor-dropMenu-follow"
              onClick={(e: any) => {
                if (!targetGroupKey) {
                  e.stopPropagation();
                  changeFollow(taskMemberItem.userId);
                }
              }}
            >
              {!targetGroupKey &&
              ((taskMemberInfo.followUKeyArray &&
                taskMemberInfo.followUKeyArray.indexOf(
                  taskMemberItem.userId
                ) !== -1) ||
                taskMemberInfo.executorKey === taskMemberItem.userId ||
                taskMemberInfo.creatorKey === taskMemberItem.userId) ? (
                <img
                  src={eyeSvg}
                  alt=""
                  style={{
                    width: '17px',
                    height: '11px',
                  }}
                />
              ) : followIndex === taskMemberIndex ? (
                <img
                  src={uneyeSvg}
                  alt=""
                  style={{
                    width: '17px',
                    height: '11px',
                  }}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
TaskMember.defaultProps = {};
export default TaskMember;
