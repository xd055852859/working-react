import React, { useState, useEffect } from 'react';
import './groupTableTreeItem.css';
import Switch from '@material-ui/core/Switch';
import DropMenu from '../../components/common/dropMenu';

import { useTypedSelector } from '../../redux/reducer/RootState';
import { useDispatch } from 'react-redux';
import rightArrowPng from '../../assets/img/rightArrow.png';


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
 
  useEffect(() => {
    // 用户已登录
    if (taskDetail) {
      setTaskItem(_.cloneDeep(taskDetail));
    }
  }, [taskDetail]);
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
    </div>
  );
};
GroupTableTreeItem.defaultProps = {};
export default GroupTableTreeItem;
