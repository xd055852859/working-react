import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  getWorkingTableTask,
  addWorkingTableTask,
} from '../../redux/actions/taskActions';
import { useTypedSelector } from '../../redux/reducer/RootState';
import api from '../../services/api';
import './taskNav.css';
import plusPng from '../../assets/img/plus.png';
import { getGroupTask } from '../../redux/actions/taskActions';
import { setMessage } from '../../redux/actions/commonActions';

interface TaskNavProps {
  avatar?: string;
  name: string;
  role: string | number;
  colorIndex: number;
  taskNavArray: any;
  children?: any;
  taskNavWidth:number|string
}

const TaskNav: React.FC<TaskNavProps> = (prop) => {
  const { avatar, name, role, colorIndex, taskNavArray, children,taskNavWidth } = prop;
  const groupKey = useTypedSelector((state) => state.group.groupKey);
  const headerIndex = useTypedSelector((state) => state.common.headerIndex);
  const user = useTypedSelector((state) => state.auth.user);
  const targetUserInfo = useTypedSelector((state) => state.auth.targetUserInfo);
  const dispatch = useDispatch();
  const BgColorArray = [
    'rgba(48,191,191,0.3)',
    'rgba(0,170,255,0.3)',
    'rgba(143,126,230,0.3)',
    'rgba(179,152,152,0.3)',
    'rgba(242,237,166,0.3)',
  ];
  const taskNavBgColor = colorIndex % 4;
  const addTask = async (groupInfo: any, labelInfo: any) => {
    console.log(groupInfo, labelInfo);
    let addTaskRes: any = await api.task.addTask(
      '',
      groupInfo._key,
      groupInfo.groupRole,
      labelInfo._key,
      0,
      labelInfo.executorKey
    );
    if (addTaskRes.msg == 'OK') {
      dispatch(setMessage(true, '新增成功', 'success'));
      if (headerIndex == 1) {
        dispatch(getWorkingTableTask(1, user._key, 1, [0, 1, 2]));
      } else if (headerIndex == 2) {
        dispatch(getWorkingTableTask(2, targetUserInfo._key, 1, [0, 1, 2]));
      } else if (headerIndex == 3) {
        dispatch(getGroupTask(3, groupKey, '[0,1,2]'));
      }
    } else {
      dispatch(setMessage(true, addTaskRes.msg, 'error'));
    }
  };
  return (
    <div
      className="taskNav"
      style={{ backgroundColor: BgColorArray[taskNavBgColor],width:taskNavWidth }}
    >
      <div className="taskNav-name-info">
        {avatar?<div className="taskNav-avatar">
          <img src={avatar} alt="" />
        </div>:null}
        <div className="taskNav-name">{name}</div>
      </div>
      {role > 0 && role < 4 ? (
        <div className="taskNav-name-info">
          <img
            src={plusPng}
            className="taskNav-name-plus"
            onClick={() => {
              addTask(taskNavArray[0], taskNavArray[1]);
            }}
          />
          {children}
        
        </div>
      ) : null}
    </div>
  );
};
export default TaskNav;
